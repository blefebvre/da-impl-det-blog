import { fetchNav, renderCall } from '../../scripts/blog.js';

/**
 * Header: site title on the left, social icon links on the right; stacks centred on small screens.
 * The nav fragment holds one section per group: brand (title link), then tools (icon links).
 * The title is written as a call, implementationDetails(): its parentheses take the accent colour.
 * On pages without their own h1 (the listing), the title is the page's h1.
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const nav = await fetchNav();
  if (!nav) return;

  const fragment = document.createElement('div');
  fragment.innerHTML = nav.html;
  // image paths in the fragment are relative to the fragment, not to the current page
  fragment.querySelectorAll('img[src]').forEach((img) => {
    img.src = new URL(img.getAttribute('src'), nav.url).href;
  });
  fragment.querySelectorAll('source[srcset]').forEach((source) => {
    source.srcset = new URL(source.getAttribute('srcset'), nav.url).href;
  });

  const navEl = document.createElement('nav');
  navEl.id = 'nav';
  navEl.setAttribute('aria-label', 'Site');

  const [brandSection, toolsSection] = [...fragment.querySelectorAll(':scope > div')];

  const brand = document.createElement('div');
  brand.className = 'nav-brand';
  const titleLink = brandSection?.querySelector('a');
  if (titleLink) {
    titleLink.className = 'nav-title';
    renderCall(titleLink, titleLink.textContent);
    if (!document.querySelector('main h1')) {
      const h1 = document.createElement('h1');
      h1.className = 'nav-heading';
      h1.append(titleLink);
      brand.append(h1);
    } else {
      brand.append(titleLink);
    }
  }

  const tools = document.createElement('div');
  tools.className = 'nav-tools';
  const links = toolsSection ? [...toolsSection.querySelectorAll('a')] : [];
  if (links.length) {
    const list = document.createElement('ul');
    links.forEach((link) => {
      // icons are vectors: use the SVG rendition rather than the raster fallbacks
      const picture = link.querySelector('picture');
      if (picture) {
        const svgSource = picture.querySelector('source[type="image/svg+xml"]');
        const pictureImg = picture.querySelector('img');
        if (pictureImg && svgSource) [pictureImg.src] = svgSource.srcset.split(/\s+/);
        if (pictureImg) picture.replaceWith(pictureImg);
      }
      const img = link.querySelector('img');
      if (img) {
        link.setAttribute('aria-label', img.alt || link.textContent.trim());
        img.alt = '';
        img.loading = 'eager';
      }
      link.className = 'nav-icon';
      const li = document.createElement('li');
      li.append(link);
      list.append(li);
    });
    tools.append(list);
  }

  navEl.append(brand, tools);
  const wrapper = document.createElement('div');
  wrapper.className = 'nav-wrapper';
  wrapper.append(navEl);
  block.replaceChildren(wrapper);
}
