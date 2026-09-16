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
    if (pathname === "/login" || pathname.startsWith("/admin")) {
      setIsAuthenticated(true);
      return;
    }

    try {
      const sessionRaw = localStorage.getItem("nmai-student-session");
      if (sessionRaw) {
        const session = JSON.parse(sessionRaw);
        if (session && session.verified === true && session.email) {
          setIsAuthenticated(true);
          return;
        }
      }
    } catch (e) {
      console.error("Failed to read student session:", e);
    }

    // Not authenticated -> redirect to login
    setIsAuthenticated(false);
    router.replace("/login");
  }, [pathname, router]);

  // If on /login or /admin, render immediately
  if (pathname === "/login" || pathname.startsWith("/admin")) {
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
