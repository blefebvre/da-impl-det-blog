/* eslint-env node */
/* eslint-disable no-console, no-await-in-loop, no-restricted-syntax */
/**
 * Read-only backup of the DA content for blefebvre/da-impl-det-blog into .backup/.
 * See BACKUP.md. Requires IMS_TOKEN in the environment.
 *
 * Usage: node tools/backup/backup.mjs [--dry-run]
 */
import { createHash } from 'node:crypto';
import {
  mkdir, readFile, rename, stat, writeFile,
} from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ORG = 'blefebvre';
const SITE = 'da-impl-det-blog';
const DA_ADMIN = 'https://admin.da.live';
const DA_CONTENT = 'https://content.da.live';
const AEM_LIVE = `https://main--${SITE}--${ORG}.aem.live`;
const EXCLUDED_TOP_LEVEL = ['drafts'];
const DOCUMENT_EXTS = ['html', 'json'];
const CONCURRENCY = 6;

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const BACKUP_DIR = path.join(REPO_ROOT, '.backup');
const MANIFEST_PATH = path.join(BACKUP_DIR, 'manifest.json');

const DRY_RUN = process.argv.includes('--dry-run');
const { IMS_TOKEN } = process.env;

const errors = [];
const stats = {
  listed: 0, downloaded: 0, unchanged: 0, markdown: 0, unpublished: 0,
};

/**
 * The only function that performs network requests. It is GET-only and refuses any URL
 * outside this site's read endpoints, so the script cannot modify DA content.
 */
async function safeGet(url, extraHeaders = {}) {
  const u = new URL(url);
  const daPrefixes = ['list', 'source'].map((k) => `/${k}/${ORG}/${SITE}`);
  const isDaAdmin = u.origin === DA_ADMIN
    && daPrefixes.some((p) => u.pathname === p || u.pathname.startsWith(`${p}/`));
  const isAemLive = u.origin === AEM_LIVE;
  if (!isDaAdmin && !isAemLive) throw new Error(`Refusing request outside allowlist: ${u.origin}${u.pathname}`);
  if (u.pathname.split('/').some((seg) => seg === '..' || decodeURIComponent(seg) === '..')) {
    throw new Error(`Refusing path traversal: ${u.pathname}`);
  }

  const headers = { ...extraHeaders };
  if (isDaAdmin) headers.Authorization = `Bearer ${IMS_TOKEN}`;
  return fetch(u, { method: 'GET', headers, redirect: 'error' });
}

/** Resolve a site-relative (decoded) path under .backup/<area>/, refusing anything outside it. */
function localPath(area, relPath) {
  const root = path.join(BACKUP_DIR, area);
  const out = path.resolve(root, `.${relPath}`);
  if (!out.startsWith(`${root}${path.sep}`)) throw new Error(`Refusing to write outside ${root}: ${relPath}`);
  return out;
}

async function exists(file) {
  try {
    await stat(file);
    return true;
  } catch {
    return false;
  }
}

async function writeAtomic(file, data) {
  await mkdir(path.dirname(file), { recursive: true });
  const tmp = `${file}.tmp-${process.pid}`;
  await writeFile(tmp, data);
  await rename(tmp, file);
}

const sha256 = (buf) => createHash('sha256').update(buf).digest('hex');
const sitePrefix = `/${ORG}/${SITE}`;
const toRel = (daPath) => decodeURIComponent(daPath.slice(sitePrefix.length));
const extOf = (rel) => path.extname(rel).slice(1).toLowerCase();

async function listFolder(encodedRel) {
  const items = [];
  let continuation;
  do {
    const res = await safeGet(
      `${DA_ADMIN}/list/${ORG}/${SITE}${encodedRel}`,
      continuation ? { 'da-continuation-token': continuation } : {},
    );
    if (res.status === 404) return items;
    if (!res.ok) throw new Error(`list ${encodedRel || '/'}: HTTP ${res.status}`);
    items.push(...await res.json());
    continuation = res.headers.get('da-continuation-token');
  } while (continuation);
  return items;
}

/** Walk the DA tree, including hidden ".<page>" media folders, returning all files. */
async function walk(encodedRel = '', files = new Map()) {
  const items = await listFolder(encodedRel);
  const subfolders = [];
  items.forEach((item) => {
    if (!item.path.startsWith(`${sitePrefix}/`)) return;
    const encoded = item.path.slice(sitePrefix.length);
    const rel = toRel(item.path);
    if (encodedRel === '' && EXCLUDED_TOP_LEVEL.includes(rel.slice(1))) return;
    if (item.ext) {
      files.set(rel, { encoded, rel, lastModified: item.lastModified });
      if (item.ext === 'html') {
        const dir = encoded.slice(0, encoded.lastIndexOf('/'));
        subfolders.push(`${dir}/.${encoded.slice(dir.length + 1, -'.html'.length)}`);
      }
    } else {
      subfolders.push(encoded);
    }
  });
  for (const sub of subfolders) {
    try {
      await walk(sub, files);
    } catch (e) {
      errors.push(e.message);
    }
  }
  return files;
}

async function runPool(items, fn) {
  const queue = [...items];
  const workers = Array.from({ length: CONCURRENCY }, async () => {
    while (queue.length) {
      const item = queue.shift();
      try {
        await fn(item);
      } catch (e) {
        errors.push(`${item.rel}: ${e.message}`);
      }
    }
  });
  await Promise.all(workers);
}

/** Find media on this site referenced from a DA source document (content.da.live URLs). */
function referencedMedia(html) {
  const prefix = `${DA_CONTENT}${sitePrefix}/`;
  const found = new Map();
  const re = /(?:src|href)="([^"]+)"/g;
  let m = re.exec(html);
  while (m) {
    const url = m[1].replace(/&amp;/g, '&').split(/[?#]/)[0];
    if (url.startsWith(prefix)) {
      const encoded = url.slice(prefix.length - 1);
      try {
        const rel = decodeURIComponent(encoded);
        if (!EXCLUDED_TOP_LEVEL.includes(rel.split('/')[1])) found.set(rel, { encoded, rel });
      } catch {
        errors.push(`Unparseable media URL: ${url}`);
      }
    }
    m = re.exec(html);
  }
  return found;
}

async function main() {
  if (!IMS_TOKEN) {
    console.error('IMS_TOKEN is not set. Refresh your token and export it first (see BACKUP.md).');
    process.exit(2);
  }

  const manifest = (await exists(MANIFEST_PATH))
    ? JSON.parse(await readFile(MANIFEST_PATH, 'utf8'))
    : { org: ORG, site: SITE, files: {} };

  console.log(`Listing DA content for ${ORG}/${SITE}${DRY_RUN ? ' (dry run)' : ''}...`);
  const files = await walk();
  stats.listed = files.size;

  const isDocument = (f) => DOCUMENT_EXTS.includes(extOf(f.rel));
  const changedDocs = new Set();

  const download = async (f) => {
    const out = localPath('da', f.rel);
    const have = await exists(out);
    const prev = manifest.files[f.rel];
    const needed = isDocument(f)
      ? !have || !prev || prev.lastModified !== f.lastModified
      : !have;
    if (!needed) {
      stats.unchanged += 1;
      return;
    }
    if (DRY_RUN) {
      console.log(`  would download ${f.rel}`);
      stats.downloaded += 1;
      return;
    }
    const res = await safeGet(`${DA_ADMIN}/source/${ORG}/${SITE}${f.encoded}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await writeAtomic(out, buf);
    manifest.files[f.rel] = {
      lastModified: f.lastModified ?? null, size: buf.length, sha256: sha256(buf),
    };
    if (extOf(f.rel) === 'html') changedDocs.add(f.rel);
    stats.downloaded += 1;
  };

  await runPool([...files.values()], download);
  if (DRY_RUN) {
    console.log(`Listed ${stats.listed} files; ${stats.downloaded} would be downloaded, ${stats.unchanged} unchanged.`);
    if (errors.length) console.error(`Errors:\n  ${errors.join('\n  ')}`);
    process.exit(errors.length ? 1 : 0);
  }

  // Safety net: media referenced by documents but missing from the listing.
  const htmlDocs = [...files.values()].filter((f) => extOf(f.rel) === 'html');
  const extraMedia = new Map();
  for (const doc of htmlDocs) {
    const file = localPath('da', doc.rel);
    if (await exists(file)) {
      referencedMedia(await readFile(file, 'utf8')).forEach((v, k) => {
        if (!files.has(k)) extraMedia.set(k, v);
      });
    }
  }
  await runPool([...extraMedia.values()], download);

  // Rendered Markdown for published pages (convenience copy, not a restore source).
  const fetchMarkdown = async (doc) => {
    const out = localPath('md', doc.rel.replace(/\.html$/, '.md'));
    if (!changedDocs.has(doc.rel) && await exists(out)) return;
    const res = await safeGet(`${AEM_LIVE}${doc.encoded.replace(/\.html$/, '.md')}`);
    if (res.status === 404) {
      stats.unpublished += 1;
      return;
    }
    if (!res.ok) throw new Error(`markdown HTTP ${res.status}`);
    await writeAtomic(out, Buffer.from(await res.arrayBuffer()));
    stats.markdown += 1;
  };
  await runPool(htmlDocs, fetchMarkdown);

  manifest.files = Object.fromEntries(
    Object.entries(manifest.files).sort(([a], [b]) => a.localeCompare(b)),
  );
  await writeAtomic(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`);

  console.log(`Listed ${stats.listed} files (+${extraMedia.size} referenced media).`);
  console.log(`Downloaded ${stats.downloaded}, unchanged ${stats.unchanged}, markdown ${stats.markdown}, unpublished ${stats.unpublished}.`);
  if (errors.length) {
    console.error(`${errors.length} error(s); backup is incomplete:\n  ${errors.join('\n  ')}`);
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(`Backup failed: ${e.message}`);
  process.exit(1);
});
