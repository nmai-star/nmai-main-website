import { cookies } from "next/headers";
import { getSession } from "@/lib/auth-store";
import HomeOverview from "./components/HomeOverview";

export default async function Page() {
  const account = getSession((await cookies()).get("nmai_session")?.value);
  return <HomeOverview signedIn={!!account} />;
}
