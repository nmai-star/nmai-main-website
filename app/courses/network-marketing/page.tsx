"use client";

import { motion } from "framer-motion";
import ThemeToggle from "../../components/ThemeToggle";
import SignOutButton from "../../components/SignOutButton";
import { hasCourseAccess, checkStudentAuthorization } from "../../data/enrolledStudents";
import {
  ArrowRight,
  Bell,
  Bookmark,
  Bot,
  CheckCircle2,
  Compass,
  Home,
  LayoutGrid,
  Menu,
  MessageCircle,
  Palette,
  Rocket,
  Search,
  Settings,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Video,
  X,
  Lock,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const courses = [
  {
    id: "network-marketing",
    title: "Network Marketing Success",
    description:
      "Build a modern network marketing system using content, conversations, retailing and automation.",
    category: "Network Marketing",
    icon: Users,
    progress: 0,
    lessons: 24,
    duration: "6h 30m",
    href: "/courses/network-marketing",
    tags: ["Retailing", "Marketing"],
    available: true,
  },
  {
    id: "ai-automation",
    title: "AI & Automation Mastery",
    description:
      "Learn AI tools, automation workflows and practical systems for modern business.",
    category: "AI & Automation",
    icon: Bot,
    progress: 0,
    lessons: 24,
    duration: "6h 20m",
    href: "#",
    tags: ["AI", "Automation"],
    available: false,
  },
  {
    id: "content-design",
    title: "Content & Design Mastery",
    description:
      "Create scroll-stopping content, graphics and visual assets for your brand.",
    category: "Content & Design",
    icon: Palette,
    progress: 0,
    lessons: 20,
    duration: "5h 10m",
    href: "#",
    tags: ["Design", "Content"],
    available: false,
  },
  {
    id: "video-editing",
    title: "Video Editing for Creators",
    description:
      "Learn modern video editing techniques for Reels, Shorts and social media.",
    category: "Video Editing",
    icon: Video,
    progress: 0,
    lessons: 16,
    duration: "3h 50m",
    href: "#",
    tags: ["Video", "Creators"],
    available: false,
  },
  {
    id: "social-media",
    title: "Social Media Marketing",
    description:
      "Build your social presence with content strategy, growth systems and analytics.",
    category: "Social Media",
    icon: TrendingUp,
    progress: 0,
    lessons: 22,
    duration: "5h 30m",
    href: "#",
    tags: ["Social", "Growth"],
    available: false,
  },
  {
    id: "digital-business",
    title: "Digital Business Blueprint",
    description:
      "Turn your knowledge into digital products, funnels and scalable online systems.",
    category: "Digital Business",
    icon: Rocket,
    progress: 0,
    lessons: 19,
    duration: "4h 40m",
    href: "#",
    tags: ["Business", "Funnels"],
    available: false,
  },
];

const categories = [
  "All Courses",
  "AI & Automation",
  "Network Marketing",
  "Content & Design",
  "Video Editing",
  "Social Media",
  "Digital Business",
];

const navItems = [
  {
    label: "Dashboard",
    icon: Home,
    href: "/",
  },
  {
    label: "Courses",
    icon: LayoutGrid,
    href: "/",
    active: true,
  },
  {
    label: "Learning Paths",
    icon: Compass,
    href: "/learning-paths",
  },
  {
    label: "Community",
    icon: MessageCircle,
    href: "/community",
  },
  {
    label: "AI Tools",
    icon: Bot,
    href: "/ai-tools",
  },
  {
    label: "Bookmarks",
    icon: Bookmark,
    href: "/bookmarks",
  },
  {
    label: "My Progress",
    icon: Target,
    href: "/progress",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

function useCursorMotion() {
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  });

  function handleMouseMove(
    event: React.MouseEvent<HTMLDivElement>
  ) {
    const rect =
      event.currentTarget.getBoundingClientRect();

    const x =
      ((event.clientX - rect.left) / rect.width - 0.5) * 2;

    const y =
      ((event.clientY - rect.top) / rect.height - 0.5) * 2;

    setPosition({ x, y });
  }

  return {
    position,
    handleMouseMove,
  };
}

/* =========================
   COURSE VISUALS
========================= */

function NetworkVisual() {
  const { position, handleMouseMove } =
    useCursorMotion();

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative h-full min-h-[210px] overflow-hidden bg-[#0A0D1A]"
    >
      <motion.div
        animate={{
          x: position.x * 10,
          y: position.y * 10,
        }}
        transition={{
          type: "spring",
          stiffness: 120,
          damping: 15,
        }}
        className="absolute inset-0"
      >
        <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-purple-300/20 bg-purple-500/10 shadow-[0_0_40px_rgba(168,85,247,.3)]">
          <div className="flex h-full items-center justify-center">
            <Users
              size={28}
              className="text-purple-300"
            />
          </div>
        </div>

        {[
          { left: "18%", top: "25%" },
          { left: "78%", top: "25%" },
          { left: "20%", top: "72%" },
          { left: "78%", top: "72%" },
        ].map((node, index) => (
          <motion.div
            key={index}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              delay: index * 0.4,
              repeat: Infinity,
            }}
            style={{
              left: node.left,
              top: node.top,
            }}
            className="absolute h-10 w-10 rounded-full border border-purple-400/20 bg-purple-500/10"
          >
            <div className="flex h-full items-center justify-center">
              <Users
                size={16}
                className="text-purple-300"
              />
            </div>
          </motion.div>
        ))}

        <div className="absolute left-[25%] top-[38%] h-px w-[25%] rotate-[25deg] bg-purple-400/20" />

        <div className="absolute right-[25%] top-[38%] h-px w-[25%] -rotate-[25deg] bg-purple-400/20" />

        <div className="absolute bottom-[32%] left-[25%] h-px w-[25%] -rotate-[25deg] bg-purple-400/20" />

        <div className="absolute bottom-[32%] right-[25%] h-px w-[25%] rotate-[25deg] bg-purple-400/20" />
      </motion.div>

      <div className="absolute bottom-4 left-5 text-xs font-medium text-purple-300/70">
        NETWORK SYSTEM
      </div>
    </div>
  );
}

function AIVisual() {
  const { position, handleMouseMove } =
    useCursorMotion();

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative h-full min-h-[210px] overflow-hidden bg-[#07101F]"
    >
      <motion.div
        animate={{
          x: position.x * 12,
          y: position.y * 12,
        }}
        transition={{
          type: "spring",
          stiffness: 120,
          damping: 15,
        }}
        className="absolute inset-0"
      >
        <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-400/20" />

        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-cyan-400/30"
        />

        <motion.div
          animate={{ rotate: -360 }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-500/10"
        />

        <div className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl border border-cyan-300/20 bg-blue-600/20 shadow-[0_0_40px_rgba(0,102,255,.4)]">
          <Bot
            size={30}
            className="text-cyan-300"
          />
        </div>

        {[
          ["18%", "28%"],
          ["78%", "25%"],
          ["20%", "70%"],
          ["78%", "72%"],
          ["50%", "15%"],
          ["50%", "85%"],
        ].map(([left, top], index) => (
          <motion.div
            key={index}
            animate={{
              y: [0, -8, 0],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 2 + index * 0.2,
              repeat: Infinity,
            }}
            className="absolute h-2 w-2 rounded-full bg-cyan-400"
            style={{
              left,
              top,
            }}
          />
        ))}
      </motion.div>

      <div className="absolute bottom-4 left-5 text-xs font-medium text-cyan-300/70">
        AI SYSTEM
      </div>
    </div>
  );
}

function DesignVisual() {
  const { position, handleMouseMove } =
    useCursorMotion();

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative h-full min-h-[210px] overflow-hidden bg-[#0B0C17]"
    >
      <motion.div
        animate={{
          x: position.x * 12,
          y: position.y * 12,
        }}
        transition={{
          type: "spring",
          stiffness: 120,
          damping: 15,
        }}
        className="absolute inset-0"
      >
        <motion.div
          animate={{
            y: [-5, 5, -5],
            rotate: [-2, 2, -2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-[15%] top-[22%] h-24 w-36 rounded-xl border border-pink-300/20 bg-pink-500/5 p-3"
        >
          <div className="h-2 w-16 rounded bg-pink-300/30" />
          <div className="mt-3 h-10 rounded-lg bg-white/5" />
        </motion.div>

        <motion.div
          animate={{
            y: [5, -5, 5],
            rotate: [2, -2, 2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute right-[14%] top-[35%] h-24 w-36 rounded-xl border border-cyan-300/20 bg-cyan-500/5 p-3"
        >
          <div className="h-2 w-20 rounded bg-cyan-300/30" />

          <div className="mt-3 flex gap-2">
            <div className="h-10 w-10 rounded bg-white/5" />
            <div className="h-10 flex-1 rounded bg-white/5" />
          </div>
        </motion.div>

        <div className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10 shadow-[0_0_30px_rgba(0,102,255,.25)]">
          <Palette
            size={25}
            className="text-blue-300"
          />
        </div>
      </motion.div>

      <div className="absolute bottom-4 left-5 text-xs font-medium text-pink-300/70">
        CREATIVE STUDIO
      </div>
    </div>
  );
}

function VideoVisual() {
  const { position, handleMouseMove } =
    useCursorMotion();

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative h-full min-h-[210px] overflow-hidden bg-[#080D18]"
    >
      <motion.div
        animate={{
          x: position.x * 10,
          y: position.y * 10,
        }}
        transition={{
          type: "spring",
          stiffness: 120,
          damping: 15,
        }}
        className="absolute inset-0"
      >
        <div className="absolute left-1/2 top-[38%] flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-blue-400/20 bg-blue-500/10 shadow-[0_0_35px_rgba(0,102,255,.3)]">
          <Video
            size={25}
            className="text-blue-300"
          />
        </div>

        <div className="absolute bottom-[24%] left-[10%] right-[10%] h-12 rounded-lg border border-white/10 bg-white/[0.03]">
          <div className="flex h-full items-center gap-1 px-2">
            {Array.from({ length: 22 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="h-5 flex-1 rounded-sm bg-blue-400/20"
                />
              )
            )}
          </div>

          <motion.div
            animate={{
              left: ["5%", "92%", "5%"],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute top-0 h-full w-px bg-cyan-300 shadow-[0_0_10px_rgba(0,229,255,.8)]"
          />
        </div>
      </motion.div>

      <div className="absolute bottom-4 left-5 text-xs font-medium text-blue-300/70">
        VIDEO EDITOR
      </div>
    </div>
  );
}

function SocialVisual() {
  const { position, handleMouseMove } =
    useCursorMotion();

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative h-full min-h-[210px] overflow-hidden bg-[#0A0D18]"
    >
      <motion.div
        animate={{
          x: position.x * 10,
          y: position.y * 10,
        }}
        transition={{
          type: "spring",
          stiffness: 120,
          damping: 15,
        }}
        className="absolute inset-0"
      >
        <motion.div
          animate={{
            y: [-6, 6, -6],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-[15%] top-[24%] w-32 rounded-xl border border-blue-400/20 bg-blue-500/5 p-3"
        >
          <div className="h-2 w-12 rounded bg-blue-300/30" />
          <div className="mt-3 h-12 rounded-lg bg-white/5" />
          <div className="mt-2 h-2 w-20 rounded bg-white/10" />
        </motion.div>

        <motion.div
          animate={{
            y: [6, -6, 6],
          }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute right-[15%] top-[40%] w-32 rounded-xl border border-cyan-400/20 bg-cyan-500/5 p-3"
        >
          <div className="h-2 w-14 rounded bg-cyan-300/30" />

          <div className="mt-3 flex gap-2">
            <div className="h-8 w-8 rounded-full bg-cyan-400/10" />

            <div className="flex-1">
              <div className="h-2 rounded bg-white/10" />
              <div className="mt-2 h-2 w-12 rounded bg-white/10" />
            </div>
          </div>
        </motion.div>

        <div className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-500/10">
          <TrendingUp
            size={22}
            className="text-cyan-300"
          />
        </div>
      </motion.div>

      <div className="absolute bottom-4 left-5 text-xs font-medium text-cyan-300/70">
        SOCIAL GROWTH
      </div>
    </div>
  );
}

function BusinessVisual() {
  const { position, handleMouseMove } =
    useCursorMotion();

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative h-full min-h-[210px] overflow-hidden bg-[#080F18]"
    >
      <motion.div
        animate={{
          x: position.x * 10,
          y: position.y * 10,
        }}
        transition={{
          type: "spring",
          stiffness: 120,
          damping: 15,
        }}
        className="absolute inset-0"
      >
        <div className="absolute bottom-[25%] left-[17%] flex items-end gap-3">
          {[35, 55, 75, 100].map(
            (height, index) => (
              <motion.div
                key={index}
                animate={{
                  height: [
                    height * 0.75,
                    height,
                    height * 0.75,
                  ],
                }}
                transition={{
                  duration: 2.5,
                  delay: index * 0.25,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-8 rounded-t-lg bg-blue-500/20"
              />
            )
          )}
        </div>

        <motion.div
          animate={{
            y: [0, -8, 0],
            rotate: [-5, 5, -5],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute right-[18%] top-[22%]"
        >
          <Rocket
            size={42}
            className="text-cyan-300"
          />
        </motion.div>
      </motion.div>

      <div className="absolute bottom-4 left-5 text-xs font-medium text-cyan-300/70">
        BUSINESS SYSTEM
      </div>
    </div>
  );
}

/* =========================
   SIDEBAR
========================= */

function SidebarItem({
  item,
  onClick,
}: {
  item: {
    label: string;
    icon: React.ElementType;
    href: string;
    active?: boolean;
  };
  onClick?: () => void;
}) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
        item.active
          ? "bg-blue-500/10 text-white"
          : "text-slate-500 hover:bg-white/[0.04] hover:text-slate-200"
      }`}
    >
      <Icon
        size={18}
        className={
          item.active
            ? "text-blue-400"
            : "text-slate-500 group-hover:text-slate-300"
        }
      />

      <span>{item.label}</span>

      {item.active && (
        <div className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-400" />
      )}
    </Link>
  );
}

/* =========================
   COURSE CARD
========================= */

function CourseCard({
  course,
  index,
}: {
  course: (typeof courses)[number];
  index: number;
}) {
  const Icon = course.icon;

  const visuals: Record<
    string,
    React.ReactNode
  > = {
    "Network Marketing": <NetworkVisual />,
    "AI & Automation": <AIVisual />,
    "Content & Design": <DesignVisual />,
    "Video Editing": <VideoVisual />,
    "Social Media": <SocialVisual />,
    "Digital Business": <BusinessVisual />,
  };

  /* AVAILABLE COURSE */
  if (course.available) {
    return (
      <motion.div
        initial={{
          opacity: 0,
          y: 25,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
          delay: index * 0.08,
        }}
        whileHover={{
          y: -7,
        }}
        className="group overflow-hidden rounded-2xl border border-white/10 bg-[#080D17] transition hover:border-purple-500/40 hover:shadow-[0_20px_60px_rgba(0,0,0,.35)]"
      >
        <Link
          href={course.href}
          className="block"
        >
          <div className="relative">
            {visuals[course.category]}

            <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-black/30 backdrop-blur-md">
              <Icon
                size={18}
                className="text-white"
              />
            </div>

            <div className="absolute left-4 top-4 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold text-emerald-300 backdrop-blur-md">
              AVAILABLE NOW
            </div>
          </div>
        </Link>

        <div className="p-5">
          <Link href={course.href}>
            <h3 className="text-lg font-semibold text-white transition group-hover:text-cyan-300">
              {course.title}
            </h3>
          </Link>

          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
            {course.description}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {course.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white/5 px-2.5 py-1 text-[10px] text-slate-400"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between">
            <div className="text-xs text-slate-600">
              {course.lessons} lessons •{" "}
              {course.duration}
            </div>

            <Link
              href={course.href}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-500"
            >
              Explore Course
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  /* COMING SOON COURSE */
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 25,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
      }}
      whileHover={{
        y: -4,
      }}
      className="group overflow-hidden rounded-2xl border border-white/10 bg-[#080D17]"
    >
      <div className="relative">
        <div className="opacity-55 grayscale-[25%]">
          {visuals[course.category]}
        </div>

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />

        {/* COMING SOON BADGE */}
        <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/30 bg-[#07101F]/90 shadow-[0_0_35px_rgba(0,229,255,.15)]"
          >
            <Lock
              size={21}
              className="text-cyan-300"
            />
          </motion.div>

          <span className="mt-3 rounded-full border border-cyan-400/20 bg-[#07101F]/90 px-4 py-1.5 text-[10px] font-bold tracking-[0.18em] text-cyan-300 backdrop-blur-md">
            COMING SOON
          </span>
        </div>

        <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-black/30 backdrop-blur-md">
          <Icon
            size={18}
            className="text-slate-400"
          />
        </div>

        <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[10px] text-slate-400 backdrop-blur-md">
          {course.category}
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-semibold text-slate-300">
          {course.title}
        </h3>

        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
          {course.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {course.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-white/[0.03] px-2.5 py-1 text-[10px] text-slate-600"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between">
          <div className="text-xs text-slate-700">
            {course.lessons} lessons •{" "}
            {course.duration}
          </div>

          <div className="inline-flex items-center gap-2 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-2.5 text-xs font-medium text-slate-600">
            <Lock size={13} />
            Locked
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* =========================
   DASHBOARD
========================= */

export default function Dashboard() {
  const [selectedCategory, setSelectedCategory] =
    useState("All Courses");

  const [mobileSidebar, setMobileSidebar] =
    useState(false);

  const [search, setSearch] = useState("");

  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [studentEmail, setStudentEmail] = useState<string>("");
  const [studentName, setStudentName] = useState<string>("");
  const [studentCoursesSummary, setStudentCoursesSummary] = useState<string>("");

  useEffect(() => {
    const evaluateAccess = () => {
      try {
        // Student session check
        const sessionRaw = localStorage.getItem("nmai-student-session");
        if (sessionRaw) {
          const session = JSON.parse(sessionRaw);
          if (session && session.email) {
            setStudentEmail(session.email);
            setStudentName(session.name || session.email.split("@")[0]);
            const access = hasCourseAccess(session.email, "course-nm", "Network Marketing Success");
            setHasAccess(access);

            const auth = checkStudentAuthorization(session.email);
            if (auth.student) {
              setStudentCoursesSummary(auth.student.enrolledCourse);
            }
            return;
          }
        }
      } catch (e) {
        console.error(e);
      }
      setHasAccess(false);
    };

    evaluateAccess();
    window.addEventListener("storage", evaluateAccess);
    window.addEventListener("nmai-student-updated", evaluateAccess);
    return () => {
      window.removeEventListener("storage", evaluateAccess);
      window.removeEventListener("nmai-student-updated", evaluateAccess);
    };
  }, []);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesCategory =
        selectedCategory === "All Courses" ||
        course.category === selectedCategory;

      const query = search
        .toLowerCase()
        .trim();

      const matchesSearch =
        !query ||
        course.title
          .toLowerCase()
          .includes(query) ||
        course.description
          .toLowerCase()
          .includes(query) ||
        course.category
          .toLowerCase()
          .includes(query);

      return (
        matchesCategory &&
        matchesSearch
      );
    });
  }, [selectedCategory, search]);

  if (hasAccess === false) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#05070D] px-4 py-12 text-white">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-600/10 blur-[120px]" />

        {/* Top bar */}
        <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs font-medium text-slate-300 transition hover:bg-white/[0.08]"
          >
            <ArrowRight className="rotate-180" size={14} />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <SignOutButton />
          </div>
        </div>

        <div className="relative w-full max-w-md rounded-3xl border border-amber-500/20 bg-[#090E1A]/90 p-8 text-center shadow-2xl backdrop-blur-2xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-400 shadow-lg shadow-amber-500/10">
            <Lock size={30} />
          </div>

          <div className="mt-5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-amber-300">
              <ShieldAlert size={12} />
              Paid Course • Free Access Not Available
            </span>
          </div>

          <h1 className="mt-3 text-2xl font-bold text-white tracking-tight">
            Network Marketing Success
          </h1>

          <p className="mt-2 text-xs text-slate-400 leading-relaxed">
            Free registration allows portal access to explore courses and tools, but proprietary course lessons and video materials are strictly paid.
          </p>

          <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Membership Tier:
              </span>
              <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-300">
                Free Member (Locked)
              </span>
            </div>
            <div className="mt-2.5 space-y-1 text-xs">
              <p className="text-slate-400">
                Account: <span className="font-mono text-cyan-300">{studentEmail || "Guest"}</span>
              </p>
              <p className="text-slate-400">
                Course Permissions: <span className="font-medium text-amber-300">{studentCoursesSummary || "0 courses assigned (No Free Access)"}</span>
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2.5">
            <a
              href="https://wa.me/919177187024?text=Hello%20Admin,%20I%20would%20like%20to%20purchase%20access%20to%20Network%20Marketing%20Success."
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 font-semibold text-xs text-white shadow-lg shadow-emerald-500/20 hover:brightness-110 transition"
            >
              <MessageCircle size={15} />
              Contact Admin on WhatsApp to Purchase
            </a>

            <Link
              href="/"
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] font-semibold text-xs text-slate-300 hover:bg-white/[0.08] transition"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#05070D] text-white">
      {/* BACKGROUND */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[5%] top-[5%] h-96 w-96 rounded-full bg-blue-600/5 blur-[130px]" />

        <div className="absolute right-[5%] top-[30%] h-96 w-96 rounded-full bg-cyan-500/5 blur-[130px]" />

        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* MOBILE HEADER */}
      <div className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between border-b border-white/10 bg-[#05070D]/90 px-4 backdrop-blur-xl lg:hidden">
        <button
          onClick={() =>
            setMobileSidebar(true)
          }
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5"
        >
          <Menu size={19} />
        </button>

        <img
          src="/nmai-logo.png"
          alt="NMAI"
          className="h-8 w-auto"
        />

        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-blue-400/30 bg-blue-500/10 text-xs font-semibold">
          K
        </div>
      </div>

      {/* MOBILE OVERLAY */}
      {mobileSidebar && (
        <div
          onClick={() =>
            setMobileSidebar(false)
          }
          className="fixed inset-0 z-[60] bg-black/70 lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed bottom-0 left-0 top-0 z-[70] w-[270px] border-r border-white/10 bg-[#070A12] transition-transform duration-300 lg:translate-x-0 ${
          mobileSidebar
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col p-5">
          <div className="mb-8 flex items-center justify-between">
            <Link href="/">
              <img
                src="/nmai-logo.png"
                alt="NMAI"
                className="h-10 w-auto"
              />
            </Link>

            <button
              onClick={() =>
                setMobileSidebar(false)
              }
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 lg:hidden"
            >
              <X size={17} />
            </button>
          </div>

          <div className="mb-3 px-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">
            Learning
          </div>

          <nav className="space-y-1">
            {navItems
              .slice(0, 5)
              .map((item) => (
                <SidebarItem
                  key={item.label}
                  item={item}
                  onClick={() =>
                    setMobileSidebar(false)
                  }
                />
              ))}
          </nav>

          <div className="mt-7 mb-3 px-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">
            Personal
          </div>

          <nav className="space-y-1">
            {navItems
              .slice(5)
              .map((item) => (
                <SidebarItem
                  key={item.label}
                  item={item}
                  onClick={() =>
                    setMobileSidebar(false)
                  }
                />
              ))}
          </nav>

          {/* DAILY GOAL */}
          <div className="mt-auto">
            <div className="rounded-2xl border border-white/10 bg-[#0A1020] p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-400">
                    Daily Goal
                  </p>

                  <p className="mt-1 text-lg font-bold">
                    35 min
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/10">
                  <Target
                    size={19}
                    className="text-cyan-400"
                  />
                </div>
              </div>

              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  initial={{
                    width: 0,
                  }}
                  animate={{
                    width: "65%",
                  }}
                  transition={{
                    duration: 1,
                  }}
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                />
              </div>

              <p className="mt-2 text-[10px] text-slate-600">
                23 minutes remaining
              </p>
            </div>

            {/* PRO */}
            <Link
              href="/pro"
              className="mt-3 block rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5 transition hover:border-blue-400/40 hover:bg-blue-500/10"
            >
              <div className="flex items-center gap-2">
                <Sparkles
                  size={17}
                  className="text-cyan-400"
                />

                <span className="text-sm font-semibold">
                  NMAI Pro
                </span>
              </div>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                Unlock premium courses, AI tools and advanced learning paths.
              </p>

              <div className="mt-3 flex items-center gap-1 text-xs font-medium text-blue-400">
                Upgrade
                <ArrowRight size={13} />
              </div>
            </Link>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <div className="lg:pl-[270px]">
        {/* TOP BAR */}
        <header className="hidden h-20 items-center justify-between border-b border-white/10 bg-[#05070D]/70 px-8 backdrop-blur-xl lg:flex">
          <div className="relative w-full max-w-xl">
            <Search
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search courses..."
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500/40"
            />
          </div>

          <div className="ml-6 flex items-center gap-4">
            <ThemeToggle />
            <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-500 transition hover:text-white">
              <Bell size={18} />

              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-cyan-400" />
            </button>

            <div className="flex items-center gap-3 border-l border-white/10 pl-5">
              <div className="text-right">
                <p className="text-sm font-medium">
                  Kranthi
                </p>

                <p className="text-[10px] text-slate-600">
                  Learner
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-400/30 bg-blue-500/10 text-sm font-semibold">
                K
              </div>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <div className="px-5 pb-12 pt-24 lg:px-8 lg:pt-10">
          {/* HERO */}
          <section className="mb-10">
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
            >
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
                Your Learning Hub
              </p>

              <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    My Courses
                  </h1>

                  <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                    Learn practical skills, build real systems and grow with
                    NMAI.
                  </p>
                </div>

                <Link
                  href="/learning-paths"
                  className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
                >
                  Explore Learning Paths
                  <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>
          </section>

          {/* LAUNCH NOTICE */}
          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.15,
            }}
            className="mb-7 flex flex-col gap-4 rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.03] p-5 sm:flex-row sm:items-center"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10">
              <Sparkles
                size={20}
                className="text-cyan-400"
              />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-200">
                NMAI is launching step by step.
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Our first course is available now. More practical courses are
                currently being prepared.
              </p>
            </div>
          </motion.div>

          {/* MOBILE SEARCH */}
          <div className="mb-6 lg:hidden">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
              />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search courses..."
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-600"
              />
            </div>
          </div>

          {/* CATEGORY FILTERS */}
          <div className="mb-7 overflow-x-auto">
            <div className="flex min-w-max gap-2">
              {categories.map(
                (category) => {
                  const active =
                    selectedCategory ===
                    category;

                  return (
                    <button
                      key={category}
                      onClick={() =>
                        setSelectedCategory(
                          category
                        )
                      }
                      className={`rounded-xl px-4 py-2.5 text-xs font-medium transition ${
                        active
                          ? "bg-blue-600 text-white shadow-[0_5px_25px_rgba(0,102,255,.2)]"
                          : "border border-white/10 bg-white/[0.03] text-slate-500 hover:bg-white/[0.06] hover:text-slate-200"
                      }`}
                    >
                      {category}
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {/* COURSE GRID */}
          {filteredCourses.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredCourses.map(
                (course, index) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    index={index}
                  />
                )
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-[#080D17] py-20 text-center">
              <Search
                size={30}
                className="mx-auto text-slate-700"
              />

              <h3 className="mt-4 font-semibold">
                No courses found
              </h3>

              <p className="mt-2 text-sm text-slate-600">
                Try another search or category.
              </p>

              <button
                onClick={() => {
                  setSearch("");
                  setSelectedCategory(
                    "All Courses"
                  );
                }}
                className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold"
              >
                Reset Filters
              </button>
            </div>
          )}

          {/* BOTTOM CTA */}
          <motion.section
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            className="relative mt-12 overflow-hidden rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-600/10 via-[#0A1020] to-cyan-500/5 p-8 sm:p-10"
          >
            <div className="absolute right-0 top-0 h-60 w-60 rounded-full bg-blue-500/10 blur-[100px]" />

            <div className="relative flex flex-col justify-between gap-7 md:flex-row md:items-center">
              <div>
                <div className="mb-3 flex items-center gap-2 text-cyan-400">
                  <Sparkles size={18} />

                  <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                    Start With Network Marketing
                  </span>
                </div>

                <h2 className="text-2xl font-bold sm:text-3xl">
                  Your NMAI journey starts here.
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                  Master modern network marketing, retailing, content and
                  business systems with our first course.
                </p>
              </div>

              <Link
                href="/courses/network-marketing"
                className="inline-flex w-fit shrink-0 items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-slate-200"
              >
                Explore Course
                <ArrowRight size={17} />
              </Link>
            </div>
          </motion.section>
        </div>
      </div>
    </main>
  );
}