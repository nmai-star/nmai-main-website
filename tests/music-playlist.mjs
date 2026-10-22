import assert from 'node:assert/strict';
import { readMusicPlaylist } from '../lib/music-playlist.ts';

const first = '920607ad-851f-4c83-948d-2a7cdc6c34d3';
const second = '92308b77-ee69-4fb8-b5cd-531adf4ab7a1';
let ids = [first];
let privateId;
let title;
const request = async (url, options) => {
  assert.equal(options.cache, 'no-store', 'Playlist and track details must be fresh');
  if (url.includes('/__api/playlists/')) return Response.json({clips: ids.map(clip_id => ({clip_id}))});
  const id = url.split('/').at(-1);
  return new Response(`<script id="__NEXT_DATA__" type="application/json">${JSON.stringify({props:{sdc:{queryClient:{queries:[{queryKey:['clip',id],state:{data:{id,title:title ?? id,privacy:id===privateId?'private':'public',audio_url:`https://storage.googleapis.com/producer-app-public/clips/${id}.m4a`,duration:{value:'171'}}}}]}}}})}</script>`);
};
assert.deepEqual((await readMusicPlaylist(request)).map(t=>t.id), [first]);
ids = [first, second];
assert.deepEqual((await readMusicPlaylist(request)).map(t=>t.id), [first, second], 'New songs sync');
ids = [second, first];
assert.deepEqual((await readMusicPlaylist(request)).map(t=>t.id), [second, first], 'Source order syncs');
title = 'Updated track title';
assert.equal((await readMusicPlaylist(request))[0].name, title, 'Track title edits sync');
ids = [second];
assert.deepEqual((await readMusicPlaylist(request)).map(t=>t.id), [second], 'Removed songs disappear');
privateId = second;
assert.deepEqual(await readMusicPlaylist(request), [], 'Private songs excluded');
ids = [];
assert.deepEqual(await readMusicPlaylist(request), [], 'Empty playlist is valid');
await assert.rejects(() => readMusicPlaylist(async () => Response.json({unexpected:true})), /format changed/);
console.log('Playlist sync checks passed: additions, removals, reordering, title edits, fresh metadata, private songs, empty playlists, source errors.');
