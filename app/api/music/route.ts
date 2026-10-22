import { readMusicPlaylist } from "@/lib/music-playlist";

export async function GET() {
  try {
    return Response.json({ tracks: await readMusicPlaylist(), syncedAt: new Date().toISOString() }, { headers: { "Cache-Control": "private, no-store" } });
  } catch {
    return Response.json({ error: "Unable to sync Flow Music right now. We’ll retry automatically." }, { status: 502, headers: { "Cache-Control": "private, no-store" } });
  }
}
