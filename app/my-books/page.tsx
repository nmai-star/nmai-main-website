import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { ArrowUpRight, BookOpen } from "lucide-react";
import { getSession } from "@/lib/auth-store";
import NavigationMenu from "../components/NavigationMenu";
import ThemeToggle from "../components/ThemeToggle";

export const metadata: Metadata = {
  title: "My Books | NMAI",
  description: "Discover From Financial Struggle to Financial Strength by Kranthi Velpuri — a real-life journey of resilience, learning and rebuilding.",
};

export default async function MyBooksPage() {
  const account = await getSession((await cookies()).get("nmai_session")?.value);
  return <div className="min-h-screen bg-[#05070D] text-slate-100">
    <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#05070D]/95 px-5 py-4 backdrop-blur-xl sm:px-10">
      <div className="flex items-center gap-3"><NavigationMenu signedIn={!!account} /><Link href="/" className="text-sm font-semibold text-white">NMAI <span className="ml-2 font-normal text-slate-400">/ My Books</span></Link></div>
      <ThemeToggle />
    </header>
    <main className="mx-auto max-w-6xl px-5 py-10 sm:px-10 sm:py-14">
      <div className="mb-10 max-w-2xl">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-300"><BookOpen size={16} /> The author’s shelf</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">My Books</h1>
        <p className="mt-4 text-base leading-7 text-slate-400">Real experiences. Lessons that stay with you. Discover your next chapter.</p>
      </div>
      <article className="max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#080D17] shadow-xl">
        <a href="https://link.amazon/B014WtitZ" target="_blank" rel="noopener noreferrer" aria-label="Explore From Financial Struggle to Financial Strength (opens in a new tab)" className="group relative flex justify-center overflow-hidden bg-gradient-to-br from-amber-200/10 via-[#10223b] to-[#080D17] px-9 py-9 focus-visible:outline-2 focus-visible:outline-amber-300 sm:px-14 sm:py-10">
          <div aria-hidden="true" className="absolute bottom-3 left-1/4 h-8 w-1/2 rounded-full bg-black/60 blur-xl" />
          <div className="relative w-full max-w-[270px] rounded-r-md shadow-[12px_16px_28px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:-translate-y-2 motion-reduce:transform-none motion-reduce:transition-none">
            <Image src="/books/financial-strength.jpg" alt="From Financial Struggle to Financial Strength, book cover by Kranthi Velpuri" width={311} height={466} priority sizes="(max-width: 480px) 70vw, 270px" className="relative z-10 h-auto w-full rounded-r-sm" />
            <div aria-hidden="true" className="absolute -right-1 bottom-1 top-1 w-2 rounded-r-sm border-r border-amber-100/50 bg-stone-200" />
            <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 z-20 w-3 bg-gradient-to-r from-black/25 to-transparent" />
          </div>
        </a>
        <div className="p-6 sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-amber-300">By Kranthi Velpuri</p>
          <h2 className="mt-3 text-2xl font-bold leading-tight text-white">From Financial Struggle to Financial Strength</h2>
          <p className="mt-4 text-sm leading-6 text-slate-300">What do you do when financial security disappears overnight?<br />Discover one man’s journey of resilience, money lessons and rebuilding—one step at a time.</p>
          <a href="https://link.amazon/B014WtitZ" target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-amber-300 px-5 py-3 text-sm font-bold text-slate-950 transition-colors hover:bg-amber-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-300">Explore the Book<ArrowUpRight size={18} /><span className="sr-only"> (opens in a new tab)</span></a>
        </div>
      </article>
    </main>
  </div>;
}
