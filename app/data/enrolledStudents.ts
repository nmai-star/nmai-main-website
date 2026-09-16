/**
 * Enrolled Student Database & Access Management
 * Defines the authorized student Gmail addresses permitted to access the NMAI platform.
 * Controlled manually by the admin via the Admin Portal (/admin).
 */

export type EnrolledStudent = {
  id: string;
  email: string;
  name: string;
  enrolledCourse: string;
  enrolledCourses: string[]; // specific course IDs, e.g. ["course-nm", "course-ai"] or ["*"] for all access
  status: "active" | "suspended";
  enrollmentDate: string;
  phone?: string;
  bio?: string;
  avatarColor?: string;
  avatarImage?: string;
  interest?: string;
  level?: string;
};

export const INITIAL_ENROLLED_STUDENTS: EnrolledStudent[] = [
  {
    id: "student-1",
    email: "student@gmail.com",
    name: "Demo Student",
    enrolledCourse: "Network Marketing Success",
    enrolledCourses: ["course-nm"],
    status: "active",
    enrollmentDate: "2026-01-15",
  },
  {
    id: "student-2",
    email: "kranthi@gmail.com",
    name: "Kranthi",
    enrolledCourse: "No Courses Assigned",
    enrolledCourses: [],
    status: "active",
    enrollmentDate: "2026-01-10",
  },
  {
    id: "student-3",
    email: "krant@gmail.com",
    name: "Krant",
    enrolledCourse: "No Courses Assigned",
    enrolledCourses: [],
    status: "active",
    enrollmentDate: "2026-01-10",
  },
  {
    id: "student-4",
    email: "alex.rivers@gmail.com",
    name: "Alex Rivers",
    enrolledCourse: "Network Marketing Success",
    enrolledCourses: ["course-nm"],
    status: "active",
    enrollmentDate: "2026-02-01",
  },
  {
    id: "student-5",
    email: "nmai.learner@gmail.com",
    name: "NMAI Learner",
    enrolledCourse: "AI Tools & Network Marketing",
    enrolledCourses: ["course-nm", "course-ai"],
    status: "active",
    enrollmentDate: "2026-02-15",
  },
];

const MASTER_STORAGE_KEY = "nmai-students-master";

/**
 * Normalizes a student record ensuring enrolledCourses array is present.
 */
function normalizeStudent(s: any): EnrolledStudent {
  let courses: string[];

  // If enrolledCourses is already an explicit array, PRESERVE IT (even if empty []!)
  if (Array.isArray(s.enrolledCourses)) {
    courses = s.enrolledCourses;
  } else {
    // Only infer from enrolledCourse string when enrolledCourses was never initialized
    const courseStr = (s.enrolledCourse || "").toLowerCase().trim();
    if (courseStr.includes("all access") || courseStr === "all" || courseStr === "*") {
      courses = ["*"];
    } else if (
      courseStr.includes("ai tools") ||
      courseStr.includes("ai &") ||
      courseStr.includes("automation")
    ) {
      courses = ["course-nm", "course-ai"];
    } else if (courseStr.includes("design")) {
      courses = ["course-design"];
    } else if (courseStr.includes("video")) {
      courses = ["course-video"];
    } else if (courseStr.includes("social")) {
      courses = ["course-social"];
    } else if (!courseStr || courseStr.includes("no courses")) {
      courses = [];
    } else {
      courses = ["course-nm"];
    }
  }

  const safeEmail = s.email ? s.email.trim().toLowerCase() : "";
  const id = s.id || `student-${safeEmail.replace(/[^a-z0-9]/g, "-") || Date.now()}`;

  return {
    ...s,
    id,
    email: safeEmail,
    name: s.name || safeEmail.split("@")[0],
    enrolledCourses: courses,
    enrolledCourse: s.enrolledCourse || formatCoursesSummary(courses),
    phone: s.phone || "",
    bio: s.bio || "",
    avatarColor: s.avatarColor || "from-blue-600 to-cyan-500",
    avatarImage: s.avatarImage || "",
    interest: s.interest || "Network Marketing & AI Automation",
    level: s.level || "Beginner",
  };
}

/**
 * Retrieves all students from master localStorage storage, initializing with defaults if empty.
 */
export function getAllStudents(): EnrolledStudent[] {
  if (typeof window === "undefined") {
    return INITIAL_ENROLLED_STUDENTS;
  }

  try {
    const raw = localStorage.getItem(MASTER_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(normalizeStudent);
      }
    }
    // Migrate legacy custom students if any
    const legacyRaw = localStorage.getItem("nmai-enrolled-students");
    let initialList = [...INITIAL_ENROLLED_STUDENTS];
    if (legacyRaw) {
      try {
        const legacyParsed = JSON.parse(legacyRaw);
        if (Array.isArray(legacyParsed)) {
          for (const s of legacyParsed) {
            if (!initialList.some((existing) => existing.email.toLowerCase() === s.email.toLowerCase())) {
              initialList.push(normalizeStudent(s));
            }
          }
        }
      } catch {}
    }

    localStorage.setItem(MASTER_STORAGE_KEY, JSON.stringify(initialList));
    return initialList;
  } catch (e) {
    console.error("Error retrieving enrolled students:", e);
    return INITIAL_ENROLLED_STUDENTS;
  }
}

/**
 * Saves full student list to master localStorage.
 */
export function saveAllStudents(students: EnrolledStudent[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(MASTER_STORAGE_KEY, JSON.stringify(students));
  } catch (e) {
    console.error("Error saving students:", e);
  }
}

/**
 * Checks if a given email is present and active in the enrolled student database.
 */
export function checkStudentAuthorization(email: string): {
  authorized: boolean;
  student?: EnrolledStudent;
  message?: string;
} {
  const normalizedEmail = email.trim().toLowerCase();
  const students = getAllStudents();

  const found = students.find(
    (s) => s.email.toLowerCase() === normalizedEmail
  );

  if (!found) {
    return {
      authorized: false,
      message: `Access Denied: "${normalizedEmail}" is not an enrolled student. Access to NMAI is strictly restricted to authorized students. Please contact the administrator on WhatsApp to purchase enrollment.`,
    };
  }

  if (found.status === "suspended") {
    return {
      authorized: false,
      message: `Account Suspended: Access for "${normalizedEmail}" has been suspended by the administrator. Please contact support.`,
    };
  }

  return {
    authorized: true,
    student: found,
  };
}

/**
 * Registers a new student or retrieves an existing one.
 * New self-signup students are given 0 courses (enrolledCourses: [])
 * so that they can enter the portal, but cannot access any paid courses for free!
 */
export function registerOrGetStudent(
  email: string,
  name?: string
): EnrolledStudent {
  const normalizedEmail = email.trim().toLowerCase();
  const students = getAllStudents();

  const existing = students.find(
    (s) => s.email.toLowerCase() === normalizedEmail
  );

  if (existing) {
    if (name && (!existing.name || existing.name === existing.email.split("@")[0])) {
      existing.name = name.trim();
      saveAllStudents(students);
    }
    return existing;
  }

  // New self-signup student: explicitly 0 courses assigned (locked by default)
  const defaultName = name?.trim() || normalizedEmail.split("@")[0].replace(/[._-]/g, " ");
  const formattedName = defaultName
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const newStudent: EnrolledStudent = {
    id: `student-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    email: normalizedEmail,
    name: formattedName || "New Member",
    enrolledCourse: "No Courses Assigned (Locked)",
    enrolledCourses: [], // LOCKED: No free courses!
    status: "active",
    enrollmentDate: new Date().toISOString().split("T")[0],
  };

  students.unshift(newStudent);
  saveAllStudents(students);
  return newStudent;
}

/**
 * Checks if a student has access to AT LEAST ONE course.
 */
export function hasAnyCourseAccess(email: string): boolean {
  if (!email) return false;

  const normalizedEmail = email.trim().toLowerCase();
  const auth = checkStudentAuthorization(normalizedEmail);
  if (!auth.authorized || !auth.student) return false;

  const courses = auth.student.enrolledCourses || [];
  return (
    courses.includes("*") ||
    courses.includes("all") ||
    (auth.student.enrolledCourse && auth.student.enrolledCourse.toLowerCase().includes("all access")) ||
    courses.length > 0
  );
}

/**
 * Formats a list of course IDs into a readable summary string.
 */
export function formatCoursesSummary(courseIds: string[]): string {
  if (!courseIds || courseIds.length === 0) return "No Courses Assigned";
  if (courseIds.includes("*") || courseIds.includes("all")) return "All Access Pass (NMAI Pro)";
  if (courseIds.length === 1) {
    const id = courseIds[0];
    if (id === "course-nm" || id === "network-marketing") return "Network Marketing Success";
    if (id === "course-ai" || id === "ai-automation") return "AI & Automation";
    if (id === "course-design") return "Content & Design";
    if (id === "course-video") return "Video Editing";
    if (id === "course-social") return "Social Media Growth";
    return id;
  }
  return `${courseIds.length} Courses Assigned`;
}

/**
 * Checks if a student has access to a specific course by slug, ID, or title.
 */
export function hasCourseAccess(
  email: string,
  courseIdOrSlug: string,
  courseTitle?: string
): boolean {
  if (!email) return false;

  const normalizedEmail = email.trim().toLowerCase();
  const auth = checkStudentAuthorization(normalizedEmail);
  if (!auth.authorized || !auth.student) return false;

  const student = auth.student;
  const courses = student.enrolledCourses || [];

  // All Access checks
  if (
    courses.includes("*") ||
    courses.includes("all") ||
    (student.enrolledCourse && student.enrolledCourse.toLowerCase().includes("all access"))
  ) {
    return true;
  }

  const targetId = courseIdOrSlug.toLowerCase().trim();
  const targetTitle = (courseTitle || "").toLowerCase().trim();

  return courses.some((c) => {
    const norm = c.toLowerCase().trim();
    if (norm === targetId) return true;
    if (targetTitle && (norm === targetTitle || targetTitle.includes(norm))) return true;

    if (norm === "course-nm") {
      return (
        targetId.includes("network") ||
        targetId.includes("marketing") ||
        targetTitle.includes("network") ||
        targetTitle.includes("marketing")
      );
    }
    if (norm === "course-ai") {
      return targetId.includes("ai") || targetTitle.includes("ai") || targetTitle.includes("automation");
    }
    if (norm === "course-design") {
      return targetId.includes("design") || targetTitle.includes("design") || targetTitle.includes("content");
    }
    if (norm === "course-video") {
      return targetId.includes("video") || targetTitle.includes("video") || targetTitle.includes("editing");
    }
    if (norm === "course-social") {
      return targetId.includes("social") || targetTitle.includes("social") || targetTitle.includes("media");
    }

    return (
      (targetId && (norm.includes(targetId) || targetId.includes(norm))) ||
      (targetTitle && (norm.includes(targetTitle) || targetTitle.includes(norm)))
    );
  });
}

/**
 * Updates a student's assigned courses.
 */
export function updateStudentCourseAccess(
  studentIdOrEmail: string,
  courseIds: string[],
  fallbackEmail?: string
): boolean {
  const students = getAllStudents();
  const query = studentIdOrEmail.trim().toLowerCase();
  const fallback = fallbackEmail ? fallbackEmail.trim().toLowerCase() : "";

  const student = students.find(
    (s) =>
      s.id === studentIdOrEmail ||
      s.email.toLowerCase() === query ||
      (fallback && s.email.toLowerCase() === fallback)
  );

  if (!student) return false;

  const validCourseIds = Array.isArray(courseIds) ? [...courseIds] : [];
  student.enrolledCourses = validCourseIds;
  student.enrolledCourse = formatCoursesSummary(validCourseIds);

  saveAllStudents(students);

  // Sync active student session in localStorage if matching
  if (typeof window !== "undefined") {
    try {
      const sessionRaw = localStorage.getItem("nmai-student-session");
      if (sessionRaw) {
        const session = JSON.parse(sessionRaw);
        if (session && session.email && session.email.toLowerCase() === student.email.toLowerCase()) {
          session.enrolledCourse = student.enrolledCourse;
          session.enrolledCourses = student.enrolledCourses;
          localStorage.setItem("nmai-student-session", JSON.stringify(session));
          localStorage.setItem("nmai-student-user", JSON.stringify(session));
        }
      }
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new CustomEvent("nmai-student-updated", { detail: student }));
    } catch {}
  }

  return true;
}

/**
 * Adds a new student record to the whitelist with specified course access.
 */
export function addEnrolledStudent(
  email: string,
  name: string,
  enrolledCoursesInput: string[] | string = ["course-nm"]
): EnrolledStudent {
  const normalizedEmail = email.trim().toLowerCase();
  const students = getAllStudents();

  const assignedCourses = Array.isArray(enrolledCoursesInput)
    ? enrolledCoursesInput
    : [enrolledCoursesInput];

  const courseSummary = formatCoursesSummary(assignedCourses);

  // If already exists, return existing and update courses
  const existing = students.find((s) => s.email.toLowerCase() === normalizedEmail);
  if (existing) {
    existing.status = "active";
    if (name) existing.name = name.trim();
    existing.enrolledCourses = assignedCourses;
    existing.enrolledCourse = courseSummary;
    saveAllStudents(students);
    return existing;
  }

  const newStudent: EnrolledStudent = {
    id: `student-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    email: normalizedEmail,
    name: name.trim() || normalizedEmail.split("@")[0],
    enrolledCourse: courseSummary,
    enrolledCourses: assignedCourses,
    status: "active",
    enrollmentDate: new Date().toISOString().split("T")[0],
  };

  students.unshift(newStudent);
  saveAllStudents(students);
  return newStudent;
}

/**
 * Updates an existing student record.
 */
export function updateStudent(
  id: string,
  data: Partial<Omit<EnrolledStudent, "id">>
): boolean {
  const students = getAllStudents();
  const query = id.trim().toLowerCase();
  const idx = students.findIndex((s) => s.id === id || s.email.toLowerCase() === query);
  if (idx === -1) return false;

  const current = students[idx];
  const updatedCourses = data.enrolledCourses !== undefined ? data.enrolledCourses : current.enrolledCourses;
  const updatedCourseSummary = data.enrolledCourse !== undefined ? data.enrolledCourse : formatCoursesSummary(updatedCourses);

  students[idx] = {
    ...current,
    ...data,
    enrolledCourses: updatedCourses,
    enrolledCourse: updatedCourseSummary,
    email: data.email ? data.email.trim().toLowerCase() : current.email,
  };

  saveAllStudents(students);

  // Also sync active session
  if (typeof window !== "undefined") {
    try {
      const sessionRaw = localStorage.getItem("nmai-student-session");
      if (sessionRaw) {
        const session = JSON.parse(sessionRaw);
        if (session && session.email && session.email.toLowerCase() === students[idx].email.toLowerCase()) {
          session.name = students[idx].name;
          session.enrolledCourse = students[idx].enrolledCourse;
          session.enrolledCourses = students[idx].enrolledCourses;
          if (students[idx].phone !== undefined) session.phone = students[idx].phone;
          if (students[idx].bio !== undefined) session.bio = students[idx].bio;
          if (students[idx].avatarColor !== undefined) session.avatarColor = students[idx].avatarColor;
          if (students[idx].avatarImage !== undefined) session.avatarImage = students[idx].avatarImage;
          if (students[idx].interest !== undefined) session.interest = students[idx].interest;
          if (students[idx].level !== undefined) session.level = students[idx].level;
          localStorage.setItem("nmai-student-session", JSON.stringify(session));
          localStorage.setItem("nmai-student-user", JSON.stringify(session));
        }
      }
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new CustomEvent("nmai-student-updated", { detail: students[idx] }));
    } catch {}
  }

  return true;
}

/**
 * Updates a student's personal profile information (name, phone, bio, avatarColor, avatarImage, interest, level).
 */
export function updateStudentProfile(
  email: string,
  profileData: Partial<Pick<EnrolledStudent, "name" | "phone" | "bio" | "avatarColor" | "avatarImage" | "interest" | "level">>
): boolean {
  return updateStudent(email, profileData);
}

/**
 * Toggles a student's status between "active" and "suspended".
 */
export function toggleStudentStatus(id: string): "active" | "suspended" | null {
  const students = getAllStudents();
  const student = students.find((s) => s.id === id);
  if (!student) return null;

  student.status = student.status === "active" ? "suspended" : "active";
  saveAllStudents(students);
  return student.status;
}

/**
 * Permanently removes a student from the whitelist.
 */
export function deleteStudent(id: string): boolean {
  const students = getAllStudents();
  const filtered = students.filter((s) => s.id !== id);
  if (filtered.length === students.length) return false;

  saveAllStudents(filtered);
  return true;
}

/**
 * Batch adds multiple Gmail addresses.
 */
export function bulkAddStudents(
  emailsText: string,
  enrolledCourse: string = "Network Marketing Success"
): { added: number; skipped: number; total: number } {
  const tokens = emailsText
    .split(/[\n,; \t]+/)
    .map((e) => e.trim().toLowerCase())
    .filter((e) => e && e.includes("@"));

  const uniqueEmails = Array.from(new Set(tokens));
  const students = getAllStudents();
  let addedCount = 0;
  let skippedCount = 0;

  const today = new Date().toISOString().split("T")[0];

  for (const email of uniqueEmails) {
    const existing = students.find((s) => s.email.toLowerCase() === email);
    if (existing) {
      skippedCount++;
    } else {
      const username = email.split("@")[0].replace(/[._-]/g, " ");
      const formattedName = username
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

      const assignedCourses = enrolledCourse.includes("All Access")
        ? ["*"]
        : enrolledCourse.includes("AI")
        ? ["course-nm", "course-ai"]
        : ["course-nm"];

      students.unshift({
        id: `student-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        email,
        name: formattedName || "Student",
        enrolledCourse,
        enrolledCourses: assignedCourses,
        status: "active",
        enrollmentDate: today,
      });
      addedCount++;
    }
  }

  saveAllStudents(students);
  return { added: addedCount, skipped: skippedCount, total: students.length };
}

/**
 * Resets student whitelist back to the initial default data.
 */
export function resetStudentsToDefault(): void {
  saveAllStudents([...INITIAL_ENROLLED_STUDENTS]);
}
