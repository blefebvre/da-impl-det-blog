<!-- stardust:provenance
  writtenBy: stardust:direct
  writtenAt: 2026-10-13T16:03:30.653Z
  againstDirection: stardust/direction.md#variant-c
  readArtifacts:
    - stardust/current/_brand-extraction.json
    - stardust/direction.md
    - stardust/prototypes/index-improvements.md
    - PRODUCT.md
  synthesizedInputs: []
  stardustVersion: see plugin
-->
---
name: "implementationDetails() — Variant C — The field notebook, at reading pace"
description: "Articles on AEM, React Native, TypeScript, and more."
colors:
  paper: "#ffffff"
  ink: "#333333"
  quiet-ink: "#6b6b6b"
  link-blue: "#0076df"
  link-ink: "#000a13"
  surface: "#fafafa"
  hairline: "#f3f3f3"
  code-ground: "#eeeeee"
  frame-grey: "#999999"
  wordmark-salmon: "rgba(255, 105, 97, 0.5)"
typography:
  wordmark:
    fontFamily: "Merriweather, Georgia, serif"
    fontSize: "1.25rem"
    fontWeight: 300
    lineHeight: 1.5
  display:
    fontFamily: "Lato, 'Helvetica Neue', Helvetica, sans-serif"
    fontSize: "2.998rem"
    fontWeight: 900
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  title-l:
    fontFamily: "Lato, 'Helvetica Neue', Helvetica, sans-serif"
    fontSize: "1.563rem"
    fontWeight: 900
    lineHeight: 1.25
  title-m:
    fontFamily: "Lato, 'Helvetica Neue', Helvetica, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 900
    lineHeight: 1.3
  body:
    fontFamily: "Merriweather, 'PT Serif', Georgia, serif"
    fontSize: "1rem"
    fontWeight: 300
    lineHeight: 1.6
  lede:
    fontFamily: "Merriweather, 'PT Serif', Georgia, serif"
    fontSize: "1.25rem"
    fontWeight: 300
    lineHeight: 1.55
  meta:
    fontFamily: "Merriweather, 'PT Serif', Georgia, serif"
    fontSize: "0.875rem"
    fontWeight: 300
    lineHeight: 1.5
  label:
    fontFamily: "Lato, 'Helvetica Neue', Helvetica, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 900
    lineHeight: 1.4
    letterSpacing: "0.02em"
  code:
    fontFamily: "'Source Code Pro', Consolas, monospace"
    fontSize: "0.875em"
    fontWeight: 400
    lineHeight: 1.45
rounded:
  code: "3px"
  frame: "5px"
  pager: "3.75px"
  avatar: "50%"
spacing:
  xs: "4px"
  s: "8px"
  m: "16px"
  l: "24px"
  xl: "32px"
  xxl: "48px"
  section: "64px"
  section-tablet: "48px"
  section-mobile: "32px"
  column: "42rem"
components:
  link:
    textColor: "{colors.link-blue}"
  link-hover:
    textColor: "{colors.link-ink}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pager}"
    padding: "0.75em 1.25em"
  button-secondary-hover:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.link-blue}"
  code-inline:
    backgroundColor: "{colors.code-ground}"
    textColor: "{colors.ink}"
    rounded: "{rounded.code}"
    typography: "{typography.code}"
  badge:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.quiet-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pager}"
---

# Design System: implementationDetails() — Variant C — The field notebook, at reading pace

## Overview

A’s sections and order, re-led by voice: the author’s one-line intro opens the page as a lede, and each entry leads with its first-person summary in the serif with the title as the secondary line. Motion is editorial — opacity-only reveals at reading pace, and a drawn-in link underline — and disappears entirely under reduced motion.

Role: visionary pitch. Mode A (brand-faithful): Merriweather + Lato and the captured palette are pinned; the muted neutral is deepened to quiet-ink `#6b6b6b` (Mode A+, contrast evidence). Expressive axis: committed.

## Colors

### Primary
- **Link Blue** `#0076df` — in-content links, drawn as the brand's baseline gradient band; hover moves to **Link Ink** `#000a13`.

### Secondary
- **Wordmark Salmon** `rgba(255,105,97,.5)` — a 4px underline only; never text, never a fill.

### Neutral
- **Paper** `#ffffff` ground; **Surface** `#fafafa` footer, pager and pre blocks; **Hairline** `#f3f3f3` rules; **Code Ground** `#eeeeee` inline code.
- **Ink** `#333333` titles and body (12.6:1); **Quiet Ink** `#6b6b6b` dates, meta, footer (5.3:1 on paper, 5.1:1 on surface, 4.6:1 on code ground).

### Named Rules
- **Quiet ink, never half-opacity** — secondary text is a colour, not an opacity.

## Typography

Major-third scale (1.25) on the brand's stepping root (14 → 16 → 18 → 20px at 32 / 48 / 64em): 0.875 · 1 · 1.25 · 1.563 · 1.953 · 2.441 · 2.998rem. Lato 900 for titles, Merriweather 300 for body and the wordmark, the declared mono stack for code only. Minimum rendered size 12px.

### Hierarchy
- **Display** Lato 900 2.998rem/1.2 — one per page.
- **Title L / M** Lato 900 1.563rem and 1.25rem — listing and section titles.
- **Lede** Merriweather 300 1.25rem/1.55; **Body** 1rem/1.6; **Meta** 0.875rem (≥ 12px); **Label** Lato 900 0.875rem.

### Named Rules
- **Summary leads, title follows** — Entries show the summary (lede type) above the title (title-m) so the first-person voice is read first.

## Layout

One centred 42rem reading column with 1rem gutters; sections separated by 64px (48px tablet, 32px mobile) — density `balanced`. No secondary columns.

## Elevation & Depth

Flat. No shadows; depth only from Surface against Paper.

## Shapes

Near-square: 3px code, 3.75px pager, 5px framed screenshots, 50% avatar.

## Components

### Navigation
Text wordmark with the 4px salmon underline; five monochrome social icons with accessible names, 0.8 → 1 opacity on hover, ≥ 24px hit targets.

### Post entry
Summary-led: first-person summary in lede type, then the title in Title M, then the date in Meta.

### Pager / archive
Year-grouped archive (year label + title + date per post) below the latest posts; Newer / Older pager kept as a text row for ?page=N.

## Do's and Don'ts

### Do:
- Let entries arrive at reading pace
- Draw the link underline in on hover

### Don't:
- Count-ups, tickers, marquees, bouncy easing
- Animate anything under prefers-reduced-motion
- Use the Generic-2026-SaaS silhouette, monospace metadata, stat-callout bars or invented content.
