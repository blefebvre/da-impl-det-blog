#!/usr/bin/env node
/* eslint-disable no-console, no-await-in-loop, no-restricted-syntax -- sequential CLI script */
/*
 * Uploads the imported blog content to Document Authoring, then previews (optionally publishes).
 *
 *   node tools/da-upload/upload.mjs                 # dry run: lists what would be uploaded
 *   node tools/da-upload/upload.mjs --run           # upload images, pages and redirects; preview
 *   node tools/da-upload/upload.mjs --run --publish # ...and publish
 *   node tools/da-upload/upload.mjs --run --paths=/nav,/footer  # only these documents
 *
 * Images are uploaded to DA at their original path (e.g. /images/aem/trial/foo.png) so links to
 * them from outside the site keep working after the domain switch. Credentials for admin.da.live
 * and admin.hlx.page are expected to be provided by the environment.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { extname, join, relative } from 'node:path';

const ORG = 'blefebvre';
const REPO = 'da-impl-det-blog';
const SOURCE_ORIGIN = 'https://implementationdetails.dev';
const DA_SOURCE = `https://admin.da.live/source/${ORG}/${REPO}`;
const DA_CONTENT = `https://content.da.live/${ORG}/${REPO}`;
const ADMIN = 'https://admin.hlx.page';
// boilerplate documents that already live in DA and are not part of this migration
const SKIP = new Set(['/nav', '/footer']);

const args = process.argv.slice(2);
const run = args.includes('--run');
const publish = args.includes('--publish');
const only = (args.find((a) => a.startsWith('--paths=')) || '').slice(8).split(',').filter(Boolean);
const MIME = {
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp',
};

/**
 * Content paths are served lowercase with anything but [a-z0-9] turned into hyphens,
 * so e.g. /images/app_screenshot.png must be stored as /images/app-screenshot.png.
 */
function sanitizePath(path) {
  return path.split('/').map((segment) => {
    const dot = segment.lastIndexOf('.');
    const [name, ext] = dot > 0 ? [segment.slice(0, dot), segment.slice(dot)] : [segment, ''];
    const clean = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    return `${clean}${ext.toLowerCase()}`;
  }).join('/');
}

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

async function check(resp, what) {
  if (!resp.ok) {
    const text = await resp.text().catch(() => '');
    throw new Error(`${what} failed: ${resp.status} ${text.slice(0, 200)}`);
  }
}

async function daPut(path, blob, type) {
  const form = new FormData();
  form.append('data', new Blob([blob], { type }), path.split('/').pop());
  const resp = await fetch(`${DA_SOURCE}${path}`, { method: 'POST', body: form });
  await check(resp, `upload ${path}`);
}

async function admin(action, path) {
  const resp = await fetch(`${ADMIN}/${action}/${ORG}/${REPO}/main${path}`, { method: 'POST' });
  await check(resp, `${action} ${path}`);
}

const pages = walk('content')
  .filter((f) => f.endsWith('.plain.html'))
  .map((f) => ({ file: f, path: `/${relative('content', f).replace(/\.plain\.html$/, '')}` }))
  .filter((p) => (only.length ? only.includes(p.path) : !SKIP.has(p.path)));

// site path -> local file for images stored next to the content, or null to download from source
const images = new Map();
pages.forEach((p) => {
  p.html = readFileSync(p.file, 'utf8');
  for (const [, src] of p.html.matchAll(/src="(https?:\/\/implementationdetails\.dev\/[^"]+)"/g)) {
    images.set(new URL(src).pathname, null);
  }
  p.html = p.html.replace(
    /(src|srcset)="https?:\/\/implementationdetails\.dev(\/[^"]+)"/g,
    (_, attr, path) => `${attr}="${DA_CONTENT}${sanitizePath(new URL(path, SOURCE_ORIGIN).pathname)}"`,
  );
  p.html = p.html.replace(/src="(?![a-z]+:|\/)([^"]+)"/g, (_, src) => {
    const { pathname } = new URL(src, `${SOURCE_ORIGIN}${p.path}`);
    images.set(pathname, join('content', pathname));
    return `src="${DA_CONTENT}${sanitizePath(pathname)}"`;
  });
});
const withRedirects = !only.length;

console.log(`${pages.length} pages, ${images.size} images${withRedirects ? ', 1 redirects sheet' : ''}`);
if (!run) {
  pages.forEach((p) => console.log(`  page  ${p.path}`));
  [...images.keys()].forEach((i) => console.log(`  image ${i}`));
  console.log('Dry run only. Re-run with --run to upload.');
  process.exit(0);
}

for (const [image, localFile] of images) {
  if (localFile) {
    await daPut(sanitizePath(image), readFileSync(localFile), MIME[extname(localFile)] || 'application/octet-stream');
  } else {
    const resp = await fetch(`${SOURCE_ORIGIN}${image}`);
    await check(resp, `download ${image}`);
    await daPut(sanitizePath(image), await resp.arrayBuffer(), resp.headers.get('content-type') || 'application/octet-stream');
  }
  console.log(`uploaded ${sanitizePath(image)}`);
}

for (const page of pages) {
  const doc = `<body><header></header><main>${page.html}</main><footer></footer></body>`;
  await daPut(`${page.path}.html`, doc, 'text/html');
  console.log(`uploaded ${page.path}`);
}

if (withRedirects) {
  await daPut('/redirects.json', readFileSync('tools/config/redirects.json', 'utf8'), 'application/json');
  console.log('uploaded /redirects.json');
}

const targets = [
  ...[...images.keys()].map(sanitizePath),
  ...(withRedirects ? ['/redirects.json'] : []),
  ...pages.map((p) => p.path),
];
for (const action of publish ? ['preview', 'live'] : ['preview']) {
  for (const target of targets) {
    await admin(action, target);
    console.log(`${action} ${target}`);
  }
}
console.log('Done.');
