import { requirePortalAccess } from "@/lib/portal-auth";
import PortalClient from "./PortalClient";
import { redirect } from "next/navigation";
import { getCourseCatalog } from "@/lib/course-store";

export default async function Page() {
  const account = await requirePortalAccess();
  if (!getCourseCatalog().find(c => c.id === "course-nm")?.available) redirect("/my-course");
  if (!account.courses.includes("*") && !account.courses.includes("course-nm")) redirect("/my-course");
  return <PortalClient />;
}
