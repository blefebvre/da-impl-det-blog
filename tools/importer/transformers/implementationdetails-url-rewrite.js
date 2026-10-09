/* eslint-disable */
/* global WebImporter */

/**
 * Link / image URL rewriting for implementationdetails.dev (Jekyll/Pixyll).
 *
 * rewriteUrl(href, options) is a pure function (no DOM access) so it can be
 * unit-tested and reused (e.g. by the import script for the cloned author bio).
 * It is idempotent: feeding its output back in returns the same value.
 *
 * Exposure: the transformer validator / importer bundle evaluates transformer
 * files as classic scripts (only `export default` is rewritten), so named
 * `export`s are a syntax error there. The helpers are therefore attached as
 * properties of the default export:
 *   import urlRewrite from './transformers/implementationdetails-url-rewrite.js';
 *   urlRewrite.rewriteUrl('/contact/');            // '/contact'
 *   urlRewrite.rewriteLinks(element, originalURL);  // in-place DOM rewrite
 *   urlRewrite.ORIGIN;                              // 'https://implementationdetails.dev'
 *
 * Rules (only for URLs that are relative or on implementationdetails.dev,
 * http/https/protocol-relative, with or without www):
 *   /blog/YYYY/MM/DD/slug/[index.html][?q][#h] -> /blog/YYYY/MM/DD/slug[#h]
 *   /contact/ -> /contact, /thanks/ -> /thanks  (hash kept)
 *   / , /index.html, https://implementationdetails.dev -> /
 *   /pageN, /pageN/ -> /?page=N
 *   /assets/<deck>/...  -> path kept; directory paths get index.html appended
 *                          (/assets/<deck>/ -> /assets/<deck>/index.html),
 *                          query and hash (e.g. #/42) preserved
 *   /images/...         -> https://implementationdetails.dev/images/... (absolute,
 *                          so the importer can download it). Any on-host <img src>
 *                          is made absolute for the same reason.
 *   other on-host paths -> relative path, trailing slash / index.html dropped, hash kept
 * Everything else (external hosts, mailto:, tel:, javascript:, data:, #anchors)
 * is returned unchanged.
 */

const ORIGIN = 'https://implementationdetails.dev';
const HOST_RE = /^(www\.)?implementationdetails\.dev$/i;
const SKIP_RE = /^(#|mailto:|tel:|javascript:|data:|blob:)/i;
const ABSOLUTE_RE = /^[a-z][a-z0-9+.-]*:/i;

/**
 * Splits an on-host URL into { path, search, hash } or returns null when the
 * URL is not on implementationdetails.dev / cannot be resolved.
 */
function toLocalParts(href, baseUrl) {
  let url;
  try {
    if (href.startsWith('//')) {
      url = new URL(`https:${href}`);
    } else if (ABSOLUTE_RE.test(href)) {
      url = new URL(href);
    } else if (href.startsWith('/')) {
      url = new URL(href, ORIGIN);
    } else {
      // document-relative (./images/x.png, ../foo/): needs an on-host base
      if (!baseUrl) return null;
      const base = new URL(baseUrl);
      if (!HOST_RE.test(base.hostname)) return null;
      url = new URL(href, `${ORIGIN}${base.pathname}`);
    }
  } catch (e) {
    return null;
  }
  if (!/^https?:$/.test(url.protocol) || !HOST_RE.test(url.hostname)) return null;
  return { path: url.pathname || '/', search: url.search || '', hash: url.hash || '' };
}

/**
 * @param {string} href original href/src value
 * @param {object} [options]
 * @param {string} [options.baseUrl] original page URL, used to resolve document-relative URLs
 * @param {boolean} [options.isImage] true for <img src>: on-host images become absolute
 * @returns {string} rewritten URL (or the input unchanged)
 */
function rewriteUrl(href, options = {}) {
  if (typeof href !== 'string') return href;
  const raw = href.trim();
  if (!raw || SKIP_RE.test(raw)) return href;

  const parts = toLocalParts(raw, options.baseUrl);
  if (!parts) return href;
  const { search, hash } = parts;
  let path = parts.path.replace(/\/{2,}/g, '/');

  // images (and any on-host image src) -> absolute so they can be downloaded
  if (/^\/images\//i.test(path) || options.isImage) {
    return `${ORIGIN}${path}${search}${hash}`;
  }

  // legacy static decks / resume served from the code repo
  const deck = path.match(/^\/assets\/[^/]+(\/.*)?$/i);
  if (deck) {
    let p = path;
    if (p.endsWith('/')) {
      p = `${p}index.html`;
    } else {
      const last = p.substring(p.lastIndexOf('/') + 1);
      if (!last.includes('.')) p = `${p}/index.html`;
    }
    return `${p}${search}${hash}`;
  }

  // home
  if (path === '/' || /^\/index\.html?$/i.test(path)) {
    return `/${search}${hash}`;
  }

  // paginated listing
  const page = path.match(/^\/page(\d+)\/?(index\.html?)?$/i);
  if (page) {
    return `/?page=${page[1]}${hash}`;
  }

  // blog posts
  const post = path.match(/^\/blog\/(\d{4})\/(\d{2})\/(\d{2})\/([^/]+?)(?:\/(?:index\.html?)?)?$/i);
  if (post) {
    return `/blog/${post[1]}/${post[2]}/${post[3]}/${post[4]}${hash}`;
  }

  // simple pages
  const simple = path.match(/^\/(contact|thanks)(?:\/(?:index\.html?)?)?$/i);
  if (simple) {
    return `/${simple[1].toLowerCase()}${hash}`;
  }

  // any other on-host path: relative, no trailing slash / index.html
  let p = path.replace(/\/index\.html?$/i, '/');
  if (p.length > 1) p = p.replace(/\/+$/, '');
  return `${p || '/'}${search}${hash}`;
}

/**
 * Applies rewriteUrl to every a[href] and img[src] under root (in place).
 */
function rewriteLinks(root, baseUrl) {
  if (!root || !root.querySelectorAll) return;
  root.querySelectorAll('a[href]').forEach((a) => {
    const href = a.getAttribute('href');
    const next = rewriteUrl(href, { baseUrl });
    if (next !== href) a.setAttribute('href', next);
  });
  root.querySelectorAll('img[src]').forEach((img) => {
    const src = img.getAttribute('src');
    const next = rewriteUrl(src, { baseUrl, isImage: true });
    if (next !== src) img.setAttribute('src', next);
  });
}

/**
 * Runs in BOTH hooks (rewriting is idempotent):
 *  - beforeTransform: so parsers and the import script (e.g. when cloning
 *    .post-footer for the author bio) already see rewritten URLs.
 *  - afterTransform: to catch any links/images created by parsers.
 */
export default function transform(hookName, element, payload) {
  if (hookName !== 'beforeTransform' && hookName !== 'afterTransform') return;
  const baseUrl = (payload && payload.params && payload.params.originalURL) || undefined;
  rewriteLinks(element, baseUrl);
}

transform.rewriteUrl = rewriteUrl;
transform.rewriteLinks = rewriteLinks;
transform.ORIGIN = ORIGIN;
