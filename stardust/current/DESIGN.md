<!-- stardust:provenance
  writtenBy: stardust:extract
  writtenAt: 2026-10-13T15:54:00Z
  readArtifacts:
    - stardust/current/_brand-extraction.json
    - stardust/current/_computed-styles.json
    - stardust/current/pages/index.json
  synthesizedInputs: []
  stardustVersion: see plugin
-->
---
name: implementationDetails()
description: Articles on AEM, React Native, TypeScript, and more.
colors:
  paper: "#ffffff"
  ink: "#333333"
  link-blue: "#0076df"
  muted-grey: "#7a7a7a"
  hairline: "#f3f3f3"
  surface: "#fafafa"
  salmon-underline: "rgba(255, 105, 97, 0.5)"
  link-hover: "#000a13"
  pager-hover: "#477dca"
typography:
  wordmark:
    fontFamily: "Merriweather, Georgia, serif"
    fontSize: "1.25rem"
    fontWeight: 300
    lineHeight: 1.5
  post-title:
    fontFamily: "Lato, 'Helvetica Neue', Helvetica, sans-serif"
    fontSize: "2.998rem"
    fontWeight: 900
    lineHeight: 1.25
  body:
    fontFamily: "Merriweather, 'PT Serif', Georgia, serif"
    fontSize: "1rem"
    fontWeight: 300
    lineHeight: 1.5
  meta:
    fontFamily: "Merriweather, Georgia, serif"
    fontSize: "1rem"
    fontWeight: 300
    lineHeight: 1.5
  pager:
    fontFamily: "Lato, 'Helvetica Neue', Helvetica, sans-serif"
    fontSize: "1rem"
    fontWeight: 300
    lineHeight: 1.5
  footer:
    fontFamily: "Merriweather, Georgia, serif"
    fontSize: "0.707rem"
    fontWeight: 300
    lineHeight: 1.5
rounded:
  sm: "3.75px"
spacing:
  row: "2rem"
  section: "1rem"
  column: "42rem"
components:
  pager-button:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "1em 1.5em"
  pager-button-hover:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.pager-hover}"
  footer-band:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.muted-grey}"
    typography: "{typography.footer}"
    padding: "2rem"
---

# Design System: implementationDetails()

## Overview

A single-column reading page in the Jekyll Pixyll lineage. White paper, dark-grey ink, a serif body (Merriweather 300) and heavy sans titles (Lato 900). The only ornament is the wordmark's thick salmon underline and the blue links' gradient underline. Everything is sized in rem against a root that steps 14 / 16 / 18 / 20px at 32 / 48 / 64em, so the whole page scales as one unit.

## Colors

### Primary
- **Link Blue** `#0076df`: every in-content link, drawn as a 5%-tall band at the baseline (background-image gradient) with a white text-shadow knockout, never as a fill.

### Secondary
- **Salmon Underline** `rgba(255,105,97,.5)`: used once, under the wordmark. The only warm color on the page.

### Neutral
- **Paper** `#ffffff` page; **Surface** `#fafafa` footer band and pager boxes; **Hairline** `#f3f3f3` post dividers and pager borders.
- **Ink** `#333333` titles, body, wordmark; **Muted Grey** `#7a7a7a` dates and footer text (4.29:1 on paper, below AA).

## Typography

### Hierarchy
- Post titles: Lato 900, 2.998rem / 1.25 (≈60px at 1440, 42px at 360).
- Body / summaries: Merriweather 300, 1rem / 1.5.
- Dates and meta: Merriweather 300 italic, 1rem, muted grey.
- Footer: 0.707rem inside 0.75rem lines (~9.9px on mobile).
- Two levels only on the listing: an ≈3:1 jump from title to body with nothing in between (ad-hoc scale).

## Layout

One centred 42rem column (840px at 1440) with 1rem gutters. The header puts the wordmark left and five icons right (stacked and centred below 32em). The listing is a vertical stack of post rows (2rem padding, hairline divider), followed by a boxed Newer / Page n of N / Older pager and a full-width footer band.

## Elevation & Depth

Flat. No shadows anywhere; depth comes only from the `#fafafa` surface against white.

## Shapes

Near-square: a 3.75px radius on the pager boxes only. Everything else is unrounded.

## Components

### Navigation
The text wordmark `implementationDetails()` with a 4px salmon underline (opacity 0.88 on hover), then 5 monochrome SVG social icons (GitHub, Twitter, Email, LinkedIn, RSS) at 0.8 opacity, rising to 1 on hover.

### Post row
An italic date, a link-wrapped Lato title (no underline, 0.88 opacity on hover) and a one-paragraph summary, separated by a hairline.

### Pager
Newer / Older as surface boxes with a hairline border and a hover shift to white with `#477dca` text. Disabled items and the "Page 1 of 10" label sit at 0.5 opacity.

## Do's and Don'ts

### Do:
- Keep one reading column and let type carry the page.
- Keep the salmon underline as the single warm accent.

### Don't:
- Add imagery, cards or shadows. The observed system has none.
