<!-- stardust:provenance
  writtenBy: stardust:extract
  writtenAt: 2026-10-13T15:52:00Z
  readArtifacts:
    - https://main--da-impl-det-blog--blefebvre.aem.live/
    - stardust/current/pages/index.json
    - stardust/current/_brand-extraction.json
    - stardust/current/_computed-styles.json
  synthesizedInputs: []
  stardustVersion: see plugin
-->
# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

_provenance: inferred — basis: post titles and summaries on the home page are hands-on AEM / React Native / TypeScript guides._

Working developers and AEM practitioners who arrive from search or a shared link with a specific problem (a Content Transfer Tool extraction, a Dispatcher config, a React Native upgrade) and want a worked, first-hand walkthrough they can follow.

## Product Purpose

implementationDetails() is the personal technical blog of Bruce Lefebvre: "Articles on AEM, React Native, TypeScript, and more." (meta description). It publishes long-form, practitioner-written posts — tips, deep dives, tool announcements and upgrade notes — newest first, four per listing page across ten pages (38 posts, 2013–2023).

## Positioning

_provenance: inferred — basis: the summaries' first-person voice ("We've released a new tool…", "some gotchas that I encountered…")._

Written by someone who builds the tools being described (Adobe AEM tooling such as the Dispatcher Optimizer Tool and the Content Transfer Tool), so posts read as insider implementation notes rather than vendor documentation or tutorials-for-traffic.

## Capabilities and Constraints

- Static editorial site: home listing (`blog-list` block, `?page=N`), post pages, contact form (Formspree), RSS feed; Disqus comments on posts.
- Edge Delivery Services on Document Authoring; listing is built live from the query index sorted by original publish date.
- No logo image — the brand is a text wordmark.
- No photography or illustration system; imagery appears only inside posts (screenshots).

## Brand Commitments

- Register: **brand** (editorial/personal publication, not a tool).
- Name: `implementationDetails()` — a function-call wordmark, set in Merriweather 300 with a thick 4px salmon underline (`rgba(255,105,97,.5)`).
- Personality (observed): quiet, literate, developer-wry — the function-call name, generous whitespace, a single reading column, serif body.
- Theme heritage: Jekyll **Pixyll** (footer credit "Theme based on Pixyll"); fonts Merriweather + Lato, blue gradient-underline links.
- Anti-references (observed by absence): no hero imagery, no marketing CTAs, no newsletter pop-ups (the TinyLetter banner was retired in the migration).

## Evidence on Hand

- `stardust/current/pages/index.json` / `index.html` — captured home listing (4 post titles + summaries + dates, pagination "Page 1 of 10").
- `stardust/current/assets/screenshots/index.png` — full-page capture.
- `stardust/current/assets/fonts/` — Merriweather (300/900, roman + italic) and Lato (300/900), open licence.
- `stardust/current/assets/favicon.png` — 16×16 favicon.
- Absences future work must not fabricate: no author photo on the home page (an avatar exists only in the post-footer bio fragment), no testimonials, no follower/download counts, no categories or tags taxonomy.

## Product Principles

_provenance: inferred — basis: captured layout and copy._

1. Reading comes first: one column, long-form, nothing competing with the text.
2. Recency is the organising axis: newest post leads, listing is purely chronological.
3. Practitioner credibility over polish: specific product names and first-hand notes are the hook.

## Accessibility & Inclusion

Lighthouse (2026-10-13) flagged the theme's muted grey `#7a7a7a` below WCAG AA 4.5:1 (4.29:1 on white, 4.11:1 on the `#fafafa` footer, 3.70:1 as code on `#eee`) and footer text at ~9.9px on mobile.
