<!-- stardust:provenance
  writtenBy:        stardust:prototype/shape
  writtenAt:        2026-10-13T17:20:00Z
  page:             index
  pageUrl:          https://main--da-impl-det-blog--blefebvre.aem.live/
  variant:          B2 (iteration of B on author feedback)
  againstDirection: stardust/direction.md (Active 2026-10-13T16:14:00Z)
  consumedBy:       impeccable:layout
  canon:            inherited from variant A (stardust/.work/canon.mjs); salmon retired
  authorFeedback:
    - "no longer loving the red/pink underline under the implementationDetails header, and the other headers (latest()) etc."
    - "Keep with the B theme, I like the post browser on the right, but its still not quite right and I think we can do better."
    - choice: "Blue parentheses" (identity)
    - choice: "Live call filter" (post browser)
  readArtifacts:
    - stardust/current/pages/index.json
    - stardust/current/_query-index.json
    - stardust/current/_author-bio.plain.html
    - stardust/current/assets/media/author-avatar.jpg
    - DESIGN-B2.md
    - DESIGN-B2.json
    - stardust/prototypes/index-B-shape.md
  _provenance:
    capturedTraitAmplified: "function-call wordmark implementationDetails() — the call voice, now carried by blue parentheses instead of the salmon underline"
    capturedSourceLineage:
      - { section: header, origin: "canon (variant A); wordmark parentheses in link blue" }
      - { section: latest, origin: "pages/index.json post list (4 entries)" }
      - { section: pager, origin: "pages/index.json pager" }
      - { section: post-browser, origin: "direction-authorized — improvement #4 floor; B's rail rebuilt as a working call; entries and per-year counts derived from _query-index.json" }
      - { section: sign-off, origin: "as B — bio verbatim from _author-bio.plain.html, avatar from the post-footer bio image" }
      - { section: footer, origin: "canon (variant A)" }
    antiTemplatePass:
      - pattern: archive-rail
        defaultReflex: "year accordion (B) — one title visible on arrival, a click per year"
        alternatives: ["live call filter posts( … ) with year strip and every title listed (picked by author)", "full static index, no filter", "dot timeline (rejected: less scannable)"]
        picked: "live call filter"
        rationale: "the call voice becomes the interface; every post visible and reachable in one keystroke or tap"
      - pattern: per-year-counts
        defaultReflex: "italic '12 posts' labels per row (B)"
        alternatives: ["6px bars, height = posts that year, empty years as flat dashes", "numbers only"]
        picked: "bars"
        rationale: "data the reader can use (when the writing happened) acting as the year control; empty years 2016/2022 kept so the strip is an honest timeline; counts also in aria-label/title and the live count line"
    substrateTransitions: { default: "paper #ffffff", exceptions: [{ section: footer, ground: "surface #fafafa", purpose: "canon footer band" }] }
    voiceClassification:
      - { section: header, classification: captured-verbatim, source: "pages/index.json" }
      - { section: latest-heading, classification: direction-authorized rewrite, copy: "latest()" }
      - { section: latest, classification: captured-verbatim, source: "pages/index.json" }
      - { section: pager, classification: captured-verbatim, source: "pages/index.json" }
      - { section: post-browser-heading, classification: direction-authorized rewrite, copy: "posts( all )" }
      - { section: post-browser-chrome, classification: direction-authorized chrome, copy: "Type a word or pick a year. Press / to start. · N of 38 posts · clear() · No post titles match “…”." }
      - { section: post-browser, classification: captured-verbatim, source: "_query-index.json" }
      - { section: sign-off, classification: captured-verbatim, source: "_author-bio.plain.html + wordmark" }
      - { section: footer, classification: captured-verbatim, source: "pages/index.json footer" }
    signatureElements:
      - { kind: motif, capturedSource: "wordmark implementationDetails()", mechanism: "the () of every call in link blue", fallback: "n/a (static)" }
      - { kind: motif, capturedSource: "link gradient underline", mechanism: "background-image band in the main column", fallback: "n/a" }
    compositionDelta_vs_B:
      - "archive: accordion rail → live filter with year strip and full title index"
      - "identity: salmon underline → blue parentheses; wordmark up to Title L"
-->
---
slug: index
url: https://main--da-impl-det-blog--blefebvre.aem.live/
register: brand
variant: B2
surprise: medium
dominantDimension: composition/function-call-structural-voice
---

# Page shape: index — Variant B2 (calls that run)

## Sections (in render order)

1. **header** — canon from A; wordmark `implementationDetails()` at Title L, the `()` in link blue, no underline.
2. **latest** — call `latest()` (Merriweather 300, Title L, blue parentheses); lead entry at Display, three compact rows, verbatim from `pages/index.json`.
3. **pager** — quiet text row (Newer · Page 1 of 10 · Older) closing the reading column.
4. **post-browser** (`aside`) — `posts( all )`: the argument is a search input that grows with what is typed
   (`/` focuses, Esc clears); one line of hint; a year strip 2013–2023 (bar height = posts that year, empty
   years a flat dash) whose years set the argument; a live "N of 38 posts" count with `clear()`; every title
   grouped by year with matches highlighted; an empty state that names the query. Without JS: the argument
   reads `all`, the input is hidden, years are anchor links to their groups. At ≥ 1024px it sits right of the
   reading column, sticky, list scrolling internally; below that it stacks after the pager with titles at Body size.
5. **sign-off** — avatar, full bio, wordmark repeated with blue parentheses.
6. **footer** — canon from A.

## Data attributes

- `header[data-section="header"][data-intent="identity and social links"][data-layout="contained"]`
- `section[data-section="latest"][data-intent="lead with the newest writing"][data-layout="stack"][data-items="4"]`
- `nav[data-section="pager"][data-intent="page through the listing"][data-layout="contained"]`
- `aside[data-section="post-browser"][data-intent="find any post fast"][data-layout="side-rail"][data-items="38"][data-interactive="filter"]`
- `section[data-section="sign-off"][data-intent="show who is writing"][data-layout="contained"][data-media="image"]`
- `footer[data-section="footer"][data-intent="credit"][data-layout="full-bleed"]`

## Unsourced content (placeholder list)

(none)
