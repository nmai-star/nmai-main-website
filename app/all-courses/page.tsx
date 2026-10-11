import { requirePortalAccess } from "@/lib/portal-auth";
import { getAllCoursesForStudent } from "@/lib/course-store";
import CourseList from "../my-course/PortalClient";

export default async function Page() {
  const account = await requirePortalAccess();
  return <CourseList initialCourses={getAllCoursesForStudent(account)} allCourses />;
}
