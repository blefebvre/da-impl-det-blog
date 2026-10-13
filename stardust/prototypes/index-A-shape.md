<!-- stardust:provenance
  writtenBy:        stardust:prototype/shape
  writtenAt:        2026-10-13T16:24:00Z
  page:             index
  pageUrl:          https://main--da-impl-det-blog--blefebvre.aem.live/
  variant:          A
  againstDirection: stardust/direction.md (Active 2026-10-13T16:14:00Z)
  consumedBy:       impeccable:craft
  readArtifacts:
    - stardust/current/pages/index.json
    - stardust/current/_brand-extraction.json
    - stardust/current/_query-index.json
    - stardust/current/_author-bio.plain.html
    - DESIGN-A.md
    - DESIGN-A.json
    - stardust/direction.md
    - stardust/prototypes/index-improvements.md
  stardustVersion:  see plugin
  _provenance:
    capturedSourceLineage:
      - { section: header, origin: "site-wide system-component (pages/index.json header landmark: wordmark + 5 social links)" }
      - { section: author-intro, origin: "direction-authorized new — improvement #5; copy from _author-bio.plain.html (post-footer fragment)" }
      - { section: latest, origin: "pages/index.json post list (4 entries: date, title, summary, href)" }
      - { section: archive, origin: "direction-authorized new — improvement #4; entries verbatim from _query-index.json" }
      - { section: pager, origin: "pages/index.json pager (Newer / Page 1 of 10 / Older)" }
      - { section: footer, origin: "site-wide system-component (pages/index.json footer: credit line + 2 links)" }
    antiTemplatePass:
      - pattern: post-list
        defaultReflex: "4 equal oversized headline rows (captured) — or a 3-up card grid with thumbnails"
        alternatives: ["lead entry + compact rows (jvns.ca recent list)", "single unpaginated list of all posts (overreacted.io)", "3-up cards (rejected: no post imagery exists; cards would invent thumbnails)"]
        picked: "lead entry + compact rows"
        rationale: "improvement #3/#6 — keeps captured order and summaries; one display moment"
        reference: { name: "jvns.ca", url: "https://jvns.ca/", tier: "WebFetch" }
      - pattern: pager
        defaultReflex: "boxed Newer / Older buttons (captured Pixyll pager)"
        alternatives: ["boxed pager kept", "quiet text row Newer · Page 1 of 10 · Older under a full archive", "infinite scroll (rejected: JS-dependent, breaks ?page=N links)"]
        picked: "quiet text row under the archive"
        rationale: "improvement #2/#4 — the archive becomes the primary path; ?page=N deep links survive"
      - pattern: header
        defaultReflex: "sticky top nav with links"
        alternatives: ["captured in-flow header (wordmark left, icons right)", "centered masthead"]
        picked: "captured in-flow header"
        rationale: "Mode A — the captured header is the brand; no sticky nav (anti-toolbox)"
    substrateTransitions: { default: "paper #ffffff", exceptions: [{ section: footer, ground: "surface #fafafa", purpose: "captured footer band" }] }
    voiceClassification:
      - { section: header, classification: captured-verbatim, source: "pages/index.json" }
      - { section: author-intro, classification: captured-verbatim, source: "_author-bio.plain.html (first sentence)" }
      - { section: latest, classification: captured-verbatim, source: "pages/index.json" }
      - { section: archive, classification: captured-verbatim, source: "_query-index.json (titles, dates)" }
      - { section: archive-heading, classification: direction-authorized rewrite, copy: "All posts" }
      - { section: latest-heading, classification: direction-authorized rewrite, copy: "Latest posts (visually hidden)" }
      - { section: pager, classification: captured-verbatim, source: "pages/index.json (Newer, Older, Page 1 of 10)" }
      - { section: footer, classification: captured-verbatim, source: "pages/index.json footer" }
    signatureElements:
      - { kind: motif, capturedSource: "header .nav-title underline 4px rgba(255,105,97,.5)", mechanism: "text-decoration underline, text-underline-position: under", fallback: "n/a (static)" }
      - { kind: motif, capturedSource: "link gradient underline (_brand-extraction.json#motifs.gradients[0])", mechanism: "background-image band + white text-shadow knockout", fallback: "n/a" }
    compositionDelta_vs_B:
      - "layout: single reading column → two-zone column + year-index rail (B)"
      - "section-sequence: author intro at top (A) → closing sign-off (B)"
      - "section-presence: separate year-grouped archive section (A) → archive is the rail, no archive section (B)"
    compositionDelta_vs_C:
      - "layout of latest: title-led lead + rows (A) → summary-led entries (C)"
      - "ia-priority: newest post title leads the page (A) → author's first-person lede leads (C)"
-->
---
slug: index
url: https://main--da-impl-det-blog--blefebvre.aem.live/
register: brand
variant: A
surprise: low
dominantDimension: composition/lead-plus-archive-index
---

# Page shape: index — Variant A (faithful + improvements)

## Sections (in render order)

1. **header** (system-component role `header`) — captured composition: wordmark
   `implementationDetails()` left with the 4px salmon underline, five social icons right
   (GitHub, Twitter, Email, LinkedIn, RSS feed) with accessible names; stacks centred below
   32em. In flow, not sticky.
2. **author-intro** — one line under the header in Lede type, quiet-ink-free (ink #333):
   "Bruce is a huge fan of the open web, currently working at Adobe as a Senior Computer
   Scientist." (improvement #5).
3. **latest** — visually-hidden H2 "Latest posts" (finish review: a visible kicker label
   would breach the craft floor's no-eyebrow rule; the display-size lead carries the cue), then:
   - lead entry: date (Meta, quiet-ink, italic), title at Display (2.998rem Lato 900),
     summary (Body) — "What can you do with an AEM Headless Trial?" (Oct 17, 2023);
   - three compact rows: date · Title L (1.563rem) · one-line summary, hairline between rows.
   All four from `pages/index.json`, same order (improvements #3, #6).
4. **pager** — quiet text row closing the latest list: "Newer" (disabled on page 1, rendered
   as plain quiet-ink text, not half-opacity) · "Page 1 of 10" · "Older" → `/?page=2`
   (improvement #2; moved above the archive at finish review — paging belongs to the list it pages).
5. **archive** — heading "All posts", then year groups 2023 → 2013 from `_query-index.json`
   (year label in Label type; each entry: title link + date in Meta), 38 entries; years
   without posts (2016, 2022) are simply absent (improvement #4).
6. **footer** (system-component role `footer`) — surface band, credit line verbatim:
   "Content © 2013-present Bruce Lefebvre. All Rights Reserved." / "Theme based on Pixyll."
   in Meta (0.875rem, ≥ 12px) quiet-ink (improvements #1, #2).

## Layout strategy

- One 42rem column, 1rem gutters, `--max-width: 42rem` (captured column; no step-up).
- Section spacing 64 / 48 / 32px (balanced).
- Lead entry title at Display only; all other titles on the major-third ladder.

## Interaction model

- Wordmark → `/`; social icons → captured hrefs; titles → captured post paths; archive
  entries → index paths; Older → `/?page=2`. Links use the brand gradient underline;
  titles inside entries use no underline, hover dims to 0.88 (captured).

## Data attributes

- `header[data-section="header"][data-intent="identity and social links"][data-layout="contained"]`
- `section[data-section="author-intro"][data-intent="show who is writing"][data-layout="contained"]`
- `section[data-section="latest"][data-intent="lead with the newest writing"][data-layout="stack"][data-items="4"]`
- `section[data-section="archive"][data-intent="make every post reachable"][data-layout="stack"][data-items="38"]`
- `nav[data-section="pager"][data-intent="page through the listing"][data-layout="contained"]`
- `footer[data-section="footer"][data-intent="credit"][data-layout="full-bleed"]`

## Unsourced content (placeholder list)

(none)
