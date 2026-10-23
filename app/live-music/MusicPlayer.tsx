"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronDown, ListMusic, Repeat, SkipBack, SkipForward } from "lucide-react";
import NavigationMenu from "../components/NavigationMenu";
import ThemeToggle from "../components/ThemeToggle";

import { MUSIC_PLAYLISTS, type MusicTrack } from "@/lib/music-playlist";

export default function MusicPlayer({ signedIn }: { signedIn: boolean }) {
  const [playlist, setPlaylist] = useState(MUSIC_PLAYLISTS[0]);
  return <PlaylistPlayer key={playlist.id} signedIn={signedIn} playlist={playlist} onSelectPlaylist={setPlaylist} />;
}

function PlaylistPlayer({ signedIn, playlist, onSelectPlaylist }: {
  signedIn: boolean;
  playlist: typeof MUSIC_PLAYLISTS[number];
  onSelectPlaylist: (playlist: typeof MUSIC_PLAYLISTS[number]) => void;
}) {
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
      const cx = width / 2;
      const cy = height / 2;
      const size = Math.min(width, height);
      const bass = frequencies.slice(1, 12).reduce((sum, value) => sum + value, 0) / (11 * 255);
      const energy = frequencies.reduce((sum, value) => sum + value, 0) / (128 * 255);
      const time = active ? (audioRef.current?.currentTime ?? 0) : 0;
      const radius = size * (0.2 + bass * 0.025);
      const halo = drawing.createRadialGradient(cx, cy, 0, cx, cy, size * 0.52);
      halo.addColorStop(0, `rgba(89,58,180,${0.2 + energy * 0.3})`);
      halo.addColorStop(0.45, `rgba(16,122,155,${0.12 + bass * 0.13})`);
      halo.addColorStop(1, "rgba(5,7,18,0)");
      drawing.fillStyle = halo;
      drawing.fillRect(0, 0, width, height);

      // Deterministic stars and orbital trails; real frequency energy shapes the rings.
      for (let i = 0; i < 38; i++) {
        const x = ((i * 73.37 + 19) % 100) / 100 * width;
        const y = ((i * 43.71 + 11) % 100) / 100 * height;
        drawing.fillStyle = `rgba(180,210,255,${0.12 + (i % 4) * 0.06 + energy * 0.15})`;
        drawing.beginPath();
        drawing.arc(x, y, i % 5 === 0 ? 1.4 : 0.7, 0, Math.PI * 2);
        drawing.fill();
      }
      for (let ring = 0; ring < 4; ring++) {
        const gradient = drawing.createLinearGradient(cx - radius, cy - radius, cx + radius, cy + radius);
        gradient.addColorStop(0, "#67e8f9");
        gradient.addColorStop(0.45, "#818cf8");
        gradient.addColorStop(1, "#e879f9");
        drawing.strokeStyle = gradient;
        drawing.lineWidth = ring === 0 ? 2.5 : 1.2;
        drawing.globalAlpha = 0.85 - ring * 0.16;
        drawing.shadowColor = ring % 2 ? "#a78bfa" : "#22d3ee";
        drawing.shadowBlur = ring === 0 ? 16 : 7;
        drawing.beginPath();
        for (let i = 0; i <= 160; i++) {
          const angle = i / 160 * Math.PI * 2;
          const bin = 1 + Math.floor((1 - Math.cos(angle * 2)) * 45);
          const wave = frequencies[bin] / 255;
          const r = radius + ring * size * 0.035 + Math.sin(angle * 3 + time * 0.5 + ring) * size * 0.012
            + wave * size * 0.055 * Math.sin(angle * 5 - time * 0.4 + ring);
          const x = cx + Math.cos(angle) * r;
          const y = cy + Math.sin(angle) * r;
          if (i === 0) drawing.moveTo(x, y); else drawing.lineTo(x, y);
        }
        drawing.closePath();
        drawing.stroke();
      }
      drawing.shadowBlur = 0;
      drawing.globalAlpha = 1;
      for (let i = 0; i < 3; i++) {
        const angle = time * (0.12 + i * 0.03) + i * Math.PI * 2 / 3;
        const r = radius + size * (0.16 + i * 0.025);
        drawing.strokeStyle = "rgba(148,163,184,0.12)";
        drawing.beginPath();
        drawing.ellipse(cx, cy, r, r * 0.72, i * 0.8, 0, Math.PI * 2);
        drawing.stroke();
        drawing.fillStyle = ["#67e8f9", "#c4b5fd", "#f0abfc"][i];
        drawing.beginPath();
        drawing.arc(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r, 2 + energy * 2, 0, Math.PI * 2);
        drawing.fill();
      }
      drawing.textAlign = "center";
      drawing.textBaseline = "middle";
      drawing.fillStyle = "#e0f2fe";
      drawing.font = `600 ${Math.round(size * 0.065)}px sans-serif`;
      drawing.fillText("N M A I", cx, cy - 5);
      drawing.fillStyle = "rgba(165,180,252,0.8)";
      drawing.font = "9px sans-serif";
      drawing.fillText("F E E L   T H E   S O U N D", cx, cy + 19);
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
        const response = await fetch(`/api/music?playlist=${encodeURIComponent(playlist.id)}`, { cache: "no-store", signal: controller.signal });
        if (!response.ok) throw new Error("Sync failed");
        const data = await response.json();
        if (!Array.isArray(data.tracks)) throw new Error("Invalid playlist");
        if (cancelled) return;
        setTracks(data.tracks);
        // Refresh the selected song's details without restarting its audio.
        // A removed song may finish playing; the next selection uses the new list.
        setTrack(current => current
          ? data.tracks.find((item: MusicTrack) => item.id === current.id) ?? current
          : data.tracks[0] ?? null);
        if (audioRef.current && !audioRef.current.getAttribute("src") && data.tracks[0]) {
          audioRef.current.src = data.tracks[0].source;
        }
        setSyncStatus("");
      } catch {
        if (!cancelled) setSyncStatus("Sync unavailable. Showing the last loaded playlist; retrying automatically.");
      } finally { inFlight = false; }
    }
    void sync();
    const timer = window.setInterval(() => void sync(), 30000);
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
  }, [playlist.id]);

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
      setError("Playback could not start. Try the player’s Play button again.");
    });
  }

  return <div className="min-h-screen bg-[#05070D] text-slate-100">
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-5 sm:px-10">
      <div className="flex items-center gap-3"><NavigationMenu signedIn={signedIn} /><Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white"><ArrowLeft size={16} />Dashboard</Link></div>
      <div className="flex items-center gap-4">{signedIn ? <Link href="/ai-tools" className="text-sm text-slate-400 hover:text-white">AI Tools</Link> : <Link href="/login" className="text-sm text-slate-300 hover:text-white">Login</Link>}<ThemeToggle /></div>
    </header>
    <main className="mx-auto max-w-5xl px-5 py-10 sm:px-10">
      <h1 className="text-3xl font-bold tracking-tight text-white">Live Music</h1>
      <div className="mt-6 rounded-2xl border border-cyan-400/20 bg-gradient-to-r from-cyan-400/10 to-indigo-400/5 p-4 sm:p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <label htmlFor="music-playlist" className="flex items-center gap-2 text-sm font-semibold text-cyan-300"><ListMusic size={18} />Choose a playlist</label>
          <span className="shrink-0 rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">{MUSIC_PLAYLISTS.length} playlists</span>
        </div>
        <div className="relative">
          <select id="music-playlist" value={playlist.id} onChange={event => {
            const next = MUSIC_PLAYLISTS.find(item => item.id === event.target.value);
            if (next) onSelectPlaylist(next);
          }} className="min-h-14 w-full appearance-none rounded-xl border border-white/15 bg-[#080D17] py-3 pl-4 pr-12 text-sm font-semibold text-white outline-none transition hover:border-cyan-400/40 focus-visible:ring-2 focus-visible:ring-cyan-400 sm:text-base">
            {MUSIC_PLAYLISTS.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
          <ChevronDown size={20} aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-cyan-300" />
        </div>
      </div>

      <div className="mt-8 grid items-start gap-5 md:grid-cols-[1.1fr_1fr]">
        <section aria-label="Music player" className="min-w-0 rounded-3xl border border-cyan-400/20 bg-[#080D17] p-5 sm:p-7">
          <div className="relative h-64 overflow-hidden rounded-2xl border border-indigo-300/10 bg-[#070b18] sm:h-72">
            <canvas ref={canvasRef} className="h-full w-full" aria-hidden="true" />
            <span className="absolute bottom-4 left-4 text-[9px] font-semibold uppercase tracking-[0.22em] text-cyan-200/70">{visualizerUnavailable ? "Enjoy the music" : playing ? "Immersed in sound" : "Your moment of music"}</span>
          </div>
          <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-cyan-300">{playing ? "Now playing" : "Ready to play"}</p>
          <h2 className="mt-2 text-2xl font-bold text-white" aria-live="polite">{track?.name ?? "Choose a track"}</h2>
          <p className="mt-2 text-sm text-slate-400">Dynamokk · {playlist.name}</p>
          {/* Track changes update the media element directly to keep play() in the user gesture. */}
          <audio ref={audioRef} crossOrigin="anonymous" controls preload="none" aria-label={`Play ${track?.name ?? "Choose a track"}`} className="mt-6 w-full"
            onPlay={() => { activateVisualizer(); setPlaying(true); setError(""); }} onPause={() => setPlaying(false)}
            onError={() => { setPlaying(false); setError("This track is currently unavailable. Try another track."); }}
            onEnded={() => { setPlaying(false); if (selected < tracks.length - 1) playTrack(selected + 1); else if (repeat && tracks.length) playTrack(0); }} />
          <div className="mt-4 flex items-center justify-between gap-2">
            <button disabled={!tracks.length} onClick={() => playTrack((selected + tracks.length - 1) % tracks.length)} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/10 px-3 text-xs hover:bg-white/5"><SkipBack size={16} />Previous</button>
            <button onClick={() => setRepeat(!repeat)} aria-pressed={repeat} aria-label="Repeat playlist" className={`min-h-11 rounded-xl border px-3 ${repeat ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-300" : "border-white/10 text-slate-400"}`}><Repeat size={18} /></button>
            <button disabled={!tracks.length} onClick={() => playTrack((selected + 1) % tracks.length)} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/10 px-3 text-xs hover:bg-white/5">Next<SkipForward size={16} /></button>
          </div>
          {error && <p role="alert" className="mt-4 text-sm text-amber-300">{error}</p>}
        </section>

        <section aria-label={`${playlist.name} playlist`} className="rounded-3xl border border-white/10 bg-[#080D17] p-5 sm:p-7">
          <h2 className="mt-2 text-2xl font-bold text-white">{playlist.name}</h2>
          <p className="mt-2 text-sm text-slate-400">{tracks.length} tracks · Dynamokk</p>
          {syncStatus && <p role="status" className="mt-2 text-xs text-cyan-300">{syncStatus}</p>}
          {!tracks.length && <p className="mt-4 text-sm text-slate-400">No playable tracks loaded yet.</p>}
          <ol tabIndex={0} aria-label="Scrollable song list" className="mt-6 h-64 space-y-3 overflow-y-auto overscroll-y-contain rounded-2xl pr-2 focus-visible:outline-2 focus-visible:outline-cyan-400 sm:h-72">{tracks.map((item, index) => <li key={item.source}>
            <button disabled={!tracks.length} onClick={() => playTrack(index)} aria-label={`Play ${item.name}`} aria-current={selected === index ? "true" : undefined} className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition ${selected === index ? "border-cyan-400/30 bg-cyan-400/10" : "border-white/10 hover:bg-white/5"}`}>
              <span className="pt-0.5 text-xs text-cyan-300">{String(index + 1).padStart(2, "0")}</span>
              <span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-white">{item.name}</span></span>
              <span className="text-xs text-slate-400">{item.duration}</span>
            </button>
          </li>)}</ol>
        </section>
      </div>
    </main>
  </div>;
}
