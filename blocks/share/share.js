import { getMetadata } from '../../scripts/aem.js';

const DEFAULT_TWITTER_HANDLE = '@brucelefebvre';

/**
 * Share block: "Share this post on Twitter" link for the current page.
 */
export default function decorate(block) {
  const handle = getMetadata('twitter:creator') || DEFAULT_TWITTER_HANDLE;
  const title = getMetadata('og:title') || document.title;
  const url = new URL(window.location.pathname, window.location.origin).href;

  const intent = new URL('https://twitter.com/intent/tweet');
  intent.searchParams.set('text', `${title} - by ${handle}:`);
  intent.searchParams.set('url', url);

  const link = document.createElement('a');
  link.href = intent.href;
  link.target = '_blank';
  link.rel = 'nofollow noopener';
  link.title = 'Share on Twitter';
  link.textContent = 'Twitter';

  const label = document.createElement('p');
  label.append('Share this post on ', link);
  block.replaceChildren(label);
}
