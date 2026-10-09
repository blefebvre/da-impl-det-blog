/**
 * Fetches the footer fragment: the local content folder first, then the site root (DA/EDS).
 * @returns {Promise<string|null>} The fragment HTML
 */
async function fetchFooter() {
  let resp = await fetch('/content/footer.plain.html');
  if (!resp.ok) resp = await fetch('/footer.plain.html');
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
