/* eslint-disable */
/* global WebImporter */

/**
 * Cleanup transformer for implementationdetails.dev (Jekyll/Pixyll).
 *
 * beforeTransform (affects block/default-content matching):
 *  - site chrome: #cta, header.site-header, site footer, .share-page and the
 *    <hr> right before it, #disqus_thread, #disqus_recommendations
 *  - script, noscript, link, style
 *  - iframes NOT inside article.post-content (Disqus, tracking/ad frames);
 *    iframes inside article.post-content (e.g. SlideShare) are kept for the embed parser
 *  - .post-header .post-meta spans (date/author/read time come from metadata)
 *    and the stray <br> in .post-header; the h1 is kept
 *  - Rouge code blocks normalized to plain <pre><code>TEXT</code></pre>
 *
 * afterTransform (final cleanup):
 *  - .post-footer (author bio). It is intentionally kept through
 *    beforeTransform and parsing so the import script can clone it
 *    (document.querySelector('.post-footer')) before/inside its own transform
 *    step; it is only removed here, at the very end.
 *  - any leftover chrome/iframes outside article content, inline event handlers.
 *  HTML comments are never removed (XWalk field hints).
 */

const CHROME_SELECTORS = [
  '#cta',
  'header.site-header',
  'footer.center',
  '.share-page',
  '#disqus_thread',
  '#disqus_recommendations',
  'script',
  'noscript',
  'link',
  'style',
];

const CONTENT_ROOT = 'article.post-content';

function removeAll(root, selectors) {
  selectors.forEach((sel) => {
    root.querySelectorAll(sel).forEach((el) => el.remove());
  });
}

/** Site footer(s): any <footer> that is not part of the authored article. */
function removeSiteFooters(root) {
  root.querySelectorAll('footer').forEach((el) => {
    if (!el.closest(CONTENT_ROOT)) el.remove();
  });
}

/** Tracking / ad / comment iframes: anything not inside article.post-content. */
function removeForeignIframes(root) {
  root.querySelectorAll('iframe').forEach((el) => {
    if (!el.closest(CONTENT_ROOT)) el.remove();
  });
}

/** The <hr> immediately preceding .share-page (must run before .share-page is removed). */
function removeShareHr(root) {
  root.querySelectorAll('.share-page').forEach((share) => {
    let prev = share.previousElementSibling;
    if (prev && prev.tagName === 'HR') {
      prev.remove();
      return;
    }
    // malformed markup: the share block can end up nested inside the <hr>
    // or the <hr> can be the last element before the share block's parent
    const parent = share.parentElement;
    if (parent && parent.tagName === 'HR') {
      parent.replaceWith(...parent.childNodes);
      return;
    }
    prev = parent && parent.previousElementSibling;
    if (prev && prev.tagName === 'HR' && parent.firstElementChild === share) prev.remove();
  });
}

function cleanPostHeader(root) {
  root.querySelectorAll('.post-header').forEach((header) => {
    header.querySelectorAll('.post-meta').forEach((el) => el.remove());
    header.querySelectorAll(':scope > br').forEach((el) => el.remove());
  });
}

/** Extract code text from a Rouge container (ignores line-number gutters). */
function codeText(container) {
  const codeCell = container.querySelector('td.code, td.rouge-code');
  const source = codeCell
    ? (codeCell.querySelector('pre') || codeCell)
    : (container.querySelector('pre code')
      || container.querySelector('code')
      || container.querySelector('pre')
      || container);
  return source.textContent.replace(/\n+$/, '');
}

function makePlainPre(document, text) {
  const pre = document.createElement('pre');
  const code = document.createElement('code');
  code.textContent = text;
  pre.append(code);
  return pre;
}

/**
 * Rouge renders:
 *   figure.highlight > pre > code[data-lang] (optionally with table.rouge-table)
 *   div.highlighter-rouge > div.highlight > pre.highlight > code
 * Normalize each to <pre><code>TEXT</code></pre> replacing the wrapper.
 * Inline <code> (not inside <pre>/rouge wrappers) is left untouched.
 */
function normalizeCodeBlocks(root, document) {
  const wrappers = root.querySelectorAll(
    'figure.highlight, div.highlighter-rouge, div.highlight, table.rouge-table',
  );
  wrappers.forEach((wrapper) => {
    if (!wrapper.isConnected) return; // inner wrapper of an already-replaced outer one
    // inline code with the highlighter-rouge class is a <code>, not a div, so it is not matched
    if (!wrapper.querySelector('pre, code, td.code')) return;
    wrapper.replaceWith(makePlainPre(document, codeText(wrapper)));
  });

  // any remaining <pre> with token spans or line-number tables
  root.querySelectorAll('pre').forEach((pre) => {
    const code = pre.querySelector(':scope > code');
    const onlyText = code
      && pre.children.length === 1
      && code.children.length === 0
      && code.attributes.length === 0
      && pre.attributes.length === 0;
    if (onlyText) return;
    pre.replaceWith(makePlainPre(document, codeText(pre)));
  });
}

function removeEventHandlers(root) {
  root.querySelectorAll('*').forEach((el) => {
    [...el.attributes].forEach((attr) => {
      if (/^on/i.test(attr.name)) el.removeAttribute(attr.name);
    });
  });
}

export default function transform(hookName, element, payload) {
  const document = (payload && payload.document) || element.ownerDocument;

  if (hookName === 'beforeTransform') {
    removeShareHr(element);
    removeAll(element, CHROME_SELECTORS);
    removeSiteFooters(element);
    removeForeignIframes(element);
    cleanPostHeader(element);
    normalizeCodeBlocks(element, document);
  }

  if (hookName === 'afterTransform') {
    // author bio: removed last so the import script can clone it first
    removeAll(element, ['.post-footer']);
    removeAll(element, CHROME_SELECTORS);
    removeSiteFooters(element);
    removeForeignIframes(element);
    removeEventHandlers(element);
  }
}
