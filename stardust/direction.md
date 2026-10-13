<!-- stardust:provenance
  writtenBy: stardust:direct
  writtenAt: 2026-10-13T16:14:00Z
  readArtifacts:
    - stardust/state.json
    - stardust/current/_brand-extraction.json
    - stardust/current/PRODUCT.md
    - stardust/current/brand-review.html
    - stardust/uplift-improvements.md
    - stardust/uplift-questions.md
  synthesizedInputs: []
  stardustVersion: see plugin
-->
---
title: "uplift presales redesign — three variants per stardust/direction.md"
resolvedAt: 2026-10-13T16:14:00Z
toolkitVersion: "v1.0 (stardust v2)"
schemaVersion: 1
---

# Active direction (2026-10-13T16:14:00Z)

## Phrase

> uplift presales redesign — three variants per stardust/direction.md

## Restatement

Keep implementationDetails() recognisably itself — white paper, Merriweather body,
Lato titles, blue gradient-underline links, the salmon-underlined function-call
wordmark — and propose three ways forward for the home page. A fixes what is
measurably broken (contrast, tiny type, a poster-sized list, a hidden ten-year archive,
an invisible author). B makes the wordmark's function-call gesture the site's
structural voice. C keeps A's sections but foregrounds the author's first-person voice
and lets it arrive at reading pace.

## Movements

- **register** — `brand` (inherited from `current/PRODUCT.md`; personal technical publication)
- **expressive axis** — `restrained` → `restrained` (A) / `committed` (B, C) — uplift variant roles
- **tone** — `technical-precise` (A, B) → first-person practitioner foregrounded (C)
- **density** — `balanced` (default — uplift runs without stopping; brand register; phrase did not move density)
- **distinctiveness** — `familiar` (A) → `distinctive` (B, C)
- **audience** — working developers / AEM practitioners arriving with a specific problem (inherited, inferred in `current/PRODUCT.md`)
- **ia-fidelity** — `reimagined` (auto-pinned: the variant contract is "what if…" for B and C)
- **constraints** — `a11y-first` on muted text (Lighthouse 2026-10-13: `#7a7a7a` < 4.5:1, footer 9.9px on mobile)

## Gaps and questions

None asked — `uplift` runs the chain without confirmation stops; every default above is
stamped as an assumption.

## Anchor references

Researched (tier 2, WebFetch — Refero MCP not available):
- overreacted.io — single unpaginated chronological list, author line in header (informs A's archive + author intro).
- jvns.ca — dense title-only list, recent-then-archive, one-line author intro (informs A's compact rows).
- simonwillison.net — year/month archive as a navigable structure (B's compositional anchor).

## Anti-references

- Generic-2026-SaaS silhouette (oversized sans hero + two-button CTA pair + sticky top nav + serial footer) — guardrailed: a refresh of a developer blog is the classic trigger.
- Monospace as load-bearing metadata (toolkit § 1 typography) — refused even though the brand is about code; B speaks the function-call voice in the captured serif, not in mono.
- Editorial-register vocabulary ("the journal", "dispatches", "field guide") as section labels — refused; the register is a personal blog, and C's pivot is voice, not vocabulary.
- Stat-callout bar ("38 posts · 10 years") — refused as a trust bar; post counts may appear only as plain archive metadata derived from the index.

## Divergence inputs

- **mode** — A (brand-faithful); captured signal `signal-strong` (8 palette roles; Lato + Merriweather named; 4 distinct heading sizes across home + post).
- **seed** — not rolled for pinned axes. Un-pinned dimensions resolved by research: decade `2025-now` (reasoned: overreacted.io / jvns.ca current personal dev-blog practice), craft `web-native plain HTML` (reasoned: same), register `personal field notes` (reasoned: captured first-person voice), ground-family `stark-white` (inherited — Mode C override `brand-faithful`).
- **picked_by** — `reasoned` (research tier 2) for decade / craft / register; `user-constraint` (Mode A) for type and palette.
- **font deck** — `brand-inherited` (Merriweather 300/900 + Lato 300/900; mono stays the declared "Source Code Pro", consolas, monospace stack).
- **palette** — inherited from `_brand-extraction.json`; muted neutral stepped one tone darker on its own ramp (`#7a7a7a` → `#6b6b6b`) under Mode A+ (`brand_adjacent_refinements[]`, evidence: Lighthouse color-contrast + T-contrast).
- **anti-toolbox audit** — 0 hits after the guardrails above (B's year index rail is position: sticky inside the content column, not a sticky top navigation).
- **brand-faithful inversions** — pure-white retention (`#ffffff` page ground); hex format retention; saturated color retention (`#0076df` link blue).

## Variants

### Variant A — Faithful + improvements

Role: risk-averse green-light. "Yes, that's us, with the obvious fixes."
Composition: same as captured — header, post list, pager, footer — with a lead entry for
the newest post, compact rows for the next three, and a year-grouped archive.
Motion: static (no cinematic layer).
Improvements applied: all six items of `stardust/prototypes/index-improvements.md`.

### Variant B — What if we amplified the function-call wordmark?

Role: design-team motivator. The brand's underused capability foregrounded.
What if: "What if the `implementationDetails()` function-call wordmark — and its salmon
underline — became the site's structural voice instead of appearing once in the header?"
Captured trait amplified: function-call wordmark + 4px salmon underline (signature gesture)
in service of the "developer-wry" personality in `PRODUCT.md § Brand Commitments`.
Evidence: `_brand-extraction.json#logo.synthesizedBasis`; `palette[accent-1]` used once;
tensions `T-logo-variants`, `T-color-imbalance`.
Composition: section heads written as calls in the wordmark's serif (`latest()`,
`archive(2013–2023)`), each carrying the salmon underline; two-zone layout at ≥ 1024px —
lead + recent rows in the reading column, a year index rail beside it whose active year is
salmon-underlined; the author intro moves to a closing sign-off with the wordmark repeated.
Motion: static.
Differs from A: layout strategy of the post list (two-zone with year rail vs single column);
section sequence (author intro moves from top to a closing sign-off); section presence
(no separate archive section — the rail is the archive).

### Variant C — What if motion was part of the identity?

Role: visionary pitch. The brand's third dimension — kinetic.
What if: "What if the blog read like the author's field notebook — first-person notes
foregrounded and revealed at reading pace — instead of a stack of product-announcement
headlines?"
Cinematic register: editorial (`publication-register`, `slow-paced` per `PRODUCT.md`).
Captured trait amplified: first-person practitioner voice (voice-register pivot).
Evidence: `_brand-extraction.json#voice` summaries; `voice.tone`.
Composition: A's section set and order; the post-list layout is summary-led (each entry's
first-person summary is the primary line, title secondary) and the author intro becomes
the opening lede.
Motion: cinematic, register editorial — opacity-only reveals (900ms, 140ms stagger),
summary-before-title entrance, link underline draw-in on hover, ≤ 10vh micro-parallax on
the lead; neutralised under prefers-reduced-motion. (Prototype note, 2026-10-13: the micro-parallax was dropped at finish review: every candidate target either rose into the header, closed the lede/latest separation, or delayed reveals of its children past the reading line.)
Differs from A: layout strategy of the post list (summary-led vs title-led); IA priority
(author voice leads the page vs newest post title leads); motion layer.
Differs from B: no year rail (A's archive section kept); author intro at top vs closing
sign-off; summary-led vs call-headed list; motion.

## Command sequence (proposed)

1. `$stardust direct` (this command — PRODUCT.md, DESIGN-A/B/C)
2. `$stardust prototype index` → A (freezes canon), then B, then C
3. per variant: `$impeccable shape` → `$impeccable craft` → `critique` / `audit` / `adapt`; C adds motion validation Pass 6

## User confirmation

> (uplift — no confirmation stop; proceeding per uplift § Stop conditions)

## Pages in scope

- `index` (home). The captured post page is brand evidence only.

### Content authorised by this direction (content-sourcing hierarchy, level 3)

- **Archive entries** (A's year-grouped archive, B's year rail, C's archive): post titles,
  dates and paths rendered **verbatim** from `stardust/current/_query-index.json`
  (live `/query-index.json`, 38 posts, 2013–2023). Per-year counts may be shown only as
  derived from that file. No other numbers.
- **Author intro**: the existing bio sentence, verbatim, from
  `stardust/current/_author-bio.plain.html` — "Bruce is a huge fan of the open web,
  currently working at Adobe as a Senior Computer Scientist. Outside of the office he can
  be found riding bikes and spending time with family." A and C may shorten it to its
  first clause ("Bruce is a huge fan of the open web, currently working at Adobe as a
  Senior Computer Scientist.") — no new claims.
- **Author avatar**: `stardust/current/assets/media/author-avatar.jpg` (the post-footer bio
  image), reused only in an author-identity position (B's sign-off).
- **Section-head calls** (B only): `latest()`, `archive(2013–2023)` — direction-authored
  labels in the wordmark's function-call voice; the year range is derived from the index.
