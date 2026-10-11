import { INITIAL_COURSES } from "../app/data/coursesData";
import { transaction, type Account } from "./auth-store";

export function getCourseCatalog() {
  return transaction(store => {
    store.courses ??= structuredClone(INITIAL_COURSES);
    return store.courses;
  });
}

export function getStudentCourses(account: Account) {
  if (account.status === "suspended") return [];
  return getCourseCatalog().filter(course => account.courses.includes("*") || account.courses.includes(course.id));
}

export function getAllCoursesForStudent(account: Account) {
  return getCourseCatalog().map(course => ({ ...course, hasAccess: account.status !== "suspended" && (account.courses.includes("*") || account.courses.includes(course.id)) }));
}
