import { requirePortalAccess } from "@/lib/portal-auth";
import MusicPlayer from "./MusicPlayer";

export default async function Page() {
  await requirePortalAccess();
  return <MusicPlayer />;
}
