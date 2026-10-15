"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Bot, Compass, Home, Menu, Music2, Settings, Sparkles, X } from "lucide-react";

const links = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/all-courses", label: "All Courses", icon: BookOpen },
  { href: "/my-course", label: "My Courses", icon: BookOpen },
  { href: "/my-books", label: "My Books", icon: BookOpen },
  { href: "/ai-tools", label: "AI Tools", icon: Bot },
  { href: "/live-music", label: "Live Music", icon: Music2 },
  { href: "/learning-paths", label: "Learning Paths", icon: Compass },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function NavigationMenu({ signedIn = true, children }: { signedIn?: boolean; children?: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const id = useId();
  const pathname = usePathname();
  const close = () => { dialog.current?.close(); setOpen(false); };
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [open]);

  return <>
    <button type="button" aria-label="Open navigation menu" aria-haspopup="dialog" aria-expanded={open} aria-controls={id}
      onClick={() => { dialog.current?.showModal(); setOpen(true); }}
      className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-400/25 bg-cyan-400/10 text-cyan-300 hover:bg-cyan-400/20 focus-visible:outline-2 focus-visible:outline-cyan-300">
      <Menu size={23} aria-hidden="true" />
    </button>
    <dialog ref={dialog} id={id} aria-label="Main navigation" className="navigation-drawer border-r border-white/10 bg-[#080D17] text-slate-100"
      onClose={() => setOpen(false)} onClick={event => {
        const bounds = event.currentTarget.getBoundingClientRect();
        if (event.target === event.currentTarget && (event.clientX > bounds.right || event.clientX < bounds.left)) close();
      }}>
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
        <div><span className="text-xl font-bold text-white">NMAI</span><p className="mt-1 text-xs text-slate-400">Next Gen Masters with AI</p></div>
        <button type="button" onClick={close} aria-label="Close navigation menu" className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 hover:bg-white/5"><X size={20} /></button>
      </div>
      <nav aria-label="Main navigation links" className="space-y-2 p-4">
        {(signedIn ? links : links.filter(link => link.href === "/" || link.href === "/my-books")).map(({ href, label, icon: Icon }) => <Link key={href} href={href} onClick={close} aria-current={pathname === href ? "page" : undefined}
          className={`flex min-h-12 items-center gap-3 rounded-xl px-4 py-3 text-sm ${pathname === href ? "border border-cyan-400/20 bg-cyan-400/10 text-cyan-300" : "text-slate-300 hover:bg-white/5 hover:text-white"}`}><Icon size={18} />{label}</Link>)}
        <Link href="/#about" onClick={close} className="flex min-h-12 items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-300 hover:bg-white/5"><Compass size={18} />About NMAI</Link>
        <Link href="/#learn" onClick={close} className="flex min-h-12 items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-300 hover:bg-white/5"><Sparkles size={18} />What You’ll Learn</Link>
        {!signedIn && <Link href="/login" onClick={close} className="block rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white">Login / Sign up</Link>}
        {children && <div onClick={close}>{children}</div>}
      </nav>
    </dialog>
  </>;
}
