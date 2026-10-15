export const PLAYLIST_ID = "66fccc15-06e8-4fd2-af12-a4f62ea6f356";
export const PLAYLIST_URL = `https://www.flowmusic.app/playlist/${PLAYLIST_ID}`;
export type MusicTrack = { id: string; name: string; duration: string; description: string; source: string };
type RecordData = Record<string, unknown>;
function record(value: unknown): RecordData {
  return value !== null && typeof value === "object" && !Array.isArray(value) ? value as RecordData : {};
}
const uuid = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;

export function parseTrack(html: string, id: string): MusicTrack | null {
  const match = html.match(/<script\b[^>]*id=["']__NEXT_DATA__["'][^>]*>([\s\S]*?)<\/script>/i);
  if (!match) throw new Error("Music source format changed");
  const root = record(JSON.parse(match[1]));
  const queries = record(record(record(root.props).sdc).queryClient).queries;
  if (!Array.isArray(queries)) throw new Error("Music metadata missing");
  const query = queries.map(record).find(q => Array.isArray(q.queryKey) && q.queryKey[0] === "clip" && q.queryKey[1] === id);
  const clip = record(record(query?.state).data);
  if (!clip.id) throw new Error("Song unavailable");
  if (clip.deleted_at || clip.privacy === "private") return null;
  const source = new URL(String(clip.audio_url));
  if (source.protocol !== "https:" || source.hostname !== "storage.googleapis.com" || !source.pathname.startsWith("/producer-app-public/")) throw new Error("Unsupported audio source");
  const seconds = Number(record(clip.duration).value);
  return { id, name: String(clip.title || "Untitled track").slice(0,200), source: source.href,
    duration: Number.isFinite(seconds) && seconds > 0 ? `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2,"0")}` : "—",
    description: "Dynamokk · Google Flow Music" };
}

// Flow Music's public website feed is not a versioned integration API.
// Validate its shape and fail visibly if the source changes; never use account cookies.
export async function readMusicPlaylist(request: typeof fetch = fetch): Promise<MusicTrack[]> {
  const response = await request(`https://www.flowmusic.app/__api/playlists/${PLAYLIST_ID}`, { cache: "no-store", signal: AbortSignal.timeout(10000) });
  if (!response.ok) throw new Error("Playlist unavailable");
  const data = record(await response.json());
  if (!Array.isArray(data.clips)) throw new Error("Playlist format changed");
  const ids = data.clips.map(item => record(item).clip_id);
  if (ids.some(id => typeof id !== "string" || !uuid.test(id))) throw new Error("Invalid song identifier");
  const uniqueIds = [...new Set(ids as string[])];
  const tracks: MusicTrack[] = [];
  for (let i = 0; i < uniqueIds.length; i += 8) {
    const batch = await Promise.all(uniqueIds.slice(i, i + 8).map(async id => {
      const page = await request(`https://www.flowmusic.app/song/${id}`, { next: { revalidate: 60 }, signal: AbortSignal.timeout(10000) });
      if (page.status === 404) return null;
      if (!page.ok) throw new Error("Song unavailable");
      return parseTrack(await page.text(), id);
    }));
    tracks.push(...batch.filter((track): track is MusicTrack => track !== null));
  }
  return tracks;
}
