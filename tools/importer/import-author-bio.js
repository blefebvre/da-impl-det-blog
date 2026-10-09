/* eslint-disable */
/* global WebImporter */

// Imports the author bio shown at the end of every post into the shared /fragments/author-bio
// fragment. Run it against any one blog post URL.

import urlRewriteTransformer from './transformers/implementationdetails-url-rewrite.js';

const PAGE_TEMPLATE = {
  name: 'author-bio',
  description: 'Author bio fragment shared by all blog posts',
  blocks: [],
};

/**
 * Clones the author bio (shared by all posts) into its own fragment document.
 * The TinyLetter subscription was retired, so its sentence is dropped.
 */
function buildBioFragment(document) {
  const source = document.querySelector('.post-footer');
  if (!source) return null;
  const bio = document.createElement('div');
  source.querySelectorAll(':scope > img, :scope > p').forEach((el) => bio.append(el.cloneNode(true)));
  bio.querySelectorAll('img').forEach((img) => {
    img.removeAttribute('class');
    if (!img.getAttribute('alt')) img.setAttribute('alt', 'Bruce Lefebvre');
  });
  bio.querySelectorAll('p').forEach((p) => {
    const subscribe = p.querySelector('a[href*="tinyletter.com"]');
    if (!subscribe) return;
    const twitter = p.querySelector('a[href*="twitter.com"]');
    const contact = p.querySelector('a[href="/contact"], a[href$="/contact"]');
    p.textContent = '';
    p.append('Follow along on ');
    if (twitter) p.append(twitter);
    if (contact) p.append(', or get in touch ', contact, '.');
    else p.append('.');
  });
  bio.append(WebImporter.Blocks.getMetadataBlock(document, { Robots: 'noindex' }));
  return bio;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    urlRewriteTransformer('beforeTransform', document.body, { ...payload, template: PAGE_TEMPLATE });

    const bio = buildBioFragment(document) || document.createElement('div');
    WebImporter.rules.adjustImageUrls(bio, url, params.originalURL);

    return [{
      element: bio,
      path: '/fragments/author-bio',
      report: { title: 'Author bio', template: PAGE_TEMPLATE.name },
    }];
  },
};
