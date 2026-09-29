// Serves the generated game library at /data/library.json (a static file after build).
// Nothing links to it; the hidden library (scripts/panel) fetches it on demand.
import type { APIRoute } from 'astro';
import { GAME_DATA } from '../../lib/games/data.ts';

export const GET: APIRoute = () => {
  const { count, categories, games } = GAME_DATA; // leave out the local source path
  return new Response(JSON.stringify({ count, categories, games }), {
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
};
