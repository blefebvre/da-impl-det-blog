<!-- stardust:provenance
  writtenBy:        stardust:prototype/shape
  writtenAt:        2026-10-13T16:40:00Z
  page:             index
  pageUrl:          https://main--da-impl-det-blog--blefebvre.aem.live/
  variant:          B
  againstDirection: stardust/direction.md (Active 2026-10-13T16:14:00Z)
  consumedBy:       impeccable:craft
  canon:            inherited from variant A (stardust/.work/canon.mjs — tokens, fonts, header, footer)
  readArtifacts:
    - stardust/current/pages/index.json
    - stardust/current/_query-index.json
    - stardust/current/_author-bio.plain.html
    - stardust/current/assets/media/author-avatar.jpg
    - DESIGN-B.md
    - DESIGN-B.json
    - stardust/direction.md
    - stardust/prototypes/index-improvements.md
  stardustVersion:  see plugin
  _provenance:
    capturedTraitAmplified: "function-call wordmark implementationDetails() + 4px salmon underline (signature gesture), in service of the developer-wry personality (PRODUCT.md § Brand Commitments)"
    capturedSourceLineage:
      - { section: header, origin: "canon (variant A) — pages/index.json header landmark" }
      - { section: latest, origin: "pages/index.json post list (4 entries)" }
      - { section: archive-rail, origin: "direction-authorized new — improvement #4 floor + B's year-index composition; entries verbatim from _query-index.json" }
      - { section: pager, origin: "pages/index.json pager" }
      - { section: sign-off, origin: "direction-authorized new — improvement #5 floor; bio verbatim from _author-bio.plain.html, avatar from the post-footer bio image (author-identity position)" }
      - { section: footer, origin: "canon (variant A)" }
    antiTemplatePass:
      - pattern: section-heads
        defaultReflex: "plain sans section titles or kicker/eyebrow labels"
        alternatives: ["calls in the wordmark serif with the salmon underline (latest(), archive(2013–2023))", "numbered eyebrows § 01 (rejected: anti-toolbox)", "monospace labels (rejected: anti-toolbox monospace-as-costume)"]
        picked: "calls in the wordmark serif"
        rationale: "extends the captured wordmark gesture (T-logo-variants) instead of importing a code costume"
      - pattern: archive
        defaultReflex: "Older/Newer pager only (captured) or an archive section below the list (variant A)"
        alternatives: ["year-index rail beside the reading column (simonwillison.net year archive)", "archive section below (A)", "tag cloud (rejected: no taxonomy captured)"]
        picked: "year-index rail"
        rationale: "differentiates from A by layout strategy and section presence; every post stays reachable"
        reference: { name: "simonwillison.net", url: "https://simonwillison.net/", tier: "WebFetch" }
      - pattern: author
        defaultReflex: "author line at the top (A) or a bio card with avatar in a sidebar"
        alternatives: ["closing sign-off with avatar + bio + repeated wordmark", "header byline"]
        picked: "closing sign-off"
        rationale: "the wordmark closes the page the way it opens it — the gesture as a frame"
    substrateTransitions: { default: "paper #ffffff", exceptions: [{ section: footer, ground: "surface #fafafa", purpose: "canon footer band" }] }
    voiceClassification:
      - { section: header, classification: captured-verbatim, source: "pages/index.json" }
      - { section: latest-heading, classification: direction-authorized rewrite, copy: "latest()" }
      - { section: latest, classification: captured-verbatim, source: "pages/index.json" }
      - { section: archive-heading, classification: direction-authorized rewrite, copy: "archive(2013–2023)" }
      - { section: archive-rail, classification: captured-verbatim, source: "_query-index.json" }
      - { section: pager, classification: captured-verbatim, source: "pages/index.json" }
      - { section: sign-off, classification: captured-verbatim, source: "_author-bio.plain.html (full bio) + wordmark" }
      - { section: footer, classification: captured-verbatim, source: "pages/index.json footer" }
    signatureElements:
      - { kind: motif, capturedSource: "header .nav-title salmon underline", mechanism: "text-decoration underline 4px, extended to section calls and the open year", fallback: "n/a (static)" }
      - { kind: motif, capturedSource: "link gradient underline", mechanism: "background-image band", fallback: "n/a" }
    compositionDelta_vs_A:
      - "layout: single column (A) → reading column + year-index rail at ≥ 1024px (B)"
      - "section-presence: A's archive section removed; the rail is the archive (B)"
      - "section-sequence: author intro at top (A) → closing sign-off before the footer (B)"
    compositionDelta_vs_C:
      - "layout: year rail (B) vs single column summary-led list (C)"
      - "ia-priority: author voice leads the page (C) vs closes it (B)"
      - "section-presence: archive section (C) vs rail (B)"
-->
---
slug: index
url: https://main--da-impl-det-blog--blefebvre.aem.live/
register: brand
variant: B
surprise: medium
dominantDimension: composition/function-call-structural-voice
---

# Page shape: index — Variant B (the function-call wordmark as structural voice)

## Sections (in render order)

1. **header** — canon from A (wordmark + salmon underline, five icons).
2. **latest** — section call `latest()` in the wordmark serif (Merriweather 300, Title L
   size) with the 4px salmon underline; then A's lead entry (Display title) and three
   compact rows, verbatim from `pages/index.json`.
3. **pager** — quiet text row (Newer · Page 1 of 10 · Older) closing the reading column.
4. **archive-rail** (`aside`) — `archive(2013–2023)` call in the same voice; one
   disclosure per year (2023 open, salmon-underlined summary when open), each listing its
   posts (title link + date) verbatim from `_query-index.json`; post count per year shown
   as plain derived metadata ("4 posts"). At ≥ 1024px the rail sits right of the reading
   column, `position: sticky; top: 1rem`, scrolling internally; below that it stacks after
   the pager.
5. **sign-off** — avatar (circle, 4rem), the full bio sentence pair verbatim, and the
   wordmark `implementationDetails()` repeated with its underline as the page's sign-off.
6. **footer** — canon from A.

## Layout strategy

- ≥ 1024px: grid `42rem | 15rem`, 3rem gap, centred; the rail is part of the content
  area (not a sticky top nav — anti-toolbox guardrail).
- < 1024px: single column; rail becomes a full-width section after the pager.

## Interaction model

- Year disclosures are native `<details>/<summary>` (no JS); keyboard and screen-reader
  native. All links absolute to the live site.

## Data attributes

- `header[data-section="header"][data-intent="identity and social links"][data-layout="contained"]`
- `section[data-section="latest"][data-intent="lead with the newest writing"][data-layout="stack"][data-items="4"]`
- `nav[data-section="pager"][data-intent="page through the listing"][data-layout="contained"]`
- `aside[data-section="archive-rail"][data-intent="make every post reachable"][data-layout="side-rail"][data-items="38"][data-interactive="accordion"]`
- `section[data-section="sign-off"][data-intent="show who is writing"][data-layout="contained"][data-media="image"]`
- `footer[data-section="footer"][data-intent="credit"][data-layout="full-bleed"]`

## Unsourced content (placeholder list)

(none)
