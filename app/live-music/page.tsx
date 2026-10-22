import { cookies } from "next/headers";
import { getSession } from "@/lib/auth-store";
import MusicPlayer from "./MusicPlayer";

export default async function Page() {
  const account = await getSession((await cookies()).get("nmai_session")?.value);
  return <MusicPlayer signedIn={!!account} />;
}
