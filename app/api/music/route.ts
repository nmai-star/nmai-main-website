import { cookies } from "next/headers";
import { getSession } from "@/lib/auth-store";
import { readMusicPlaylist } from "@/lib/music-playlist";

export async function GET() {
  const session = await getSession((await cookies()).get("nmai_session")?.value);
  if (!session || session === true) return Response.json({ error: "Sign in to listen." }, { status: 401 });
  try {
    return Response.json({ tracks: await readMusicPlaylist(), syncedAt: new Date().toISOString() }, { headers: { "Cache-Control": "private, no-store" } });
  } catch {
    return Response.json({ error: "Unable to sync Flow Music right now. We’ll retry automatically." }, { status: 502, headers: { "Cache-Control": "private, no-store" } });
  }
}
