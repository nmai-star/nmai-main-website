"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Headphones, Music2, Repeat, SkipBack, SkipForward } from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";

import { PLAYLIST_URL as playlistUrl, type MusicTrack } from "@/lib/music-playlist";

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [track, setTrack] = useState<MusicTrack | null>(null);
  const [syncStatus, setSyncStatus] = useState("Loading playlist…");
  const selected = tracks.findIndex(item => item.id === track?.id);
  const [playing, setPlaying] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [error, setError] = useState("");
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
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white"><ArrowLeft size={16} />Dashboard</Link>
      <div className="flex items-center gap-4"><Link href="/ai-tools" className="text-sm text-slate-400 hover:text-white">AI Tools</Link><ThemeToggle /></div>
    </header>
    <main className="mx-auto max-w-5xl px-5 py-10 sm:px-10">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-cyan-300"><Headphones size={16} />NMAI Live Music</p>
      <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">Find your rhythm.</h1>
      <p className="mt-4 max-w-xl text-sm leading-6 text-slate-400">Your EDM & phonk listening corner. Press play, pick a track and enjoy the music right here.</p>

      <div className="mt-8 grid gap-5 md:grid-cols-[1.1fr_1fr]">
        <section aria-label="Music player" className="min-w-0 rounded-3xl border border-cyan-400/20 bg-[#080D17] p-5 sm:p-7">
          <div className="flex h-44 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600/30 via-purple-600/25 to-cyan-500/20"><Music2 size={64} className="text-cyan-300" aria-hidden="true" /></div>
          <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-cyan-300">{playing ? "Now playing" : "Ready to play"}</p>
          <h2 className="mt-2 text-2xl font-bold text-white" aria-live="polite">{track?.name ?? "Choose a track"}</h2>
          <p className="mt-2 text-sm text-slate-400">Dynamokk · EDM, PHONK</p>
          {/* Track changes update the media element directly to keep play() in the user gesture. */}
          <audio ref={audioRef} controls preload="none" aria-label={`Play ${track?.name ?? "Choose a track"}`} className="mt-6 w-full"
            onPlay={() => { setPlaying(true); setError(""); }} onPause={() => setPlaying(false)}
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
          <ol className="mt-6 space-y-3">{tracks.map((item, index) => <li key={item.source}>
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
