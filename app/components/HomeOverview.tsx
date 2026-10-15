import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Bot, BookOpen, Compass, Home, Music2, Palette, Play, Settings, Sparkles, TrendingUp, Users, Workflow } from "lucide-react";
import FounderSection from "./FounderSection";
import ThemeToggle from "./ThemeToggle";
import SignOutButton from "./SignOutButton";

const skills = [
  { icon: Bot, title: "AI & Automation", text: "Understand AI tools, write useful prompts and simplify everyday work with practical workflows." },
  { icon: Palette, title: "Content & Design", text: "Turn your ideas into clear stories, engaging graphics and a consistent visual identity." },
  { icon: Play, title: "Video Creation", text: "Explore editing, storytelling and short-form content for Reels, Shorts and social media." },
  { icon: TrendingUp, title: "Digital Marketing", text: "Learn the foundations of personal branding, content strategy and connecting with your audience." },
  { icon: Users, title: "Network Marketing", text: "Build practical skills in product conversations, retailing, customer relationships and follow-ups." },
  { icon: Workflow, title: "Digital Business", text: "Connect your skills with useful systems for organizing work and developing digital ideas." },
];

export default function HomeOverview({ signedIn }: { signedIn: boolean }) {
  return <div className="min-h-screen bg-[#05070D] text-slate-100">
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-white/[0.07] bg-[#080D17] p-6 lg:flex">
      <Link href="/" aria-label="NMAI dashboard"><Image src="/nmai-logo.png" alt="NMAI" width={135} height={52} className="h-12 w-auto object-contain" priority /></Link>
      <p className="mt-3 text-xs leading-5 text-slate-500">Next Gen Masters with AI</p>
      <nav aria-label="Main navigation" className="mt-10 space-y-2 text-sm">
        <Link href="/" aria-current="page" className="flex items-center gap-3 rounded-xl border border-cyan-400/15 bg-cyan-400/10 px-4 py-3 text-cyan-300"><Home size={18} />Dashboard</Link>
        <a href="#about" className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-400 hover:bg-white/5 hover:text-white"><Compass size={18} />About NMAI</a>
        <a href="#learn" className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-400 hover:bg-white/5 hover:text-white"><Sparkles size={18} />What You’ll Learn</a>
        {signedIn && <><Link href="/all-courses" className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-400 hover:bg-white/5 hover:text-white"><BookOpen size={18} />All Courses</Link><Link href="/my-course" className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-400 hover:bg-white/5 hover:text-white"><BookOpen size={18} />My Courses</Link><Link href="/ai-tools" className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-400 hover:bg-white/5 hover:text-white"><Bot size={18} />AI Tools</Link><Link href="/live-music" className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-400 hover:bg-white/5 hover:text-white"><Music2 size={18} />Live Music</Link><Link href="/settings" className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-400 hover:bg-white/5 hover:text-white"><Settings size={18} />Settings</Link></>}
      </nav>
      <div className="mt-auto rounded-2xl border border-white/10 bg-white/[0.025] p-4"><p className="text-sm font-semibold text-white">Learn. Create. Grow.</p><p className="mt-2 text-xs leading-5 text-slate-500">Build practical skills for a world shaped by AI.</p></div>
    </aside>
    <div className="lg:pl-64">
      <header className="sticky top-0 z-30 flex min-h-20 flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] bg-[#05070D]/95 px-5 py-4 backdrop-blur-xl sm:px-10">
        <Link href="/" className="text-sm font-semibold tracking-wide text-white">NMAI <span className="ml-2 font-normal text-slate-500">/ Dashboard</span></Link>
        <div className="flex items-center gap-3"><ThemeToggle />{signedIn ? <><Link href="/all-courses" className="text-xs font-semibold text-slate-300 hover:text-white">All Courses</Link><Link href="/my-course" className="rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-500">My Courses</Link><Link href="/live-music" className="text-xs font-semibold text-cyan-300 hover:text-white">Live Music</Link><SignOutButton /></> : <><Link href="/login?mode=signin" className="text-sm text-slate-300 hover:text-white">Login</Link><Link href="/login?mode=signup" className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500">Get Started</Link></>}</div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-8 sm:px-10 sm:py-12">
        <section className="relative overflow-hidden rounded-3xl border border-cyan-400/15 bg-gradient-to-br from-[#10223b] via-[#0A1425] to-[#08101F] px-6 py-12 sm:p-12">
          <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="relative max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Welcome to NMAI</p>
            <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">Next Gen Masters<br /><span className="text-cyan-300">with AI.</span></h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300">Learn the skills to create, communicate and build in the AI era. NMAI brings practical digital learning, creative thinking and modern business skills together in one place.</p>
            <div className="mt-8 flex flex-wrap gap-3"><a href="#about" className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-300">Discover NMAI<ArrowRight size={17} /></a><a href="#learn" className="rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-white hover:bg-white/5">Explore what you can learn</a></div>
          </div>
        </section>

        <section id="about" className="scroll-mt-28 grid gap-8 py-16 md:grid-cols-[1fr_1.5fr]">
          <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">What is NMAI?</p><h2 className="mt-4 text-3xl font-bold leading-tight text-white">A place to learn.<br />A space to build.</h2></div>
          <div className="space-y-4 text-sm leading-7 text-slate-400 sm:text-base"><p><strong className="font-semibold text-slate-200">NMAI stands for Next Gen Masters with AI.</strong> It is a learning platform focused on helping you understand modern digital tools and turn that understanding into practical skills.</p><p>Whether you’re starting your learning journey, creating content or developing a business, NMAI connects AI with the work you want to do. The focus is on applying what you learn: creating useful content, improving communication and building better ways to work.</p></div>
        </section>

        <section id="learn" className="scroll-mt-28 border-t border-white/[0.07] py-12">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">Your learning possibilities</p><h2 className="mt-3 text-3xl font-bold text-white">Skills for your next chapter.</h2><p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">Explore the areas NMAI is building around. Learning content is being introduced step by step.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{skills.map(({ icon: Icon, title, text }) => <article key={title} className="rounded-2xl border border-white/[0.07] bg-[#080D17] p-6"><Icon size={24} className="text-cyan-400" /><h3 className="mt-5 text-base font-semibold text-white">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-400">{text}</p></article>)}</div>
        </section>

        <section className="py-8"><h2 className="text-2xl font-bold text-white">From understanding to doing.</h2><div className="mt-7 grid gap-6 md:grid-cols-3">{[{ n: "01", title: "Learn the essentials", text: "Start with clear concepts and get familiar with the tools behind them." }, { n: "02", title: "Put ideas into practice", text: "Apply your learning to content, conversations and everyday work." }, { n: "03", title: "Build your own approach", text: "Combine your skills and keep improving as your goals and technology evolve." }].map(step => <div key={step.n} className="border-t border-white/10 pt-5"><span className="text-xs font-semibold text-cyan-400">{step.n}</span><h3 className="mt-3 font-semibold text-white">{step.title}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{step.text}</p></div>)}</div></section>

        <FounderSection />

        <section className="mt-10 flex flex-col items-start justify-between gap-6 rounded-3xl border border-blue-400/20 bg-[#0A1425] p-7 sm:p-9 md:flex-row md:items-center"><div><h2 className="text-2xl font-bold text-white">{signedIn ? "Make your next step a learning step." : "Start your journey with NMAI."}</h2><p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">{signedIn ? "Your assigned learning is waiting in My Courses." : "Create an account to explore the portal. Course access is granted separately by the administrator."}</p></div><Link href={signedIn ? "/my-course" : "/login?mode=signup"} className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500">{signedIn ? "Go to My Courses" : "Create an Account"}<ArrowRight size={17} /></Link></section>
      </main>
      <footer className="border-t border-white/[0.07] px-6 py-7 text-center text-xs text-slate-500">NMAI · Next Gen Masters with AI · Learn skills. Build your future.</footer>
    </div>
  </div>;
}
