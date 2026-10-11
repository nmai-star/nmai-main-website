"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "../components/ThemeToggle";
import SignOutButton from "../components/SignOutButton";
import { getAiTools } from "../data/aiToolsData";
import { hasAnyCourseAccess } from "../data/enrolledStudents";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  Check,
  ChevronRight,
  Copy,
  Crown,
  ExternalLink,
  Filter,
  GraduationCap,
  HelpCircle,
  Image as ImageIcon,
  Layers,
  LayoutDashboard,
  Lock,
  Mic,
  Search,
  ShieldAlert,
  Sparkles,
  Terminal,
  Video,
  Wand2,
  Workflow,
  Zap,
  Menu,
  X,
  Compass,
  MessageCircle,
  BarChart3,
  Settings,
} from "lucide-react";

type AITool = {
  id: string;
  name: string;
  category: "Gemini Gems" | "Text & Reasoning" | "Video & Avatars" | "Image & Creative" | "Voice & Audio" | "Automation & Agents" | "Productivity";
  pricing: "Free" | "Freemium" | "Paid";
  rating: number;
  description: string;
  bestFor: string;
  website: string;
  iconBg: string;
  iconColor: string;
  promptExample: string;
  practicalWorkflow: string;
  tags: string[];
};

const aiTools: AITool[] = [
  {
    id: "custom-gemini-gem-1",
    name: "NMAI Sales Objection Mentor",
    category: "Gemini Gems",
    pricing: "Free",
    rating: 5.0,
    description: "Custom-trained Gemini assistant created specifically for NMAI. Pre-configured with specialized instructions, conversation frameworks, and practical business knowledge.",
    bestFor: "Personalized course guidance, objection handling, sales scripts & direct student support",
    website: "https://gemini.google.com/gem/16HfUl9hwpduJh9TIkPFJ171ZU-2n8-68?usp=sharing",
    iconBg: "bg-gradient-to-tr from-blue-500/20 via-purple-500/20 to-cyan-400/20",
    iconColor: "text-cyan-300",
    promptExample: "Help me practice handling customer objections using the NMAI conversation system.",
    practicalWorkflow: "Click Launch Gem -> Opens directly in Google Gemini -> Start asking questions with preloaded knowledge.",
    tags: ["Gemini Gem", "Custom AI", "Google Gemini", "NMAI Exclusive"],
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    category: "Text & Reasoning",
    pricing: "Freemium",
    rating: 4.9,
    description: "Industry-standard conversational AI for copywriting, business strategy, curriculum planning, and problem solving.",
    bestFor: "Content creation, lesson scripts, customer emails & sales scripts",
    website: "https://chatgpt.com",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-400",
    promptExample: "Act as an expert digital educator. Create a 5-day email onboarding sequence for new students joining our online business course, focusing on building high confidence and immediate action.",
    practicalWorkflow: "Use ChatGPT to draft lesson scripts -> Refine tone -> Generate quiz questions for each module.",
    tags: ["OpenAI", "Copywriting", "GPT-4o", "Scripts"],
  },
  {
    id: "claude",
    name: "Claude 3.7 Sonnet",
    category: "Text & Reasoning",
    pricing: "Freemium",
    rating: 4.9,
    description: "Anthropic's flagship model known for nuanced writing, deep reasoning, long document analysis, and high-accuracy code.",
    bestFor: "Complex course architectures, analytical business reviews, and human-sounding longform writing",
    website: "https://claude.ai",
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-400",
    promptExample: "Review this 4-module network marketing course outline. Analyze it for student drop-off risks and suggest 3 interactive exercises that reinforce active retailing.",
    practicalWorkflow: "Upload PDF slides or ebooks into Claude -> Ask it to summarize into bite-sized actionable cheat sheets.",
    tags: ["Anthropic", "Analysis", "Deep Thinking", "Education"],
  },
  {
    id: "perplexity",
    name: "Perplexity AI",
    category: "Text & Reasoning",
    pricing: "Freemium",
    rating: 4.8,
    description: "Real-time AI search engine that delivers cited research, market competitor breakdowns, and verifiable sources.",
    bestFor: "Fact-checking, finding market trends, and industry research with links",
    website: "https://perplexity.ai",
    iconBg: "bg-cyan-500/10",
    iconColor: "text-cyan-400",
    promptExample: "What are the top 5 emerging consumer product retailing trends in 2026? Provide statistics and credible sources.",
    practicalWorkflow: "Research course topics on Perplexity -> Extract verified facts -> Insert citations directly into your lessons.",
    tags: ["Search", "Research", "Real-time", "Citations"],
  },
  {
    id: "heygen",
    name: "HeyGen",
    category: "Video & Avatars",
    pricing: "Freemium",
    rating: 4.8,
    description: "Create studio-quality video lessons using photorealistic AI avatars and automatic voice translation in 40+ languages.",
    bestFor: "Course video lessons, multilingual outreach, and instructor avatars without expensive camera gear",
    website: "https://heygen.com",
    iconBg: "bg-purple-500/10",
    iconColor: "text-purple-400",
    promptExample: "Select an executive avatar -> Paste your lesson script -> Translate to Spanish, Hindi, or French with lip-sync matching.",
    practicalWorkflow: "Write course script in Claude -> Paste into HeyGen -> Export 1080p lesson video directly for your student portal.",
    tags: ["Avatars", "Video AI", "Multilingual", "No Camera"],
  },
  {
    id: "runway",
    name: "Runway Gen-3",
    category: "Video & Avatars",
    pricing: "Freemium",
    rating: 4.7,
    description: "Next-generation video creation engine turning text prompts and static images into cinematic B-roll and trailers.",
    bestFor: "High-impact course intro trailers, promotional video ads, and dynamic background motion",
    website: "https://runwayml.com",
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-400",
    promptExample: "Cinematic drone shot soaring over modern digital entrepreneurs working in a futuristic glass coworking space, golden hour lighting, 4k.",
    practicalWorkflow: "Generate course concept art in Midjourney -> Animate in Runway Gen-3 -> Use as course module intro video.",
    tags: ["Text-to-Video", "B-Roll", "Cinematic", "Motion"],
  },
  {
    id: "midjourney",
    name: "Midjourney v6",
    category: "Image & Creative",
    pricing: "Paid",
    rating: 4.9,
    description: "The gold standard AI image generator for stunning course covers, concept art, and high-converting marketing thumbnails.",
    bestFor: "Course card visuals, website banners, social post graphics, and brand imagery",
    website: "https://midjourney.com",
    iconBg: "bg-indigo-500/10",
    iconColor: "text-indigo-400",
    promptExample: "/imagine modern digital marketing command center with glowing holographic charts, ultra-clean UI, cyber navy and cyan tones --ar 16:9 --v 6.0",
    practicalWorkflow: "Generate high-resolution thumbnails for your lessons -> Upscale -> Place in NMAI course catalog.",
    tags: ["Image AI", "Cover Art", "Photorealistic", "Design"],
  },
  {
    id: "canva-magic",
    name: "Canva Magic Studio",
    category: "Image & Creative",
    pricing: "Freemium",
    rating: 4.7,
    description: "Suite of AI tools inside Canva for instant slide deck generation, background removal, and brand asset resizing.",
    bestFor: "Fast presentation slides, downloadable student worksheets, and Instagram carousels",
    website: "https://canva.com",
    iconBg: "bg-pink-500/10",
    iconColor: "text-pink-400",
    promptExample: "Generate a 10-slide presentation deck on 'Modern Customer Conversations for Network Marketers' with a dark sleek theme.",
    practicalWorkflow: "Generate slides with Canva Magic -> Export as PDF -> Attach as downloadable course resource.",
    tags: ["Presentations", "Worksheets", "Social", "Templates"],
  },
  {
    id: "elevenlabs",
    name: "ElevenLabs",
    category: "Voice & Audio",
    pricing: "Freemium",
    rating: 4.9,
    description: "The world's leading generative AI voice platform with ultra-realistic voice cloning and emotional cadence control.",
    bestFor: "Professional voiceovers for video lessons, audio summaries, and multilingual course dubbing",
    website: "https://elevenlabs.io",
    iconBg: "bg-rose-500/10",
    iconColor: "text-rose-400",
    promptExample: "Record 1 minute of your voice -> Clone your voice profile -> Generate crystal-clear audio lessons without a microphone.",
    practicalWorkflow: "Generate narration in ElevenLabs -> Combine with screen recordings or slides for polished course content.",
    tags: ["Voice Clone", "Audio", "Narration", "Dubbing"],
  },
  {
    id: "make",
    name: "Make.com (Integromat)",
    category: "Automation & Agents",
    pricing: "Freemium",
    rating: 4.8,
    description: "Visual workflow automation platform to connect your landing pages, databases, AI models, and communication channels.",
    bestFor: "Automated student welcome sequences, WhatsApp lead follow-ups, and CRM lead capture",
    website: "https://make.com",
    iconBg: "bg-violet-500/10",
    iconColor: "text-violet-400",
    promptExample: "Webhook: New student sign-up -> Send ChatGPT personalized welcome message -> Notify instructor on Telegram -> Add row to Google Sheet.",
    practicalWorkflow: "Create a 3-step automation: Form Submit -> AI categorization -> Instant WhatsApp message.",
    tags: ["Workflows", "No-code", "Webhooks", "Integrations"],
  },
  {
    id: "notion-ai",
    name: "Notion AI",
    category: "Productivity",
    pricing: "Freemium",
    rating: 4.7,
    description: "Connected workspace with built-in AI for curriculum planning, student resource wikis, and project management.",
    bestFor: "Organizing your courses, tracking lesson production, and generating student resource docs",
    website: "https://notion.so",
    iconBg: "bg-slate-500/10",
    iconColor: "text-slate-300",
    promptExample: "Summarize this page into 5 key bullet points and create a checklist of action items for a beginner student.",
    practicalWorkflow: "Manage your entire NMAI course pipeline, lesson scripts, and student FAQs in one shared AI workspace.",
    tags: ["Workspace", "Wiki", "Project Management", "Notes"],
  },
];

const categories = [
  "All",
  "Gemini Gems",
  "Text & Reasoning",
  "Video & Avatars",
  "Image & Creative",
  "Voice & Audio",
  "Automation & Agents",
  "Productivity",
] as const;

export default function AIToolsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedPricing, setSelectedPricing] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);
  const [expandedTipId, setExpandedTipId] = useState<string | null>(null);
  const [mobileMenu, setMobileMenu] = useState<boolean>(false);
  const [currentUserEmail, setCurrentUserEmail] = useState<string>("");
  const [isEnrolled, setIsEnrolled] = useState<boolean>(false);
  const [lockedModalOpen, setLockedModalOpen] = useState<boolean>(false);
  const [communityLockedModalOpen, setCommunityLockedModalOpen] = useState<boolean>(false);

  const [toolsList, setToolsList] = useState<AITool[]>(aiTools);

  useEffect(() => {
    setToolsList(getAiTools());

    const evaluateEnrollment = () => {
      try {
        const sessionRaw = localStorage.getItem("nmai-student-session");
        if (sessionRaw) {
          const session = JSON.parse(sessionRaw);
          if (session && session.email) {
            setCurrentUserEmail(session.email);
            setIsEnrolled(hasAnyCourseAccess(session.email));
            return;
          }
        }
      } catch {}
      setIsEnrolled(false);
      setCurrentUserEmail("");
    };

    evaluateEnrollment();
    window.addEventListener("storage", evaluateEnrollment);
    window.addEventListener("nmai-student-updated", evaluateEnrollment);
    return () => {
      window.removeEventListener("storage", evaluateEnrollment);
      window.removeEventListener("nmai-student-updated", evaluateEnrollment);
    };
  }, []);

  // Filtered tools
  const filteredTools = useMemo(() => {
    return toolsList.filter((tool) => {
      const matchesCategory =
        selectedCategory === "All" || tool.category === selectedCategory;
      const matchesPricing =
        selectedPricing === "All" || tool.pricing === selectedPricing;
      const matchesSearch =
        searchQuery.trim() === "" ||
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.bestFor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );

      return matchesCategory && matchesPricing && matchesSearch;
    });
  }, [selectedCategory, selectedPricing, searchQuery]);

  const handleCopyPrompt = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPromptId(id);
    setTimeout(() => {
      setCopiedPromptId(null);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#05070D] text-slate-100 selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* =====================================================
          DESKTOP SIDEBAR
      ===================================================== */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-[250px] lg:flex-col lg:border-r lg:border-white/[0.06] lg:bg-[#05070D]/95 lg:backdrop-blur-xl">
        <div className="flex h-[72px] items-center gap-3 border-b border-white/[0.06] px-6">
          <Link href="/" className="flex items-center">
            <img
              src="/nmai-logo.png"
              alt="NMAI"
              className="h-10 w-auto object-contain"
            />
          </Link>
        </div>

        <div className="flex flex-1 flex-col justify-between overflow-y-auto px-4 py-6">
          <div className="space-y-6">
            <div>
              <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600">
                Menu
              </p>
              <nav className="space-y-1">
                <Link
                  href="/"
                  className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 transition hover:bg-white/[0.04] hover:text-white"
                >
                  <LayoutDashboard size={18} className="text-slate-500 group-hover:text-cyan-300" />
                  Dashboard
                </Link>

                <Link
                  href="/courses/network-marketing"
                  className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 transition hover:bg-white/[0.04] hover:text-white"
                >
                  <GraduationCap size={18} className="text-slate-500 group-hover:text-cyan-300" />
                  Courses
                </Link>

                <Link
                  href="/learning-paths"
                  className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 transition hover:bg-white/[0.04] hover:text-white"
                >
                  <Compass size={18} className="text-slate-500 group-hover:text-cyan-300" />
                  Learning Paths
                </Link>

                <Link
                  href="/ai-tools"
                  className="flex items-center gap-3 rounded-xl border border-cyan-400/20 bg-cyan-400/[0.08] px-3 py-2.5 text-sm font-semibold text-cyan-300 shadow-sm"
                >
                  <Bot size={18} className="text-cyan-300" />
                  AI Tools
                </Link>

                {isEnrolled ? (
                  <a
                    href="https://chat.whatsapp.com/CjZKNudezQp46MRqsUOTBR"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 transition hover:bg-white/[0.04] hover:text-white"
                  >
                    <MessageCircle size={18} className="text-slate-500 group-hover:text-cyan-300" />
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
              </nav>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-500/20 bg-gradient-to-b from-blue-500/[0.08] to-transparent p-4">
            <div className="flex items-center gap-2 text-cyan-300">
              <Crown size={17} />
              <span className="text-sm font-semibold text-white">NMAI Pro</span>
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-400">
              Unlock prompt templates, AI workflows and future masterclasses.
            </p>
            <Link
              href="/"
              className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-500"
            >
              Explore Pro
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </aside>

      {/* =====================================================
          MAIN VIEWPORT
      ===================================================== */}
      <main className="lg:pl-[250px]">
        {/* TOPBAR */}
        <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#05070D]/90 backdrop-blur-xl">
          <div className="flex h-[72px] items-center justify-between px-4 md:px-7">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileMenu(true)}
                className="rounded-xl border border-white/10 p-2 text-slate-300 hover:bg-white/5 lg:hidden"
                aria-label="Open mobile menu"
              >
                <Menu size={18} />
              </button>

              <div className="flex items-center gap-2">
                <Link
                  href="/"
                  className="hidden items-center gap-1.5 text-xs text-slate-400 transition hover:text-white sm:flex"
                >
                  <ArrowLeft size={14} />
                  Dashboard
                </Link>
                <span className="hidden text-slate-600 sm:inline">/</span>
                <span className="text-sm font-semibold text-white">AI Tools Directory</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link
                href="/courses/network-marketing"
                className="hidden rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs font-medium text-slate-300 transition hover:bg-white/[0.06] sm:flex items-center gap-2"
              >
                <GraduationCap size={15} />
                My Courses
              </Link>
              <Link
                href="/login"
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-cyan-400/30 hover:text-white"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 text-[10px] font-bold text-white shadow-sm">
                  K
                </div>
                <span className="hidden sm:inline">Student Account</span>
              </Link>
              <SignOutButton />
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div className="mx-auto max-w-[1450px] px-4 py-8 md:px-7">
          {/* FREE MEMBER NOTICE BANNER */}
          {currentUserEmail && !isEnrolled && (
            <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-4 sm:flex-row sm:items-center sm:justify-between shadow-lg shadow-amber-500/5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-400">
                  <Lock size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    Free Member Account • Proprietary AI Mentors Locked
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    You can explore public tools and workflows below. Proprietary NMAI AI Mentors and course materials are reserved for paid enrolled students.
                  </p>
                </div>
              </div>
              <a
                href="https://wa.me/919177187024?text=Hello%20Admin,%20I%20would%20like%20to%20purchase%20course%20access%20on%20NMAI."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-emerald-500/20 hover:brightness-110 transition"
              >
                <MessageCircle size={14} />
                Contact Admin to Purchase
              </a>
            </div>
          )}

          {/* HERO BANNER */}
          <div className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-[#080D17] p-6 md:p-9">
            <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -left-20 -bottom-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

            <div className="relative max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.06] px-3.5 py-1.5 text-xs font-semibold text-cyan-300">
                <Wand2 size={13} />
                Curated AI Toolkit
              </div>

              <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white md:text-5xl">
                Master the Best{" "}
                <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  AI Tools & Workflows
                </span>
              </h1>

              <p className="mt-4 text-sm leading-7 text-slate-400 md:text-base">
                Discover the highest-leverage AI tools for creators, educators, and network marketers.
                Copy proven prompt formulas, understand real-world workflows, and boost your daily productivity.
              </p>

              {/* SEARCH BAR */}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <Search
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by tool name, use case (e.g. video, copy, slides)..."
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 transition focus:border-cyan-400/40 focus:bg-white/[0.07] focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-500 hover:text-white"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Pricing:</span>
                  {(["All", "Free", "Freemium", "Paid"] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setSelectedPricing(p)}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                        selectedPricing === p
                          ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-300"
                          : "border-white/[0.07] bg-white/[0.02] text-slate-400 hover:text-white"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* CATEGORY FILTER PILLS */}
          <div className="mt-8 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => {
              const count =
                cat === "All"
                  ? aiTools.length
                  : aiTools.filter((t) => t.category === cat).length;

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold transition ${
                    selectedCategory === cat
                      ? "border-blue-500/30 bg-blue-500/15 text-cyan-300 shadow-md shadow-blue-500/10"
                      : "border-white/[0.07] bg-white/[0.02] text-slate-400 hover:border-white/15 hover:bg-white/[0.05] hover:text-white"
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] ${
                      selectedCategory === cat
                        ? "bg-cyan-400/20 text-cyan-300"
                        : "bg-white/[0.06] text-slate-500"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* TOOLS GRID */}
          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence>
              {filteredTools.map((tool, index) => (
                <motion.div
                  key={tool.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, delay: index * 0.04 }}
                  className="group flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#080D17] p-6 transition hover:border-cyan-400/30 hover:shadow-2xl hover:shadow-cyan-500/10"
                >
                  <div>
                    {/* CARD HEADER */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${tool.iconBg} ${tool.iconColor} border border-white/[0.06]`}
                        >
                          {tool.category === "Gemini Gems" && <Sparkles size={22} className="text-cyan-300" />}
                          {tool.category === "Text & Reasoning" && <Bot size={22} />}
                          {tool.category === "Video & Avatars" && <Video size={22} />}
                          {tool.category === "Image & Creative" && <ImageIcon size={22} />}
                          {tool.category === "Voice & Audio" && <Mic size={22} />}
                          {tool.category === "Automation & Agents" && <Workflow size={22} />}
                          {tool.category === "Productivity" && <Layers size={22} />}
                        </div>

                        <div>
                          <h3 className="text-lg font-bold text-white transition group-hover:text-cyan-300">
                            {tool.name}
                          </h3>
                          <span className="text-xs font-medium text-slate-500">
                            {tool.category}
                          </span>
                        </div>
                      </div>

                      {tool.id === "custom-gemini-gem-1" && !isEnrolled ? (
                        <span className="flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/15 px-2.5 py-1 text-[10px] font-bold tracking-wider text-amber-300">
                          <Lock size={10} />
                          Enrolled Only
                        </span>
                      ) : (
                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                            tool.pricing === "Free"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : tool.pricing === "Freemium"
                              ? "bg-blue-500/10 text-blue-300 border border-blue-500/20"
                              : "bg-purple-500/10 text-purple-300 border border-purple-500/20"
                          }`}
                        >
                          {tool.pricing}
                        </span>
                      )}
                    </div>

                    {/* DESCRIPTION */}
                    <p className="mt-4 text-xs leading-5 text-slate-400">
                      {tool.description}
                    </p>

                    {/* BEST FOR BADGE */}
                    <div className="mt-3.5 rounded-xl border border-white/[0.05] bg-white/[0.02] p-2.5">
                      <p className="text-[11px] font-medium text-slate-500">
                        <span className="font-semibold text-slate-300">Best for: </span>
                        {tool.bestFor}
                      </p>
                    </div>

                    {/* TAGS */}
                    <div className="mt-3.5 flex flex-wrap gap-1.5">
                      {tool.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md bg-white/[0.03] px-2 py-0.5 text-[10px] text-slate-400 border border-white/[0.04]"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* ACCORDION WORKFLOW & PROMPT */}
                    <div className="mt-4 border-t border-white/[0.06] pt-3">
                      <button
                        onClick={() =>
                          setExpandedTipId(expandedTipId === tool.id ? null : tool.id)
                        }
                        className="flex w-full items-center justify-between text-xs font-semibold text-cyan-300 hover:text-cyan-200"
                      >
                        <span className="flex items-center gap-1.5">
                          <Terminal size={14} />
                          {expandedTipId === tool.id
                            ? "Hide Workflow & Prompt"
                            : "View Actionable Prompt"}
                        </span>
                        <ChevronRight
                          size={14}
                          className={`transition-transform ${
                            expandedTipId === tool.id ? "rotate-90" : ""
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {expandedTipId === tool.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-3 rounded-xl border border-cyan-400/20 bg-[#040810] p-3 text-xs">
                              <p className="font-semibold text-cyan-300">
                                💡 Practical Workflow:
                              </p>
                              <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
                                {tool.practicalWorkflow}
                              </p>

                              <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2">
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                                  Sample Prompt
                                </span>
                                <button
                                  onClick={() =>
                                    handleCopyPrompt(tool.id, tool.promptExample)
                                  }
                                  className="flex items-center gap-1 rounded bg-white/5 px-2 py-1 text-[10px] font-semibold text-slate-300 hover:bg-white/10 hover:text-white"
                                >
                                  {copiedPromptId === tool.id ? (
                                    <>
                                      <Check size={11} className="text-emerald-400" />
                                      <span className="text-emerald-400">Copied!</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy size={11} />
                                      <span>Copy</span>
                                    </>
                                  )}
                                </button>
                              </div>

                              <pre className="mt-1.5 max-h-24 overflow-y-auto whitespace-pre-wrap rounded-lg bg-black/40 p-2 font-mono text-[11px] text-slate-300">
                                {tool.promptExample}
                              </pre>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* ACTION LINKS */}
                  <div className="mt-5 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                    <button
                      onClick={() =>
                        handleCopyPrompt(tool.id, tool.promptExample)
                      }
                      className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
                    >
                      {copiedPromptId === tool.id ? (
                        <>
                          <Check size={13} className="text-emerald-400" />
                          <span className="text-emerald-400 font-medium">Prompt Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={13} />
                          <span>Copy Prompt</span>
                        </>
                      )}
                    </button>

                    {tool.id === "custom-gemini-gem-1" && !isEnrolled ? (
                      <button
                        onClick={() => setLockedModalOpen(true)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-2 text-xs font-semibold text-amber-300 transition hover:bg-amber-500/20"
                      >
                        <Lock size={13} />
                        Locked • Enrolled Only
                      </button>
                    ) : (
                      <a
                        href={tool.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-blue-500"
                      >
                        Launch Tool
                        <ExternalLink size={13} />
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredTools.length === 0 && (
            <div className="mt-12 rounded-3xl border border-white/[0.07] bg-[#080D17] p-12 text-center">
              <Bot size={40} className="mx-auto text-slate-600" />
              <h3 className="mt-4 text-base font-bold text-white">No AI Tools Match Your Filter</h3>
              <p className="mt-2 text-xs text-slate-500">
                Try clearing your search query or selecting "All" categories.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                  setSelectedPricing("All");
                }}
                className="mt-4 rounded-xl bg-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/15"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </main>

      {/* =====================================================
          MOBILE SLIDEOUT MENU
      ===================================================== */}
      <AnimatePresence>
        {mobileMenu && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenu(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative flex h-full w-[280px] flex-col border-r border-white/10 bg-[#05070D] p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 text-white">
                    <Sparkles size={16} />
                  </div>
                  <span className="font-bold text-white">NMAI</span>
                </div>
                <div className="flex items-center gap-2">
                  <ThemeToggle />
                  <button
                    onClick={() => setMobileMenu(false)}
                    className="rounded-lg p-1.5 text-slate-400 hover:text-white"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              <nav className="mt-6 space-y-1.5">
                <Link
                  href="/"
                  onClick={() => setMobileMenu(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-300 hover:bg-white/5"
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>
                <Link
                  href="/courses/network-marketing"
                  onClick={() => setMobileMenu(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-300 hover:bg-white/5"
                >
                  <GraduationCap size={18} />
                  Courses
                </Link>
                <Link
                  href="/learning-paths"
                  onClick={() => setMobileMenu(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-300 hover:bg-white/5"
                >
                  <Compass size={18} />
                  Learning Paths
                </Link>
                <Link
                  href="/ai-tools"
                  onClick={() => setMobileMenu(false)}
                  className="flex items-center gap-3 rounded-xl bg-cyan-400/10 px-3 py-2.5 text-sm font-semibold text-cyan-300"
                >
                  <Bot size={18} />
                  AI Tools
                </Link>
                {isEnrolled ? (
                  <a
                    href="https://chat.whatsapp.com/CjZKNudezQp46MRqsUOTBR"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-300 hover:bg-white/5"
                  >
                    <MessageCircle size={18} />
                    Community
                  </a>
                ) : (
                  <button
                    onClick={() => {
                      setMobileMenu(false);
                      setCommunityLockedModalOpen(true);
                    }}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm text-slate-500 hover:bg-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <MessageCircle size={18} />
                      <span>Community</span>
                    </div>
                    <span className="flex items-center gap-1 rounded bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-bold text-amber-400 border border-amber-500/20">
                      <Lock size={9} />
                      Locked
                    </span>
                  </button>
                )}
              </nav>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ACCESS LOCKED MODAL */}
      <AnimatePresence>
        {lockedModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLockedModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-md rounded-3xl border border-amber-500/30 bg-[#090E1A] p-7 text-center shadow-2xl backdrop-blur-2xl"
            >
              <button
                onClick={() => setLockedModalOpen(false)}
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
                  Enrolled Students Only • Paid Access
                </span>
              </div>

              <h2 className="mt-3 text-xl font-bold text-white">
                NMAI Sales Objection Mentor
              </h2>

              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                This custom-trained Google Gemini mentor is pre-configured with proprietary NMAI frameworks. Free accounts cannot access proprietary AI mentors for free.
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
                  href="https://wa.me/919177187024?text=Hello%20Admin,%20I%20would%20like%20to%20purchase%20course%20access%20on%20NMAI."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 font-semibold text-xs text-white shadow-lg shadow-emerald-500/20 hover:brightness-110 transition"
                >
                  <MessageCircle size={15} />
                  Contact Admin on WhatsApp to Purchase
                </a>

                <button
                  onClick={() => setLockedModalOpen(false)}
                  className="flex h-10 w-full items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-xs font-semibold text-slate-300 hover:bg-white/[0.08] transition"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
