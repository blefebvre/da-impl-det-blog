/* eslint-disable */
/* global WebImporter */

import contactFormParser from './parsers/contact-form.js';
import cleanupTransformer from './transformers/implementationdetails-cleanup.js';
import sectionsTransformer from './transformers/implementationdetails-sections.js';
import urlRewriteTransformer from './transformers/implementationdetails-url-rewrite.js';

const PAGE_TEMPLATE = {
  name: 'simple-page',
  description: 'Simple content page with a heading and body (contact form, thank-you message)',
  representativeUrl: 'https://implementationdetails.dev/contact/',
  blocks: [{ name: 'contact-form', instances: ['article.post-content form'] }],
  urlPattern: '/*',
  sections: [
    {
      id: 'rc1', name: 'page-content', selector: ['div.post'], style: null, blocks: ['contact-form'], defaultContent: ['header.post-header h1', 'article.post-content > p'],
    },
  ],
};

const parsers = { 'contact-form': contactFormParser };
const transformers = [urlRewriteTransformer, cleanupTransformer, sectionsTransformer];

// the thank-you page is only reached after submitting the contact form
const NOINDEX_PATHS = ['/thanks'];

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((fn) => {
    try { fn(hookName, element, enhancedPayload); } catch (e) { console.error(`Transformer failed at ${hookName}:`, e); }
  });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      document.querySelectorAll(selector).forEach((element) => {
        pageBlocks.push({ name: blockDef.name, selector, element });
      });
    });
  });
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/index\.html?$/, '')
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    const meta = { Title: (document.querySelector('.post-header h1, h1')?.textContent || document.title).trim() };
    if (NOINDEX_PATHS.includes(path)) meta.Robots = 'noindex';

    executeTransformers('beforeTransform', main, payload);

    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
      const parser = parsers[block.name];
      if (!parser) return;
      try { parser(block.element, { document, url, params }); } catch (e) { console.error(`Failed to parse ${block.name} (${block.selector}):`, e); }
    });

    executeTransformers('afterTransform', main, payload);

    main.append(WebImporter.Blocks.getMetadataBlock(document, meta));
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    return [{
      element: main,
      path,
      report: { title: meta.Title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) },
    }];
  },
};
