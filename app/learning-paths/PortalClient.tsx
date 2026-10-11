"use client";

import { motion } from "framer-motion";
import ThemeToggle from "../components/ThemeToggle";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Palette,
  Rocket,
  Users,
  Zap,
} from "lucide-react";

const paths = [
  {
    icon: Bot,
    title: "AI & Automation",
    subtitle: "Become an AI-powered professional",
    description:
      "Build practical AI skills and learn how to automate repetitive work using modern AI tools.",
    courses: 8,
    hours: "12+ hours",
    progress: 0,
    color: "cyan",
    lessons: [
      "AI Fundamentals",
      "Prompt Engineering",
      "AI Tools Mastery",
      "Business Automation",
    ],
  },
  {
    icon: Palette,
    title: "Creator Path",
    subtitle: "Turn ideas into engaging content",
    description:
      "Learn content creation, design, video editing and social media skills to build your creator brand.",
    courses: 7,
    hours: "14+ hours",
    progress: 0,
    color: "purple",
    lessons: [
      "Content Creation",
      "Canva & Design",
      "Video Editing",
      "Social Media",
    ],
  },
  {
    icon: Rocket,
    title: "Digital Business",
    subtitle: "Build your digital business",
    description:
      "Learn the systems, marketing strategies and digital skills needed to build an online business.",
    courses: 9,
    hours: "16+ hours",
    progress: 0,
    color: "blue",
    lessons: [
      "Personal Branding",
      "Digital Marketing",
      "Funnels & Leads",
      "Online Business",
    ],
  },
  {
    icon: Users,
    title: "Network Marketing",
    subtitle: "Build a modern network marketing business",
    description:
      "Master retailing, content, customer acquisition, follow-up and automation for network marketing.",
    courses: 6,
    hours: "10+ hours",
    progress: 0,
    color: "emerald",
    lessons: [
      "Retailing",
      "Content Strategy",
      "Customer Acquisition",
      "Follow-up & Automation",
    ],
  },
];

export default function LearningPaths() {
  return (
    <main className="min-h-screen bg-[#050B14] text-white">
      {/* TOP NAV */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050B14]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[80px] max-w-[1500px] items-center justify-between px-5 lg:px-8">
          <div className="flex items-center gap-5">
            <a
              href="/"
              className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </a>

            <div className="hidden h-6 w-px bg-white/10 sm:block" />

            <img
              src="/nmai-logo.png"
              alt="NMAI"
              className="h-12 w-auto object-contain"
            />
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <a
              href="/"
              className="hidden rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-cyan-400/30 hover:text-white sm:block"
            >
              My Courses
            </a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden px-5 py-20 lg:px-8 lg:py-28">
        {/* Glow */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.08, 0.16, 0.08],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
          }}
          className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-cyan-400 blur-[140px]"
        />

        <div className="relative mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 text-sm font-semibold text-cyan-400"
          >
            <Zap className="h-4 w-4" />
            Guided Learning
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-bold tracking-tight md:text-7xl"
          >
            Choose Your
            <br />
            <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Learning Path.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-slate-400"
          >
            Don't know where to start? Follow a structured path designed to
            take you from beginner to confident practitioner.
          </motion.p>
        </div>
      </section>

      {/* PATHS */}
      <section className="px-5 pb-24 lg:px-8">
        <div className="mx-auto max-w-[1200px] space-y-6">
          {paths.map((path, index) => {
            const Icon = path.icon;

            return (
              <motion.div
                key={path.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.08,
                }}
                whileHover={{ y: -3 }}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#081421] p-6 transition-colors hover:border-cyan-400/25 md:p-8"
              >
                {/* Background glow */}
                <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-cyan-400/5 blur-3xl transition-opacity group-hover:opacity-100" />

                <div className="relative grid gap-8 lg:grid-cols-[280px_1fr_auto] lg:items-center">
                  {/* ICON */}
                  <div>
                    <motion.div
                      whileHover={{
                        rotate: 8,
                        scale: 1.08,
                      }}
                      className="flex h-20 w-20 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10"
                    >
                      <Icon className="h-9 w-9 text-cyan-300" />
                    </motion.div>

                    <p className="mt-5 text-sm font-semibold uppercase tracking-[0.18em] text-cyan-400">
                      Learning Path
                    </p>

                    <h2 className="mt-2 text-2xl font-bold">
                      {path.title}
                    </h2>
                  </div>

                  {/* CONTENT */}
                  <div>
                    <h3 className="text-xl font-semibold text-white md:text-2xl">
                      {path.subtitle}
                    </h3>

                    <p className="mt-3 max-w-2xl leading-7 text-slate-400">
                      {path.description}
                    </p>

                    {/* META */}
                    <div className="mt-5 flex flex-wrap gap-5 text-sm text-slate-500">
                      <span className="flex items-center gap-2">
                        <BriefcaseBusiness className="h-4 w-4 text-cyan-400" />
                        {path.courses} courses
                      </span>

                      <span className="flex items-center gap-2">
                        <Clock3 className="h-4 w-4 text-cyan-400" />
                        {path.hours}
                      </span>

                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                        Beginner friendly
                      </span>
                    </div>

                    {/* LESSONS */}
                    <div className="mt-6 grid gap-2 sm:grid-cols-2">
                      {path.lessons.map((lesson) => (
                        <div
                          key={lesson}
                          className="flex items-center gap-2 text-sm text-slate-400"
                        >
                          <ChevronRight className="h-4 w-4 text-cyan-400" />
                          {lesson}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ACTION */}
                  <div className="lg:text-right">
                    <div className="mb-4 lg:text-right">
                      <p className="text-xs uppercase tracking-wider text-slate-500">
                        Your Progress
                      </p>

                      <p className="mt-1 text-2xl font-bold text-cyan-400">
                        {path.progress}%
                      </p>
                    </div>

                    <div className="mb-5 h-2 w-full overflow-hidden rounded-full bg-white/10 lg:w-40">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{
                          width: `${path.progress}%`,
                        }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-300"
                      />
                    </div>

                    <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 lg:w-auto">
                      Start Path
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="border-t border-white/10 px-5 py-24 lg:px-8">
        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/10 via-blue-500/5 to-purple-500/10 p-10 text-center md:p-16">
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
            }}
            className="absolute left-1/2 top-1/2 h-60 w-60 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400 blur-[100px]"
          />

          <div className="relative">
            <h2 className="text-3xl font-bold md:text-4xl">
              Not sure which path is right for you?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-slate-400">
              Start with our beginner-friendly courses and discover the skills
              that match your goals.
            </p>

            <a
              href="/"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-6 py-3.5 font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Explore All Courses
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}