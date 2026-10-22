import { MUSIC_PLAYLISTS, PLAYLIST_ID, readMusicPlaylist } from "@/lib/music-playlist";

export async function GET(request: Request) {
  const playlistId = new URL(request.url).searchParams.get("playlist") ?? PLAYLIST_ID;
  if (!MUSIC_PLAYLISTS.some(playlist => playlist.id === playlistId)) {
    return Response.json({ error: "Unknown playlist." }, { status: 400 });
  }
  try {
    return Response.json({ playlistId, tracks: await readMusicPlaylist(fetch, playlistId), syncedAt: new Date().toISOString() }, { headers: { "Cache-Control": "private, no-store" } });
  } catch {
    return Response.json({ error: "Unable to sync Flow Music right now. We’ll retry automatically." }, { status: 502, headers: { "Cache-Control": "private, no-store" } });
  }
}
