"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Headphones, Music2, Repeat, SkipBack, SkipForward } from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";

const playlistUrl = "https://www.flowmusic.app/playlist/66fccc15-06e8-4fd2-af12-a4f62ea6f356";
const tracks = [
  { name: "Voltage Strike", duration: "2:56", description: "Festival EDM drops, phonk cowbells and driving bass.", source: "https://storage.googleapis.com/producer-app-public/clips/920607ad-851f-4c83-948d-2a7cdc6c34d3.m4a" },
  { name: "IRON GRIP", duration: "2:51", description: "Dark club energy, heavy 808s and aggressive synth leads.", source: "https://storage.googleapis.com/producer-app-public/clips/92308b77-ee69-4fb8-b5cd-531adf4ab7a1.m4a" },
];

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [selected, setSelected] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [error, setError] = useState("");
  const track = tracks[selected];

  function playTrack(index: number) {
    const audio = audioRef.current;
    if (!audio) return;
    setError("");
    setSelected(index);
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
          <h2 className="mt-2 text-2xl font-bold text-white" aria-live="polite">{track.name}</h2>
          <p className="mt-2 text-sm text-slate-400">Dynamokk · EDM, PHONK</p>
          <audio ref={audioRef} src={track.source} controls preload="none" aria-label={`Play ${track.name}`} className="mt-6 w-full"
            onPlay={() => { setPlaying(true); setError(""); }} onPause={() => setPlaying(false)}
            onError={() => { setPlaying(false); setError("This track is currently unavailable. Try another track or open Flow Music below."); }}
            onEnded={() => { setPlaying(false); if (selected < tracks.length - 1) playTrack(selected + 1); else if (repeat) playTrack(0); }} />
          <div className="mt-4 flex items-center justify-between gap-2">
            <button onClick={() => playTrack((selected + tracks.length - 1) % tracks.length)} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/10 px-3 text-xs hover:bg-white/5"><SkipBack size={16} />Previous</button>
            <button onClick={() => setRepeat(!repeat)} aria-pressed={repeat} aria-label="Repeat playlist" className={`min-h-11 rounded-xl border px-3 ${repeat ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-300" : "border-white/10 text-slate-400"}`}><Repeat size={18} /></button>
            <button onClick={() => playTrack((selected + 1) % tracks.length)} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/10 px-3 text-xs hover:bg-white/5">Next<SkipForward size={16} /></button>
          </div>
          {error && <p role="alert" className="mt-4 text-sm text-amber-300">{error}</p>}
        </section>

        <section aria-label="EDM, PHONK playlist" className="rounded-3xl border border-white/10 bg-[#080D17] p-5 sm:p-7">
          <p className="text-xs uppercase tracking-widest text-slate-500">Featured playlist</p>
          <h2 className="mt-2 text-2xl font-bold text-white">EDM, PHONK</h2>
          <p className="mt-2 text-sm text-slate-400">2 tracks · Dynamokk · 140 BPM</p>
          <ol className="mt-6 space-y-3">{tracks.map((item, index) => <li key={item.source}>
            <button onClick={() => playTrack(index)} aria-label={`Play ${item.name}`} aria-current={selected === index ? "true" : undefined} className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition ${selected === index ? "border-cyan-400/30 bg-cyan-400/10" : "border-white/10 hover:bg-white/5"}`}>
              <span className="pt-0.5 text-xs text-cyan-300">0{index + 1}</span>
              <span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-white">{item.name}</span><span className="mt-1 block text-xs leading-5 text-slate-400">{item.description}</span></span>
              <span className="text-xs text-slate-400">{item.duration}</span>
            </button>
          </li>)}</ol>
          <a href={playlistUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm text-cyan-300 hover:underline">Open in Google Flow Music<ExternalLink size={14} /></a>
          <p className="mt-3 text-xs leading-5 text-slate-500">Tracks stream from Google Flow Music. This selection does not automatically sync playlist changes.</p>
        </section>
      </div>
    </main>
  </div>;
}
