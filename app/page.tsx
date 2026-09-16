"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ThemeToggle from "./components/ThemeToggle";
import SignOutButton from "./components/SignOutButton";
import { getCourses } from "./data/coursesData";
import { getWebsiteConfig } from "./data/websiteConfig";
import { hasCourseAccess, hasAnyCourseAccess } from "./data/enrolledStudents";
import { playClickSound, preloadClickSound } from "./utils/sound";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Bell,
  Bookmark,
  Bot,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Code2,
  Compass,
  Crown,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Lock,
  Menu,
  MessageCircle,
  Play,
  Search,
  Settings,
  ShieldAlert,
  Sparkles,
  Target,
  Users,
  Video,
  X,
  Zap,
} from "lucide-react";

type Course = {
  id: string;
  title: string;
  category: string;
  description: string;
  lessons: number;
  duration: string;
  progress: number;
  available: boolean;
  href: string;
  icon: React.ReactNode;
  visual: string;
};

const courses: Course[] = [
  {
    id: "course-nm",
    title: "Network Marketing Success",
    category: "Network Marketing",
    description:
      "Learn practical product retailing, customer conversations, follow-ups, content and modern network marketing systems.",
    lessons: 5,
    duration: "3h 20m",
    progress: 0,
    available: true,
    href: "/courses/network-marketing",
    icon: <Users size={24} />,
    visual: "network",
  },
  {
    id: "course-ai",
    title: "AI & Automation",
    category: "AI & Automation",
    description:
      "Learn how AI and automation can transform the way you work, create and build digital systems.",
    lessons: 8,
    duration: "5h 10m",
    progress: 0,
    available: false,
    href: "#",
    icon: <Bot size={24} />,
    visual: "ai",
  },
  {
    id: "course-design",
    title: "Content & Design",
    category: "Content & Design",
    description:
      "Create better content, graphics and digital experiences using modern creative tools.",
    lessons: 7,
    duration: "4h 30m",
    progress: 0,
    available: false,
    href: "#",
    icon: <Sparkles size={24} />,
    visual: "design",
  },
  {
    id: "course-video",
    title: "Video Editing",
    category: "Video Editing",
    description:
      "Learn short-form video editing, storytelling, effects and content production.",
    lessons: 9,
    duration: "6h 15m",
    progress: 0,
    available: false,
    href: "#",
    icon: <Video size={24} />,
    visual: "video",
  },
  {
    id: "course-social",
    title: "Social Media Growth",
    category: "Social Media",
    description:
      "Build your personal brand, create consistent content and grow your social media presence.",
    lessons: 8,
    duration: "5h 40m",
    progress: 0,
    available: false,
    href: "#",
    icon: <BarChart3 size={24} />,
    visual: "social",
  },
  {
    id: "course-business",
    title: "Digital Business",
    category: "Digital Business",
    description:
      "Understand digital business models, funnels, systems and online opportunities.",
    lessons: 10,
    duration: "7h 20m",
    progress: 0,
    available: false,
    href: "#",
    icon: <BriefcaseBusiness size={24} />,
    visual: "business",
  },
];

const categories = [
  "All Courses",
  "Network Marketing",
  "AI & Automation",
  "Content & Design",
  "Video Editing",
  "Social Media",
  "Digital Business",
];

/* =========================================================
   ANIMATED COURSE VISUAL
========================================================= */

function CourseVisual({ type }: { type: string }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, {
    stiffness: 120,
    damping: 20,
  });

  const smoothY = useSpring(mouseY, {
    stiffness: 120,
    damping: 20,
  });

  const rotateX = useTransform(smoothY, [-100, 100], [8, -8]);
  const rotateY = useTransform(smoothX, [-100, 100], [-8, 8]);

  const glowX = useTransform(smoothX, [-200, 200], [-30, 30]);
  const glowY = useTransform(smoothY, [-150, 150], [-20, 20]);

  const handleMouseMove = (
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const x =
      e.clientX - rect.left - rect.width / 2;

    const y =
      e.clientY - rect.top - rect.height / 2;

    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative h-48 overflow-hidden bg-gradient-to-br from-[#0D1830] via-[#08101F] to-[#07101A]"
    >
      {/* Ambient Glow */}

      <motion.div
        style={{
          x: glowX,
          y: glowY,
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-3xl"
      />

      {/* ================= AI ================= */}

      {type === "ai" && (
        <motion.div
          style={{
            rotateX,
            rotateY,
          }}
          className="absolute inset-0"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/30"
          />

          <motion.div
            animate={{ rotate: -360 }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-400/30 border-dashed"
          />

          <motion.div
            animate={{
              scale: [1, 1.08, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
            }}
            className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/10 shadow-[0_0_50px_rgba(0,229,255,0.2)]"
          />

          <motion.div
            animate={{
              y: [-3, 3, -3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
            className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl border border-cyan-400/20 bg-[#06202A]/90 text-cyan-300 shadow-[0_0_40px_rgba(0,229,255,0.15)]"
          >
            <Bot size={38} />
          </motion.div>

          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2"
          >
            <span className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 rounded-full bg-cyan-300 shadow-[0_0_15px_rgba(0,229,255,0.8)]" />
          </motion.div>

          <motion.div
            animate={{ rotate: -360 }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2"
          >
            <span className="absolute right-0 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-blue-400 shadow-[0_0_15px_rgba(0,102,255,0.8)]" />
          </motion.div>

          <motion.span
            animate={{
              y: [0, -12, 0],
              x: [0, 5, 0],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
            className="absolute left-[24%] top-[25%] h-2.5 w-2.5 rounded-full bg-cyan-300"
          />

          <motion.span
            animate={{
              y: [0, 10, 0],
              opacity: [0.3, 0.9, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
            }}
            className="absolute right-[25%] top-[32%] h-2 w-2 rounded-full bg-blue-400"
          />

          <motion.span
            animate={{
              y: [0, -8, 0],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
            }}
            className="absolute bottom-[25%] left-[30%] h-2 w-2 rounded-full bg-cyan-400"
          />

          <motion.span
            animate={{
              y: [0, 9, 0],
              opacity: [0.3, 0.9, 0.3],
            }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
            }}
            className="absolute bottom-[30%] right-[30%] h-2.5 w-2.5 rounded-full bg-blue-300"
          />
        </motion.div>
      )}

      {/* ================= NETWORK ================= */}

      {type === "network" && (
        <motion.div
          style={{
            rotateX,
            rotateY,
          }}
          className="absolute inset-0"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/25"
          />

          <motion.div
            animate={{ rotate: -360 }}
            transition={{
              duration: 14,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-400/25 border-dashed"
          />

          <motion.div
            animate={{
              scale: [1, 1.08, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
            className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300"
          >
            <Users size={32} />
          </motion.div>

          {[
            ["left-[18%]", "top-[25%]"],
            ["right-[18%]", "top-[30%]"],
            ["left-[25%]", "bottom-[22%]"],
            ["right-[27%]", "bottom-[18%]"],
          ].map(([x, y], index) => (
            <motion.span
              key={index}
              animate={{
                y: [0, -8, 0],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 2.5 + index * 0.4,
                repeat: Infinity,
              }}
              className={`absolute ${x} ${y} h-3 w-3 rounded-full bg-cyan-300 shadow-[0_0_15px_rgba(0,229,255,0.7)]`}
            />
          ))}
        </motion.div>
      )}

      {/* ================= DESIGN ================= */}

      {type === "design" && (
        <motion.div
          style={{
            rotateX,
            rotateY,
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute h-36 w-36 rounded-3xl border border-cyan-400/20"
          />

          <motion.div
            animate={{ rotate: -360 }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute h-28 w-28 rounded-3xl border border-blue-400/30 border-dashed"
          />

          <motion.div
            animate={{
              scale: [1, 1.12, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
            className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300"
          >
            <Sparkles size={35} />
          </motion.div>
        </motion.div>
      )}

      {/* ================= VIDEO ================= */}

      {type === "video" && (
        <motion.div
          style={{
            rotateX,
            rotateY,
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
            }}
            className="flex h-24 w-32 items-center justify-center rounded-2xl border border-blue-400/30 bg-blue-400/10 text-blue-300 shadow-[0_0_60px_rgba(0,102,255,0.15)]"
          >
            <Play size={34} fill="currentColor" />
          </motion.div>

          <motion.div
            animate={{
              width: ["30%", "70%", "30%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
            className="absolute bottom-7 h-1 rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(0,229,255,0.6)]"
          />
        </motion.div>
      )}

      {/* ================= SOCIAL ================= */}

      {type === "social" && (
        <motion.div
          style={{
            rotateX,
            rotateY,
          }}
          className="absolute inset-0 flex items-end justify-center gap-3 pb-10"
        >
          {[45, 65, 85].map((height, index) => (
            <motion.div
              key={index}
              animate={{
                height: [
                  `${height}%`,
                  `${height + 12}%`,
                  `${height}%`,
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.2,
              }}
              className="w-8 rounded-t-lg bg-blue-400/25"
            />
          ))}

          <BarChart3
            className="absolute top-8 text-cyan-300"
            size={36}
          />
        </motion.div>
      )}

      {/* ================= BUSINESS ================= */}

      {type === "business" && (
        <motion.div
          style={{
            rotateX,
            rotateY,
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute h-36 w-36 rounded-full border border-blue-400/20"
          />

          <motion.div
            animate={{ rotate: -360 }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute h-28 w-28 rounded-full border border-cyan-400/20 border-dashed"
          />

          <motion.div
            animate={{
              y: [-4, 4, -4],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
            className="relative rounded-2xl border border-white/10 bg-white/5 p-5 text-cyan-300"
          >
            <BriefcaseBusiness size={34} />
          </motion.div>
        </motion.div>
      )}

      {/* Cursor Light */}

      <motion.div
        style={{
          x: glowX,
          y: glowY,
        }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-3xl"
      />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#080D17] to-transparent" />
    </motion.div>
  );
}

/* =========================================================
   SIDEBAR
========================================================= */

function SidebarItem({
  icon,
  label,
  active = false,
  href = "#",
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  href?: string;
}) {
  return (
    <Link
      href={href}
      className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
        active
          ? "bg-blue-500/10 text-white"
          : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
      }`}
    >
      <span
        className={
          active
            ? "text-cyan-300"
            : "text-slate-500 group-hover:text-slate-300"
        }
      >
        {icon}
      </span>

      <span>{label}</span>
    </Link>
  );
}

/* =========================================================
   MAIN DASHBOARD
========================================================= */

export default function Home() {
  const [selectedCategory, setSelectedCategory] =
    useState("All Courses");

  const [searchQuery, setSearchQuery] = useState("");

  const [mobileMenu, setMobileMenu] =
    useState(false);

  const [coursesList, setCoursesList] = useState<Course[]>(courses);
  const [siteConfig, setSiteConfig] = useState(getWebsiteConfig());
  const [currentUserEmail, setCurrentUserEmail] = useState<string>("");
  const [currentStudentName, setCurrentStudentName] = useState<string>("");
  const [currentStudentAvatar, setCurrentStudentAvatar] = useState<string>("from-blue-500 to-cyan-400");
  const [currentStudentImage, setCurrentStudentImage] = useState<string>("");
  const [communityLockedModalOpen, setCommunityLockedModalOpen] = useState<boolean>(false);

  useEffect(() => {
    preloadClickSound();
    const dynamicCourses = getCourses();
    if (dynamicCourses && dynamicCourses.length > 0) {
      setCoursesList(dynamicCourses.map((c) => ({
        ...c,
        icon: courses.find((orig) => orig.category === c.category)?.icon || <Users size={24} />
      })));
    }
    setSiteConfig(getWebsiteConfig());

    const updateSessionAndCourses = () => {
      try {
        const sessionRaw = localStorage.getItem("nmai-student-session");
        if (sessionRaw) {
          const session = JSON.parse(sessionRaw);
          if (session && session.email) {
            setCurrentUserEmail(session.email);
            setCurrentStudentName(session.name || session.email.split("@")[0]);
            if (session.avatarColor) setCurrentStudentAvatar(session.avatarColor);
            if (session.avatarImage) {
              setCurrentStudentImage(session.avatarImage);
            } else {
              setCurrentStudentImage("");
            }
            return;
          }
        }
        setCurrentUserEmail("");
        setCurrentStudentName("");
        setCurrentStudentImage("");
      } catch {}
    };

    updateSessionAndCourses();
    window.addEventListener("storage", updateSessionAndCourses);
    window.addEventListener("nmai-student-updated", updateSessionAndCourses);
    return () => {
      window.removeEventListener("storage", updateSessionAndCourses);
      window.removeEventListener("nmai-student-updated", updateSessionAndCourses);
    };
  }, []);

  const filteredCourses = useMemo(() => {
    return coursesList.filter((course) => {
      const categoryMatch =
        selectedCategory === "All Courses" ||
        course.category === selectedCategory;

      const searchMatch =
        course.title
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        course.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        course.category
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      return categoryMatch && searchMatch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div
      onClickCapture={(e) => {
        const target = (e.target as HTMLElement).closest(
          "button, a, input[type='button'], input[type='submit'], [role='button'], [role='tab'], summary"
        );
        if (target) playClickSound();
      }}
      className="min-h-screen bg-[#05070D] text-white"
    >

      {/* Mobile Overlay */}

      {mobileMenu && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenu(false)}
        />
      )}

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[250px] flex-col border-r border-white/[0.07] bg-[#070B14] px-4 py-5 transition-transform duration-300 lg:translate-x-0 ${
          mobileMenu
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-2">
          <Link href="/" className="flex items-center">
            <img
              src="/nmai-logo.png"
              alt="NMAI"
              className="h-11 w-auto object-contain"
            />
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle className="lg:hidden" />
            <button
              onClick={() => setMobileMenu(false)}
              className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white lg:hidden"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="mt-8">
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600">
            Learn
          </p>

          <div className="space-y-1">
            <SidebarItem
              icon={<LayoutDashboard size={18} />}
              label="Dashboard"
              active
              href="/"
            />

            <SidebarItem
              icon={<Compass size={18} />}
              label="Learning Paths"
              href="/learning-paths"
            />

            <SidebarItem
              icon={<GraduationCap size={18} />}
              label="My Courses"
              href="/"
            />

            <SidebarItem
              icon={<Bookmark size={18} />}
              label="Bookmarks"
              href="/bookmarks"
            />
          </div>
        </div>

        <div className="mt-7">
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600">
            Community
          </p>

          <div className="space-y-1">

            {hasAnyCourseAccess(currentUserEmail) ? (
              <a
                href={siteConfig.community.whatsappUrl || "https://chat.whatsapp.com/CjZKNudezQp46MRqsUOTBR"}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 transition hover:bg-white/[0.04] hover:text-white"
              >
                <MessageCircle
                  size={18}
                  className="text-slate-500 group-hover:text-cyan-300"
                />
                Community
              </a>
            ) : (
              <button
                onClick={() => setCommunityLockedModalOpen(true)}
                className="group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm text-slate-500 transition hover:bg-white/[0.04] hover:text-slate-400"
              >
                <div className="flex items-center gap-3">
                  <MessageCircle size={18} className="text-slate-600 group-hover:text-slate-500" />
                  <span>Community</span>
                </div>
                <span className="flex items-center gap-1 rounded bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-bold text-amber-400 border border-amber-500/20">
                  <Lock size={9} />
                  Locked
                </span>
              </button>
            )}

            <SidebarItem
              icon={<Bot size={18} />}
              label="AI Tools"
              href="/ai-tools"
            />

          </div>
        </div>

        <div className="mt-7">
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600">
            Account
          </p>

          <div className="space-y-1">

            <SidebarItem
              icon={<BarChart3 size={18} />}
              label="My Progress"
              href="/progress"
            />

            <SidebarItem
              icon={<Settings size={18} />}
              label="Settings"
              href="/settings"
            />

          </div>
        </div>

        <div className="mt-auto">

          <div className="overflow-hidden rounded-2xl border border-blue-400/10 bg-gradient-to-br from-blue-500/10 to-cyan-400/5 p-4">

            <div className="flex items-center gap-2">

              <div className="rounded-lg bg-blue-500/10 p-2 text-cyan-300">
                <Crown size={17} />
              </div>

              <span className="text-sm font-semibold text-white">
                NMAI Pro
              </span>

            </div>

            <p className="mt-3 text-xs leading-5 text-slate-400">
              Unlock premium learning experiences, resources and future
              courses.
            </p>

            <Link
              href="/pro"
              className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-500"
            >
              Explore Pro
              <ArrowRight size={14} />
            </Link>

          </div>

          <Link
            href="/settings"
            title="View Student Profile & Settings"
            className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-4 group transition"
          >
            <div className="flex items-center gap-3">
              <div className={`relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br ${currentStudentAvatar} text-sm font-bold text-white shadow-sm ring-1 ring-white/10`}>
                {currentStudentImage ? (
                  <img src={currentStudentImage} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  (currentStudentName || currentUserEmail || "S").slice(0, 1).toUpperCase()
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white group-hover:text-cyan-300 transition">
                  {currentStudentName || "Student Account"}
                </p>
                <p className="text-xs text-slate-500">
                  Profile & Settings
                </p>
              </div>
            </div>
            <ArrowRight size={14} className="text-slate-600 transition group-hover:translate-x-1 group-hover:text-cyan-300" />
          </Link>

          <SignOutButton className="mt-3 w-full justify-center py-2 text-xs" />

        </div>
      </aside>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="lg:pl-[250px]">

        {/* TOPBAR */}

        <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#05070D]/90 backdrop-blur-xl">

          <div className="flex h-[72px] items-center gap-4 px-4 md:px-7">

            <button
              onClick={() => setMobileMenu(true)}
              className="rounded-xl border border-white/10 p-2 text-slate-300 hover:bg-white/5 lg:hidden"
            >
              <Menu size={21} />
            </button>

            <div className="relative max-w-xl flex-1">

              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <input
                type="text"
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(e.target.value)
                }
                placeholder="Search courses, skills, topics..."
                className="h-11 w-full rounded-xl border border-white/[0.07] bg-white/[0.03] pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500/40"
              />

            </div>

            <ThemeToggle />

            <button className="relative rounded-xl border border-white/[0.07] bg-white/[0.03] p-2.5 text-slate-400 hover:text-white">

              <Bell size={19} />

              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-cyan-400" />

            </button>

            <Link
              href="/settings"
              title="Student Profile & Settings"
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-cyan-400/30 hover:text-white"
            >
              <div className={`relative flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br ${currentStudentAvatar} text-xs font-bold text-white shadow-sm ring-1 ring-white/10`}>
                {currentStudentImage ? (
                  <img src={currentStudentImage} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  (currentStudentName || currentUserEmail || "S").slice(0, 1).toUpperCase()
                )}
              </div>
              <span className="hidden sm:inline">{currentStudentName || "Profile & Settings"}</span>
            </Link>

            <SignOutButton />

          </div>

        </header>

        <div className="mx-auto max-w-[1450px] px-4 py-7 md:px-7">

          {/* FREE MEMBER LOCKED BANNER */}
          {currentUserEmail && !hasAnyCourseAccess(currentUserEmail) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-7 flex flex-col gap-3 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent p-5 sm:flex-row sm:items-center sm:justify-between shadow-lg shadow-amber-500/5"
            >
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/15 text-amber-400">
                  <Lock size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                      Free Member Account • Course Access Locked
                    </span>
                    <span className="rounded-full border border-amber-500/30 bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold text-amber-200">
                      0 Courses Enrolled
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                    You can browse the course catalog, but proprietary video lessons and training materials are strictly paid. Free access is not available.
                  </p>
                </div>
              </div>
              <a
                href="https://wa.me/919177187024?text=Hello%20Admin,%20I%20would%20like%20to%20purchase%20course%20access%20on%20NMAI."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-emerald-500/20 hover:brightness-110 transition"
              >
                <MessageCircle size={15} />
                Contact Admin to Purchase Access
              </a>
            </motion.div>
          )}

          {/* LAUNCH NOTICE */}

          {siteConfig.announcement.enabled && (
            <motion.div
              initial={{
                opacity: 0,
                y: -10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.5,
              }}
              className="mb-7 flex flex-col gap-3 rounded-2xl border border-cyan-400/10 bg-gradient-to-r from-blue-500/[0.08] to-cyan-400/[0.04] px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
            >

              <div className="flex items-start gap-3">

                <div className="mt-0.5 rounded-lg bg-cyan-400/10 p-2 text-cyan-300">
                  <Zap size={17} />
                </div>

                <div>

                  <p className="text-sm font-semibold text-white">
                    {siteConfig.announcement.badgeText || "NMAI is launching step by step."}
                  </p>

                  <p className="mt-0.5 text-xs text-slate-400">
                    {siteConfig.announcement.text || "Network Marketing Success is currently available. More learning experiences are coming soon."}
                  </p>

                </div>

              </div>

              <Link
                href="/courses/network-marketing"
                className="flex shrink-0 items-center gap-2 text-sm font-semibold text-cyan-300 transition hover:text-cyan-200"
              >
                Start Available Course
                <ArrowRight size={16} />
              </Link>

            </motion.div>
          )}

          {/* HERO */}

          <section className="grid gap-6 xl:grid-cols-[1fr_330px]">

            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.6,
              }}
              className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-[#080D17] p-7 md:p-9"
            >

              <div className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />

              <div className="relative max-w-3xl">

                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/10 bg-cyan-400/[0.05] px-3 py-1.5 text-xs font-medium text-cyan-300">
                  <Sparkles size={13} />
                  NMAI Learning Platform
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
                  Learn Skills.
                  <br />
                  <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                    Build Your Future.
                  </span>
                </h1>

                <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-400 md:text-base">
                  Practical learning for the AI-powered world.
                  Learn, implement and build with courses designed
                  around real-world digital skills.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">

                  <Link
                    href="/courses/network-marketing"
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500"
                  >
                    Start Learning
                    <ArrowRight size={17} />
                  </Link>

                  <Link
                    href="/learning-paths"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-slate-200 hover:bg-white/[0.06]"
                  >
                    Find Your Learning Path
                    <Compass size={17} />
                  </Link>

                </div>

              </div>

            </motion.div>

            {/* DAILY GOAL */}

            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.6,
                delay: 0.15,
              }}
              className="rounded-3xl border border-white/[0.07] bg-[#080D17] p-6"
            >

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm font-semibold text-white">
                    Daily Goal
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Keep your learning streak alive.
                  </p>
                </div>

                <div className="rounded-xl bg-blue-500/10 p-2.5 text-blue-300">
                  <Target size={19} />
                </div>

              </div>

              <div className="mt-8 flex items-end justify-between">

                <div>
                  <span className="text-4xl font-bold text-white">
                    0
                  </span>

                  <span className="ml-1 text-sm text-slate-500">
                    / 30 min
                  </span>
                </div>

                <span className="text-xs font-medium text-cyan-300">
                  Start today
                </span>

              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                <div className="h-full w-0 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />
              </div>

              <div className="mt-5 flex items-center gap-2 text-xs text-slate-500">
                <Clock3 size={14} />
                30 minutes of focused learning
              </div>

            </motion.div>

          </section>

          {/* COURSES */}

          <section className="mt-10">

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-400">
                Learning Library
              </p>

              <h2 className="mt-2 text-2xl font-bold text-white md:text-3xl">
                Explore Courses
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Start with what is available today. More courses are on
                the way.
              </p>
            </div>

            {/* FILTERS */}

            <div className="mt-6 flex gap-2 overflow-x-auto pb-2">

              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() =>
                    setSelectedCategory(category)
                  }
                  className={`whitespace-nowrap rounded-xl border px-4 py-2.5 text-xs font-medium transition ${
                    selectedCategory === category
                      ? "border-blue-500/30 bg-blue-500/10 text-blue-300"
                      : "border-white/[0.07] bg-white/[0.02] text-slate-500 hover:bg-white/[0.05]"
                  }`}
                >
                  {category}
                </button>
              ))}

            </div>

            {/* COURSE GRID */}

            <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">

              {filteredCourses.map(
                (course, index) => (
                  <motion.div
                    key={course.title}
                    initial={{
                      opacity: 0,
                      y: 35,
                      scale: 0.97,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                    }}
                    transition={{
                      duration: 0.55,
                      delay: index * 0.09,
                      ease: "easeOut",
                    }}
                    whileHover={{
                      y: -8,
                      scale: 1.015,
                    }}
                    className={`group overflow-hidden rounded-2xl border border-white/[0.07] bg-[#080D17] ${
                      course.available
                        ? "hover:border-blue-400/20 hover:shadow-2xl hover:shadow-blue-500/10"
                        : "opacity-80"
                    }`}
                  >

                    <div className="relative">

                      <CourseVisual
                        type={course.visual}
                      />

                      {!course.available && (
                        <div className="absolute inset-0 flex items-center justify-center bg-[#05070D]/40">
                          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-[#070B14]/90 px-4 py-2 text-xs font-semibold text-slate-300 backdrop-blur">
                            <Lock size={14} />
                            COMING SOON
                          </div>
                        </div>
                      )}

                      {course.available && (
                        <div
                          className={`absolute left-4 top-4 rounded-full border px-3 py-1.5 text-[10px] font-bold tracking-wider backdrop-blur ${
                            hasCourseAccess(currentUserEmail, course.id, course.title)
                              ? "border-emerald-400/30 bg-emerald-950/80 text-emerald-300"
                              : "border-amber-400/30 bg-amber-950/80 text-amber-300"
                          }`}
                        >
                          {hasCourseAccess(currentUserEmail, course.id, course.title)
                            ? "ENROLLED"
                            : "LOCKED • PAID ONLY"}
                        </div>
                      )}

                    </div>

                    <div className="p-5">

                      <div className="flex items-start justify-between gap-3">

                        <div>

                          <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-400">
                            {course.category}
                          </p>

                          <h3 className="mt-2 text-lg font-semibold text-white">
                            {course.title}
                          </h3>

                        </div>

                        <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-2.5 text-slate-400">
                          {course.icon}
                        </div>

                      </div>

                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">
                        {course.description}
                      </p>

                      <div className="mt-5 flex items-center gap-4 text-xs text-slate-500">

                        <span className="flex items-center gap-1.5">
                          <FileText size={14} />
                          {course.lessons} lessons
                        </span>

                        <span className="flex items-center gap-1.5">
                          <Clock3 size={14} />
                          {course.duration}
                        </span>

                      </div>

                      {course.available ? (
                        hasCourseAccess(currentUserEmail, course.id, course.title) ? (
                          <Link
                            href={course.href}
                            className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
                          >
                            Start Course
                            <ArrowRight size={16} />
                          </Link>
                        ) : (
                          <Link
                            href={course.href}
                            className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm font-semibold text-amber-300 transition hover:bg-amber-500/20"
                          >
                            <Lock size={15} />
                            Locked • Request Access
                          </Link>
                        )
                      ) : (
                        <div className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-sm font-medium text-slate-600">
                          <Lock size={15} />
                          Coming Soon
                        </div>
                      )}

                    </div>

                  </motion.div>
                )
              )}

            </div>

          </section>

          {/* =====================================================
              LEARNING PATHS
          ===================================================== */}

          <section className="mt-12">

            <div className="flex items-end justify-between">

              <div>

                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-400">
                  Structured Learning
                </p>

                <h2 className="mt-2 text-2xl font-bold text-white">
                  Learning Paths
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Follow a clear path instead of jumping randomly between
                  topics.
                </p>

              </div>

              <Link
                href="/learning-paths"
                className="hidden items-center gap-2 text-sm font-medium text-blue-400 sm:flex"
              >
                View all
                <ChevronRight size={16} />
              </Link>

            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">

              {[
                {
                  title: "AI & Automation",
                  text: "Understand AI tools, workflows and automation.",
                  icon: <Bot size={22} />,
                  available: false,
                },
                {
                  title: "Creator Path",
                  text: "Content, design, video and personal branding.",
                  icon: <Sparkles size={22} />,
                  available: false,
                },
                {
                  title: "Digital Business",
                  text: "Build systems, funnels and online opportunities.",
                  icon: <BriefcaseBusiness size={22} />,
                  available: false,
                },
                {
                  title: "Network Marketing",
                  text: "Build a modern product retailing system.",
                  icon: <Users size={22} />,
                  available: true,
                },
              ].map((path, index) => (

                <motion.div
                  key={path.title}
                  initial={{
                    opacity: 0,
                    y: 25,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.2,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.08,
                  }}
                  whileHover={{
                    y: -5,
                  }}
                >

                  <Link
                    href="/learning-paths"
                    className="group block rounded-2xl border border-white/[0.07] bg-[#080D17] p-5 hover:border-blue-400/20"
                  >

                    <div className="flex items-start justify-between">

                      <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3 text-cyan-300">
                        {path.icon}
                      </div>

                      {path.available ? (
                        <span className="rounded-full bg-cyan-400/10 px-2.5 py-1 text-[9px] font-bold text-cyan-300">
                          AVAILABLE
                        </span>
                      ) : (
                        <Lock size={15} className="text-slate-600" />
                      )}

                    </div>

                    <h3 className="mt-5 font-semibold text-white">
                      {path.title}
                    </h3>

                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      {path.text}
                    </p>

                    <div className="mt-5 flex items-center gap-2 text-xs font-medium text-slate-400">
                      Explore path
                      <ArrowRight size={14} />
                    </div>

                  </Link>

                </motion.div>

              ))}

            </div>

          </section>

          {/* =====================================================
              PLATFORM RESOURCES & AI DIRECTORY
          ===================================================== */}

          <section className="mt-12">

            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-400">
              Platform Resources
            </p>

            <h2 className="mt-2 text-2xl font-bold text-white">
              AI Tools & Practical Directory
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Curated tools and systems to help you build modern digital workflows.
            </p>

            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">

              {[
                {
                  title: "NMAI Sales Objection Mentor",
                  text: hasAnyCourseAccess(currentUserEmail)
                    ? "Instant AI mentor pre-trained on NMAI systems & conversation frameworks."
                    : "Exclusive to enrolled students • Locked for free accounts.",
                  icon: <Sparkles size={21} className="text-cyan-300" />,
                  href: hasAnyCourseAccess(currentUserEmail)
                    ? "https://gemini.google.com/gem/16HfUl9hwpduJh9TIkPFJ171ZU-2n8-68?usp=sharing"
                    : "/courses/network-marketing",
                  external: hasAnyCourseAccess(currentUserEmail),
                  badge: hasAnyCourseAccess(currentUserEmail) ? "Enrolled" : "Paid Only",
                },
                {
                  title: "AI Tools Directory",
                  text: "Explore 10+ curated AI tools, workflows, and actionable prompts.",
                  icon: <Bot size={21} />,
                  href: "/ai-tools",
                  external: false,
                },
                {
                  title: "Content Ideas",
                  text: "Ideas and frameworks for creating better content.",
                  icon: <Sparkles size={21} />,
                  href: "/learning-paths",
                  external: false,
                },
                {
                  title: "Business Templates",
                  text: "Useful templates for digital business and marketing.",
                  icon: <FileText size={21} />,
                  href: "/courses/network-marketing",
                  external: false,
                },
              ].map((item, index) => (

                <motion.div
                  key={item.title}
                  initial={{
                    opacity: 0,
                    y: 25,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.2,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.08,
                  }}
                  whileHover={{
                    y: -5,
                  }}
                >

                  <Link
                    href={item.href}
                    {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-[#080D17] p-5 hover:border-cyan-400/30 transition h-full"
                  >

                    <div className="rounded-xl bg-blue-500/10 p-3 text-blue-300">
                      {item.icon}
                    </div>

                    <div className="min-w-0 flex-1">

                      <h3 className="font-semibold text-white group-hover:text-cyan-300 transition">
                        {item.title}
                      </h3>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        {item.text}
                      </p>

                    </div>

                    <ArrowRight
                      size={17}
                      className="text-slate-600 transition group-hover:translate-x-1 group-hover:text-cyan-300"
                    />

                  </Link>

                </motion.div>

              ))}

            </div>

          </section>

          {/* =====================================================
              FEATURED AI TOOLS SECTION
          ===================================================== */}

          <section className="mt-12">

            <div className="flex items-end justify-between">

              <div>

                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-400">
                  Curated Toolkit
                </p>

                <h2 className="mt-2 text-2xl font-bold text-white">
                  Featured AI Tools & Workflows
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Leverage the best AI models to script courses, create video avatars, design thumbnails, and automate business.
                </p>

              </div>

              <Link
                href="/ai-tools"
                className="hidden items-center gap-2 text-sm font-medium text-cyan-400 sm:flex"
              >
                View All Tools
                <ChevronRight size={16} />
              </Link>

            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">

              {[
                {
                  name: "NMAI Sales Objection Mentor",
                  tag: "Google Gemini",
                  category: "Custom Assistant",
                  desc: "Custom-trained Gemini assistant for NMAI students. Pre-loaded with scripts & frameworks.",
                  badge: "Exclusive",
                  icon: <Sparkles size={20} className="text-cyan-300" />,
                  iconBg: "bg-cyan-500/10",
                },
                {
                  name: "HeyGen",
                  tag: "Avatars",
                  category: "Video & Avatars",
                  desc: "Studio-quality AI video lessons with talking avatars and 40+ language dubbing.",
                  badge: "Freemium",
                  icon: <Video size={20} className="text-purple-400" />,
                  iconBg: "bg-purple-500/10",
                },
                {
                  name: "Midjourney",
                  tag: "Visuals",
                  category: "Image & Creative",
                  desc: "Photorealistic cover artwork, lesson thumbnails and branded promotional assets.",
                  badge: "Paid",
                  icon: <Sparkles size={20} className="text-indigo-400" />,
                  iconBg: "bg-indigo-500/10",
                },
                {
                  name: "Claude 3.7",
                  tag: "Anthropic",
                  category: "Reasoning & Code",
                  desc: "Deep analytical thinking, course structure reviews, and human-like strategic writing.",
                  badge: "Freemium",
                  icon: <Bot size={20} className="text-amber-400" />,
                  iconBg: "bg-amber-500/10",
                },
              ].map((tool, index) => (

                <motion.div
                  key={tool.name}
                  initial={{
                    opacity: 0,
                    y: 25,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.2,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.08,
                  }}
                  whileHover={{
                    y: -5,
                  }}
                >

                  <Link
                    href="/ai-tools"
                    className="group flex flex-col justify-between rounded-2xl border border-white/[0.07] bg-[#080D17] p-5 transition hover:border-cyan-400/30 hover:shadow-xl hover:shadow-cyan-500/5 h-full"
                  >

                    <div>

                      <div className="flex items-center justify-between">

                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${tool.iconBg} border border-white/[0.05]`}>
                          {tool.icon}
                        </div>

                        <span className="rounded-full bg-white/[0.05] border border-white/[0.07] px-2.5 py-0.5 text-[10px] font-semibold text-slate-300">
                          {tool.badge}
                        </span>

                      </div>

                      <h3 className="mt-4 font-bold text-white group-hover:text-cyan-300 transition">
                        {tool.name}
                      </h3>

                      <p className="text-[11px] font-medium text-slate-500">
                        {tool.category}
                      </p>

                      <p className="mt-2 text-xs leading-5 text-slate-400">
                        {tool.desc}
                      </p>

                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-white/[0.05] pt-3 text-xs font-semibold text-cyan-300">
                      <span>Explore Workflows</span>
                      <ArrowRight size={14} className="transition group-hover:translate-x-1" />
                    </div>

                  </Link>

                </motion.div>

              ))}

            </div>

            <div className="mt-5 flex justify-center sm:hidden">
              <Link
                href="/ai-tools"
                className="flex items-center gap-2 text-xs font-semibold text-cyan-400"
              >
                View All AI Tools & Workflows
                <ChevronRight size={15} />
              </Link>
            </div>

          </section>

          {/* =====================================================
              FOUNDER
          ===================================================== */}

          <motion.section
            initial={{
              opacity: 0,
              y: 35,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.15,
            }}
            transition={{
              duration: 0.7,
            }}
            className="mt-14"
          >

            <div className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-[#080D17] p-6 md:p-8 lg:p-10">

              <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

              <div className="relative grid items-center gap-10 lg:grid-cols-[320px_1fr]">

                {/* PHOTO */}

                <motion.div
                  whileHover={{
                    scale: 1.02,
                  }}
                  className="relative mx-auto w-full max-w-[320px]"
                >

                  <div className="absolute -inset-3 rounded-[28px] bg-gradient-to-br from-blue-500/30 to-cyan-400/20 blur-2xl" />

                  <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#05070D]">

                    <img
                      src="/kranthi.png"
                      alt="Kranthi Velpuri - Founder and CEO of NMAI"
                      className="h-[390px] w-full object-cover object-top"
                    />

                  </div>

                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-cyan-400/20 bg-[#070B14]/95 px-5 py-2.5 text-[10px] font-bold tracking-[0.16em] text-cyan-300 shadow-2xl backdrop-blur-xl">
                    FOUNDER • NMAI
                  </div>

                </motion.div>

                {/* CONTENT */}

                <div>

                  <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/10 bg-blue-500/[0.06] px-3 py-1.5 text-xs font-semibold text-blue-300">
                    <Sparkles size={13} />
                    Meet the Founder
                  </div>

                  <h2 className="mt-5 text-3xl font-bold tracking-tight text-white md:text-4xl">
                    Kranthi Velpuri
                  </h2>

                  <p className="mt-2 text-lg font-medium text-cyan-300">
                    Founder & CEO — NMAI
                  </p>

                  <p className="mt-6 max-w-3xl text-sm leading-7 text-slate-400 md:text-base">
                    NMAI was created with a simple mission — to help people
                    learn practical digital skills and use AI to build
                    better opportunities in the modern world.
                  </p>

                  <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-400 md:text-base">
                    From AI and automation to digital business, content
                    creation, marketing and network marketing, NMAI focuses
                    on practical learning that can be implemented in the
                    real world.
                  </p>

                  <div className="mt-7 grid gap-3 sm:grid-cols-2">

                    {[
                      {
                        title: "Learn",
                        text: "Learn skills that matter in the real world.",
                      },
                      {
                        title: "Implement",
                        text: "Turn knowledge into practical action.",
                      },
                      {
                        title: "Build",
                        text: "Build skills, systems and digital opportunities.",
                      },
                      {
                        title: "Evolve",
                        text: "Keep learning as technology continues to evolve.",
                      },
                    ].map((item) => (

                      <div
                        key={item.title}
                        className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4"
                      >

                        <div className="flex items-center gap-2">

                          <CheckCircle2
                            size={17}
                            className="text-cyan-300"
                          />

                          <p className="font-semibold text-white">
                            {item.title}
                          </p>

                        </div>

                        <p className="mt-2 text-xs leading-5 text-slate-500">
                          {item.text}
                        </p>

                      </div>

                    ))}

                  </div>

                  <div className="mt-7 rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.03] p-5">

                    <p className="text-sm italic leading-7 text-slate-200 md:text-base">
                      “The future belongs to people who know how to use AI —
                      not people who are afraid of it.”
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </motion.section>

          {/* =====================================================
              COMMUNITY
          ===================================================== */}

          <motion.section
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.6,
            }}
            className="mt-12"
          >

            <div className="relative overflow-hidden rounded-3xl border border-blue-400/10 bg-gradient-to-br from-blue-500/[0.10] via-[#080D17] to-cyan-400/[0.04] p-7 md:p-9">

              <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

                <div className="max-w-2xl">

                  <div className="flex items-center gap-2 text-cyan-300">

                    <MessageCircle size={19} />

                    <span className="text-xs font-semibold uppercase tracking-[0.16em]">
                      NMAI Community
                    </span>

                    {!hasAnyCourseAccess(currentUserEmail) && (
                      <span className="ml-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-300">
                        Paid Members Only
                      </span>
                    )}

                  </div>

                  <h2 className="mt-3 text-2xl font-bold text-white md:text-3xl">
                    {hasAnyCourseAccess(currentUserEmail)
                      ? "Learn together. Build together."
                      : "Exclusive Student WhatsApp Community"}
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {hasAnyCourseAccess(currentUserEmail)
                      ? "Connect with other learners, discover new opportunities and stay updated as NMAI grows."
                      : "The NMAI WhatsApp Community group is exclusively reserved for paid enrolled students. Free accounts cannot join the community group until a course is unlocked."}
                  </p>

                </div>

                {hasAnyCourseAccess(currentUserEmail) ? (
                  <a
                    href={siteConfig.community.whatsappUrl || "https://chat.whatsapp.com/CjZKNudezQp46MRqsUOTBR"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#05070D] hover:bg-slate-200"
                  >
                    Join WhatsApp Community
                    <ArrowRight size={16} />
                  </a>
                ) : (
                  <button
                    onClick={() => setCommunityLockedModalOpen(true)}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-5 py-3 text-sm font-semibold text-amber-300 hover:bg-amber-500/20 transition"
                  >
                    <Lock size={15} />
                    Community Locked • Enrolled Only
                  </button>
                )}

              </div>

            </div>

          </motion.section>

          {/* =====================================================
              FINAL CTA
          ===================================================== */}

          <motion.section
            initial={{
              opacity: 0,
              y: 25,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.6,
            }}
            className="mt-12 pb-10"
          >

            <div className="rounded-3xl border border-white/[0.07] bg-[#080D17] p-7 text-center md:p-10">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-cyan-300">
                <Code2 size={23} />
              </div>

              <h2 className="mt-5 text-2xl font-bold text-white md:text-3xl">
                Start with Network Marketing Success.
              </h2>

              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">
                The first NMAI course is live. Start learning the modern
                approach to product retailing and network marketing.
              </p>

              <Link
                href="/courses/network-marketing"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-500"
              >
                Explore Network Marketing
                <ArrowRight size={17} />
              </Link>

            </div>

          </motion.section>

        </div>

      </main>

      {/* COMMUNITY ACCESS LOCKED MODAL */}
      <AnimatePresence>
        {communityLockedModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCommunityLockedModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-md rounded-3xl border border-amber-500/30 bg-[#090E1A] p-7 text-center shadow-2xl backdrop-blur-2xl"
            >
              <button
                onClick={() => setCommunityLockedModalOpen(false)}
                className="absolute right-4 top-4 rounded-xl p-2 text-slate-500 hover:bg-white/5 hover:text-white"
              >
                <X size={18} />
              </button>

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-400 shadow-lg shadow-amber-500/10">
                <Lock size={30} />
              </div>

              <div className="mt-4">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-amber-300">
                  <ShieldAlert size={12} />
                  Enrolled Students Only • Community Locked
                </span>
              </div>

              <h2 className="mt-3 text-xl font-bold text-white">
                WhatsApp Community Access Restricted
              </h2>

              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                The NMAI WhatsApp Community group is an exclusive private group reserved for enrolled students who have purchased course training. Free / new signup accounts cannot access the community group.
              </p>

              <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-left text-xs">
                <p className="text-slate-400">
                  Logged in as: <span className="font-mono text-cyan-300">{currentUserEmail || "Free Member"}</span>
                </p>
                <p className="mt-1 text-slate-400">
                  Status: <span className="text-amber-300 font-medium">Free Member (0 Courses Enrolled)</span>
                </p>
              </div>

              <div className="mt-6 flex flex-col gap-2.5">
                <a
                  href="https://wa.me/919177187024?text=Hello%20Admin,%20I%20would%20like%20to%20purchase%20course%20access%20to%20join%20the%20NMAI%20Community."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 font-semibold text-xs text-white shadow-lg shadow-emerald-500/20 hover:brightness-110 transition"
                >
                  <MessageCircle size={15} />
                  Contact Admin to Purchase Course Access
                </a>

                <button
                  onClick={() => setCommunityLockedModalOpen(false)}
                  className="flex h-10 w-full items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-xs font-semibold text-slate-300 hover:bg-white/[0.08] transition"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}