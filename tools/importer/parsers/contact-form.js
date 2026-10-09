/* eslint-disable */
/* global WebImporter */
/**
 * Parser for the "contact-form" block (blocks/contact-form/contact-form.js).
 * decorate() rebuilds the form from readBlockConfig() keys: action, redirect, subject, submit.
 *
 * Source: <div class="py2"><form action="https://formspree.io/..." method="POST">
 *           ... <input type="hidden" name="_next" value="/thanks/">
 *           <input type="hidden" name="_subject" value="New submission!">
 *           <input type="submit" value="Say Hello"></form></div>
 * Output: | Contact Form |
 *         | Action   | https://formspree.io/... |
 *         | Redirect | /thanks |
 *         | Subject  | New submission! |
 *         | Submit   | Say Hello |
 */
export default function parse(element, { document }) {
  const form = element.matches('form') ? element : element.querySelector('form');
  if (!form) return;

  const action = (form.getAttribute('action') || '').trim();

  // "/thanks/" -> "/thanks" (clean EDS path; also handles absolute URLs).
  let redirect = ((form.querySelector('input[name="_next"]') || {}).value || '').trim();
  if (redirect) {
    try {
      const url = new URL(redirect, 'https://implementationdetails.dev/');
      if (url.hostname === 'implementationdetails.dev') redirect = url.pathname;
    } catch (e) {
      // keep as-is
    }
    if (redirect.length > 1) redirect = redirect.replace(/\/+$/, '');
  }

  const subject = ((form.querySelector('input[name="_subject"]') || {}).value || '').trim();
  const submitEl = form.querySelector('input[type="submit"], button[type="submit"]');
  const submit = submitEl ? (submitEl.value || submitEl.textContent || '').trim() : '';

  const cells = [];
  if (action) cells.push(['Action', action]);
  if (redirect) cells.push(['Redirect', redirect]);
  if (subject) cells.push(['Subject', subject]);
  if (submit) cells.push(['Submit', submit]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'Contact Form', cells });

  // Replace the form, then drop the wrapping div.py2 if it held nothing else.
  const parent = form.parentElement;
  element.replaceWith(block);
  if (parent && parent.matches('div.py2') && parent.children.length === 1
    && parent.textContent.trim() === block.textContent.trim()) {
    parent.before(block);
    parent.remove();
  }
}
