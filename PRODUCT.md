<!-- stardust:provenance
  writtenBy: stardust:direct
  writtenAt: 2026-10-13T16:17:00Z
  readArtifacts:
    - stardust/current/PRODUCT.md
    - stardust/current/_brand-extraction.json
    - stardust/direction.md
  synthesizedInputs: []
  stardustVersion: see plugin
-->
# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

<!-- _provenance: inferred — basis: home-page post titles/summaries and the captured long-form post are hands-on AEM / React Native / TypeScript guides. -->

Working developers and AEM practitioners who land from search or a shared link with a specific problem — a Content Transfer Tool extraction, a Dispatcher configuration, a React Native upgrade — and want a first-hand, worked walkthrough. A smaller group of returning readers browse the newest posts and the archive.

## Product Purpose

The personal technical blog of Bruce Lefebvre: practitioner-written notes on AEM, React Native, TypeScript and more. Success is a reader finding the right post fast, trusting who wrote it, and being able to read a long post with code comfortably on any screen.

## Positioning

<!-- _provenance: inferred — basis: first-person summaries ("We've released a new tool…", "some gotchas that I encountered…"). -->

Insider implementation notes from someone who builds the tools being written about, not vendor documentation and not traffic-driven tutorials.

## Capabilities and Constraints

- Edge Delivery Services site authored in Document Authoring; the home listing is built live from the query index (newest first, `?page=N`), posts are long-form with code blocks and framed screenshots; RSS feed; Disqus on posts; Formspree contact form.
- Every listed post and its date must come from the index — no hand-curated or invented entries.
- Constraint `a11y-first` for text contrast and small text (Lighthouse 2026-10-13 findings).

## Brand Commitments

- Register: **brand** — a personal technical publication.
- Name and mark: the text wordmark `implementationDetails()` in Merriweather 300 with a 4px salmon underline (`rgba(255,105,97,.5)`); no image logo exists.
- Personality: quiet, literate, developer-wry; reading-first; publication-register, slow-paced.
- Type and palette are pinned (Mode A): Merriweather + Lato; white paper, `#333` ink, `#0076df` gradient-underline links, `#fafafa` surface, `#f3f3f3` hairline, salmon accent. One bounded refinement: the muted neutral deepens to `#6b6b6b` for contrast.
- Anti-references: the Generic-2026-SaaS silhouette; monospace as load-bearing metadata; editorial-magazine vocabulary as section labels; stat-callout "trust bars"; stock imagery.

## Evidence on Hand

- `stardust/current/pages/index.json` — four newest posts (titles, dates, summaries), pager "Page 1 of 10".
- `stardust/current/pages/blog-2018-11-06-react-native-offline-first-db-with-sqlite.json` — a representative long post (headings, code, screenshots, author bio, share line).
- `stardust/current/assets/fonts/` — Merriweather + Lato (open licence); `assets/favicon.png`.
- Author bio copy (post-footer fragment): "Bruce is a huge fan of the open web, currently working at Adobe as a Senior Computer Scientist. Outside of the office he can be found riding bikes and spending time with family."
- Absences that must not be fabricated: no author photo on the home page (an avatar exists only in the post bio), no testimonials, no follower/download counts, no tag or category taxonomy, no per-year post counts beyond what the index returns.

## Product Principles

1. **Read first.** One reading column carries the page; nothing competes with the text.
2. **Lead with recency, keep the depth reachable.** The newest post leads; every older post is one click away, not nine.
3. **Show who's talking.** The author's identity and first-person voice are part of the value, so they're visible on the front page.
4. **Accessible by default.** Every text colour meets 4.5:1 on its ground and no text drops below 12px.

## Accessibility & Inclusion

WCAG 2.2 AA for text contrast (4.5:1 body, 3:1 large text) and a 12px minimum rendered text size; motion (variant C) fully neutralised under `prefers-reduced-motion: reduce`.
