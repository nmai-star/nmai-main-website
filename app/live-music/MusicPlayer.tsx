"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Headphones, Repeat, SkipBack, SkipForward } from "lucide-react";
import NavigationMenu from "../components/NavigationMenu";
import ThemeToggle from "../components/ThemeToggle";

import { PLAYLIST_URL as playlistUrl, type MusicTrack } from "@/lib/music-playlist";

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioGraph = useRef<{ context: AudioContext; analyser: AnalyserNode; source: MediaElementAudioSourceNode } | null>(null);
  const [visualizerUnavailable, setVisualizerUnavailable] = useState(false);
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [track, setTrack] = useState<MusicTrack | null>(null);
  const [syncStatus, setSyncStatus] = useState("Loading playlist…");
  const selected = tracks.findIndex(item => item.id === track?.id);
  const [playing, setPlaying] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [error, setError] = useState("");

  function activateVisualizer() {
    if (!audioRef.current) return;
    try {
      if (!audioGraph.current) {
        const context = new AudioContext();
        const analyser = context.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.75;
        const source = context.createMediaElementSource(audioRef.current);
        source.connect(analyser);
        analyser.connect(context.destination);
        audioGraph.current = { context, analyser, source };
      }
      void audioGraph.current.context.resume().catch(() => setVisualizerUnavailable(true));
    } catch { setVisualizerUnavailable(true); }
  }

  useEffect(() => () => {
    const graph = audioGraph.current;
    if (graph) {
      graph.source.disconnect();
      graph.analyser.disconnect();
      void graph.context.close();
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const drawing = canvas?.getContext("2d");
    if (!canvas || !drawing) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const frequencies = new Uint8Array(128);
    let frame = 0;
    function draw() {
      if (!canvas || !drawing) return;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      if (canvas.width !== Math.round(width * ratio) || canvas.height !== Math.round(height * ratio)) {
        canvas.width = Math.round(width * ratio);
        canvas.height = Math.round(height * ratio);
      }
      drawing.setTransform(ratio, 0, 0, ratio, 0, 0);
      drawing.clearRect(0, 0, width, height);
      const active = playing && !document.hidden && !reducedMotion.matches && !visualizerUnavailable;
      const analyser = audioGraph.current?.analyser;
      frequencies.fill(0);
      if (active && analyser) analyser.getByteFrequencyData(frequencies);
      const gradient = drawing.createLinearGradient(0, height, width, 0);
      gradient.addColorStop(0, "#22d3ee");
      gradient.addColorStop(0.5, "#60a5fa");
      gradient.addColorStop(1, "#c084fc");
      drawing.fillStyle = gradient;
      const count = 32;
      const gap = 4;
      const barWidth = Math.max(1, (width - 32 - gap * (count - 1)) / count);
      for (let i = 0; i < count; i++) {
        const bin = Math.floor(Math.pow(i / count, 1.65) * 100) + 1;
        const amplitude = active ? frequencies[bin] / 255 : 0;
        const barHeight = 4 + amplitude * (height - 40);
        drawing.globalAlpha = active ? 0.65 + amplitude * 0.35 : 0.35;
        drawing.beginPath();
        drawing.roundRect(16 + i * (barWidth + gap), (height - barHeight) / 2, barWidth, barHeight, 3);
        drawing.fill();
      }
      drawing.globalAlpha = 1;
      if (active) frame = requestAnimationFrame(draw);
    }
    function refresh() { cancelAnimationFrame(frame); draw(); }
    const resize = new ResizeObserver(refresh);
    resize.observe(canvas);
    document.addEventListener("visibilitychange", refresh);
    reducedMotion.addEventListener("change", refresh);
    draw();
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      document.removeEventListener("visibilitychange", refresh);
      reducedMotion.removeEventListener("change", refresh);
    };
  }, [playing, visualizerUnavailable]);
  useEffect(() => {
    let cancelled = false;
    let inFlight = false;
    const controller = new AbortController();
    async function sync() {
      if (inFlight || document.hidden) return;
      inFlight = true;
      try {
        const response = await fetch("/api/music", { cache: "no-store", signal: controller.signal });
        if (!response.ok) throw new Error("Sync failed");
        const data = await response.json();
        if (!Array.isArray(data.tracks)) throw new Error("Invalid playlist");
        if (cancelled) return;
        setTracks(data.tracks);
        setTrack(current => current ?? data.tracks[0] ?? null);
        if (audioRef.current && !audioRef.current.getAttribute("src") && data.tracks[0]) {
          audioRef.current.src = data.tracks[0].source;
        }
        setSyncStatus("Auto-sync on · Checks every minute");
      } catch {
        if (!cancelled) setSyncStatus("Sync unavailable. Showing the last loaded playlist; retrying automatically.");
      } finally { inFlight = false; }
    }
    void sync();
    const timer = window.setInterval(() => void sync(), 60000);
    const refresh = () => void sync();
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      cancelled = true;
      controller.abort();
      clearInterval(timer);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);

  function playTrack(index: number) {
    const audio = audioRef.current;
    if (!audio || !tracks[index]) return;
    activateVisualizer();
    setError("");
    setTrack(tracks[index]);
    if (audio.getAttribute("src") !== tracks[index].source) {
      audio.src = tracks[index].source;
    } else {
      audio.currentTime = 0;
    }
    void audio.play().catch((reason: unknown) => {
      if (reason instanceof DOMException && reason.name === "AbortError") return;
      setPlaying(false);
      setError("Playback could not start. Try the player’s Play button or open this playlist in Flow Music.");
    });
  }

  return <div className="min-h-screen bg-[#05070D] text-slate-100">
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-5 sm:px-10">
      <div className="flex items-center gap-3"><NavigationMenu /><Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white"><ArrowLeft size={16} />Dashboard</Link></div>
      <div className="flex items-center gap-4"><Link href="/ai-tools" className="text-sm text-slate-400 hover:text-white">AI Tools</Link><ThemeToggle /></div>
    </header>
    <main className="mx-auto max-w-5xl px-5 py-10 sm:px-10">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-cyan-300"><Headphones size={16} />NMAI Live Music</p>
      <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">Find your rhythm.</h1>
      <p className="mt-4 max-w-xl text-sm leading-6 text-slate-400">Your EDM & phonk listening corner. Press play, pick a track and enjoy the music right here.</p>

      <div className="mt-8 grid items-start gap-5 md:grid-cols-[1.1fr_1fr]">
        <section aria-label="Music player" className="min-w-0 rounded-3xl border border-cyan-400/20 bg-[#080D17] p-5 sm:p-7">
          <div className="relative h-44 overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600/30 via-purple-600/25 to-cyan-500/20">
            <canvas ref={canvasRef} className="h-full w-full" aria-hidden="true" />
            <span className="absolute bottom-3 left-4 text-[10px] font-semibold uppercase tracking-widest text-cyan-200">{visualizerUnavailable ? "Enjoy the music" : "Audio spectrum"}</span>
          </div>
          <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-cyan-300">{playing ? "Now playing" : "Ready to play"}</p>
          <h2 className="mt-2 text-2xl font-bold text-white" aria-live="polite">{track?.name ?? "Choose a track"}</h2>
          <p className="mt-2 text-sm text-slate-400">Dynamokk · EDM, PHONK</p>
          {/* Track changes update the media element directly to keep play() in the user gesture. */}
          <audio ref={audioRef} crossOrigin="anonymous" controls preload="none" aria-label={`Play ${track?.name ?? "Choose a track"}`} className="mt-6 w-full"
            onPlay={() => { activateVisualizer(); setPlaying(true); setError(""); }} onPause={() => setPlaying(false)}
            onError={() => { setPlaying(false); setError("This track is currently unavailable. Try another track or open Flow Music below."); }}
            onEnded={() => { setPlaying(false); if (selected < tracks.length - 1) playTrack(selected + 1); else if (repeat && tracks.length) playTrack(0); }} />
          <div className="mt-4 flex items-center justify-between gap-2">
            <button disabled={!tracks.length} onClick={() => playTrack((selected + tracks.length - 1) % tracks.length)} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/10 px-3 text-xs hover:bg-white/5"><SkipBack size={16} />Previous</button>
            <button onClick={() => setRepeat(!repeat)} aria-pressed={repeat} aria-label="Repeat playlist" className={`min-h-11 rounded-xl border px-3 ${repeat ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-300" : "border-white/10 text-slate-400"}`}><Repeat size={18} /></button>
            <button disabled={!tracks.length} onClick={() => playTrack((selected + 1) % tracks.length)} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/10 px-3 text-xs hover:bg-white/5">Next<SkipForward size={16} /></button>
          </div>
          {error && <p role="alert" className="mt-4 text-sm text-amber-300">{error}</p>}
        </section>

        <section aria-label="EDM, PHONK playlist" className="rounded-3xl border border-white/10 bg-[#080D17] p-5 sm:p-7">
          <p className="text-xs uppercase tracking-widest text-slate-500">Featured playlist</p>
          <h2 className="mt-2 text-2xl font-bold text-white">EDM, PHONK</h2>
          <p className="mt-2 text-sm text-slate-400">{tracks.length} tracks · Dynamokk</p>
          <p role="status" className="mt-2 text-xs text-cyan-300">{syncStatus}</p>
          {!tracks.length && <p className="mt-4 text-sm text-slate-400">No playable tracks loaded yet.</p>}
          <ol tabIndex={0} aria-label="Scrollable song list" className="mt-6 h-64 space-y-3 overflow-y-auto overscroll-y-contain rounded-2xl pr-2 focus-visible:outline-2 focus-visible:outline-cyan-400 sm:h-72">{tracks.map((item, index) => <li key={item.source}>
            <button disabled={!tracks.length} onClick={() => playTrack(index)} aria-label={`Play ${item.name}`} aria-current={selected === index ? "true" : undefined} className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition ${selected === index ? "border-cyan-400/30 bg-cyan-400/10" : "border-white/10 hover:bg-white/5"}`}>
              <span className="pt-0.5 text-xs text-cyan-300">{String(index + 1).padStart(2, "0")}</span>
              <span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-white">{item.name}</span><span className="mt-1 block text-xs leading-5 text-slate-400">{item.description}</span></span>
              <span className="text-xs text-slate-400">{item.duration}</span>
            </button>
          </li>)}</ol>
          <a href={playlistUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm text-cyan-300 hover:underline">Open in Google Flow Music<ExternalLink size={14} /></a>
          <p className="mt-3 text-xs leading-5 text-slate-500">Songs added to this shared Flow Music playlist appear automatically. Private or unavailable songs cannot be played here.</p>
        </section>
      </div>
    </main>
  </div>;
}
