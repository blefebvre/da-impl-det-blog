/* eslint-disable */
/* global WebImporter */

import blogListParser from './parsers/blog-list.js';
import cleanupTransformer from './transformers/implementationdetails-cleanup.js';
import sectionsTransformer from './transformers/implementationdetails-sections.js';
import urlRewriteTransformer from './transformers/implementationdetails-url-rewrite.js';

const PAGE_TEMPLATE = {
  name: 'blog-listing',
  description: 'Homepage listing of blog posts (4 per page, newest first) with Newer/Older pagination',
  representativeUrl: 'https://implementationdetails.dev/',
  blocks: [{ name: 'blog-list', instances: ['div.home div.posts'] }],
  urlPattern: '/',
  sections: [
    {
      id: 'rc1', name: 'post-listing', selector: ['div.home'], style: null, blocks: ['blog-list'], defaultContent: [],
    },
  ],
};

const parsers = { 'blog-list': blogListParser };
const transformers = [urlRewriteTransformer, cleanupTransformer, sectionsTransformer];

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

function metaContent(document, selector) {
  const el = document.querySelector(selector);
  return el ? (el.getAttribute('content') || '').trim() : '';
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    const meta = {
      Title: metaContent(document, 'meta[property="og:title"]') || document.title,
      Description: metaContent(document, 'meta[name="description"]'),
    };

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

    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/index\.html?$/, '')
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: { title: meta.Title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) },
    }];
  },
};
