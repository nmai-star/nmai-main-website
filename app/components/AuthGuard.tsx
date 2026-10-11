"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sparkles, ShieldAlert } from "lucide-react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // The login page and admin portal have their own independent auth gates
    if (pathname === "/" || pathname === "/login" || pathname.startsWith("/admin")) {
      return;
    }

    let cancelled = false;
    const verify = async () => {
      try {
        const response = await fetch("/api/auth/session", { cache: "no-store" });
        if (!response.ok) throw new Error("Access denied");
        const { account } = await response.json();
        const catalogResponse = await fetch("/api/auth/courses", { cache: "no-store" });
        if (!catalogResponse.ok) throw new Error("Unable to load courses");
        const catalog = await catalogResponse.json();
        if (cancelled) return;
        localStorage.setItem("nmai-courses-data", JSON.stringify(catalog.courses));
        const student = {
          id: account.id, email: account.email, name: account.name,
          status: "active", enrolledCourses: account.courses,
          enrolledCourse: account.courses.length ? account.courses.join(", ") : "No Courses Assigned",
          enrollmentDate: account.createdAt.split("T")[0],
        };
        let previous = [];
        try { previous = JSON.parse(localStorage.getItem("nmai-students-master") || "[]"); } catch {}
        const others = Array.isArray(previous) ? previous.filter((s: { email: string }) => s.email !== account.email) : [];
        const previousStudent = Array.isArray(previous) ? previous.find((s: { email: string }) => s.email === account.email) : {};
        localStorage.setItem("nmai-students-master", JSON.stringify([...others, { ...previousStudent, ...student }]));
        const session = { ...student, verified: true };
        localStorage.setItem("nmai-student-session", JSON.stringify(session));
        localStorage.setItem("nmai-student-user", JSON.stringify(session));
        window.dispatchEvent(new Event("storage"));
        setIsAuthenticated(true);
      } catch {
        if (cancelled) return;
        localStorage.removeItem("nmai-student-session");
        localStorage.removeItem("nmai-student-user");
        setIsAuthenticated(false);
        router.replace("/login");
      }
    };
    void verify();
    const timer = window.setInterval(verify, 30000);
    window.addEventListener("focus", verify);
    return () => { cancelled = true; clearInterval(timer); window.removeEventListener("focus", verify); };
  }, [pathname, router]);

  // If on /login or /admin, render immediately
  if (pathname === "/" || pathname === "/login" || pathname.startsWith("/admin")) {
    return <>{children}</>;
  }

  // Loading state while verifying
  if (isAuthenticated === null) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#05070D] text-white">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-cyan-300 shadow-xl shadow-cyan-500/20 animate-pulse">
          <Sparkles size={28} className="text-white" />
        </div>
        <p className="mt-5 text-sm font-semibold text-slate-300">
          Verifying Student Enrollment...
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Checking your verified Gmail credentials
        </p>
      </div>
    );
  }

  // If unauthorized, show security gate while router redirects
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#05070D] text-white px-4 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 mb-4">
          <ShieldAlert size={28} />
        </div>
        <h2 className="text-lg font-bold text-white">Access Restricted</h2>
        <p className="mt-1.5 text-xs text-slate-400 max-w-sm">
          Please log in with your verified student Gmail address to access NMAI courses and AI tools.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
