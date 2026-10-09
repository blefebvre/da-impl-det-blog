import { readBlockConfig } from '../../scripts/aem.js';
import { fetchPosts, formatDate } from '../../scripts/blog.js';

/**
 * Returns the URL of a listing page; page 1 is the bare listing path.
 * @param {number} page The page number
 */
function pageUrl(page) {
  const url = new URL(window.location.pathname, window.location.origin);
  if (page > 1) url.searchParams.set('page', page);
  return `${url.pathname}${url.search}`;
}

function buildPost(post) {
  const li = document.createElement('li');
  li.className = 'blog-list-post';

  const meta = document.createElement('p');
  meta.className = 'blog-list-date';
  const time = document.createElement('time');
  time.dateTime = post.date;
  time.textContent = formatDate(post.date);
  meta.append(time);

  const link = document.createElement('a');
  link.href = post.path;
  const title = document.createElement('h3');
  title.textContent = post.title || post.path;
  link.append(title);

  li.append(meta, link);
  if (post.description) {
    const summary = document.createElement('p');
    summary.className = 'blog-list-summary';
    summary.textContent = post.description;
    li.append(summary);
  }
  return li;
}

function buildPagination(page, pages) {
  const nav = document.createElement('nav');
  nav.className = 'blog-list-pagination';
  nav.setAttribute('aria-label', 'Pagination');

  const item = (label, target, rel) => {
    if (!target) {
      const span = document.createElement('span');
      span.className = 'disabled';
      span.textContent = label;
      return span;
    }
    const a = document.createElement('a');
    a.href = pageUrl(target);
    a.rel = rel;
    a.textContent = label;
    return a;
  };

  const newer = item('Newer', page > 1 ? page - 1 : 0, 'prev');
  newer.classList.add('blog-list-newer');
  const older = item('Older', page < pages ? page + 1 : 0, 'next');
  older.classList.add('blog-list-older');
  const meta = document.createElement('p');
  meta.className = 'blog-list-page-meta';
  meta.textContent = `Page ${page} of ${pages}`;

  nav.append(newer, older, meta);
  return nav;
}

export default async function decorate(block) {
  const config = readBlockConfig(block);
  const perPage = parseInt(config['posts-per-page'], 10) || 4;
  const prefix = config.path || '/blog/';
  block.textContent = '';

  const posts = await fetchPosts(prefix);
  const pages = Math.max(1, Math.ceil(posts.length / perPage));
  const requested = parseInt(new URLSearchParams(window.location.search).get('page'), 10) || 1;
  const page = Math.min(Math.max(1, requested), pages);
  if (page !== requested) window.history.replaceState(null, '', pageUrl(page));

  const list = document.createElement('ul');
  posts.slice((page - 1) * perPage, page * perPage).forEach((post) => list.append(buildPost(post)));
  if (!list.children.length) {
    const empty = document.createElement('p');
    empty.textContent = 'No posts yet.';
    block.append(empty);
    return;
  }
  block.append(list, buildPagination(page, pages));
}
