import { getMetadata } from '../../scripts/aem.js';

/**
 * Fetches the footer fragment (the page's `footer` metadata, or /footer).
 * @returns {Promise<string|null>} The fragment HTML
 */
async function fetchFooter() {
  const meta = getMetadata('footer');
  const path = meta ? new URL(meta, window.location).pathname : '/footer';
  const resp = await fetch(`${path}.plain.html`);
  return resp.ok ? resp.text() : null;
}

/**
 * Footer: renders the fragment's sections; links to other sites open in a new tab.
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const html = await fetchFooter();
  if (!html) return;

  const fragment = document.createElement('div');
  fragment.innerHTML = html;

  const sections = [...fragment.querySelectorAll(':scope > div')].map((section) => {
    section.classList.add('footer-section');
    return section;
  });

  sections.forEach((section) => {
    section.querySelectorAll('a[href]').forEach((a) => {
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin && url.protocol.startsWith('http')) {
        a.target = '_blank';
        a.rel = 'noopener';
      }
    });
  });

  block.replaceChildren(...sections);
}
