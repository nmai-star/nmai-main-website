"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  KeyRound,
  Lock,
  Unlock,
  Users,
  UserPlus,
  UserCheck,
  UserX,
  Search,
  Trash2,
  Edit3,
  Check,
  Copy,
  Download,
  Upload,
  RefreshCw,
  Plus,
  ExternalLink,
  Bot,
  BookOpen,
  Settings,
  Bell,
  Sparkles,
  MessageCircle,
  AlertCircle,
  LogOut,
  ArrowLeft,
  GraduationCap,
  Save,
  CheckCircle2,
  FileText,
  Eye,
  EyeOff,
} from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";
import {
  getAllStudents,
  saveAllStudents,
  addEnrolledStudent,
  updateStudent,
  toggleStudentStatus,
  deleteStudent,
  bulkAddStudents,
  resetStudentsToDefault,
  updateStudentCourseAccess,
  formatCoursesSummary,
  EnrolledStudent,
} from "../data/enrolledStudents";
import {
  getWebsiteConfig,
  saveWebsiteConfig,
  verifyAdminPasskey,
  WebsiteConfig,
} from "../data/websiteConfig";
import {
  getCourses,
  saveCourses,
  updateCourse,
  toggleCourseAvailability,
  addCourse,
  deleteCourse,
  CourseItem,
} from "../data/coursesData";
import {
  getAiTools,
  saveAiTools,
  addAiTool,
  updateAiTool,
  deleteAiTool,
  AITool,
} from "../data/aiToolsData";

type AdminTab = "students" | "courses" | "tools" | "settings";

export default function AdminPortalPage() {
  const router = useRouter();

  // Admin Auth State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [passkeyInput, setPasskeyInput] = useState<string>("");
  const [showSettingsPasskey, setShowSettingsPasskey] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>("");
  const [activeTab, setActiveTab] = useState<AdminTab>("students");
  const [toastMessage, setToastMessage] = useState<string>("");

  // Data states
  const [students, setStudents] = useState<EnrolledStudent[]>([]);
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [aiTools, setAiTools] = useState<AITool[]>([]);
  const [config, setConfig] = useState<WebsiteConfig>(getWebsiteConfig());

  // Student Manager Filters & Modals
  const [studentSearch, setStudentSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "suspended">("all");
  const [showAddStudentModal, setShowAddStudentModal] = useState<boolean>(false);
  const [showBulkModal, setShowBulkModal] = useState<boolean>(false);
  const [newStudentEmail, setNewStudentEmail] = useState<string>("");
  const [newStudentName, setNewStudentName] = useState<string>("");
  const [newStudentCourse, setNewStudentCourse] = useState<string>("Network Marketing Success");
  const [newStudentCourses, setNewStudentCourses] = useState<string[]>(["course-nm"]);
  const [bulkEmailsInput, setBulkEmailsInput] = useState<string>("");
  const [bulkCoursesInput, setBulkCoursesInput] = useState<string[]>(["course-nm"]);
  const [editingStudent, setEditingStudent] = useState<EnrolledStudent | null>(null);
  const [managingCoursesStudent, setManagingCoursesStudent] = useState<EnrolledStudent | null>(null);
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);

  // Course Edit Modal
  const [editingCourse, setEditingCourse] = useState<CourseItem | null>(null);
  const [showAddCourseModal, setShowAddCourseModal] = useState<boolean>(false);
  const [newCourseTitle, setNewCourseTitle] = useState<string>("");
  const [newCourseCategory, setNewCourseCategory] = useState<string>("Network Marketing");
  const [newCourseDesc, setNewCourseDesc] = useState<string>("");
  const [newCourseLessons, setNewCourseLessons] = useState<number>(6);
  const [newCourseDuration, setNewCourseDuration] = useState<string>("3h 30m");
  const [newCourseHref, setNewCourseHref] = useState<string>("/courses/network-marketing");

  // AI Tool Edit / Add
  const [showAddToolModal, setShowAddToolModal] = useState<boolean>(false);
  const [newToolName, setNewToolName] = useState<string>("");
  const [newToolCategory, setNewToolCategory] = useState<AITool["category"]>("Gemini Gems");
  const [newToolPricing, setNewToolPricing] = useState<"Free" | "Freemium" | "Paid">("Free");
  const [newToolUrl, setNewToolUrl] = useState<string>("");
  const [newToolDesc, setNewToolDesc] = useState<string>("");
  const [newToolBestFor, setNewToolBestFor] = useState<string>("");
  const [newToolWorkflow, setNewToolWorkflow] = useState<string>("");

  // Check existing admin session on mount
  useEffect(() => {
    try {
      const sessionRaw = localStorage.getItem("nmai-admin-session");
      if (sessionRaw) {
        const parsed = JSON.parse(sessionRaw);
        if (parsed && parsed.authorized === true) {
          setIsAdminAuthenticated(true);
        }
      }
    } catch {}
    loadAllData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const loadAllData = () => {
    setStudents(getAllStudents());
    setCourses(getCourses());
    setAiTools(getAiTools());
    setConfig(getWebsiteConfig());
  };

  // Handle Admin Login
  const handleAdminLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthError("");

    if (!passkeyInput.trim()) {
      setAuthError("Please enter the Admin Master Passkey.");
      return;
    }

    if (verifyAdminPasskey(passkeyInput)) {
      const session = {
        authorized: true,
        role: "super-admin",
        loginTime: new Date().toISOString(),
      };
      localStorage.setItem("nmai-admin-session", JSON.stringify(session));
      setIsAdminAuthenticated(true);
      loadAllData();
      showToast("Welcome to NMAI Admin Portal! Full administrative access unlocked.");
    } else {
      setAuthError("Incorrect Admin Master Passkey. Access is strictly restricted to the site owner.");
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem("nmai-admin-session");
    setIsAdminAuthenticated(false);
    setPasskeyInput("");
    showToast("Admin session ended. Portal locked.");
  };

  // ================= STUDENT ACTIONS =================
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch =
        s.email.toLowerCase().includes(studentSearch.toLowerCase()) ||
        s.name.toLowerCase().includes(studentSearch.toLowerCase());
      const matchesStatus =
        statusFilter === "all" ? true : s.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [students, studentSearch, statusFilter]);

  const handleOpenManageCourses = (student: EnrolledStudent) => {
    setManagingCoursesStudent(student);
    const initial = Array.isArray(student.enrolledCourses)
      ? [...student.enrolledCourses]
      : student.enrolledCourse && student.enrolledCourse.toLowerCase().includes("all access")
      ? ["*"]
      : ["course-nm"];
    setSelectedCourseIds(initial);
  };

  const handleToggleCourseSelection = (courseId: string) => {
    if (courseId === "*") {
      if (selectedCourseIds.includes("*")) {
        setSelectedCourseIds([]);
      } else {
        setSelectedCourseIds(["*"]);
      }
      return;
    }

    let updated = selectedCourseIds.filter((id) => id !== "*");
    if (updated.includes(courseId)) {
      updated = updated.filter((id) => id !== courseId);
    } else {
      updated.push(courseId);
    }
    setSelectedCourseIds(updated);
  };

  const handleSaveCourseAccess = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!managingCoursesStudent) return;

    const finalCourses = [...selectedCourseIds];
    updateStudentCourseAccess(managingCoursesStudent.id, finalCourses, managingCoursesStudent.email);
    setStudents(getAllStudents());
    showToast(`Course access updated for ${managingCoursesStudent.name}!`);
    setManagingCoursesStudent(null);
  };

  const handleAddSingleStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentEmail.trim() || !newStudentEmail.includes("@")) {
      alert("Please enter a valid student Gmail / email address.");
      return;
    }

    const assigned = [...newStudentCourses];
    addEnrolledStudent(newStudentEmail, newStudentName, assigned);
    setStudents(getAllStudents());
    setNewStudentEmail("");
    setNewStudentName("");
    setNewStudentCourses(["course-nm"]);
    setShowAddStudentModal(false);
    showToast(`Access granted! "${newStudentEmail.trim().toLowerCase()}" can now log in to NMAI.`);
  };

  const handleBulkEnroll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkEmailsInput.trim()) {
      alert("Please paste at least one email address.");
      return;
    }

    const assignedSummary = formatCoursesSummary(bulkCoursesInput);
    const res = bulkAddStudents(bulkEmailsInput, assignedSummary);
    // update all with the specific courses
    const all = getAllStudents();
    for (const st of all) {
      if (!st.enrolledCourses || st.enrolledCourses.length === 0) {
        st.enrolledCourses = bulkCoursesInput;
      }
    }
    saveAllStudents(all);
    setStudents(getAllStudents());
    setBulkEmailsInput("");
    setShowBulkModal(false);
    showToast(`Bulk access updated! ${res.added} new students added with course access.`);
  };

  const handleToggleStatus = (id: string, name: string) => {
    const newStatus = toggleStudentStatus(id);
    setStudents(getAllStudents());
    if (newStatus === "suspended") {
      showToast(`Access suspended for ${name}. They are now blocked from logging in.`);
    } else {
      showToast(`Access reactivated for ${name}. They can now log in.`);
    }
  };

  const handleDeleteStudent = (id: string, email: string) => {
    if (window.confirm(`Are you sure you want to permanently revoke access for "${email}"? They will no longer be able to open the student portal.`)) {
      deleteStudent(id);
      setStudents(getAllStudents());
      showToast(`Access revoked and removed for ${email}.`);
    }
  };

  const handleSaveEditedStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    updateStudent(editingStudent.id, {
      name: editingStudent.name,
      email: editingStudent.email,
      enrolledCourse: editingStudent.enrolledCourse,
      enrolledCourses: editingStudent.enrolledCourses,
      status: editingStudent.status,
    });
    setStudents(getAllStudents());
    setEditingStudent(null);
    showToast("Student details updated successfully!");
  };

  const handleExportCSV = () => {
    const headers = ["ID", "Name", "Email", "Enrolled Course", "Status", "Enrollment Date"];
    const rows = students.map((s) => [
      s.id,
      `"${s.name.replace(/"/g, '""')}"`,
      s.email,
      `"${s.enrolledCourse.replace(/"/g, '""')}"`,
      s.status,
      s.enrollmentDate,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `nmai_authorized_students_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Student whitelist exported as CSV!");
  };

  const handleResetStudents = () => {
    if (window.confirm("Are you sure you want to reset the student database to default initial seeds? Any custom enrolled students will be reset.")) {
      resetStudentsToDefault();
      setStudents(getAllStudents());
      showToast("Student database reset to default seeds.");
    }
  };

  // ================= COURSE ACTIONS =================
  const handleToggleCourse = (id: string, title: string) => {
    const isNowAvailable = toggleCourseAvailability(id);
    setCourses(getCourses());
    showToast(`"${title}" is now ${isNowAvailable ? "LIVE" : "COMING SOON"} on the main dashboard.`);
  };

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle.trim()) {
      alert("Please enter a course title.");
      return;
    }

    addCourse({
      title: newCourseTitle.trim(),
      category: newCourseCategory,
      description: newCourseDesc.trim() || "Comprehensive learning module on modern digital workflows.",
      lessons: Number(newCourseLessons) || 5,
      duration: newCourseDuration.trim() || "3h 00m",
      progress: 0,
      available: true,
      href: newCourseHref.trim() || "/courses/network-marketing",
      visual: "network",
    });

    setCourses(getCourses());
    setShowAddCourseModal(false);
    setNewCourseTitle("");
    setNewCourseDesc("");
    showToast("New course successfully published!");
  };

  const handleSaveEditedCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;

    updateCourse(editingCourse.id, editingCourse);
    setCourses(getCourses());
    setEditingCourse(null);
    showToast("Course details saved!");
  };

  const handleDeleteCourse = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to remove the course "${title}"?`)) {
      deleteCourse(id);
      setCourses(getCourses());
      showToast(`Course "${title}" removed.`);
    }
  };

  // ================= AI TOOLS & GEMINI GEMS ACTIONS =================
  const handleAddTool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newToolName.trim() || !newToolUrl.trim()) {
      alert("Please enter a tool name and URL.");
      return;
    }

    addAiTool({
      name: newToolName.trim(),
      category: newToolCategory,
      pricing: newToolPricing,
      rating: 5.0,
      description: newToolDesc.trim() || "Custom AI tool integrated with NMAI.",
      bestFor: newToolBestFor.trim() || "General productivity and workflows",
      website: newToolUrl.trim(),
      iconBg: newToolCategory === "Gemini Gems" ? "bg-gradient-to-tr from-blue-500/20 via-purple-500/20 to-cyan-400/20" : "bg-cyan-500/10",
      iconColor: "text-cyan-300",
      promptExample: "Ask this AI tool for guidance or solutions.",
      practicalWorkflow: newToolWorkflow.trim() || "Click Launch -> Open tool -> Use directly for workflows.",
      tags: [newToolCategory, newToolPricing, "NMAI"],
    });

    setAiTools(getAiTools());
    setShowAddToolModal(false);
    setNewToolName("");
    setNewToolUrl("");
    setNewToolDesc("");
    setNewToolBestFor("");
    setNewToolWorkflow("");
    showToast(`New ${newToolCategory} added to the AI Tools Directory!`);
  };

  const handleDeleteTool = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}" from the AI Tools Directory?`)) {
      deleteAiTool(id);
      setAiTools(getAiTools());
      showToast(`"${name}" removed from AI tools.`);
    }
  };

  // ================= SITE SETTINGS ACTIONS =================
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveWebsiteConfig(config);
    showToast("Platform configuration and site broadcast saved successfully!");
  };

  // ================= RENDER: PASSKEY LOCK SCREEN =================
  if (!isAdminAuthenticated) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#04060C] px-4 py-12 text-white">
        {/* Background glow effects */}
        <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-600/15 blur-[120px]" />
        <div className="pointer-events-none absolute bottom-10 right-10 h-80 w-80 rounded-full bg-cyan-500/10 blur-[100px]" />

        {/* Top Navbar */}
        <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs font-medium text-slate-300 transition hover:bg-white/[0.08]"
          >
            <ArrowLeft size={14} />
            Back to Platform
          </Link>
          <ThemeToggle />
        </div>

        {/* Master Auth Card */}
        <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#080D18]/90 p-8 shadow-2xl backdrop-blur-2xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/20 bg-gradient-to-tr from-blue-600/30 to-cyan-400/20 text-cyan-300 shadow-lg shadow-cyan-500/10">
            <Shield size={32} />
          </div>

          <div className="mt-5 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-cyan-300">
              <Lock size={12} />
              Owner & Administrator Portal
            </span>
            <h1 className="mt-3 text-2xl font-bold text-white tracking-tight">
              NMAI Master Control
            </h1>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Strictly restricted area. Enter your Master Admin Passkey to manually grant student access and manage all website information.
            </p>
          </div>

          {authError && (
            <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
              <AlertCircle size={16} className="mt-0.5 shrink-0 text-rose-400" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Master Admin Passkey
              </label>
              <div className="relative mt-2">
                <KeyRound
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  type="password"
                  value={passkeyInput}
                  onChange={(e) => setPasskeyInput(e.target.value)}
                  placeholder="Enter Master Passkey"
                  autoFocus
                  className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-10 pr-4 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-cyan-400/50 focus:bg-white/[0.07]"
                />
              </div>
              <p className="mt-1.5 text-[11px] text-slate-500">
                Restricted area. Authorized administrator credentials required.
              </p>
            </div>

            <button
              type="submit"
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-600 to-cyan-500 font-semibold text-xs uppercase tracking-wider text-white shadow-lg shadow-cyan-500/20 transition hover:brightness-110 active:scale-[0.99]"
            >
              <Unlock size={16} />
              Unlock Admin Portal
            </button>
          </form>

          <div className="mt-6 border-t border-white/[0.06] pt-4 text-center">
            <p className="text-[11px] text-slate-500">
              Only authorized site administrators are permitted access.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ================= RENDER: FULL ADMIN DASHBOARD =================
  const activeStudentsCount = students.filter((s) => s.status === "active").length;
  const suspendedStudentsCount = students.filter((s) => s.status === "suspended").length;

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 selection:bg-cyan-500/30">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-cyan-400/30 bg-[#0B1324] px-5 py-3.5 text-xs font-semibold text-white shadow-2xl shadow-cyan-500/20 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 size={18} className="text-cyan-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOPBAR */}
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#070B16]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Logo & Portal Badge */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center">
              <img
                src="/nmai-logo.png"
                alt="NMAI"
                className="h-9 w-auto object-contain"
              />
            </Link>
            <div className="h-5 w-px bg-white/10" />
            <div className="flex items-center gap-2">
              <div className="flex h-7 items-center gap-1.5 rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-2.5 text-[11px] font-bold uppercase tracking-wider text-cyan-300">
                <ShieldCheck size={14} />
                <span>Admin Master Portal</span>
              </div>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-white/[0.07]"
            >
              <ExternalLink size={13} />
              <span>View Main Site</span>
            </Link>

            <Link
              href="/ai-tools"
              target="_blank"
              className="hidden md:flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-white/[0.07]"
            >
              <Bot size={13} />
              <span>AI Tools Page</span>
            </Link>

            <ThemeToggle />

            <button
              onClick={handleAdminLogout}
              type="button"
              className="flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-300 transition hover:bg-rose-500/20"
            >
              <LogOut size={13} />
              <span>Lock Portal</span>
            </button>
          </div>
        </div>
      </header>

      {/* SUB-NAV / TABS */}
      <div className="border-b border-white/[0.06] bg-[#080E1C]">
        <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-4 sm:px-6 py-2">
          <button
            onClick={() => setActiveTab("students")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition ${
              activeTab === "students"
                ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-cyan-500/20"
                : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
            }`}
          >
            <Users size={15} />
            <span>Student Whitelist ({students.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("courses")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition ${
              activeTab === "courses"
                ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-cyan-500/20"
                : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
            }`}
          >
            <BookOpen size={15} />
            <span>Manage Courses ({courses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("tools")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition ${
              activeTab === "tools"
                ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-cyan-500/20"
                : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
            }`}
          >
            <Bot size={15} />
            <span>AI Tools & Gemini Gems ({aiTools.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition ${
              activeTab === "settings"
                ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-cyan-500/20"
                : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
            }`}
          >
            <Settings size={15} />
            <span>Site Broadcast & Settings</span>
          </button>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* TOP QUICK METRICS */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-white/[0.07] bg-[#091122] p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Total Enrolled</span>
              <Users size={16} className="text-cyan-400" />
            </div>
            <p className="mt-2 text-2xl font-bold text-white">{students.length}</p>
            <p className="mt-1 text-[11px] text-emerald-400">Authorized Gmail Whitelist</p>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-[#091122] p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Active Students</span>
              <UserCheck size={16} className="text-emerald-400" />
            </div>
            <p className="mt-2 text-2xl font-bold text-emerald-300">{activeStudentsCount}</p>
            <p className="mt-1 text-[11px] text-slate-500">Can access full portal</p>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-[#091122] p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Suspended</span>
              <UserX size={16} className="text-rose-400" />
            </div>
            <p className="mt-2 text-2xl font-bold text-rose-300">{suspendedStudentsCount}</p>
            <p className="mt-1 text-[11px] text-slate-500">Access temporarily locked</p>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-[#091122] p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Courses & AI Tools</span>
              <Bot size={16} className="text-cyan-400" />
            </div>
            <p className="mt-2 text-2xl font-bold text-white">{courses.length + aiTools.length}</p>
            <p className="mt-1 text-[11px] text-cyan-400">{aiTools.filter(t => t.category === "Gemini Gems").length} Custom Gems</p>
          </div>
        </div>

        {/* =========================================================
            TAB 1: STUDENT ACCESS & WHITELIST MANAGER
        ========================================================= */}
        {activeTab === "students" && (
          <div className="space-y-6">
            {/* Header & Controls */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="text-cyan-400" size={22} />
                  Student Access & Gmail Whitelist
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Only email addresses listed below are granted entry into NMAI. You manually control who can access the courses.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setShowAddStudentModal(true)}
                  className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-cyan-500/20 hover:brightness-110"
                >
                  <UserPlus size={15} />
                  <span>Grant Access (Add)</span>
                </button>

                <button
                  onClick={() => setShowBulkModal(true)}
                  className="flex items-center gap-1.5 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-3.5 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-400/20"
                >
                  <Upload size={14} />
                  <span>Bulk Import</span>
                </button>

                <button
                  onClick={handleExportCSV}
                  title="Export whitelist to CSV"
                  className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-medium text-slate-300 hover:bg-white/[0.08]"
                >
                  <Download size={14} />
                  <span>Export CSV</span>
                </button>

                <button
                  onClick={handleResetStudents}
                  title="Reset to initial seeds"
                  className="rounded-xl border border-white/10 bg-white/[0.04] p-2 text-slate-400 hover:text-white"
                >
                  <RefreshCw size={14} />
                </button>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col gap-3 rounded-2xl border border-white/[0.07] bg-[#080E1C] p-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  placeholder="Search by student name or Gmail address..."
                  className="h-10 w-full rounded-xl border border-white/10 bg-white/[0.03] pl-10 pr-4 text-xs text-white placeholder:text-slate-500 outline-none focus:border-cyan-400/40"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-400">Status:</span>
                {(["all", "active", "suspended"] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition ${
                      statusFilter === st
                        ? "bg-white/10 text-white"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Student Directory Table */}
            <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#070D1A]">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-white/[0.08] bg-white/[0.02] text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="px-5 py-3.5">Student / Gmail</th>
                      <th className="px-4 py-3.5">Enrolled Course</th>
                      <th className="px-4 py-3.5">Access Status</th>
                      <th className="px-4 py-3.5">Granted On</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.06]">
                    {filteredStudents.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-10 text-center text-slate-500">
                          No authorized students found matching your criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredStudents.map((st) => (
                        <tr key={st.id} className="transition hover:bg-white/[0.02]">
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 text-xs font-bold text-white shadow-sm ring-1 ring-white/10">
                                {st.avatarImage ? (
                                  <img src={st.avatarImage} alt="" className="h-full w-full object-cover" />
                                ) : (
                                  st.name.charAt(0).toUpperCase()
                                )}
                              </div>
                              <div>
                                <p className="font-semibold text-white">{st.name}</p>
                                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                                  <span>{st.email}</span>
                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText(st.email);
                                      showToast(`Copied ${st.email}`);
                                    }}
                                    className="text-slate-500 hover:text-cyan-300"
                                    title="Copy email"
                                  >
                                    <Copy size={11} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-3.5">
                            <div className="flex flex-wrap items-center gap-1.5">
                              {st.enrolledCourses?.includes("*") || (st.enrolledCourse && st.enrolledCourse.includes("All Access")) ? (
                                <span className="inline-flex items-center gap-1 rounded-md border border-cyan-400/30 bg-cyan-400/10 px-2 py-0.5 text-[10px] font-bold text-cyan-300">
                                  ★ All Access Pass
                                </span>
                              ) : !st.enrolledCourses || st.enrolledCourses.length === 0 ? (
                                <span className="inline-flex items-center rounded-md border border-rose-500/20 bg-rose-500/10 px-2 py-0.5 text-[10px] font-medium text-rose-300">
                                  No Courses Assigned
                                </span>
                              ) : (
                                st.enrolledCourses.map((cid) => {
                                  const matching = courses.find((c) => c.id === cid);
                                  const label = matching?.title || (cid === "course-nm" ? "Network Marketing" : cid === "course-ai" ? "AI & Automation" : cid === "course-design" ? "Content & Design" : cid === "course-video" ? "Video Editing" : cid === "course-social" ? "Social Media" : cid);
                                  return (
                                    <span
                                      key={cid}
                                      className="inline-flex items-center rounded-md border border-blue-400/20 bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-300"
                                    >
                                      {label}
                                    </span>
                                  );
                                })
                              )}
                              <button
                                onClick={() => handleOpenManageCourses(st)}
                                title="Change course access for this student"
                                className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[10px] font-medium text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300 transition"
                              >
                                <BookOpen size={10} />
                                Manage
                              </button>
                            </div>
                          </td>

                          <td className="px-4 py-3.5">
                            {st.status === "active" ? (
                              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300">
                                <Check size={11} />
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-rose-300">
                                <UserX size={11} />
                                Suspended
                              </span>
                            )}
                          </td>

                          <td className="px-4 py-3.5 text-slate-400 font-mono text-[11px]">
                            {st.enrollmentDate}
                          </td>

                          <td className="px-5 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Manage Courses Action */}
                              <button
                                onClick={() => handleOpenManageCourses(st)}
                                title="Manage course permissions"
                                className="rounded-lg border border-cyan-400/20 bg-cyan-400/10 p-1.5 text-cyan-400 hover:bg-cyan-400/20 hover:text-cyan-200"
                              >
                                <BookOpen size={13} />
                              </button>

                              {/* Toggle Active / Suspend */}
                              <button
                                onClick={() => handleToggleStatus(st.id, st.name)}
                                title={st.status === "active" ? "Suspend student access" : "Activate student access"}
                                className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition ${
                                  st.status === "active"
                                    ? "border border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20"
                                    : "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
                                }`}
                              >
                                {st.status === "active" ? "Suspend" : "Activate"}
                              </button>

                              {/* Edit details */}
                              <button
                                onClick={() => setEditingStudent(st)}
                                title="Edit student"
                                className="rounded-lg border border-white/10 bg-white/[0.04] p-1.5 text-slate-400 hover:bg-white/[0.08] hover:text-white"
                              >
                                <Edit3 size={13} />
                              </button>

                              {/* Delete */}
                              <button
                                onClick={() => handleDeleteStudent(st.id, st.email)}
                                title="Revoke and remove from database"
                                className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-1.5 text-rose-400 hover:bg-rose-500/20 hover:text-rose-300"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 2: COURSE & CURRICULUM MANAGER
        ========================================================= */}
        {activeTab === "courses" && (
          <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <BookOpen className="text-cyan-400" size={22} />
                  Course & Curriculum Management
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Manage the courses visible on the main page, toggle active status, and modify lesson counts.
                </p>
              </div>

              <button
                onClick={() => setShowAddCourseModal(true)}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-cyan-500/20 hover:brightness-110"
              >
                <Plus size={15} />
                <span>Add New Course</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((c) => (
                <div
                  key={c.id}
                  className="relative flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#080E1C] p-5 shadow-lg transition hover:border-cyan-400/30"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-300">
                        {c.category}
                      </span>
                      <button
                        onClick={() => handleToggleCourse(c.id, c.title)}
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase transition ${
                          c.available
                            ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                            : "border border-amber-500/30 bg-amber-500/10 text-amber-300"
                        }`}
                      >
                        {c.available ? "Live" : "Coming Soon"}
                      </button>
                    </div>

                    <h3 className="mt-3 text-base font-bold text-white">{c.title}</h3>
                    <p className="mt-1.5 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {c.description}
                    </p>

                    <div className="mt-4 flex items-center gap-4 text-xs text-slate-400">
                      <span>{c.lessons} Lessons</span>
                      <span>•</span>
                      <span>{c.duration}</span>
                      <span>•</span>
                      <span className="font-mono text-[11px] text-cyan-400 truncate max-w-[120px]">
                        {c.href}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4">
                    <button
                      onClick={() => setEditingCourse(c)}
                      className="flex items-center gap-1 text-xs font-semibold text-cyan-300 hover:text-cyan-200"
                    >
                      <Edit3 size={13} />
                      Edit Details
                    </button>

                    <button
                      onClick={() => handleDeleteCourse(c.id, c.title)}
                      className="flex items-center gap-1 text-xs font-semibold text-rose-400 hover:text-rose-300"
                    >
                      <Trash2 size={13} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 3: AI TOOLS & GEMINI GEMS DIRECTORY
        ========================================================= */}
        {activeTab === "tools" && (
          <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Bot className="text-cyan-400" size={22} />
                  AI Tools & Gemini Gems Directory
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Add custom Gemini Gems via sharable links (like the NMAI Sales Objection Mentor) and manage all AI tools.
                </p>
              </div>

              <button
                onClick={() => setShowAddToolModal(true)}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-cyan-500/20 hover:brightness-110"
              >
                <Plus size={15} />
                <span>Add AI Tool / Gemini Gem</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {aiTools.map((tool) => (
                <div
                  key={tool.id}
                  className="relative flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#080E1C] p-5 shadow-lg transition hover:border-cyan-400/30"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span
                        className={`rounded-lg px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          tool.category === "Gemini Gems"
                            ? "border border-cyan-400/30 bg-cyan-400/10 text-cyan-300"
                            : "border border-white/10 bg-white/[0.04] text-slate-300"
                        }`}
                      >
                        {tool.category}
                      </span>
                      <span className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                        {tool.pricing}
                      </span>
                    </div>

                    <h3 className="mt-3 text-base font-bold text-white">{tool.name}</h3>
                    <p className="mt-1.5 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {tool.description}
                    </p>

                    <div className="mt-3 rounded-xl border border-white/[0.06] bg-black/20 p-2.5 text-[11px] text-slate-400">
                      <p className="font-semibold text-slate-300">Workflow / Direct Link:</p>
                      <a
                        href={tool.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-0.5 flex items-center gap-1 text-cyan-400 hover:underline truncate"
                      >
                        <ExternalLink size={11} className="shrink-0" />
                        <span className="truncate">{tool.website}</span>
                      </a>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3">
                    <a
                      href={tool.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs font-semibold text-cyan-300 hover:underline"
                    >
                      <ExternalLink size={12} />
                      Launch
                    </a>

                    <button
                      onClick={() => handleDeleteTool(tool.id, tool.name)}
                      className="flex items-center gap-1 text-xs font-semibold text-rose-400 hover:text-rose-300"
                    >
                      <Trash2 size={12} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 4: SITE BROADCAST & SETTINGS
        ========================================================= */}
        {activeTab === "settings" && (
          <div className="max-w-3xl space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Settings className="text-cyan-400" size={22} />
                Site Broadcast & Platform Settings
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Customize global announcements, community links, and administrator security keys.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-6">
              {/* Announcement Banner */}
              <div className="rounded-2xl border border-white/[0.08] bg-[#080E1C] p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="text-cyan-400" size={18} />
                    <h3 className="text-sm font-bold text-white">Platform Announcement Banner</h3>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={config.announcement.enabled}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          announcement: {
                            ...config.announcement,
                            enabled: e.target.checked,
                          },
                        })
                      }
                      className="peer sr-only"
                    />
                    <div className="peer h-6 w-11 rounded-full bg-white/10 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-cyan-500 peer-checked:after:translate-x-full peer-focus:outline-none" />
                  </label>
                </div>

                <div className="mt-4 space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400">
                      Announcement Text
                    </label>
                    <textarea
                      rows={2}
                      value={config.announcement.text}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          announcement: {
                            ...config.announcement,
                            text: e.target.value,
                          },
                        })
                      }
                      className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs text-white placeholder:text-slate-600 outline-none focus:border-cyan-400/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400">
                      Badge Label
                    </label>
                    <input
                      type="text"
                      value={config.announcement.badgeText}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          announcement: {
                            ...config.announcement,
                            badgeText: e.target.value,
                          },
                        })
                      }
                      className="mt-1.5 h-10 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 text-xs text-white outline-none focus:border-cyan-400/50"
                    />
                  </div>
                </div>
              </div>

              {/* Community WhatsApp Link */}
              <div className="rounded-2xl border border-white/[0.08] bg-[#080E1C] p-5">
                <div className="flex items-center gap-2">
                  <MessageCircle className="text-emerald-400" size={18} />
                  <h3 className="text-sm font-bold text-white">Community WhatsApp Group</h3>
                </div>
                <div className="mt-3">
                  <label className="block text-xs font-semibold text-slate-400">
                    Invite Link
                  </label>
                  <input
                    type="url"
                    value={config.community.whatsappUrl}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        community: {
                          whatsappUrl: e.target.value,
                        },
                      })
                    }
                    className="mt-1.5 h-10 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 text-xs text-white outline-none focus:border-cyan-400/50"
                  />
                </div>
              </div>

              {/* Admin Master Key */}
              <div className="rounded-2xl border border-white/[0.08] bg-[#080E1C] p-5">
                <div className="flex items-center gap-2">
                  <KeyRound className="text-amber-400" size={18} />
                  <h3 className="text-sm font-bold text-white">Admin Master Passkey</h3>
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  The password required to unlock this admin portal.
                </p>
                <div className="relative mt-3">
                  <input
                    type={showSettingsPasskey ? "text" : "password"}
                    value={config.adminPasskey}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        adminPasskey: e.target.value,
                      })
                    }
                    placeholder="Enter master passkey"
                    className="h-10 w-full rounded-xl border border-white/10 bg-white/[0.03] pl-3 pr-10 text-xs font-mono text-cyan-300 outline-none focus:border-cyan-400/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSettingsPasskey(!showSettingsPasskey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                    title={showSettingsPasskey ? "Hide passkey" : "Show passkey"}
                  >
                    {showSettingsPasskey ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-3 text-xs font-semibold text-white shadow-lg shadow-cyan-500/20 hover:brightness-110"
              >
                <Save size={15} />
                Save Platform Settings
              </button>
            </form>
          </div>
        )}
      </main>

      {/* =========================================================
          MODALS
      ========================================================= */}

      {/* Modal: Grant Access (Add Single Student) */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0A1020] p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserPlus size={18} className="text-cyan-400" />
                Grant Student Access
              </h3>
              <button
                onClick={() => setShowAddStudentModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
              Enter the student's name and Gmail address. Once added, their email will immediately be authorized to log into the main platform.
            </p>

            <form onSubmit={handleAddSingleStudent} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-400">
                  Student Name
                </label>
                <input
                  type="text"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="mt-1 h-10 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 text-xs text-white outline-none focus:border-cyan-400/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400">
                  Gmail Address <span className="text-rose-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={newStudentEmail}
                  onChange={(e) => setNewStudentEmail(e.target.value)}
                  placeholder="e.g. johndoe@gmail.com"
                  className="mt-1 h-10 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 text-xs text-white outline-none focus:border-cyan-400/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">
                  Course Permissions (Select Courses to Grant):
                </label>

                {/* All Access Pass Master Toggle */}
                <label className="flex items-center gap-2.5 rounded-xl border border-cyan-400/30 bg-cyan-400/[0.08] p-2.5 cursor-pointer hover:bg-cyan-400/[0.12] transition mb-2">
                  <input
                    type="checkbox"
                    checked={newStudentCourses.includes("*")}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setNewStudentCourses(["*"]);
                      } else {
                        setNewStudentCourses([]);
                      }
                    }}
                    className="h-4 w-4 rounded border-white/20 text-cyan-500 focus:ring-0"
                  />
                  <div>
                    <span className="text-xs font-bold text-cyan-300">★ All Access Pass (All Courses)</span>
                    <span className="block text-[10px] text-slate-400">Student can access every course on the platform</span>
                  </div>
                </label>

                {!newStudentCourses.includes("*") && (
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {courses.map((c) => (
                      <label
                        key={c.id}
                        className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.02] p-2 cursor-pointer hover:bg-white/[0.05] transition"
                      >
                        <input
                          type="checkbox"
                          checked={newStudentCourses.includes(c.id)}
                          onChange={() => {
                            if (newStudentCourses.includes(c.id)) {
                              setNewStudentCourses(newStudentCourses.filter((id) => id !== c.id));
                            } else {
                              setNewStudentCourses([...newStudentCourses.filter((id) => id !== "*"), c.id]);
                            }
                          }}
                          className="h-4 w-4 rounded border-white/20 text-cyan-500 focus:ring-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-white truncate">{c.title}</p>
                          <p className="text-[10px] text-slate-500">{c.category} • {c.lessons} lessons</p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-6 flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="rounded-xl border border-white/10 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-white/[0.05]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-cyan-500/20 hover:brightness-110"
                >
                  Grant Access
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Manage Student Course Access */}
      {managingCoursesStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#0A1020] p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BookOpen size={18} className="text-cyan-400" />
                Manage Course Access
              </h3>
              <button
                onClick={() => setManagingCoursesStudent(null)}
                className="rounded-lg p-1 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-white">{managingCoursesStudent.name}</p>
                <p className="text-[11px] text-slate-400">{managingCoursesStudent.email}</p>
              </div>
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${managingCoursesStudent.status === "active" ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20" : "bg-rose-500/10 text-rose-300 border border-rose-500/20"}`}>
                {managingCoursesStudent.status}
              </span>
            </div>

            <p className="mt-3 text-xs text-slate-400 leading-relaxed">
              Check the specific course(s) you want to grant access to. Courses left unchecked will be locked for this student.
            </p>

            <form onSubmit={handleSaveCourseAccess} className="mt-4 space-y-3">
              {/* Master All-Access Toggle */}
              <label className="flex items-center gap-3 rounded-2xl border border-cyan-400/30 bg-gradient-to-r from-blue-600/15 to-cyan-500/15 p-3.5 cursor-pointer hover:border-cyan-400/50 transition">
                <input
                  type="checkbox"
                  checked={selectedCourseIds.includes("*")}
                  onChange={() => handleToggleCourseSelection("*")}
                  className="h-5 w-5 rounded border-white/20 text-cyan-500 focus:ring-0"
                />
                <div>
                  <p className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                    ★ All Access Pass (All Courses)
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Gives this student full access to every current and future course
                  </p>
                </div>
              </label>

              {/* Individual Course Checkboxes */}
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {courses.map((course) => {
                  const isChecked = selectedCourseIds.includes("*") || selectedCourseIds.includes(course.id);
                  return (
                    <label
                      key={course.id}
                      className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition ${
                        isChecked
                          ? "border-cyan-400/30 bg-white/[0.04]"
                          : "border-white/[0.07] bg-white/[0.01] hover:bg-white/[0.03]"
                      }`}
                    >
                      <input
                        type="checkbox"
                        disabled={selectedCourseIds.includes("*")}
                        checked={isChecked}
                        onChange={() => handleToggleCourseSelection(course.id)}
                        className="h-4 w-4 rounded border-white/20 text-cyan-500 focus:ring-0 disabled:opacity-50"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-white truncate">{course.title}</p>
                          <span className="text-[10px] text-slate-500 uppercase">{course.category}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-1">{course.description}</p>
                      </div>
                    </label>
                  );
                })}
              </div>

              <div className="mt-5 flex items-center justify-end gap-2 pt-3 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => setManagingCoursesStudent(null)}
                  className="rounded-xl border border-white/10 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-white/[0.05]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-5 py-2 text-xs font-semibold text-white shadow-md shadow-cyan-500/20 hover:brightness-110"
                >
                  Save Course Permissions
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Bulk Import */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#0A1020] p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Upload size={18} className="text-cyan-400" />
                Bulk Student Access Import
              </h3>
              <button
                onClick={() => setShowBulkModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
              Paste multiple student Gmail addresses separated by commas, spaces, or newlines (e.g. from Google Sheets or WhatsApp):
            </p>

            <form onSubmit={handleBulkEnroll} className="mt-4 space-y-3.5">
              <textarea
                rows={6}
                required
                value={bulkEmailsInput}
                onChange={(e) => setBulkEmailsInput(e.target.value)}
                placeholder={"student1@gmail.com\nstudent2@gmail.com, student3@gmail.com"}
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs font-mono text-white placeholder:text-slate-600 outline-none focus:border-cyan-400/50"
              />

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBulkModal(false)}
                  className="rounded-xl border border-white/10 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-white/[0.05]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-cyan-500/20 hover:brightness-110"
                >
                  Enroll All
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Student */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0A1020] p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Edit3 size={18} className="text-cyan-400" />
              Edit Student Details
            </h3>

            <form onSubmit={handleSaveEditedStudent} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-400">Name</label>
                <input
                  type="text"
                  value={editingStudent.name}
                  onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                  className="mt-1 h-10 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 text-xs text-white outline-none focus:border-cyan-400/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400">Gmail</label>
                <input
                  type="email"
                  value={editingStudent.email}
                  onChange={(e) => setEditingStudent({ ...editingStudent, email: e.target.value })}
                  className="mt-1 h-10 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 text-xs text-white outline-none focus:border-cyan-400/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400">Course Permissions</label>
                <div className="mt-1 flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={editingStudent.enrolledCourse}
                    className="h-10 flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-xs text-white outline-none cursor-default"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const st = editingStudent;
                      setEditingStudent(null);
                      handleOpenManageCourses(st);
                    }}
                    className="h-10 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-3 text-xs font-semibold text-cyan-300 hover:bg-cyan-400/20 transition whitespace-nowrap"
                  >
                    Change Courses
                  </button>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="rounded-xl border border-white/10 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-white/[0.05]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-cyan-600 px-4 py-2 text-xs font-semibold text-white hover:bg-cyan-500"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add AI Tool / Gemini Gem */}
      {showAddToolModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#0A1020] p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Bot size={18} className="text-cyan-400" />
                Add AI Tool or Custom Gemini Gem
              </h3>
              <button
                onClick={() => setShowAddToolModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddTool} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-400">Tool / Gem Name *</label>
                <input
                  type="text"
                  required
                  value={newToolName}
                  onChange={(e) => setNewToolName(e.target.value)}
                  placeholder="e.g. NMAI Prospecting Coach"
                  className="mt-1 h-10 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 text-xs text-white outline-none focus:border-cyan-400/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400">Category</label>
                  <select
                    value={newToolCategory}
                    onChange={(e) => setNewToolCategory(e.target.value as any)}
                    className="mt-1 h-10 w-full rounded-xl border border-white/10 bg-[#080E1C] px-3 text-xs text-white outline-none focus:border-cyan-400/50"
                  >
                    <option value="Gemini Gems">Gemini Gems (Custom AI)</option>
                    <option value="Text & Reasoning">Text & Reasoning</option>
                    <option value="Video & Avatars">Video & Avatars</option>
                    <option value="Image & Creative">Image & Creative</option>
                    <option value="Voice & Audio">Voice & Audio</option>
                    <option value="Automation & Agents">Automation & Agents</option>
                    <option value="Productivity">Productivity</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400">Pricing Badge</label>
                  <select
                    value={newToolPricing}
                    onChange={(e) => setNewToolPricing(e.target.value as any)}
                    className="mt-1 h-10 w-full rounded-xl border border-white/10 bg-[#080E1C] px-3 text-xs text-white outline-none focus:border-cyan-400/50"
                  >
                    <option value="Free">Free</option>
                    <option value="Freemium">Freemium</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400">Sharable URL / Gem Link *</label>
                <input
                  type="url"
                  required
                  value={newToolUrl}
                  onChange={(e) => setNewToolUrl(e.target.value)}
                  placeholder="https://gemini.google.com/gem/... or tool URL"
                  className="mt-1 h-10 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 text-xs text-white outline-none focus:border-cyan-400/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400">Description</label>
                <textarea
                  rows={2}
                  value={newToolDesc}
                  onChange={(e) => setNewToolDesc(e.target.value)}
                  placeholder="What does this AI tool or Gem do for students?"
                  className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.04] p-2.5 text-xs text-white outline-none focus:border-cyan-400/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400">Best For</label>
                <input
                  type="text"
                  value={newToolBestFor}
                  onChange={(e) => setNewToolBestFor(e.target.value)}
                  placeholder="e.g. Sales scripts, objection handling"
                  className="mt-1 h-10 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 text-xs text-white outline-none focus:border-cyan-400/50"
                />
              </div>

              <div className="mt-5 flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddToolModal(false)}
                  className="rounded-xl border border-white/10 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-white/[0.05]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-cyan-500/20 hover:brightness-110"
                >
                  Add Tool / Gem
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Course */}
      {showAddCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0A1020] p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BookOpen size={18} className="text-cyan-400" />
              Add New Course
            </h3>

            <form onSubmit={handleAddCourse} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-400">Course Title *</label>
                <input
                  type="text"
                  required
                  value={newCourseTitle}
                  onChange={(e) => setNewCourseTitle(e.target.value)}
                  placeholder="e.g. Advanced Funnel Building"
                  className="mt-1 h-10 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 text-xs text-white outline-none focus:border-cyan-400/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400">Category</label>
                  <input
                    type="text"
                    value={newCourseCategory}
                    onChange={(e) => setNewCourseCategory(e.target.value)}
                    className="mt-1 h-10 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 text-xs text-white outline-none focus:border-cyan-400/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400">Lessons Count</label>
                  <input
                    type="number"
                    value={newCourseLessons}
                    onChange={(e) => setNewCourseLessons(Number(e.target.value))}
                    className="mt-1 h-10 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 text-xs text-white outline-none focus:border-cyan-400/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400">Description</label>
                <textarea
                  rows={2}
                  value={newCourseDesc}
                  onChange={(e) => setNewCourseDesc(e.target.value)}
                  placeholder="Summary of course content..."
                  className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.04] p-2.5 text-xs text-white outline-none focus:border-cyan-400/50"
                />
              </div>

              <div className="mt-5 flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCourseModal(false)}
                  className="rounded-xl border border-white/10 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-white/[0.05]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-cyan-500/20 hover:brightness-110"
                >
                  Add Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Course */}
      {editingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0A1020] p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Edit3 size={18} className="text-cyan-400" />
              Edit Course Details
            </h3>

            <form onSubmit={handleSaveEditedCourse} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-400">Title</label>
                <input
                  type="text"
                  value={editingCourse.title}
                  onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                  className="mt-1 h-10 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 text-xs text-white outline-none focus:border-cyan-400/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400">Category</label>
                <input
                  type="text"
                  value={editingCourse.category}
                  onChange={(e) => setEditingCourse({ ...editingCourse, category: e.target.value })}
                  className="mt-1 h-10 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 text-xs text-white outline-none focus:border-cyan-400/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400">Description</label>
                <textarea
                  rows={3}
                  value={editingCourse.description}
                  onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.04] p-2.5 text-xs text-white outline-none focus:border-cyan-400/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400">Lessons Count</label>
                  <input
                    type="number"
                    value={editingCourse.lessons}
                    onChange={(e) => setEditingCourse({ ...editingCourse, lessons: Number(e.target.value) })}
                    className="mt-1 h-10 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 text-xs text-white outline-none focus:border-cyan-400/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400">Duration</label>
                  <input
                    type="text"
                    value={editingCourse.duration}
                    onChange={(e) => setEditingCourse({ ...editingCourse, duration: e.target.value })}
                    className="mt-1 h-10 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 text-xs text-white outline-none focus:border-cyan-400/50"
                  />
                </div>
              </div>

              <div className="mt-5 flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCourse(null)}
                  className="rounded-xl border border-white/10 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-white/[0.05]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-cyan-600 px-4 py-2 text-xs font-semibold text-white hover:bg-cyan-500"
                >
                  Save Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
