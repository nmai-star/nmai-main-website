import { requirePortalAccess } from "@/lib/portal-auth";
import PortalClient from "./PortalClient";

export default async function Page() {
  await requirePortalAccess();
  return <PortalClient />;
}
