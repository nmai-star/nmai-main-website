"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  CheckCircle2,
  GraduationCap,
  Lock,
  Mail,
  MessageCircle,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  Zap,
  Eye,
  EyeOff,
  X,
} from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";
import { checkStudentAuthorization } from "../data/enrolledStudents";
import { playClickSound, preloadClickSound } from "../utils/sound";

interface RippleEffect {
  id: number;
  x: number;
  y: number;
  size: number;
  buttonType: "google" | "submit";
}

export default function StudentLoginPage() {
  const router = useRouter();
  const [gmail, setGmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Preload click sound on mount
  useEffect(() => {
    preloadClickSound();
  }, []);

  // Click ripple effects
  const [ripples, setRipples] = useState<RippleEffect[]>([]);

  const triggerRipple = (e: React.MouseEvent<HTMLButtonElement>, buttonType: "google" | "submit") => {
    playClickSound();
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    const newRipple: RippleEffect = { id: Date.now() + Math.random(), x, y, size, buttonType };
    setRipples((prev) => [...prev.slice(-3), newRipple]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);
  };

  // Google Modal State
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);

  // Strict verification: only pre-authorized enrolled students allowed!
  const authenticateStudent = (targetEmail: string, studentName?: string) => {
    const auth = checkStudentAuthorization(targetEmail);

    if (!auth.authorized || !auth.student) {
      const msg = `⛔ Access Denied: "${targetEmail}" is not an enrolled student. NMAI access is strictly restricted to registered students. Please contact support on WhatsApp to purchase enrollment.`;
      setError(msg);
      setGoogleError(msg);
      setLoading(false);
      setGoogleLoading(false);
      return false;
    }

    const student = auth.student;

    if (student.status === "suspended") {
      const msg = `⛔ Access Suspended: Account for "${targetEmail}" has been suspended by the administrator. Please contact support.`;
      setError(msg);
      setGoogleError(msg);
      setLoading(false);
      setGoogleLoading(false);
      setShowGoogleModal(false);
      return false;
    }

    // Email is authorized! Create verified session
    const session = {
      verified: true,
      email: student.email,
      name: student.name || studentName || student.email.split("@")[0],
      enrolledCourse: student.enrolledCourse,
      enrolledCourses: student.enrolledCourses || [],
      loginTime: new Date().toISOString(),
      provider: "google",
    };

    localStorage.setItem("nmai-student-session", JSON.stringify(session));
    localStorage.setItem("nmai-student-user", JSON.stringify(session));

    setSuccessMsg(
      `Welcome back, ${session.name}! Enrolled student access verified. Redirecting to NMAI...`
    );
    setShowGoogleModal(false);

    setTimeout(() => {
      router.push("/");
    }, 800);

    return true;
  };

  // Google Sign-In button clicked
  const handleGoogleClick = () => {
    playClickSound();
    setError(null);
    setGoogleError(null);
    setShowGoogleModal(true);
  };

  // Google modal verification submit
  const handleGoogleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();
    setGoogleError(null);

    if (!customGoogleEmail.trim()) {
      setGoogleError("Please enter your Gmail address.");
      return;
    }

    if (!customGoogleEmail.includes("@")) {
      setGoogleError("Please enter a valid email address (e.g. yourname@gmail.com).");
      return;
    }

    setGoogleLoading(true);

    setTimeout(() => {
      authenticateStudent(customGoogleEmail);
    }, 600);
  };

  // Form submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();
    setError(null);
    setSuccessMsg(null);

    if (!gmail.trim()) {
      setError("Please enter your enrolled student Gmail address.");
      return;
    }

    if (!gmail.toLowerCase().endsWith("@gmail.com") && !gmail.includes("@")) {
      setError("Please enter a valid email address (e.g. yourname@gmail.com).");
      return;
    }

    if (password.length < 4) {
      setError("Please enter your student password.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      authenticateStudent(gmail);
    }, 700);
  };

  // Delegated click capture to ensure all buttons and links trigger click sound
  const handleContainerClickCapture = (e: React.MouseEvent) => {
    const target = (e.target as HTMLElement).closest("button, a, [role='button'], input[type='submit']");
    if (target) {
      playClickSound();
    }
  };

  return (
    <div
      onClickCapture={handleContainerClickCapture}
      className="min-h-screen bg-[#05070D] text-slate-100 relative flex flex-col justify-between overflow-x-hidden selection:bg-cyan-500/20 selection:text-cyan-300"
    >
      {/* BACKGROUND GLOWS */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[10%] top-[10%] h-96 w-96 rounded-full bg-blue-600/10 blur-[140px]" />
        <div className="absolute right-[10%] bottom-[10%] h-96 w-96 rounded-full bg-cyan-500/10 blur-[140px]" />
      </div>

      {/* TOPBAR */}
      <header className="relative z-20 flex h-[72px] items-center justify-between px-6 lg:px-12 border-b border-white/[0.06] bg-[#05070D]/80 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <motion.div whileHover={{ x: -3 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/"
              className="flex items-center gap-2 text-xs font-semibold text-slate-400 transition hover:text-white rounded-xl py-1.5 px-2 hover:bg-white/[0.04]"
            >
              <ArrowLeft size={16} />
              <span>Back to NMAI</span>
            </Link>
          </motion.div>
          <div className="h-4 w-px bg-white/10 hidden sm:block" />
          <Link href="/" className="flex items-center gap-2.5 group">
            <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}>
              <img
                src="/nmai-logo.png"
                alt="NMAI"
                className="h-9 w-auto object-contain transition duration-200"
              />
            </motion.div>
            <div className="hidden sm:block">
              <span className="font-bold tracking-tight text-white block leading-tight">NMAI</span>
              <span className="text-[10px] text-cyan-400 block font-medium">Student Portal</span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-5xl grid lg:grid-cols-12 gap-8 items-center">
          {/* LEFT COLUMN: SECURITY & BRAND HIGHLIGHTS */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden lg:flex lg:col-span-6 flex-col justify-center pr-6"
          >
            {/* HERO NMAI LOGO WITH CLICK EFFECT */}
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <Link href="/" className="mb-6 inline-block w-fit group">
                <img
                  src="/nmai-logo.png"
                  alt="NMAI Platform"
                  className="h-16 w-auto object-contain drop-shadow-[0_0_35px_rgba(6,182,212,0.35)] transition duration-200"
                />
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.06] px-3.5 py-1.5 text-xs font-semibold text-cyan-300 w-fit cursor-default shadow-sm hover:border-cyan-400/40 transition-colors"
            >
              <ShieldCheck size={14} className="text-cyan-400" />
              Verified Enrolled Student Access Only
            </motion.div>

            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-white xl:text-5xl leading-tight">
              Direct Sales & AI{" "}
              <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Learning Platform.
              </span>
            </h1>

            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              NMAI provides specialized frameworks, training playbooks, and automated AI mentors for direct sales leaders. Platform access is strictly restricted to verified enrolled students.
            </p>

            {/* VALUE PROPOSITION CARDS */}
            <div className="mt-7 space-y-3">
              <div className="flex items-start gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3.5 backdrop-blur-sm">
                <div className="h-9 w-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                  <GraduationCap size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Network Marketing Mastery</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Objection handling, team building, leadership models, and prospect closing frameworks.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3.5 backdrop-blur-sm">
                <div className="h-9 w-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0 mt-0.5">
                  <Bot size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">NMAI Sales Objection Mentor</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Exclusive custom Gemini AI trained specifically to handle direct sales objections in real time.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3.5 backdrop-blur-sm">
                <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Protected Student Area</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Only accounts pre-authorized by NMAI administrators are granted access credentials.</p>
                </div>
              </div>
            </div>

            {/* NOT ENROLLED CTA */}
            <div className="mt-6 rounded-2xl border border-amber-500/20 bg-amber-500/[0.05] p-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <span>🔒</span> Need Course Access?
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Courses are strictly paid. Reach out on WhatsApp to purchase enrollment.
                </p>
              </div>
              <motion.a
                href="https://wa.me/919177187024?text=Hi%20NMAI%20Admin,%20I%20want%20to%20enroll%20in%20an%20NMAI%20course"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="shrink-0 flex items-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white transition shadow-md shadow-emerald-500/20"
              >
                <MessageCircle size={14} />
                <span>Enroll on WhatsApp</span>
              </motion.a>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: LOGIN CARD */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full lg:col-span-6 max-w-md mx-auto"
          >
            <div className="rounded-3xl border border-white/[0.08] bg-[#080D17] p-7 sm:p-9 shadow-2xl shadow-cyan-500/5 backdrop-blur-2xl transition-all duration-300 hover:border-white/15">
              {/* CARD NMAI LOGO WITH CLICK EFFECT */}
              <div className="mb-6 flex flex-col items-center justify-center text-center">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                  <Link href="/" className="inline-block transition duration-200">
                    <img
                      src="/nmai-logo.png"
                      alt="NMAI Logo"
                      className="h-14 sm:h-16 w-auto object-contain drop-shadow-[0_0_30px_rgba(6,182,212,0.3)]"
                    />
                  </Link>
                </motion.div>
                <h2 className="mt-4 text-2xl font-bold text-white">
                  Student Sign In
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  Enter your verified student Gmail address to access your courses.
                </p>
              </div>

              {/* PRIMARY GMAIL / GOOGLE BUTTON WITH CLICK EFFECT & EXPANDING RIPPLE */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.015, borderColor: "rgba(6, 182, 212, 0.45)" }}
                whileTap={{ scale: 0.97 }}
                onClick={(e) => {
                  triggerRipple(e, "google");
                  handleGoogleClick();
                }}
                disabled={googleLoading || loading}
                className="relative overflow-hidden w-full flex items-center justify-center gap-3 rounded-2xl border border-white/15 bg-white/[0.06] hover:bg-white/[0.1] py-3.5 px-4 text-sm font-semibold text-white transition-all duration-200 shadow-sm hover:shadow-lg hover:shadow-cyan-500/10 focus:outline-none"
              >
                {/* Expanding Click Ripple */}
                <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
                  {ripples
                    .filter((r) => r.buttonType === "google")
                    .map((r) => (
                      <motion.span
                        key={r.id}
                        initial={{ scale: 0, opacity: 0.4 }}
                        animate={{ scale: 1.2, opacity: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        style={{
                          left: r.x,
                          top: r.y,
                          width: r.size,
                          height: r.size,
                        }}
                        className="absolute rounded-full bg-cyan-400/30 pointer-events-none"
                      />
                    ))}
                </span>

                {/* Official Google 'G' Icon */}
                <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google (Gmail)</span>
              </motion.button>

              <div className="relative my-6 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/[0.08]" />
                </div>
                <span className="relative bg-[#080D17] px-3 text-[11px] font-medium uppercase tracking-wider text-slate-500">
                  Or sign in with password
                </span>
              </div>

              {/* ERROR ALERT */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 rounded-xl border border-rose-500/40 bg-rose-500/15 p-3.5 text-xs text-rose-200 flex items-start gap-2.5"
                >
                  <ShieldAlert size={18} className="text-rose-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-rose-300">Access Denied</p>
                    <p className="mt-0.5 leading-relaxed">{error}</p>
                  </div>
                </motion.div>
              )}

              {/* SUCCESS ALERT */}
              {successMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 rounded-xl border border-emerald-500/40 bg-emerald-500/15 p-3.5 text-xs text-emerald-200 flex items-start gap-2.5"
                >
                  <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                  <p className="font-semibold">{successMsg}</p>
                </motion.div>
              )}

              {/* FORM */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Student Gmail Address
                  </label>
                  <div className="relative">
                    <Mail
                      size={17}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                    />
                    <input
                      type="email"
                      value={gmail}
                      onChange={(e) => setGmail(e.target.value)}
                      placeholder="student@gmail.com"
                      required
                      className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-2.5 pl-10 pr-3.5 text-sm text-white placeholder-slate-600 transition-all duration-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:bg-white/[0.07] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-300">
                      Password
                    </label>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.94 }}
                      onClick={() => alert("Please contact the NMAI Administrator on WhatsApp to reset your password.")}
                      className="text-[11px] font-medium text-cyan-400 hover:text-cyan-300 hover:underline transition"
                    >
                      Forgot password?
                    </motion.button>
                  </div>
                  <div className="relative">
                    <Lock
                      size={17}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-2.5 pl-10 pr-10 text-sm text-white placeholder-slate-600 transition-all duration-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:bg-white/[0.07] focus:outline-none"
                    />
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.85, rotate: 15 }}
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-500 hover:text-white transition-colors"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </motion.button>
                  </div>
                </div>

                {/* PRIMARY SUBMIT BUTTON WITH CLICK EFFECT & EXPANDING RIPPLE */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.015, boxShadow: "0 0 25px rgba(6, 182, 212, 0.35)" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={(e) => triggerRipple(e, "submit")}
                  disabled={loading || googleLoading}
                  className="relative overflow-hidden w-full mt-3 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-cyan-400 py-3.5 px-4 text-sm font-bold text-white transition-all shadow-lg shadow-cyan-500/25 hover:brightness-110 focus:outline-none disabled:opacity-50"
                >
                  {/* Expanding Click Ripple */}
                  <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
                    {ripples
                      .filter((r) => r.buttonType === "submit")
                      .map((r) => (
                        <motion.span
                          key={r.id}
                          initial={{ scale: 0, opacity: 0.45 }}
                          animate={{ scale: 1.2, opacity: 0 }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                          style={{
                            left: r.x,
                            top: r.y,
                            width: r.size,
                            height: r.size,
                          }}
                          className="absolute rounded-full bg-white/40 pointer-events-none"
                        />
                      ))}
                  </span>

                  <span className="relative z-10 flex items-center gap-2">
                    {loading ? "Verifying Student Enrollment..." : "Sign In & Open Platform"}
                    <ArrowRight size={16} />
                  </span>
                </motion.button>
              </form>

              <div className="mt-6 pt-4 border-t border-white/[0.06] text-center">
                <p className="text-xs text-slate-500">
                  Not an enrolled student?{" "}
                  <motion.a
                    href="https://wa.me/919177187024?text=Hi%20NMAI%20Admin,%20I%20want%20to%20enroll%20in%20an%20NMAI%20course"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.94 }}
                    className="font-semibold text-cyan-300 hover:text-cyan-200 underline underline-offset-4 transition"
                  >
                    Request Enrollment on WhatsApp
                  </motion.a>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* GOOGLE ACCOUNT SELECTOR MODAL WITH ANIMATIONS */}
      <AnimatePresence>
        {showGoogleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !googleLoading && setShowGoogleModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#080D17] p-6 shadow-2xl z-10"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src="/nmai-logo.png"
                    alt="NMAI"
                    className="h-7 w-auto object-contain"
                  />
                  <div className="h-4 w-px bg-white/15" />
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <h3 className="text-sm font-bold text-white">Sign in with Google</h3>
                  </div>
                </div>
                <motion.button
                  type="button"
                  whileHover={{ rotate: 90 }}
                  whileTap={{ scale: 0.85 }}
                  onClick={() => setShowGoogleModal(false)}
                  className="rounded-xl p-1.5 text-slate-400 hover:bg-white/[0.08] hover:text-white transition"
                >
                  <X size={16} />
                </motion.button>
              </div>

              <p className="text-xs text-slate-400 mb-4">
                Enter your enrolled Google / Gmail address to verify your student membership:
              </p>

              {googleError && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 rounded-xl border border-rose-500/40 bg-rose-500/15 p-3 text-xs text-rose-200 flex items-start gap-2"
                >
                  <ShieldAlert size={16} className="text-rose-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-rose-300">Access Denied</p>
                    <p className="mt-0.5 leading-relaxed">{googleError}</p>
                  </div>
                </motion.div>
              )}

              <form onSubmit={handleGoogleVerify} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Student Gmail Address
                  </label>
                  <div className="relative">
                    <Mail
                      size={16}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                    />
                    <input
                      type="email"
                      value={customGoogleEmail}
                      onChange={(e) => setCustomGoogleEmail(e.target.value)}
                      placeholder="student@gmail.com"
                      required
                      className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-2.5 pl-10 pr-3.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all"
                    />
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={googleLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-2.5 px-4 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:brightness-110 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {googleLoading ? "Verifying Student Enrollment..." : "Verify & Open Student Portal"}
                  <ArrowRight size={14} />
                </motion.button>
              </form>

              <div className="mt-4 pt-3 border-t border-white/10 text-center">
                <p className="text-[11px] text-slate-500">
                  Only Gmail addresses pre-authorized by NMAI administrators are permitted.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FOOTER */}
      <footer className="relative z-10 py-6 border-t border-white/[0.06] text-center text-xs text-slate-600 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
        <p>&copy; {new Date().getFullYear()} NMAI Learning Platform. Verified Enrolled Student Access Only.</p>
      </footer>
    </div>
  );
}
