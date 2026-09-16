/**
 * Centralized Course Registry
 * Managed via the Admin Portal (/admin) and rendered on the student main page.
 */

export type CourseItem = {
  id: string;
  title: string;
  category: string;
  description: string;
  lessons: number;
  duration: string;
  progress: number;
  available: boolean;
  href: string;
  visual: string;
};

export const INITIAL_COURSES: CourseItem[] = [
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
    visual: "social",
  },
];

const COURSES_STORAGE_KEY = "nmai-courses-data";

export function getCourses(): CourseItem[] {
  if (typeof window === "undefined") {
    return INITIAL_COURSES;
  }

  try {
    const raw = localStorage.getItem(COURSES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Error reading courses:", e);
  }

  return INITIAL_COURSES;
}

export function saveCourses(courses: CourseItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(courses));
  } catch (e) {
    console.error("Error saving courses:", e);
  }
}

export function updateCourse(id: string, partial: Partial<CourseItem>): boolean {
  const courses = getCourses();
  const idx = courses.findIndex((c) => c.id === id);
  if (idx === -1) return false;

  courses[idx] = { ...courses[idx], ...partial };
  saveCourses(courses);
  return true;
}

export function toggleCourseAvailability(id: string): boolean {
  const courses = getCourses();
  const course = courses.find((c) => c.id === id);
  if (!course) return false;

  course.available = !course.available;
  saveCourses(courses);
  return course.available;
}

export function addCourse(newCourse: Omit<CourseItem, "id">): CourseItem {
  const courses = getCourses();
  const course: CourseItem = {
    ...newCourse,
    id: `course-${Date.now()}`,
  };
  courses.push(course);
  saveCourses(courses);
  return course;
}

export function deleteCourse(id: string): boolean {
  const courses = getCourses();
  const filtered = courses.filter((c) => c.id !== id);
  if (filtered.length === courses.length) return false;

  saveCourses(filtered);
  return true;
}
