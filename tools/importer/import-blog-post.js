/* eslint-disable */
/* global WebImporter */

import embedParser from './parsers/embed.js';
import cleanupTransformer from './transformers/implementationdetails-cleanup.js';
import sectionsTransformer from './transformers/implementationdetails-sections.js';
import urlRewriteTransformer from './transformers/implementationdetails-url-rewrite.js';

const PAGE_TEMPLATE = {
  name: 'blog-post',
  description: 'Blog article: title, date, author, read time, body with code/images, share link, author bio, comments',
  representativeUrl: 'https://implementationdetails.dev/blog/2018/11/06/react-native-offline-first-db-with-sqlite/',
  blocks: [{ name: 'embed', instances: ['article.post-content iframe'] }],
  urlPattern: '/blog/*',
  sections: [
    {
      id: 'rc1', name: 'post-header', selector: ['div.post-header', '.measure > .post-header'], style: null, blocks: [], defaultContent: ['div.post-header h1'],
    },
    {
      id: 'rc2', name: 'article-body', selector: ['article.post-content'], style: null, blocks: ['embed'], defaultContent: ['article.post-content > *'],
    },
  ],
};

const parsers = { embed: embedParser };
const transformers = [urlRewriteTransformer, cleanupTransformer, sectionsTransformer];

const SITE_DESCRIPTION = 'Articles on AEM, React Native, TypeScript, and more.';

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

/**
 * Builds the post metadata. Jekyll uses the first paragraph as the excerpt when a
 * post has no description of its own, so do the same to keep listing summaries identical.
 */
function buildMetadata(document, originalURL) {
  const title = (document.querySelector('.post-header h1, h1')?.textContent || metaContent(document, 'meta[property="og:title"]')).trim();
  let description = metaContent(document, 'meta[name="description"]');
  if (!description || description === SITE_DESCRIPTION) {
    const first = document.querySelector('article.post-content > p');
    description = first ? first.textContent.replace(/\s+/g, ' ').trim() : '';
  }
  const [, y, m, d] = new URL(originalURL).pathname.match(/\/blog\/(\d{4})\/(\d{2})\/(\d{2})\//) || [];
  const authorLink = document.querySelector('.post-header .post-meta a[href]');

  const meta = {
    Title: title,
    Description: description,
    Date: y ? `${y}-${m}-${d}` : '',
    Author: metaContent(document, 'meta[name="author"]') || 'Bruce Lefebvre',
    'Author-Link': authorLink ? authorLink.href : 'https://twitter.com/brucelefebvre',
    Template: 'blog-post',
  };
  const image = metaContent(document, 'meta[property="og:image"]');
  if (image) {
    const img = document.createElement('img');
    img.src = image;
    meta.Image = img;
  }
  return meta;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    executeTransformers('beforeTransform', main, payload);

    // read metadata before cleanup's afterTransform removes the source chrome
    const meta = buildMetadata(document, params.originalURL);

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
      report: {
        title: meta.Title, date: meta.Date, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
