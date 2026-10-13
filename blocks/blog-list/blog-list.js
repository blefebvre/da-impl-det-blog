import { readBlockConfig } from '../../scripts/aem.js';
import {
  fetchPosts, formatDate, fetchNav, renderCall,
} from '../../scripts/blog.js';
import { loadFragment } from '../fragment/fragment.js';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Returns the URL of a listing page; page 1 is the bare listing path.
 * @param {number} page The page number
 */
function pageUrl(page) {
  const url = new URL(window.location.pathname, window.location.origin);
  if (page > 1) url.searchParams.set('page', page);
  return `${url.pathname}${url.search}`;
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function buildPost(post, lead) {
  const li = el('li', `blog-list-post${lead ? ' blog-list-lead' : ''}`);
  const link = el('a', 'blog-list-title-link');
  link.href = post.path;
  const time = el('time', 'blog-list-date', formatDate(post.date));
  time.dateTime = post.date.slice(0, 10);
  link.append(time, el('h3', '', post.title || post.path));
  li.append(link);
  if (post.description) li.append(el('p', 'blog-list-summary', post.description));
  return li;
}

function buildPagination(page, pages) {
  const nav = el('nav', 'blog-list-pagination');
  nav.setAttribute('aria-label', 'Pagination');
  const item = (label, target, rel) => {
    if (!target) return el('span', 'disabled', label);
    const a = el('a', '', label);
    a.href = pageUrl(target);
    a.rel = rel;
    return a;
  };
  nav.append(
    item('Newer', page > 1 ? page - 1 : 0, 'prev'),
    el('span', 'blog-list-page-meta', `Page ${page} of ${pages}`),
    item('Older', page < pages ? page + 1 : 0, 'next'),
  );
  return nav;
}

/**
 * The post browser: posts( … ) is a working call. Its argument is a filter over every post title;
 * a year strip (bar height = posts that year) sets the argument. Without JS the strip still jumps
 * to each year, and every post is listed.
 */
function buildBrowser(posts) {
  const total = posts.length;
  const byYear = new Map();
  posts.forEach((post) => {
    const year = post.date.slice(0, 4);
    if (!byYear.has(year)) byYear.set(year, []);
    byYear.get(year).push(post);
  });
  const years = [...byYear.keys()];
  const maxCount = Math.max(...[...byYear.values()].map((list) => list.length));
  const plural = (n) => `${n} ${n === 1 ? 'post' : 'posts'}`;

  const aside = el('aside', 'blog-list-browser');
  aside.setAttribute('aria-labelledby', 'blog-list-browser-heading');
  const heading = el('h2', 'blog-list-sr', 'All posts');
  heading.id = 'blog-list-browser-heading';

  // posts( input )
  const query = el('p', 'blog-list-call blog-list-query');
  const input = el('input');
  Object.assign(input, {
    id: 'blog-list-filter', type: 'search', placeholder: 'all', autocomplete: 'off', spellcheck: false,
  });
  input.setAttribute('aria-label', 'Filter posts by title or year');
  input.setAttribute('aria-describedby', 'blog-list-hint');
  input.setAttribute('aria-keyshortcuts', '/');
  const [open, close] = ['(', ')'].map((char) => {
    const span = el('span', 'call-paren', char);
    span.setAttribute('aria-hidden', 'true');
    return span;
  });
  const name = el('span', '', 'posts');
  name.setAttribute('aria-hidden', 'true');
  query.append(name, open, input, close);

  const hint = el('p', 'blog-list-hint', 'Type a word or pick a year.');
  hint.id = 'blog-list-hint';
  const kbd = el('span', 'blog-list-kbd-hint');
  kbd.setAttribute('aria-hidden', 'true');
  kbd.append(' Press ', el('kbd', '', '/'), ' to start.');
  hint.append(kbd);

  // year strip: oldest to newest, only years that have posts
  const strip = el('ol', 'blog-list-years');
  strip.setAttribute('aria-label', 'Posts per year');
  const yearLinks = [...years].reverse().map((year) => {
    const n = byYear.get(year).length;
    const mark = el('a');
    mark.style.setProperty('--n', n);
    mark.style.setProperty('--max', maxCount);
    mark.title = `${year} · ${plural(n)}`;
    mark.setAttribute('aria-label', `${year}, ${plural(n)}`);
    mark.append(el('i'), year.slice(2));
    mark.href = `#blog-list-${year}`;
    mark.dataset.year = year;
    mark.setAttribute('role', 'button');
    mark.setAttribute('aria-pressed', 'false');
    const li = el('li');
    li.append(mark);
    strip.append(li);
    return mark;
  });

  const count = el('p', 'blog-list-count');
  count.setAttribute('aria-live', 'polite');
  const countText = el('span', '', plural(total));
  const clear = el('button', 'blog-list-clear', 'clear');
  clear.type = 'button';
  clear.hidden = true;
  clear.append(el('span', 'call-paren', '()'));
  count.append(countText, clear);

  const index = el('div', 'blog-list-index');
  const groups = years.map((year) => {
    const group = el('section', 'blog-list-year');
    group.id = `blog-list-${year}`;
    group.setAttribute('aria-label', year);
    const list = el('ol');
    byYear.get(year).forEach((post) => {
      const li = el('li');
      li.dataset.title = post.title || post.path;
      li.dataset.date = post.date;
      const a = el('a', '', li.dataset.title);
      a.href = post.path;
      const [, m, d] = post.date.slice(0, 10).split('-').map(Number);
      const time = el('time', '', `${MONTHS[m - 1]} ${d}`);
      time.dateTime = post.date.slice(0, 10);
      li.append(a, time);
      list.append(li);
    });
    group.append(el('h3', '', year), list);
    return group;
  });
  const empty = el('p', 'blog-list-empty');
  empty.hidden = true;
  index.append(...groups, empty);

  aside.append(heading, query, hint, strip, count, index);

  // grow the argument with what is typed
  const ctx = document.createElement('canvas').getContext('2d');
  const fit = () => {
    const cs = getComputedStyle(input);
    ctx.font = `${input.value ? 'normal' : 'italic'} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    const { width } = ctx.measureText(input.value || input.placeholder);
    input.style.width = `${Math.ceil(width + parseFloat(cs.fontSize) * 0.3)}px`;
  };

  const highlight = (a, title, term) => {
    a.textContent = '';
    if (!term) {
      a.textContent = title;
      return;
    }
    const lower = title.toLowerCase();
    let i = 0;
    let at = lower.indexOf(term);
    while (at !== -1) {
      if (at > i) a.append(title.slice(i, at));
      a.append(el('mark', '', title.slice(at, at + term.length)));
      i = at + term.length;
      at = lower.indexOf(term, i);
    }
    a.append(title.slice(i));
  };

  const apply = () => {
    const raw = input.value.trim();
    const term = raw.toLowerCase();
    const isYear = /^\d{4}$/.test(raw);
    let shown = 0;
    groups.forEach((group) => {
      let inGroup = 0;
      group.querySelectorAll('li').forEach((li) => {
        const { title, date } = li.dataset;
        const hit = !term || (isYear ? date.startsWith(raw) : title.toLowerCase().includes(term));
        li.hidden = !hit;
        highlight(li.querySelector('a'), title, hit && !isYear ? term : '');
        if (hit) inGroup += 1;
      });
      group.hidden = inGroup === 0;
      shown += inGroup;
    });
    yearLinks.forEach((a) => a.setAttribute('aria-pressed', String(isYear && a.dataset.year === raw)));
    countText.textContent = term ? `${shown} of ${plural(total)}` : plural(total);
    clear.hidden = !term;
    empty.hidden = shown > 0;
    empty.textContent = `No post titles match “${raw}”.`;
    fit();
  };

  input.addEventListener('input', apply);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && input.value) {
      e.preventDefault();
      input.value = '';
      apply();
    }
  });
  clear.addEventListener('click', () => {
    input.value = '';
    apply();
    input.focus();
  });
  yearLinks.forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      input.value = input.value === a.dataset.year ? '' : a.dataset.year;
      apply();
      index.scrollTop = 0;
    });
    a.addEventListener('keydown', (e) => {
      if (e.key === ' ') {
        e.preventDefault();
        a.click();
      }
    });
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return;
    const { target } = e;
    if (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
    e.preventDefault();
    input.focus();
    input.select();
  });
  aside.classList.add('is-interactive');
  document.fonts?.ready.then(fit);
  requestAnimationFrame(fit);
  return aside;
}

/**
 * The sign-off: the avatar and first bio paragraph from the author bio fragment, then the wordmark.
 * Filled after the listing renders so the fragment never delays the first paint.
 */
async function fillSignOff(section, path) {
  const [fragment, nav] = await Promise.all([
    loadFragment(path).catch(() => null),
    fetchNav().catch(() => null),
  ]);
  const picture = fragment?.querySelector('picture');
  // only the bio itself: the fragment's follow/contact line stays on the post pages
  const bio = fragment ? [...fragment.querySelectorAll('p')]
    .find((p) => !p.querySelector('picture') && p.textContent.trim()) : null;
  if (!bio) return;

  const card = el('div', 'blog-list-signoff-card');
  if (picture) {
    const img = picture.querySelector('img');
    if (img) img.loading = 'lazy';
    card.append(picture);
  }
  const text = el('div', 'blog-list-signoff-text');
  text.append(bio);
  card.append(text);
  section.append(card);

  const navDoc = el('div');
  navDoc.innerHTML = nav?.html || '';
  const titleLink = navDoc.querySelector('a');
  if (titleLink) {
    const mark = el('p', 'blog-list-signoff-mark');
    const a = el('a');
    a.href = titleLink.getAttribute('href') || '/';
    renderCall(a, titleLink.textContent);
    mark.append(a);
    section.append(mark);
  }
  section.hidden = false;
}

export default async function decorate(block) {
  const config = readBlockConfig(block);
  const perPage = parseInt(config['posts-per-page'], 10) || 4;
  const prefix = config.path || '/blog/';
  const bioPath = config['author-bio'] ?? '/fragments/author-bio';
  block.textContent = '';

  const posts = await fetchPosts(prefix);
  const pages = Math.max(1, Math.ceil(posts.length / perPage));
  const requested = parseInt(new URLSearchParams(window.location.search).get('page'), 10) || 1;
  const page = Math.min(Math.max(1, requested), pages);
  if (page !== requested) window.history.replaceState(null, '', pageUrl(page));

  const pagePosts = posts.slice((page - 1) * perPage, page * perPage);
  if (!pagePosts.length) {
    block.append(el('p', '', 'No posts yet.'));
    return;
  }

  // latest(): the newest post leads at display size on page 1; later pages are rows only
  const reading = el('section', 'blog-list-reading');
  reading.setAttribute('aria-labelledby', 'blog-list-heading');
  const heading = renderCall(el('h2', 'blog-list-call'), page === 1 ? 'latest()' : `latest(page: ${page})`);
  heading.id = 'blog-list-heading';
  const list = el('ol', 'blog-list-posts');
  pagePosts.forEach((post, i) => list.append(buildPost(post, page === 1 && i === 0)));
  reading.append(heading, list, buildPagination(page, pages));

  block.append(reading, buildBrowser(posts));

  if (bioPath && bioPath !== 'none') {
    const signOff = el('section', 'blog-list-signoff');
    signOff.setAttribute('aria-label', 'About the author');
    signOff.hidden = true;
    block.append(signOff);
    fillSignOff(signOff, bioPath);
  }
}
