import { INITIAL_COURSES } from "../app/data/coursesData";
import { transaction, type Account } from "./auth-store";

export async function getCourseCatalog() {
  return transaction(store => {
    store.courses ??= structuredClone(INITIAL_COURSES);
    return store.courses;
  });
}

export async function getStudentCourses(account: Account) {
  if (account.status === "suspended") return [];
  return (await getCourseCatalog()).filter(course => account.courses.includes("*") || account.courses.includes(course.id));
}

export async function getAllCoursesForStudent(account: Account) {
  return (await getCourseCatalog()).map(course => ({ ...course, hasAccess: account.status !== "suspended" && (account.courses.includes("*") || account.courses.includes(course.id)) }));
}
