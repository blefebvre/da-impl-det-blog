#!/usr/bin/env node
/* eslint-disable no-console */
/*
 * Generates /feed.xml (RSS 2.0) from the query index.
 *
 *   node tools/feed/generate-feed.mjs                     # read the live query index
 *   node tools/feed/generate-feed.mjs --source <url>      # read a specific host's query index
 *   node tools/feed/generate-feed.mjs --content content   # read local imported .plain.html files
 *
 * GUIDs keep the trailing-slash form used by the original Jekyll feed so existing
 * subscribers don't see every post again after the migration.
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const ORIGIN = 'https://implementationdetails.dev';
const DEFAULT_SOURCE = 'https://main--da-impl-det-blog--blefebvre.aem.live';
const TITLE = 'implementationDetails()';
const DESCRIPTION = 'Articles on AEM, React Native, TypeScript, and more.';
const MAX_ITEMS = 10;

const args = process.argv.slice(2);
const arg = (name) => {
  const i = args.indexOf(name);
  return i === -1 ? undefined : args[i + 1];
};

const escapeXml = (s) => String(s || '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

const decodeEntities = (s) => s
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"')
  .replace(/&#39;/g, "'")
  .replace(/&amp;/g, '&');

async function fromIndex(source) {
  const rows = [];
  let offset = 0;
  let total = Infinity;
  while (offset < total) {
    // eslint-disable-next-line no-await-in-loop
    const resp = await fetch(`${source}/query-index.json?offset=${offset}&limit=500`);
    if (!resp.ok) throw new Error(`Failed to fetch query index: ${resp.status}`);
    // eslint-disable-next-line no-await-in-loop
    const json = await resp.json();
    rows.push(...(json.data || []));
    total = json.total || 0;
    offset += 500;
  }
  return rows;
}

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

function fromContent(dir) {
  return walk(dir)
    .filter((file) => file.endsWith('.plain.html'))
    .map((file) => {
      const html = readFileSync(file, 'utf8');
      const meta = {};
      const block = html.slice(html.indexOf('<div class="metadata">'));
      [...block.matchAll(/<div><div>([^<]+)<\/div><div>(.*?)<\/div><\/div>/g)].forEach(([, key, value]) => {
        meta[key.trim().toLowerCase()] = decodeEntities(value.replace(/<[^>]+>/g, '').trim());
      });
      return { path: `/${relative(dir, file).replace(/\.plain\.html$/, '')}`, ...meta };
    });
}

function toItem(post) {
  const link = `${ORIGIN}${post.path}`;
  const pubDate = new Date(`${post.date.slice(0, 10)}T00:00:00Z`).toUTCString().replace('GMT', '+0000');
  return `    <item>
      <title>${escapeXml(post.title)}</title>
      <description>${escapeXml(post.description)}</description>
      <pubDate>${pubDate}</pubDate>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="false">${escapeXml(`${link}/`)}</guid>
    </item>`;
}

const contentDir = arg('--content');
const rows = contentDir ? fromContent(contentDir) : await fromIndex(arg('--source') || DEFAULT_SOURCE);
const posts = rows
  .filter((p) => p.path && p.path.startsWith('/blog/') && /^\d{4}-\d{2}-\d{2}/.test(p.date || ''))
  .filter((p) => !(p.robots || '').includes('noindex'))
  .sort((a, b) => b.date.localeCompare(a.date) || a.path.localeCompare(b.path))
  .slice(0, MAX_ITEMS);

if (!posts.length) {
  console.error('No posts found; leaving feed.xml unchanged.');
  process.exit(1);
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(TITLE)}</title>
    <description>${escapeXml(DESCRIPTION)}</description>
    <link>${ORIGIN}/</link>
    <atom:link href="${ORIGIN}/feed.xml" rel="self" type="application/rss+xml" />
${posts.map(toItem).join('\n')}
  </channel>
</rss>
`;

writeFileSync(arg('--out') || 'feed.xml', xml);
console.log(`Wrote ${posts.length} items to ${arg('--out') || 'feed.xml'}`);
