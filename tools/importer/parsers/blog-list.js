/* eslint-disable */
/* global WebImporter */
/**
 * Parser for the "blog-list" block (blocks/blog-list/blog-list.js).
 * The listing is rendered at runtime from the query index, so individual posts
 * are NOT imported; only the block config is emitted. readBlockConfig() keys:
 *   "Posts per page" -> posts-per-page, "Path" -> path.
 *
 * Source: div.home div.posts > div.post (x4) followed by sibling div.pagination.
 * Output: | Blog List |
 *         | Posts per page | 4 |
 *         | Path | /blog/ |
 */
export default function parse(element, { document }) {
  const count = element.querySelectorAll('.post').length;
  const perPage = count > 0 ? count : 4;

  // Remove the static Newer/Older pagination; the block renders its own.
  const parent = element.parentElement;
  if (parent) {
    parent.querySelectorAll(':scope > .pagination').forEach((el) => el.remove());
  }

  const cells = [
    ['Posts per page', String(perPage)],
    ['Path', '/blog/'],
  ];
  const block = WebImporter.Blocks.createBlock(document, { name: 'Blog List', cells });
  element.replaceWith(block);
}
