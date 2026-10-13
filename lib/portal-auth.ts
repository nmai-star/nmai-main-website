import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSession } from "./auth-store";

export async function requirePortalAccess() {
  const session = await getSession((await cookies()).get("nmai_session")?.value);
  if (!session || session === true) redirect("/login");
  return session;
}
