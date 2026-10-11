"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  BookOpen,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Unlock,
  CheckCircle2,
  MessageCircle,
  ArrowLeft,
  ArrowRight,
  Save,
  Sparkles,
  Bell,
  ExternalLink,
  Settings as SettingsIcon,
  LogOut,
  Check,
  Palette,
  Target,
  Award,
  Clock,
  ChevronRight,
  AlertCircle,
  Camera,
  Upload,
  Trash2,
  RefreshCw,
  X,
  Video,
  Image as ImageIcon,
} from "lucide-react";

import ThemeToggle from "../components/ThemeToggle";
import SignOutButton from "../components/SignOutButton";
import { playClickSound } from "../utils/sound";
import {
  getAllStudents,
  checkStudentAuthorization,
  hasAnyCourseAccess,
  hasCourseAccess,
  updateStudentProfile,
  EnrolledStudent,
} from "../data/enrolledStudents";

const AVATAR_GRADIENTS = [
  { id: "ocean", label: "Ocean Cyan", value: "from-blue-600 to-cyan-500" },
  { id: "violet", label: "Royal Violet", value: "from-purple-600 to-pink-500" },
  { id: "emerald", label: "Emerald Mint", value: "from-emerald-600 to-teal-400" },
  { id: "amber", label: "Sunset Gold", value: "from-amber-500 to-orange-500" },
  { id: "indigo", label: "Deep Indigo", value: "from-indigo-600 to-violet-500" },
  { id: "rose", label: "Crimson Glow", value: "from-rose-600 to-pink-500" },
];

const INTEREST_OPTIONS = [
  "Network Marketing & Team Building",
  "AI Tools & Prompt Automation",
  "Social Media Lead Generation",
  "Automated Video & Content Creation",
  "Full Stack Direct Sales Mastery",
];

const LEVEL_OPTIONS = [
  { value: "Beginner", label: "Beginner (New to Direct Sales & AI)" },
  { value: "Intermediate", label: "Intermediate (1 - 3 Years in Network Marketing)" },
  { value: "Advanced", label: "Advanced / Team Leader (3+ Years Experience)" },
];

const PLATFORM_COURSES = [
  {
    id: "course-nm",
    title: "Network Marketing Success",
    description: "Core recruiting scripts, objection handling frameworks, and automated closing pipelines.",
    href: "/courses/network-marketing",
    category: "Network Marketing",
  },
  {
    id: "course-ai",
    title: "AI Tools & Automation Masterclass",
    description: "Hands-on implementation of ChatGPT, Midjourney, and Make.com workflows for 10x productivity.",
    href: "/ai-tools",
    category: "AI & Automation",
  },
  {
    id: "course-design",
    title: "Content & Social Media Design",
    description: "Creating high-converting carousels, Canva brand kits, and viral social assets.",
    href: "/courses/network-marketing",
    category: "Content & Design",
  },
  {
    id: "course-video",
    title: "Video Editing & Reels Accelerator",
    description: "CapCut editing frameworks, AI avatar cloning, and viral short-form video strategies.",
    href: "/courses/network-marketing",
    category: "Video Editing",
  },
];

/**
 * Compresses an image element or video frame to a centered square JPEG data URL (~25KB).
 */
function compressImageSource(
  source: HTMLImageElement | HTMLVideoElement,
  targetSize = 360,
  quality = 0.85
): string {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = targetSize;
    canvas.height = targetSize;
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";

    const srcWidth = source instanceof HTMLVideoElement ? source.videoWidth : source.naturalWidth || source.width;
    const srcHeight = source instanceof HTMLVideoElement ? source.videoHeight : source.naturalHeight || source.height;

    if (!srcWidth || !srcHeight) return "";

    // Center crop to 1:1 square
    const minDim = Math.min(srcWidth, srcHeight);
    const startX = (srcWidth - minDim) / 2;
    const startY = (srcHeight - minDim) / 2;

    ctx.drawImage(source, startX, startY, minDim, minDim, 0, 0, targetSize, targetSize);
    return canvas.toDataURL("image/jpeg", quality);
  } catch (err) {
    console.error("Error compressing image:", err);
    return "";
  }
}

export default function ProfileSettingsPage() {
  const [student, setStudent] = useState<EnrolledStudent | null>(null);
  const [currentUserEmail, setCurrentUserEmail] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"profile" | "courses" | "community" | "security">("profile");

  // Profile Form States
  const [fullName, setFullName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [avatarColor, setAvatarColor] = useState<string>("from-blue-600 to-cyan-500");
  const [avatarImage, setAvatarImage] = useState<string>("");
  const [interest, setInterest] = useState<string>(INTEREST_OPTIONS[0]);
  const [level, setLevel] = useState<string>("Beginner");

  // Photo Modal & Camera States
  const [showPhotoModal, setShowPhotoModal] = useState<boolean>(false);
  const [photoModalTab, setPhotoModalTab] = useState<"upload" | "camera">("upload");
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isCameraStarting, setIsCameraStarting] = useState<boolean>(false);
  const [cameraFacing, setCameraFacing] = useState<"user" | "environment">("user");

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Notification Preferences
  const [notifyAnnouncements, setNotifyAnnouncements] = useState<boolean>(true);
  const [notifyCourseUpdates, setNotifyCourseUpdates] = useState<boolean>(true);

  // Status & Feedback
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Load active session and student profile
  useEffect(() => {
    function loadData() {
      try {
        let email = "";
        const sessionRaw = localStorage.getItem("nmai-student-session");
        if (sessionRaw) {
          const session = JSON.parse(sessionRaw);
          if (session && session.email) {
            email = session.email.toLowerCase().trim();
          }
        }

        if (email) {
          setCurrentUserEmail(email);
          const auth = checkStudentAuthorization(email);
          if (auth.student) {
            setStudent(auth.student);
            setFullName(auth.student.name || email.split("@")[0]);
            setPhone(auth.student.phone || "");
            setBio(auth.student.bio || "");
            setAvatarColor(auth.student.avatarColor || "from-blue-600 to-cyan-500");
            setAvatarImage(auth.student.avatarImage || "");
            setInterest(auth.student.interest || INTEREST_OPTIONS[0]);
            setLevel(auth.student.level || "Beginner");
          } else {
            // Fallback object for new user without full record
            const fallbackStudent: EnrolledStudent = {
              id: `student-${Date.now()}`,
              email,
              name: email.split("@")[0],
              enrolledCourse: "No Courses Assigned (Locked)",
              enrolledCourses: [],
              status: "active",
              enrollmentDate: new Date().toISOString().split("T")[0],
            };
            setStudent(fallbackStudent);
            setFullName(fallbackStudent.name);
          }
        }

        // Load local preferences
        const savedPref = localStorage.getItem("nmai-student-pref");
        if (savedPref) {
          const pref = JSON.parse(savedPref);
          if (pref.notifyAnnouncements !== undefined) setNotifyAnnouncements(pref.notifyAnnouncements);
          if (pref.notifyCourseUpdates !== undefined) setNotifyCourseUpdates(pref.notifyCourseUpdates);
        }
      } catch (err) {
        console.error("Error loading student profile:", err);
      }
    }

    loadData();

    window.addEventListener("storage", loadData);
    window.addEventListener("nmai-student-updated", loadData);
    return () => {
      window.removeEventListener("storage", loadData);
      window.removeEventListener("nmai-student-updated", loadData);
    };
  }, []);

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [mediaStream]);

  // Connect video ref when stream updates or modal tab switches
  useEffect(() => {
    if (videoRef.current && mediaStream) {
      videoRef.current.srcObject = mediaStream;
      videoRef.current.play().catch(() => {});
    }
  }, [mediaStream, showPhotoModal, photoModalTab]);

  const hasAccess = currentUserEmail ? hasAnyCourseAccess(currentUserEmail) : false;

  const getInitials = (nameStr: string) => {
    if (!nameStr) return "S";
    const parts = nameStr.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return nameStr.slice(0, 2).toUpperCase();
  };

  // ================= CAMERA HANDLERS =================
  const startCamera = async (facing: "user" | "environment" = cameraFacing) => {
    try {
      setCameraError(null);
      setCapturedPhoto(null);
      setIsCameraStarting(true);

      // Stop existing stream if any
      if (mediaStream) {
        mediaStream.getTracks().forEach((t) => t.stop());
      }

      if (typeof navigator === "undefined" || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError("Live camera is not supported in this browser. Please upload a photo from your device.");
        setIsCameraStarting(false);
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facing,
          width: { ideal: 720 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      setMediaStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
    } catch (err: any) {
      console.error("Camera access error:", err);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setCameraError("Camera permission was denied. Please allow camera permissions in your browser address bar.");
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        setCameraError("No camera device detected on your system. Please upload a photo from your computer.");
      } else {
        setCameraError("Could not access camera. Please check your system camera settings or upload an image.");
      }
    } finally {
      setIsCameraStarting(false);
    }
  };

  const stopCamera = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      setMediaStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const toggleCameraFacing = () => {
    const nextFacing = cameraFacing === "user" ? "environment" : "user";
    setCameraFacing(nextFacing);
    startCamera(nextFacing);
  };

  const captureFromCamera = () => {
    if (!videoRef.current) return;
    const compressed = compressImageSource(videoRef.current, 360, 0.85);
    if (compressed) {
      setCapturedPhoto(compressed);
    }
  };

  const applyCapturedPhoto = () => {
    if (!capturedPhoto) return;
    setAvatarImage(capturedPhoto);
    stopCamera();
    setShowPhotoModal(false);
    if (currentUserEmail) {
      updateStudentProfile(currentUserEmail, { avatarImage: capturedPhoto });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 12 * 1024 * 1024) {
      alert("Please select an image smaller than 12MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const compressedDataUrl = compressImageSource(img, 360, 0.85);
        if (compressedDataUrl) {
          setAvatarImage(compressedDataUrl);
          setShowPhotoModal(false);
          if (currentUserEmail) {
            updateStudentProfile(currentUserEmail, { avatarImage: compressedDataUrl });
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleRemovePhoto = () => {
    setAvatarImage("");
    setCapturedPhoto(null);
    stopCamera();
    setShowPhotoModal(false);
    if (currentUserEmail) {
      updateStudentProfile(currentUserEmail, { avatarImage: "" });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const closePhotoModal = () => {
    stopCamera();
    setCapturedPhoto(null);
    setCameraError(null);
    setShowPhotoModal(false);
  };

  // ================= SAVE PROFILE FORM =================
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUserEmail) return;

    setIsSaving(true);

    const updated = updateStudentProfile(currentUserEmail, {
      name: fullName.trim() || student?.name || currentUserEmail.split("@")[0],
      phone: phone.trim(),
      bio: bio.trim(),
      avatarColor,
      avatarImage,
      interest,
      level,
    });

    // Save preferences
    try {
      localStorage.setItem(
        "nmai-student-pref",
        JSON.stringify({
          notifyAnnouncements,
          notifyCourseUpdates,
        })
      );
    } catch {}

    if (updated) {
      const auth = checkStudentAuthorization(currentUserEmail);
      if (auth.student) {
        setStudent(auth.student);
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    }
    setIsSaving(false);
  };

  return (
    <div
      onClickCapture={(e) => {
        const target = (e.target as HTMLElement).closest("button, a, [role='button'], input[type='submit']");
        if (target) playClickSound();
      }}
      className="min-h-screen bg-[#05070D] text-white"
    >
      {/* ================= HEADER / TOPBAR ================= */}
      <header className="sticky top-0 z-40 border-b border-white/[0.07] bg-[#070B14]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[70px] max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-cyan-400/40 hover:bg-white/[0.07] hover:text-white"
            >
              <ArrowLeft size={15} />
              <span>Back to Dashboard</span>
            </Link>

            <div className="hidden h-5 w-[1px] bg-white/10 sm:block" />

            <Link href="/" className="flex items-center">
              <img
                src="/nmai-logo.png"
                alt="NMAI"
                className="h-9 w-auto object-contain"
              />
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-slate-400 md:flex">
              <div
                className={`h-2 w-2 rounded-full ${
                  hasAccess ? "bg-emerald-400 shadow-[0_0_8px_#34d399]" : "bg-amber-400 shadow-[0_0_8px_#fbbf24]"
                }`}
              />
              <span className="font-mono text-[11px] text-slate-300">
                {hasAccess ? "Enrolled Student" : "Free Member"}
              </span>
            </div>
            <SignOutButton />
          </div>
        </div>
      </header>

      {/* ================= MAIN CONTAINER ================= */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* SUCCESS TOAST BANNER */}
        <AnimatePresence>
          {saveSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="mb-6 flex items-center justify-between rounded-2xl border border-emerald-500/30 bg-emerald-500/15 p-4 text-emerald-300 shadow-xl shadow-emerald-500/10"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Profile Updated Successfully</h4>
                  <p className="text-xs text-emerald-300/80">
                    Your personal information and profile picture have been updated across your NMAI session.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSaveSuccess(false)}
                className="rounded-lg p-1 text-emerald-400 hover:bg-emerald-500/20"
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* HERO PROFILE CARD */}
        <div className="relative mb-8 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0B1220] via-[#070B14] to-[#05070D] p-6 shadow-2xl sm:p-8">
          {/* Subtle Ambient Glow */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-5">
              {/* Profile Avatar with Photo / Initials & Edit Badge */}
              <div className="relative group shrink-0">
                <div
                  className={`flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br ${avatarColor} text-2xl font-bold text-white shadow-xl shadow-blue-500/20 ring-4 ring-white/10`}
                >
                  {avatarImage ? (
                    <img
                      src={avatarImage}
                      alt={fullName || "Student Avatar"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    getInitials(fullName || student?.name || "Student")
                  )}
                </div>

                {/* Camera Click Overlay Badge */}
                <button
                  type="button"
                  onClick={() => {
                    setPhotoModalTab("upload");
                    setShowPhotoModal(true);
                  }}
                  title="Change Profile Picture"
                  className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md ring-2 ring-[#070B14] transition hover:bg-cyan-500 hover:scale-105"
                >
                  <Camera size={13} />
                </button>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold text-white sm:text-3xl">
                    {fullName || student?.name || "Student"}
                  </h1>
                  {hasAccess ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-0.5 text-xs font-semibold text-emerald-300">
                      <ShieldCheck size={14} />
                      Active Student
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-0.5 text-xs font-semibold text-amber-300">
                      <Lock size={13} />
                      Free Member (Locked)
                    </span>
                  )}
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5 font-mono text-cyan-300">
                    <Mail size={13} className="text-slate-500" />
                    {currentUserEmail || "student@gmail.com"}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={13} className="text-slate-500" />
                    Enrolled: {student?.enrollmentDate || "2026-02-01"}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Award size={13} className="text-slate-500" />
                    Level: {level}
                  </span>
                </div>

                <div className="mt-2.5 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPhotoModalTab("upload");
                      setShowPhotoModal(true);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] font-medium text-slate-300 transition hover:border-cyan-400/40 hover:text-white"
                  >
                    <Camera size={12} className="text-cyan-400" />
                    <span>{avatarImage ? "Change Photo" : "Add Profile Photo"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPhotoModalTab("camera");
                      setShowPhotoModal(true);
                      startCamera();
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] font-medium text-slate-300 transition hover:border-cyan-400/40 hover:text-white"
                  >
                    <Video size={12} className="text-cyan-400" />
                    <span>Live Camera</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Status / WhatsApp CTAs */}
            <div className="flex shrink-0 flex-wrap items-center gap-2.5">
              {hasAccess ? (
                <a
                  href="https://chat.whatsapp.com/CjZKNudezQp46MRqsUOTBR"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:brightness-110"
                >
                  <MessageCircle size={16} />
                  <span>Student Community</span>
                  <ExternalLink size={12} className="opacity-70" />
                </a>
              ) : (
                <a
                  href="https://wa.me/919177187024?text=Hello%20Admin,%20I%20would%20like%20to%20upgrade%20my%20account%20and%20unlock%20courses."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-500 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-amber-600/20 transition hover:brightness-110"
                >
                  <Lock size={15} />
                  <span>Upgrade to Enrolled</span>
                  <ArrowRight size={13} />
                </a>
              )}
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-7 grid grid-cols-2 gap-3 border-t border-white/[0.08] pt-5 sm:grid-cols-4 sm:gap-4">
            <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Course Permissions
              </span>
              <p className="mt-1 truncate text-sm font-bold text-white">
                {student?.enrolledCourse || "No Courses Assigned"}
              </p>
            </div>
            <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                WhatsApp Group
              </span>
              <p className="mt-1 text-sm font-bold">
                {hasAccess ? (
                  <span className="text-emerald-400">Unlocked & Active</span>
                ) : (
                  <span className="text-amber-400">Locked (Paid Only)</span>
                )}
              </p>
            </div>
            <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Learning Focus
              </span>
              <p className="mt-1 truncate text-sm font-bold text-cyan-300">
                {interest.split("&")[0].trim()}
              </p>
            </div>
            <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Account Status
              </span>
              <p className="mt-1 text-sm font-bold text-emerald-400">
                Verified (Active)
              </p>
            </div>
          </div>
        </div>

        {/* ================= NAVIGATION TABS ================= */}
        <div className="mb-8 flex flex-wrap items-center gap-2 border-b border-white/[0.07] pb-3">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition ${
              activeTab === "profile"
                ? "border border-blue-500/30 bg-blue-600/20 text-cyan-300 shadow-md shadow-blue-500/10"
                : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
            }`}
          >
            <User size={15} />
            <span>Profile Details</span>
          </button>

          <button
            onClick={() => setActiveTab("courses")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition ${
              activeTab === "courses"
                ? "border border-blue-500/30 bg-blue-600/20 text-cyan-300 shadow-md shadow-blue-500/10"
                : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
            }`}
          >
            <BookOpen size={15} />
            <span>Course Access & Permissions</span>
            {hasAccess ? (
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                {student?.enrolledCourses?.includes("*") ? "All" : student?.enrolledCourses?.length || 1}
              </span>
            ) : (
              <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-400">
                0
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("community")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition ${
              activeTab === "community"
                ? "border border-blue-500/30 bg-blue-600/20 text-cyan-300 shadow-md shadow-blue-500/10"
                : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
            }`}
          >
            <MessageCircle size={15} />
            <span>WhatsApp Community</span>
          </button>

          <button
            onClick={() => setActiveTab("security")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition ${
              activeTab === "security"
                ? "border border-blue-500/30 bg-blue-600/20 text-cyan-300 shadow-md shadow-blue-500/10"
                : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
            }`}
          >
            <Shield size={15} />
            <span>Preferences & Security</span>
          </button>
        </div>

        {/* ================= TAB 1: PROFILE DETAILS ================= */}
        {activeTab === "profile" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="rounded-3xl border border-white/[0.08] bg-[#070B14] p-6 shadow-xl sm:p-8"
          >
            <div className="border-b border-white/[0.06] pb-5">
              <h2 className="text-lg font-bold text-white">Personal Information</h2>
              <p className="mt-1 text-xs text-slate-400">
                Update your student profile, profile picture, contact information, and platform customization.
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="mt-6 space-y-6">
              {/* Profile Picture Management Card */}
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 sm:p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br ${avatarColor} text-xl font-bold text-white ring-2 ring-white/10 shadow-md`}>
                      {avatarImage ? (
                        <img src={avatarImage} alt="Profile preview" className="h-full w-full object-cover" />
                      ) : (
                        getInitials(fullName || student?.name || "Student")
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Student Profile Picture</h4>
                      <p className="text-xs text-slate-400">
                        Add a personal photo from your computer or snap a picture with your live camera.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setPhotoModalTab("upload");
                        setShowPhotoModal(true);
                      }}
                      className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-semibold text-slate-200 hover:border-cyan-400/40 hover:text-white transition"
                    >
                      <Upload size={14} className="text-cyan-400" />
                      <span>Upload from Device</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setPhotoModalTab("camera");
                        setShowPhotoModal(true);
                        startCamera();
                      }}
                      className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-blue-500/20 hover:brightness-110 transition"
                    >
                      <Camera size={14} />
                      <span>Take Live Photo</span>
                    </button>

                    {avatarImage && (
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        title="Remove custom photo and revert to initials"
                        className="flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 transition"
                      >
                        <Trash2 size={13} />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Full Name */}
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Full Name
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your full name"
                      required
                      className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Email Address (Read-only) */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Gmail Address
                    </label>
                    <span className="flex items-center gap-1 text-[10px] text-slate-500">
                      <Lock size={10} /> Verified ID
                    </span>
                  </div>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="email"
                      value={currentUserEmail}
                      disabled
                      className="h-11 w-full cursor-not-allowed rounded-xl border border-white/[0.06] bg-white/[0.02] pl-10 pr-4 font-mono text-sm text-slate-400"
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500">
                    Gmail address is locked to your enrolled student account. Contact admin to change.
                  </p>
                </div>

                {/* WhatsApp / Phone Number */}
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300">
                    WhatsApp / Phone Number
                  </label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500">
                    Used for mentor WhatsApp support and course material updates.
                  </p>
                </div>

                {/* Experience Level */}
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Network Marketing Experience
                  </label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="h-11 w-full rounded-xl border border-white/10 bg-[#0A0F1D] px-3.5 text-sm text-white focus:border-cyan-400 focus:outline-none"
                  >
                    {LEVEL_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value} className="bg-[#070B14] text-white">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Primary Learning Focus */}
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Primary Learning Interest
                </label>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                  {INTEREST_OPTIONS.map((item) => (
                    <button
                      type="button"
                      key={item}
                      onClick={() => setInterest(item)}
                      className={`flex items-center justify-between rounded-xl border p-3 text-left text-xs font-medium transition ${
                        interest === item
                          ? "border-cyan-400/50 bg-cyan-400/10 text-cyan-200"
                          : "border-white/[0.08] bg-white/[0.02] text-slate-400 hover:border-white/20 hover:text-white"
                      }`}
                    >
                      <span>{item}</span>
                      {interest === item && <Check size={14} className="text-cyan-400" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Learning Bio / Goal */}
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Learning Goal & Direct Sales Bio
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="e.g. Building an automated direct sales team using AI lead generation and modern video marketing..."
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-white placeholder:text-slate-600 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              {/* Avatar Accent Color */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-300">
                  <Palette size={14} className="text-cyan-400" />
                  <span>Avatar Accent Theme (Background & Badges)</span>
                </label>
                <div className="flex flex-wrap gap-3">
                  {AVATAR_GRADIENTS.map((g) => (
                    <button
                      type="button"
                      key={g.id}
                      onClick={() => setAvatarColor(g.value)}
                      className={`flex items-center gap-2.5 rounded-xl border px-3 py-2 text-xs font-medium transition ${
                        avatarColor === g.value
                          ? "border-white bg-white/10 text-white shadow-md"
                          : "border-white/[0.08] bg-white/[0.02] text-slate-400 hover:border-white/20"
                      }`}
                    >
                      <div className={`h-4 w-4 rounded-full bg-gradient-to-br ${g.value}`} />
                      <span>{g.label}</span>
                      {avatarColor === g.value && <Check size={12} className="text-cyan-400" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="border-t border-white/[0.06] pt-5">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 text-xs font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:brightness-110 disabled:opacity-50"
                >
                  <Save size={16} />
                  <span>{isSaving ? "Saving..." : "Save Profile Changes"}</span>
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* ================= TAB 2: COURSE ACCESS & PERMISSIONS ================= */}
        {activeTab === "courses" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Permissions Summary Card */}
            <div className="rounded-3xl border border-white/[0.08] bg-[#070B14] p-6 shadow-xl sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">Course Enrollment Status</h2>
                  <p className="mt-1 text-xs text-slate-400">
                    Your account permissions are managed by the NMAI Admin. All proprietary course materials require an active enrollment.
                  </p>
                </div>

                <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2.5">
                  <ShieldCheck size={18} className="text-cyan-400" />
                  <div className="text-left">
                    <span className="block text-[10px] uppercase tracking-wider text-slate-500">
                      Current Plan
                    </span>
                    <span className="text-xs font-bold text-white">
                      {student?.enrolledCourse || "No Courses Assigned"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Lock Alert for Free Members */}
              {!hasAccess && (
                <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <AlertCircle size={20} className="shrink-0 text-amber-400 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-amber-300">Free Registration Account (Locked)</h4>
                      <p className="text-xs text-slate-300">
                        You can explore platform features and browse course curriculums, but course lessons and videos are strictly reserved for enrolled students.
                      </p>
                    </div>
                  </div>
                  <a
                    href="https://wa.me/919177187024?text=Hello%20Admin,%20I%20would%20like%20to%20purchase%20access%20to%20NMAI%20courses."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-500 px-4 py-2 text-xs font-semibold text-white shadow-md hover:brightness-110"
                  >
                    <MessageCircle size={14} />
                    Contact Admin to Unlock
                  </a>
                </div>
              )}
            </div>

            {/* Individual Courses Grid */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {PLATFORM_COURSES.map((course) => {
                const isUnlocked = currentUserEmail
                  ? hasCourseAccess(currentUserEmail, course.id, course.title)
                  : false;

                return (
                  <div
                    key={course.id}
                    className={`relative flex flex-col justify-between overflow-hidden rounded-2xl border p-5 transition ${
                      isUnlocked
                        ? "border-white/10 bg-[#070B14] hover:border-cyan-500/30"
                        : "border-white/[0.06] bg-white/[0.01]"
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <span className="rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                          {course.category}
                        </span>

                        {isUnlocked ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400">
                            <Unlock size={11} /> Unlocked
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-bold text-amber-400">
                            <Lock size={11} /> Locked (Paid)
                          </span>
                        )}
                      </div>

                      <h3 className="mt-3 text-base font-bold text-white">{course.title}</h3>
                      <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                        {course.description}
                      </p>
                    </div>

                    <div className="mt-5 border-t border-white/[0.06] pt-4">
                      {isUnlocked ? (
                        <Link
                          href={course.href}
                          className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-blue-600/20 border border-blue-500/30 text-xs font-semibold text-cyan-300 hover:bg-blue-600/30 transition"
                        >
                          <BookOpen size={14} />
                          <span>Open Course Lessons</span>
                          <ArrowRight size={13} />
                        </Link>
                      ) : (
                        <a
                          href={`https://wa.me/919177187024?text=Hello%20Admin,%20I%20would%20like%20to%20purchase%20access%20to%20${encodeURIComponent(
                            course.title
                          )}.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] text-xs font-semibold text-amber-300 hover:bg-amber-500/10 hover:border-amber-500/30 transition"
                        >
                          <Lock size={13} />
                          <span>Unlock via WhatsApp Support</span>
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ================= TAB 3: WHATSAPP COMMUNITY ================= */}
        {activeTab === "community" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="rounded-3xl border border-white/[0.08] bg-[#070B14] p-6 shadow-xl sm:p-8"
          >
            <div className="max-w-2xl">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/20">
                  <MessageCircle size={26} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">NMAI Student WhatsApp Community</h2>
                  <p className="text-xs text-slate-400">
                    Network with 5,000+ direct sellers and get direct updates from platform mentors.
                  </p>
                </div>
              </div>

              <div className="mt-7 space-y-4">
                {hasAccess ? (
                  <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-left">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <ShieldCheck size={18} />
                      <span className="text-xs font-bold uppercase tracking-wider">
                        Active Enrolled Student Membership
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                      You are an enrolled student with access to our official private WhatsApp group. Join the group below to receive live Q&A session links, daily AI prompts, and network marketing case studies.
                    </p>

                    <div className="mt-5 flex flex-wrap gap-3">
                      <a
                        href="https://chat.whatsapp.com/CjZKNudezQp46MRqsUOTBR"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:brightness-110"
                      >
                        <MessageCircle size={16} />
                        <span>Join Official WhatsApp Group</span>
                        <ExternalLink size={13} />
                      </a>

                      <a
                        href="https://wa.me/919177187024?text=Hello%20Admin,%20I%20am%20enrolled%20student%20inquiring%20about%20community%20updates."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-white/[0.08] transition"
                      >
                        <span>Direct WhatsApp Support</span>
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 text-left">
                    <div className="flex items-center gap-2 text-amber-400">
                      <ShieldAlert size={18} />
                      <span className="text-xs font-bold uppercase tracking-wider">
                        Community Access Restricted to Enrolled Students
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                      Free registered accounts do not have access to the private WhatsApp community. To prevent spam and maintain high value discussions, community admission is reserved exclusively for enrolled students.
                    </p>

                    <div className="mt-5">
                      <a
                        href="https://wa.me/919177187024?text=Hello%20Admin,%20I%20would%20like%20to%20enroll%20in%20courses%20and%20join%20the%20WhatsApp%20community."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-500 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-amber-500/25 transition hover:brightness-110"
                      >
                        <MessageCircle size={16} />
                        <span>Contact Admin on WhatsApp to Enroll</span>
                        <ArrowRight size={13} />
                      </a>
                    </div>
                  </div>
                )}

                {/* Community Guidelines */}
                <div className="mt-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Community Values & Guidelines
                  </h4>
                  <ul className="mt-3 space-y-2 text-xs text-slate-400">
                    <li className="flex items-start gap-2">
                      <Check size={14} className="shrink-0 text-cyan-400 mt-0.5" />
                      <span>Respect all members and engage in collaborative learning discussions.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check size={14} className="shrink-0 text-cyan-400 mt-0.5" />
                      <span>No unsolicited cross-pitching or direct unsolicited DM spam.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check size={14} className="shrink-0 text-cyan-400 mt-0.5" />
                      <span>Share your real AI prospecting wins, prompts, and insights freely.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ================= TAB 4: PREFERENCES & SECURITY ================= */}
        {activeTab === "security" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Notification Preferences */}
            <div className="rounded-3xl border border-white/[0.08] bg-[#070B14] p-6 shadow-xl sm:p-8">
              <h2 className="text-lg font-bold text-white">Notification & Alert Preferences</h2>
              <p className="mt-1 text-xs text-slate-400">
                Choose how you receive course announcements and platform alerts.
              </p>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-cyan-300">
                      <Bell size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Course Lesson & AI Tool Releases</h4>
                      <p className="text-xs text-slate-400">
                        Get notified when new video lessons, prompt templates, or AI tools are published.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const next = !notifyCourseUpdates;
                      setNotifyCourseUpdates(next);
                      localStorage.setItem(
                        "nmai-student-pref",
                        JSON.stringify({ notifyAnnouncements, notifyCourseUpdates: next })
                      );
                    }}
                    className={`relative h-6 w-11 rounded-full transition-colors ${
                      notifyCourseUpdates ? "bg-cyan-500" : "bg-slate-700"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notifyCourseUpdates ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-300">
                      <Sparkles size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Community & Live Q&A Broadcasts</h4>
                      <p className="text-xs text-slate-400">
                        Receive platform notifications for upcoming live webinars and mentor sessions.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const next = !notifyAnnouncements;
                      setNotifyAnnouncements(next);
                      localStorage.setItem(
                        "nmai-student-pref",
                        JSON.stringify({ notifyAnnouncements: next, notifyCourseUpdates })
                      );
                    }}
                    className={`relative h-6 w-11 rounded-full transition-colors ${
                      notifyAnnouncements ? "bg-cyan-500" : "bg-slate-700"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notifyAnnouncements ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Session & Security */}
            <div className="rounded-3xl border border-white/[0.08] bg-[#070B14] p-6 shadow-xl sm:p-8">
              <h2 className="text-lg font-bold text-white">Active Session & Security</h2>
              <p className="mt-1 text-xs text-slate-400">
                Manage your authenticated device session.
              </p>

              <div className="mt-6 space-y-4">
                <div className="flex flex-col gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                      <ShieldCheck size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-white">Current Browser Session</h4>
                        <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                          Active
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Authenticated as <span className="font-mono text-cyan-300">{currentUserEmail}</span>
                      </p>
                    </div>
                  </div>

                  <SignOutButton className="py-2 text-xs" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* ================= PROFILE PICTURE MODAL (LOCAL FILE / LIVE CAMERA) ================= */}
      <AnimatePresence>
        {showPhotoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#0B1220] p-6 shadow-2xl"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-cyan-300">
                    <Camera size={18} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Update Profile Picture</h3>
                    <p className="text-xs text-slate-400">Add a photo from your computer or camera</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closePhotoModal}
                  className="rounded-xl p-1.5 text-slate-400 hover:bg-white/[0.06] hover:text-white transition"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Tab Selector: Upload vs Camera */}
              <div className="mt-5 grid grid-cols-2 gap-2 rounded-xl bg-white/[0.03] p-1 border border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => {
                    stopCamera();
                    setCapturedPhoto(null);
                    setPhotoModalTab("upload");
                  }}
                  className={`flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold transition ${
                    photoModalTab === "upload"
                      ? "bg-blue-600 text-white shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Upload size={14} />
                  <span>Upload from Device</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPhotoModalTab("camera");
                    startCamera();
                  }}
                  className={`flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold transition ${
                    photoModalTab === "camera"
                      ? "bg-blue-600 text-white shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Video size={14} />
                  <span>Live Camera</span>
                </button>
              </div>

              {/* MODAL TAB 1: UPLOAD FROM DEVICE */}
              {photoModalTab === "upload" && (
                <div className="mt-5 space-y-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/15 bg-white/[0.02] p-8 text-center transition cursor-pointer hover:border-cyan-400/50 hover:bg-cyan-500/[0.03]"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-cyan-400 group-hover:scale-105 transition">
                      <Upload size={24} />
                    </div>
                    <p className="mt-3 text-sm font-semibold text-white">Click to browse your computer or phone</p>
                    <p className="mt-1 text-xs text-slate-400">Supports JPG, PNG, GIF, or WebP</p>
                    <p className="mt-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] text-slate-500">
                      Automatically square-cropped & optimized
                    </p>
                  </div>

                  {avatarImage && (
                    <div className="flex items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={avatarImage}
                          alt="Current profile"
                          className="h-10 w-10 rounded-xl object-cover ring-1 ring-white/10"
                        />
                        <div>
                          <p className="text-xs font-medium text-white">Current photo active</p>
                          <p className="text-[11px] text-slate-500">Visible on portal and account</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 transition"
                      >
                        <Trash2 size={13} />
                        <span>Remove</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* MODAL TAB 2: LIVE CAMERA */}
              {photoModalTab === "camera" && (
                <div className="mt-5 space-y-4">
                  {cameraError ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6 text-center">
                      <AlertCircle size={28} className="text-amber-400 mb-2" />
                      <h4 className="text-sm font-bold text-amber-300">Camera Access Error</h4>
                      <p className="mt-1 text-xs text-slate-300 max-w-xs">{cameraError}</p>
                      <div className="mt-4 flex flex-wrap justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => startCamera()}
                          className="flex items-center gap-1.5 rounded-xl bg-amber-500/20 px-3 py-1.5 text-xs font-semibold text-amber-200 hover:bg-amber-500/30 transition"
                        >
                          <RefreshCw size={13} />
                          <span>Retry Camera</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPhotoModalTab("upload")}
                          className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white transition"
                        >
                          Upload File Instead
                        </button>
                      </div>
                    </div>
                  ) : capturedPhoto ? (
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="relative h-60 w-60 overflow-hidden rounded-2xl border-2 border-cyan-400 shadow-2xl">
                        <img
                          src={capturedPhoto}
                          alt="Captured snapshot"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex items-center gap-3 w-full">
                        <button
                          type="button"
                          onClick={() => {
                            setCapturedPhoto(null);
                            startCamera();
                          }}
                          className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] py-2.5 text-xs font-semibold text-slate-300 hover:bg-white/[0.08] transition"
                        >
                          <RefreshCw size={14} />
                          <span>Retake Photo</span>
                        </button>
                        <button
                          type="button"
                          onClick={applyCapturedPhoto}
                          className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-2.5 text-xs font-semibold text-white shadow-lg shadow-blue-500/20 hover:brightness-110 transition"
                        >
                          <Check size={15} />
                          <span>Save & Apply</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="relative h-60 w-60 overflow-hidden rounded-2xl border-2 border-cyan-400/40 bg-black/50 shadow-2xl">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className="h-full w-full object-cover -scale-x-100"
                        />
                        {/* Viewfinder circle guide overlay */}
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                          <div className="h-44 w-44 rounded-full border border-cyan-400/40 border-dashed" />
                        </div>
                        {isCameraStarting && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-xs text-slate-300">
                            Starting camera...
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-3 w-full">
                        <button
                          type="button"
                          onClick={toggleCameraFacing}
                          title="Flip Camera (Front/Back)"
                          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 hover:text-white transition"
                        >
                          <RefreshCw size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={captureFromCamera}
                          className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-2.5 text-xs font-semibold text-white shadow-lg shadow-blue-500/25 hover:brightness-110 transition"
                        >
                          <Camera size={16} />
                          <span>Snap Photo</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
