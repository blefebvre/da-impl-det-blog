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
