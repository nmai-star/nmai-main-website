"use client";

import { LogOut } from "lucide-react";
import { playClickSound } from "../utils/sound";

export default function SignOutButton({ className = "" }: { className?: string }) {

  const handleSignOut = async () => {
    const response = await fetch("/api/auth/logout", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
    if (!response.ok) { alert("Sign out failed. Please try again."); return; }
    playClickSound();
    localStorage.removeItem("nmai-student-session");
    localStorage.removeItem("nmai-student-user");
    window.location.assign("/login");
  };

  return (
    <button
      onClick={handleSignOut}
      type="button"
      title="Sign Out of Student Account"
      className={`inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-slate-400 transition hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-300 focus:outline-none ${className}`}
    >
      <LogOut size={14} />
      <span>Sign Out</span>
    </button>
  );
}
