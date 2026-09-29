import type { APIRoute } from 'astro';
import { SITE } from '../config/site.ts';

export const GET: APIRoute = () =>
  new Response(
    ['User-agent: *', 'Allow: /', '', `Sitemap: ${new URL('/sitemap-index.xml', SITE.url).href}`, ''].join('\n'),
    { headers: { 'content-type': 'text/plain; charset=utf-8' } },
  );
