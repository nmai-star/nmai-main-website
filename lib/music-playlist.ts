export const PLAYLIST_ID = "66fccc15-06e8-4fd2-af12-a4f62ea6f356";
export const MUSIC_PLAYLISTS = [
  { id: PLAYLIST_ID, name: "EDM, PHONK", mood: "Energy & intensity" },
  { id: "8690326b-80d6-4d4e-9773-3e121ee81b22", name: "132 BPM DJ Workout Mix", mood: "Move to the beat" },
  { id: "40633033-6b2d-4558-8510-b4fc65ec157b", name: "EDM - Festival & Club" },
  { id: "1f6aaae0-0a05-4403-9b69-7bf4cb7b9c65", name: "Channel Intros & Loops" },
  { id: "3c79b7f0-693a-44a6-8e1b-9faeb9803a9d", name: "House - Deep, Lounge & Piano" },
  { id: "c224aff9-4cda-493f-9d1e-04ad936249ce", name: "House - Tropical, Organic, Afro & Latin" },
  { id: "981053e2-c959-424d-9579-8608e20e49ba", name: "Lo-Fi & Chillhop - Study and Background" },
  { id: "3e0e06f1-9f82-44b9-84c3-49e572f3c103", name: "Motivational - Ads & Corporate Background" },
  { id: "d0e87a9a-b331-4357-bf30-06c1d8ffc9d7", name: "Telugu Pop & Romantic Ballads" },
  { id: "923fafec-12e0-49c2-a3fc-fae7aa2ade68", name: "Phonk - Drift & Electronic Fusion" },
  { id: "04318def-3346-4378-9d5d-97675bcb74f7", name: "House - Tech, Progressive & Future" },
  { id: "2ec234f5-3b58-44f9-899f-94222f0d37e6", name: "Indian Fusion - House & Techno" },
  { id: "ef179690-9942-43d5-99ac-10bfaf81f1c1", name: "Cinematic & Orchestral Electronic" },
  { id: "e0ce8396-84c3-4ebe-9627-9f60110f9984", name: "Ambient - Chill & Atmospheric" },
  { id: "c04cc801-8295-4d9c-a92a-89ac4b9f4632", name: "Jazz & Electronic Jazz Fusion" },
  { id: "f0f132c6-547e-4721-b1d2-81b14500b349", name: "Rock & Electronic Rock Fusion" },
  { id: "0cd1e15a-d80d-4371-9b83-6fa31d1ab2e8", name: "Workout - High Energy Electronic" },
  { id: "a69aec60-c475-4347-99c3-777436ad2bbc", name: "Techno - Dark, Industrial & Peak Time" },
  { id: "40f55d50-7867-4040-bbcf-6388833115ec", name: "Trance - Uplifting, Progressive & Psy" },
  { id: "8b30bafc-ddf7-414a-a18a-a82d6043826c", name: "Telugu Romantic Lo-Fi & Acoustic" },
];
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
export async function readMusicPlaylist(request: typeof fetch = fetch, playlistId = PLAYLIST_ID): Promise<MusicTrack[]> {
  if (!MUSIC_PLAYLISTS.some(playlist => playlist.id === playlistId)) throw new Error("Unknown playlist");
  const response = await request(`https://www.flowmusic.app/__api/playlists/${playlistId}`, { cache: "no-store", signal: AbortSignal.timeout(10000) });
  if (!response.ok) throw new Error("Playlist unavailable");
  const data = record(await response.json());
  if (!Array.isArray(data.clips)) throw new Error("Playlist format changed");
  const ids = data.clips.map(item => record(item).clip_id);
  if (ids.some(id => typeof id !== "string" || !uuid.test(id))) throw new Error("Invalid song identifier");
  const uniqueIds = [...new Set(ids as string[])];
  const tracks: MusicTrack[] = [];
  for (let i = 0; i < uniqueIds.length; i += 8) {
    const batch = await Promise.all(uniqueIds.slice(i, i + 8).map(async id => {
      const page = await request(`https://www.flowmusic.app/song/${id}`, { cache: "no-store", signal: AbortSignal.timeout(10000) });
      if (page.status === 404) return null;
      if (!page.ok) throw new Error("Song unavailable");
      return parseTrack(await page.text(), id);
    }));
    tracks.push(...batch.filter((track): track is MusicTrack => track !== null));
  }
  return tracks;
}
