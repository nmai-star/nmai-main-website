import { requirePortalAccess } from "@/lib/portal-auth";
import PortalClient from "./PortalClient";
import { getStudentCourses } from "@/lib/course-store";

export default async function Page() {
  const account = await requirePortalAccess();
  return <PortalClient initialCourses={await getStudentCourses(account)} />;
}
