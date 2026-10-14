import { getMetadata } from './aem.js';

/**
 * Formats an ISO date (YYYY-MM-DD) the way the original blog did, e.g. "Nov 6, 2018".
 * @param {string} iso ISO date string
 * @returns {string} The formatted date, or the input if it can't be parsed
 */
export function formatDate(iso) {
  const date = new Date(`${(iso || '').trim().slice(0, 10)}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return iso || '';
  return date.toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC',
  });
}

/**
 * Fetches all blog posts from the query index, newest first by original publish date.
 * @param {string} [prefix] Only include pages under this path
 * @returns {Promise<Array<object>>} The posts
 */
export async function fetchPosts(prefix = '/blog/') {
  const posts = [];
  const limit = 500;
  let offset = 0;
  let total = Infinity;
  while (offset < total) {
    // eslint-disable-next-line no-await-in-loop
    const resp = await fetch(`/query-index.json?offset=${offset}&limit=${limit}`);
    if (!resp.ok) break;
    // eslint-disable-next-line no-await-in-loop
    const json = await resp.json();
    posts.push(...(json.data || []));
    total = json.total || 0;
    offset += limit;
  }
  return posts
    .filter((p) => p.path && p.path.startsWith(prefix) && /^\d{4}-\d{2}-\d{2}/.test(p.date || ''))
    .filter((p) => !(p.robots || '').includes('noindex'))
    .sort((a, b) => b.date.localeCompare(a.date) || a.path.localeCompare(b.path));
}

/**
 * Fetches the nav fragment (the page's `nav` metadata, or /nav).
 * @returns {Promise<{html: string, url: URL}|null>}
 */
export async function fetchNav() {
  const meta = getMetadata('nav');
  const path = meta ? new URL(meta, window.location).pathname : '/nav';
  const resp = await fetch(`${path}.plain.html`);
  if (!resp.ok) return null;
  return { html: await resp.text(), url: new URL(resp.url, window.location.href) };
}

/**
 * Renders text written as a function call, e.g. "latest()" or "posts(2019)", into an element:
 * the name stays in ink, the parentheses take the accent colour, an argument sits between them.
 * Text that is not a call is rendered as is.
 * @param {Element} el The element to fill
 * @param {string} text The call text
 * @returns {Element} The element
 */
export function renderCall(el, text) {
  const match = (text || '').trim().match(/^(.*?)\((.*)\)$/);
  if (!match) {
    el.textContent = text;
    return el;
  }
  const [, name, arg] = match;
  const paren = (char) => {
    const span = document.createElement('span');
    span.className = 'call-paren';
    span.textContent = char;
    return span;
  };
  el.replaceChildren(name, paren('('));
  if (arg) el.append(arg);
  el.append(paren(')'));
  return el;
}
