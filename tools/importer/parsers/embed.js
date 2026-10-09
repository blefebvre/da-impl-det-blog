/* eslint-disable */
/* global WebImporter */
/**
 * Parser for the project's custom "embed" block (blocks/embed/embed.js), which
 * intentionally differs from the library "Embed (video/social)" convention:
 * decorate() reads the first <a> as the URL and any cell whose text matches
 * /^\d+:\d+$/ as the aspect ratio (default 16:9).
 *
 * Source: <iframe src="//www.slideshare.net/slideshow/embed_code/39421014"
 *          width="476" height="400"> inside article.post-content (often in a <p>).
 * Output: | Embed |
 *         | <a href="https://...">https://...</a> | 476:400 |
 */
export default function parse(element, { document }) {
  const iframe = element.matches('iframe') ? element : element.querySelector('iframe');
  if (!iframe) return;

  const rawSrc = (iframe.getAttribute('src') || iframe.getAttribute('data-src') || '').trim();
  if (!rawSrc) {
    element.remove();
    return;
  }

  // Protocol-relative / http -> absolute https URL.
  let href = rawSrc.startsWith('//') ? `https:${rawSrc}` : rawSrc;
  try {
    const url = new URL(href, 'https://implementationdetails.dev/');
    url.protocol = 'https:';
    href = url.href;
  } catch (e) {
    // keep best-effort href
  }

  const link = document.createElement('a');
  link.href = href;
  link.textContent = href;

  const row = [link];
  const width = parseInt(iframe.getAttribute('width'), 10);
  const height = parseInt(iframe.getAttribute('height'), 10);
  if (width > 0 && height > 0) row.push(`${width}:${height}`);

  const cells = [row];
  const block = WebImporter.Blocks.createBlock(document, { name: 'Embed', cells });

  // Replace the wrapping <p> as well when the iframe is its only content.
  const parent = iframe.parentElement;
  if (parent && parent.tagName === 'P' && parent.children.length === 1 && !parent.textContent.trim()) {
    parent.replaceWith(block);
  } else {
    element.replaceWith(block);
  }
}
