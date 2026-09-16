"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  PlayCircle,
  ArrowLeft,
  Lock,
  MessageCircle,
  ShieldAlert,
} from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";
import SignOutButton from "../components/SignOutButton";
import { hasCourseAccess, checkStudentAuthorization } from "../data/enrolledStudents";

export default function MyCoursesPage() {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [studentEmail, setStudentEmail] = useState<string>("");
  const [studentName, setStudentName] = useState<string>("");
  const [coursesSummary, setCoursesSummary] = useState<string>("");

  useEffect(() => {
    const evaluate = () => {
      try {
        const sessionRaw = localStorage.getItem("nmai-student-session");
        if (sessionRaw) {
          const session = JSON.parse(sessionRaw);
          if (session && session.email) {
            setStudentEmail(session.email);
            setStudentName(session.name || session.email.split("@")[0]);
            const access = hasCourseAccess(
              session.email,
              "course-nm",
              "Network Marketing Success"
            );
            setHasAccess(access);

            const auth = checkStudentAuthorization(session.email);
            if (auth.student) {
              setCoursesSummary(auth.student.enrolledCourse);
            }
            return;
          }
        }
      } catch (e) {
        console.error(e);
      }
      setHasAccess(false);
    };

    evaluate();
    window.addEventListener("storage", evaluate);
    window.addEventListener("nmai-student-updated", evaluate);
    return () => {
      window.removeEventListener("storage", evaluate);
      window.removeEventListener("nmai-student-updated", evaluate);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#05070D] text-white">
      {/* Header */}
      <header className="border-b border-white/[0.06] bg-[#05070D]/90 sticky top-0 z-30 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={17} />
            Back to Dashboard
          </Link>

          <Link href="/">
            <img
              src="/nmai-logo.png"
              alt="NMAI"
              className="h-11 w-auto object-contain"
            />
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <SignOutButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
        {/* Page Heading */}
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#00E5FF]">
            My Learning
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            My Courses
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
            Continue your learning journey and build practical skills with NMAI.
          </p>
        </div>

        {/* Course Card: ENROLLED vs LOCKED */}
        {hasAccess ? (
          <div className="max-w-4xl overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0A1020] transition duration-300 hover:border-[#0066FF]/30">
            <div className="grid md:grid-cols-[280px_1fr]">
              {/* Course Visual */}
              <div className="relative flex min-h-[220px] items-center justify-center overflow-hidden bg-gradient-to-br from-[#0D1830] via-[#08101F] to-[#07101A]">
                <div className="absolute h-44 w-44 rounded-full border border-[#0066FF]/20" />
                <div className="absolute h-32 w-32 rounded-full border border-dashed border-[#00E5FF]/25" />
                <div className="absolute h-20 w-20 rounded-full border border-[#0066FF]/30" />

                <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#00E5FF]/20 bg-[#071827] shadow-[0_0_35px_rgba(0,229,255,0.12)]">
                  <BookOpen size={30} className="text-[#00E5FF]" />
                </div>
              </div>

              {/* Course Information */}
              <div className="p-7">
                <div className="mb-4 inline-flex items-center rounded-full border border-green-400/20 bg-green-400/10 px-3 py-1 text-xs font-medium text-green-400">
                  Enrolled & Active
                </div>

                <h2 className="text-2xl font-bold">
                  Network Marketing Success
                </h2>

                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
                  Learn practical strategies to build, grow and automate your
                  network marketing business using modern digital tools and
                  systems.
                </p>

                {/* Progress */}
                <div className="mt-7">
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Course Progress</span>
                    <span className="font-medium text-[#00E5FF]">0%</span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                    <div className="h-full w-0 rounded-full bg-[#0066FF]" />
                  </div>
                </div>

                {/* Button */}
                <Link
                  href="/courses/network-marketing"
                  className="group mt-7 inline-flex items-center gap-2 rounded-xl bg-[#0066FF] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_25px_rgba(0,102,255,0.18)] transition hover:bg-[#1673ff] hover:shadow-[0_0_35px_rgba(0,102,255,0.3)]"
                >
                  <PlayCircle size={18} />
                  Start Learning
                  <ArrowRight
                    size={17}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* LOCKED / UNENROLLED STATE */
          <div className="max-w-4xl overflow-hidden rounded-3xl border border-amber-500/20 bg-[#090E1A]/90 p-8 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-400 shadow-lg shadow-amber-500/10">
                <Lock size={32} />
              </div>

              <div className="flex-1">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-amber-300">
                  <ShieldAlert size={12} />
                  No Active Course Enrollments • Paid Training Only
                </div>

                <h2 className="mt-3 text-2xl font-bold text-white">
                  Course Content is Locked
                </h2>

                <p className="mt-2 text-sm text-slate-400 leading-relaxed max-w-xl">
                  You are currently registered as a Free Member. Free accounts have portal access to explore the catalog, but proprietary video lessons and courses are not available for free.
                </p>

                <div className="mt-4 inline-block rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-xs text-slate-300">
                  Account: <span className="font-mono text-cyan-300">{studentEmail || "Guest"}</span> • Status: <span className="text-amber-300 font-semibold">{coursesSummary || "0 Courses Assigned"}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3 border-t border-white/[0.08] pt-6">
              <a
                href="https://wa.me/919177187024?text=Hello%20Admin,%20I%20would%20like%20to%20purchase%20course%20access%20on%20NMAI."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 hover:brightness-110 transition"
              >
                <MessageCircle size={17} />
                Contact Admin to Purchase Access
              </a>

              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3.5 text-sm font-semibold text-slate-300 hover:bg-white/[0.08] transition"
              >
                Explore Course Catalog
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        )}

        {/* Coming Soon */}
        <section className="mt-16">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#64748B]">
              Course Catalog
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              Upcoming NMAI Courses
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "AI & Automation",
              "Content & Design",
              "Video Editing",
            ].map((course) => (
              <div
                key={course}
                className="rounded-2xl border border-white/[0.06] bg-[#080D17] p-6 opacity-70"
              >
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04]">
                  <BookOpen size={19} className="text-slate-500" />
                </div>

                <h3 className="font-semibold">{course}</h3>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  This course will be available soon on NMAI.
                </p>

                <div className="mt-5 inline-flex rounded-full border border-white/[0.06] px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Coming Soon
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}