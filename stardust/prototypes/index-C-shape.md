<!-- stardust:provenance
  writtenBy:        stardust:prototype/shape
  writtenAt:        2026-10-13T16:52:00Z
  page:             index
  pageUrl:          https://main--da-impl-det-blog--blefebvre.aem.live/
  variant:          C
  againstDirection: stardust/direction.md (Active 2026-10-13T16:14:00Z)
  consumedBy:       impeccable:craft
  canon:            inherited from variant A (stardust/.work/canon.mjs)
  readArtifacts:
    - stardust/current/pages/index.json
    - stardust/current/_query-index.json
    - stardust/current/_author-bio.plain.html
    - DESIGN-C.md
    - DESIGN-C.json
    - stardust/direction.md
    - stardust/prototypes/index-improvements.md
  stardustVersion:  see plugin
  _provenance:
    capturedTraitAmplified: "first-person practitioner voice (voice-register pivot), in service of the publication-register / slow-paced personality (PRODUCT.md § Brand Commitments)"
    capturedSourceLineage:
      - { section: header, origin: "canon (variant A)" }
      - { section: author-lede, origin: "direction-authorized — improvement #5 floor, promoted to the opening lede; copy verbatim from _author-bio.plain.html (first sentence)" }
      - { section: latest, origin: "pages/index.json post list — re-led by each entry's own first-person summary" }
      - { section: archive, origin: "direction-authorized — improvement #4; entries verbatim from _query-index.json (A's archive)" }
      - { section: pager, origin: "pages/index.json pager" }
      - { section: footer, origin: "canon (variant A)" }
    antiTemplatePass:
      - pattern: post-list
        defaultReflex: "title-led rows (captured / A)"
        alternatives: ["summary-led entries: the author's sentence first, title as its caption", "pull-quote cards (rejected: cards + quotes would read as testimonials)", "title-led rows (A)"]
        picked: "summary-led entries"
        rationale: "the voice pivot made structural — the first-person summaries are captured copy the listing currently buries under 60px product titles"
      - pattern: opening
        defaultReflex: "header then newest post (captured / A)"
        alternatives: ["author's own sentence as the opening lede", "large display title lead (A)"]
        picked: "opening lede"
        rationale: "who is talking comes first; IA-priority change vs A"
    substrateTransitions: { default: "paper #ffffff", exceptions: [{ section: footer, ground: "surface #fafafa", purpose: "canon footer band" }] }
    voiceClassification:
      - { section: header, classification: captured-verbatim, source: "pages/index.json" }
      - { section: author-lede, classification: captured-verbatim, source: "_author-bio.plain.html" }
      - { section: latest, classification: captured-verbatim, source: "pages/index.json (summary, title, date)" }
      - { section: archive-heading, classification: direction-authorized rewrite, copy: "All posts" }
      - { section: archive, classification: captured-verbatim, source: "_query-index.json" }
      - { section: pager, classification: captured-verbatim, source: "pages/index.json" }
      - { section: footer, classification: captured-verbatim, source: "pages/index.json footer" }
    signatureElements:
      - { kind: motif, capturedSource: "header .nav-title salmon underline", mechanism: "text-decoration underline 4px", fallback: "n/a" }
      - { kind: motif, capturedSource: "link gradient underline", mechanism: "background band; cinematic file draws the hover band in left-to-right", fallback: "static band under reduced motion / no JS" }
    motion:
      register: editorial
      registerSource: direct
      choreographies:
        - { name: reading-paced-entry, targets: "[data-anim] on the lede, each entry's summary then title (per-entry .band stagger group), the archive block", mechanism: "runtime scroll-progress opacity, slide 0 (no translate)", byDesign: "elements below the 85% viewport line wait for scroll" }
        # lead-micro-parallax dropped at finish review: every candidate target either rose into the header, closed the lede/latest separation, or delayed reveals of its children past the reading line
        - { name: underline-draw-in, targets: "main a", mechanism: "CSS: dark hover band grows 0→100% width over 600ms", byDesign: "hover/focus only" }
    compositionDelta_vs_A:
      - "layout of latest: title-led lead + rows (A) → summary-led entries (C)"
      - "ia-priority: newest post title leads (A) → the author's first-person lede leads (C)"
    compositionDelta_vs_B:
      - "layout: year rail two-zone (B) → single column with archive section (C)"
      - "section-sequence: author closes the page (B) → author opens it (C)"
      - "section-presence: archive section present (C) vs rail (B)"
-->
---
slug: index
url: https://main--da-impl-det-blog--blefebvre.aem.live/
register: brand
variant: C
surprise: high
dominantDimension: voice/first-person-summary-led
---

# Page shape: index — Variant C (the field notebook, at reading pace)

## Sections (in render order)

1. **header** — canon from A.
2. **author-lede** — the bio's first sentence as the page's opening, Merriweather 300 at
   Title XL (1.953rem), measure ≤ 26ch: "Bruce is a huge fan of the open web, currently
   working at Adobe as a Senior Computer Scientist."
3. **latest** — four summary-led entries in captured order: the summary in Lede type
   (lead entry at Title L serif 1.563rem; rows at 1.25rem), then the title as a Lato 900
   Title M caption link, then the date in Meta. Hairline between entries. Visually-hidden
   H2 "Latest posts"; each title is an H3.
   A hairline and a section-padding gap separate the lede from the latest list; each entry
   is a stretched link (the H3 anchor covers the entry) and the summary takes link-ink on
   hover. Title and date reveal together as one caption.
4. **pager** — quiet text row closing the latest list (moved up from after the archive per
   finish review: paging belongs to the list it pages).
5. **archive** — A's year-grouped "All posts" archive, verbatim from `_query-index.json`.
6. **footer** — canon from A.

## Motion (cinematic file only — `index-C-cinematic.html`)

Editorial register: opacity-only reading-paced reveals (runtime `cards.slide: 0`,
`stagger: 0.14`), summary before title within each entry, dark underline band drawing in on hover. `<noscript>` and
`prefers-reduced-motion` force every final state. No marquees, flips, fills, count-ups.

## Data attributes

- `header[data-section="header"][data-intent="identity and social links"][data-layout="contained"]`
- `section[data-section="author-lede"][data-intent="let the author speak first"][data-layout="contained"]`
- `section[data-section="latest"][data-intent="lead with the author's own words"][data-layout="stack"][data-items="4"]`
- `section[data-section="archive"][data-intent="make every post reachable"][data-layout="stack"][data-items="38"]`
- `nav[data-section="pager"][data-intent="page through the listing"][data-layout="contained"]`
- `footer[data-section="footer"][data-intent="credit"][data-layout="full-bleed"]`

## Unsourced content (placeholder list)

(none)
