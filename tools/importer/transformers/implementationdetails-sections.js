/* eslint-disable */
/* global WebImporter */

/**
 * Section transformer for implementationdetails.dev.
 *
 * Driven by payload.template.sections ({ id, name, selector[], style, ... }).
 *  - beforeTransform: walk sections in reverse and insert <hr> before every
 *    non-first section (while the parser targets still exist). Styled sections
 *    get a temporary data-excat-section-id on that <hr>.
 *  - afterTransform: walk in reverse and append a Section Metadata block for
 *    styled sections only, then drop the marker attribute.
 *
 * All current templates use style: null, so no Section Metadata is produced.
 * Templates listed in SINGLE_SECTION_TEMPLATES are authored as one section
 * (blog posts: the h1 from .post-header flows straight into the article body),
 * so no <hr> is inserted for them even though page-templates.json models the
 * header and body as two logical sections.
 */

const SINGLE_SECTION_TEMPLATES = new Set(['blog-post']);
const MARKER = 'data-excat-section-id';

function findSectionElement(root, section) {
  const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
  for (const sel of selectors) {
    if (!sel) continue;
    try {
      const el = root.querySelector(sel);
      if (el) return el;
    } catch (e) {
      // invalid selector: try next
    }
  }
  return null;
}

export default function transform(hookName, element, payload) {
  const template = payload && payload.template;
  const sections = (template && template.sections) || [];
  if (sections.length < 2) return;
  if (template.name && SINGLE_SECTION_TEMPLATES.has(template.name)) return;

  const document = (payload && payload.document) || element.ownerDocument;

  if (hookName === 'beforeTransform') {
    for (let i = sections.length - 1; i >= 1; i -= 1) {
      const section = sections[i];
      const el = findSectionElement(element, section);
      if (!el || !el.parentNode) continue;
      const hr = document.createElement('hr');
      if (section.style) hr.setAttribute(MARKER, section.id);
      el.parentNode.insertBefore(hr, el);
    }
  }

  if (hookName === 'afterTransform') {
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      if (!section.style) continue;
      let anchor = null;
      const marker = element.querySelector(`hr[${MARKER}="${section.id}"]`);
      if (i > 0 && marker) {
        // Section Metadata goes at the end of the section: right before the next section's <hr>
        let next = marker.nextElementSibling;
        while (next && next.tagName !== 'HR') next = next.nextElementSibling;
        anchor = { before: next, parent: marker.parentNode };
        marker.removeAttribute(MARKER);
      } else {
        const el = findSectionElement(element, section);
        if (el) anchor = { after: el };
      }
      if (!anchor) continue;
      const meta = WebImporter.Blocks.createBlock(document, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });
      if (anchor.after) anchor.after.after(meta);
      else if (anchor.before) anchor.parent.insertBefore(meta, anchor.before);
      else anchor.parent.appendChild(meta);
    }
    element.querySelectorAll(`[${MARKER}]`).forEach((el) => el.removeAttribute(MARKER));
  }
}
