"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { playClickSound } from "../utils/sound";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("nmai-theme") as "dark" | "light" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === "light") {
        document.documentElement.classList.add("light");
        document.documentElement.classList.remove("dark");
      } else {
        document.documentElement.classList.add("dark");
        document.documentElement.classList.remove("light");
      }
    } else {
      // Default to dark
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    playClickSound();
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("nmai-theme", nextTheme);

    if (nextTheme === "light") {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    }
  };

  if (!mounted) {
    return (
      <div
        className={`h-9 w-9 rounded-xl border border-white/10 bg-white/[0.04] p-2 ${className}`}
        aria-hidden="true"
      />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`relative flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] p-2 text-slate-300 transition-colors hover:border-cyan-400/40 hover:bg-white/[0.08] hover:text-white focus:outline-none ${className}`}
      title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label="Toggle dark and light theme"
    >
      {theme === "dark" ? (
        <Sun size={18} className="text-amber-400 transition-transform duration-300 hover:rotate-45" />
      ) : (
        <Moon size={18} className="text-blue-500 transition-transform duration-300 hover:-rotate-12" />
      )}
    </button>
  );
}
