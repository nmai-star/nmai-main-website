"use client";

import { useId, useRef, useSyncExternalStore } from "react";
import { Check, Palette, X } from "lucide-react";

const themes = [
  { id: "dark", name: "Midnight", description: "Classic dark", colors: ["#05070d", "#10223b", "#67e8f9"] },
  { id: "light", name: "Daylight", description: "Bright & clear", colors: ["#f8fafc", "#e2e8f0", "#0369a1"] },
  { id: "ocean", name: "Ocean", description: "Deep blue", colors: ["#041522", "#0b2e46", "#7dd3fc"] },
  { id: "forest", name: "Forest", description: "Calm green", colors: ["#071b16", "#153b30", "#6ee7b7"] },
  { id: "rose", name: "Rose", description: "Warm & soft", colors: ["#201019", "#442236", "#f9a8d4"] },
] as const;
type Theme = typeof themes[number]["id"];
function snapshot(): Theme {
  const id = document.documentElement.dataset.theme;
  return themes.find(theme => theme.id === id)?.id ?? "dark";
}
function applyTheme(id: Theme) {
  const root = document.documentElement;
  root.dataset.theme = id;
  root.classList.toggle("light", id === "light");
  root.classList.toggle("dark", id !== "light");
  window.dispatchEvent(new Event("nmai-theme-change"));
}
function subscribe(listener: () => void) {
  const sync = (event: StorageEvent) => {
    if (event.key !== "nmai-theme" && event.key !== null) return;
    applyTheme(themes.find(theme => theme.id === event.newValue)?.id ?? "dark");
  };
  window.addEventListener("nmai-theme-change", listener);
  window.addEventListener("storage", sync);
  return () => {
    window.removeEventListener("nmai-theme-change", listener);
    window.removeEventListener("storage", sync);
  };
}

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, snapshot, () => "dark" as Theme);
  const dialog = useRef<HTMLDialogElement>(null);
  const headingId = useId();
  const radioName = useId();
  const choose = (id: Theme) => {
    applyTheme(id);
    try { localStorage.setItem("nmai-theme", id); } catch { /* Works for this visit when storage is unavailable. */ }
  };
  return <>
    <button type="button" className={`theme-trigger ${className}`} aria-label="Change theme" aria-haspopup="dialog" title="Change theme" onClick={() => dialog.current?.showModal()}>
      <Palette size={18} aria-hidden="true" /><span>Theme</span>
    </button>
    <dialog ref={dialog} className="theme-dialog" aria-labelledby={headingId} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
      <div className="theme-picker-content">
        <div className="theme-picker-heading"><div><h2 id={headingId}>Make it yours</h2><p>Choose your look. See it change instantly.</p></div><button type="button" className="theme-close" aria-label="Close theme picker" onClick={() => dialog.current?.close()}><X size={20} /></button></div>
        <fieldset className="theme-options"><legend className="sr-only">Website theme</legend>{themes.map(option => <label key={option.id} className={`theme-option ${theme === option.id ? "is-selected" : ""}`}>
          <input type="radio" name={radioName} value={option.id} checked={theme === option.id} onChange={() => choose(option.id)} />
          <span className="theme-swatches" aria-hidden="true">{option.colors.map(color => <span key={color} style={{ backgroundColor: color }} />)}</span>
          <span className="theme-option-label"><strong>{option.name}</strong><small>{option.description}</small></span>
          {theme === option.id && <Check size={18} className="theme-selected-check" aria-hidden="true" />}
        </label>)}</fieldset>
        <div className="theme-picker-footer"><span>Applies across the website.</span><button type="button" onClick={() => dialog.current?.close()}>Done</button></div>
      </div>
    </dialog>
  </>;
}
