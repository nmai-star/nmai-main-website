"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, PlayCircle, ArrowLeft, Lock, MessageCircle } from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";
import SignOutButton from "../components/SignOutButton";
import type { CourseItem } from "../data/coursesData";
import { getAdminPurchaseWhatsappUrl } from "../data/websiteConfig";

type ListedCourse = CourseItem & { hasAccess?: boolean };
export default function MyCoursesPage({ initialCourses, allCourses = false }: { initialCourses: ListedCourse[]; allCourses?: boolean }) {
  const [courses, setCourses] = useState(initialCourses);
  const [error, setError] = useState("");
  const refresh = useCallback((signal?: AbortSignal) => fetch(allCourses ? "/api/auth/all-courses" : "/api/auth/my-courses", { cache: "no-store", signal })
    .then(async response => {
      if (!response.ok) throw new Error("Unable to verify course access.");
      const result = await response.json();
      if (signal?.aborted) return;
      setCourses(result.courses);
      setError("");
    }).catch(() => {
      if (signal?.aborted) return;
      setCourses([]);
      setError("We couldn’t verify your courses. Please retry or sign in again.");
    }), [allCourses]);

  useEffect(() => {
    const controller = new AbortController();
    const update = () => { void refresh(controller.signal); };
    update();
    const timer = window.setInterval(update, 30000);
    window.addEventListener("focus", update);
    window.addEventListener("storage", update);
    return () => {
      controller.abort(); clearInterval(timer);
      window.removeEventListener("focus", update);
      window.removeEventListener("storage", update);
    };
  }, [refresh]);

  return (
    <div className="min-h-screen bg-[#05070D] text-white">
      <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#05070D]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-3 px-6 lg:px-10">
          <Link href="/" className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"><ArrowLeft size={17} /><span className="hidden sm:inline">Back to Dashboard</span></Link>
          <Link href="/" aria-label="NMAI dashboard"><Image src="/nmai-logo.png" alt="NMAI" width={120} height={44} className="h-11 w-auto object-contain" /></Link>
          <div className="flex items-center gap-3"><ThemeToggle /><SignOutButton /></div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
        <nav aria-label="Course navigation" className="mb-8 flex flex-wrap gap-3 text-sm">
          <Link href="/all-courses" aria-current={allCourses ? "page" : undefined} className={`rounded-xl px-4 py-2 ${allCourses ? "bg-cyan-400/10 text-cyan-300" : "text-slate-400 hover:text-white"}`}>All Courses</Link>
          <Link href="/my-course" aria-current={!allCourses ? "page" : undefined} className={`rounded-xl px-4 py-2 ${!allCourses ? "bg-cyan-400/10 text-cyan-300" : "text-slate-400 hover:text-white"}`}>My Courses</Link>
        </nav>
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">My Learning</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{allCourses ? "All Courses" : "My Courses"}</h1>
          <p className="mt-3 text-sm leading-6 text-slate-400">{allCourses ? "Explore the full NMAI catalog. Only courses assigned to you are unlocked." : "Your assigned courses, all in one place."}</p>
          {!error && courses.length > 0 && <p className="mt-2 text-xs text-cyan-300">{courses.length} {courses.length === 1 ? "course" : "courses"}{allCourses ? " in the catalog" : " assigned"}</p>}
        </div>
        {error ? (
          <div role="alert" className="rounded-2xl border border-amber-500/20 bg-[#090E1A] p-8">
            <p className="text-sm text-amber-200">{error}</p>
            <button onClick={() => void refresh()} className="mt-4 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold">Retry</button>
          </div>
        ) : courses.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {courses.map(course => {
              const hasAccess = !allCourses || course.hasAccess === true;
              const canOpen = hasAccess && course.available && /^\/courses\/[a-z0-9-]+$/.test(course.href);
              return <article key={course.id} className="flex flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0A1020] transition hover:border-blue-500/30">
                <div className="flex h-36 items-center justify-center bg-gradient-to-br from-[#0D1830] via-[#08101F] to-[#071827]"><div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-5"><BookOpen size={32} className="text-cyan-400" /></div></div>
                <div className="flex flex-1 flex-col p-7">
                  <div className="flex flex-wrap items-center gap-2 text-xs"><span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 ${hasAccess ? "bg-emerald-400/10 text-emerald-300" : "bg-amber-400/10 text-amber-300"}`}>{!hasAccess && <Lock size={12} />}{hasAccess ? "Access granted" : "Locked"}</span><span className="text-slate-400">{course.category}</span></div>
                  <h2 className="mt-4 text-xl font-bold">{course.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-400">{course.description}</p>
                  <p className="mt-4 text-xs text-slate-500">{course.lessons} lessons{course.duration ? ` · ${course.duration}` : ""}</p>
                  <div className="mt-auto pt-6">
                    {canOpen ? <Link href={course.href} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold transition hover:bg-blue-500"><PlayCircle size={18} />Start Learning<ArrowRight size={16} /></Link>
                      : !hasAccess ? <a href={getAdminPurchaseWhatsappUrl(course.title)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-amber-400/20 px-4 py-3 text-sm text-amber-300 hover:bg-amber-400/5"><Lock size={16} />Contact Admin to Unlock</a>
                      : <p className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-400"><Lock size={16} />Assigned · Content coming soon</p>}
                  </div>
                </div>
              </article>;
            })}
          </div>
        ) : (
          <div className="max-w-3xl rounded-3xl border border-white/10 bg-[#090E1A] p-8 sm:p-10">
            <div className="inline-flex rounded-2xl bg-cyan-400/10 p-4 text-cyan-400"><BookOpen size={30} /></div>
            <h2 className="mt-5 text-2xl font-bold">{allCourses ? "No courses added yet" : "No courses assigned yet"}</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">{allCourses ? "New courses will appear here when the administrator adds them." : "Once the administrator grants you course access, your courses will appear here."}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href={getAdminPurchaseWhatsappUrl()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold hover:bg-emerald-500"><MessageCircle size={17} />Contact Admin</a>
              <Link href={allCourses ? "/" : "/all-courses"} className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm text-slate-300 hover:bg-white/5">{allCourses ? "Back to Dashboard" : "Explore All Courses"}<ArrowRight size={16} /></Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
