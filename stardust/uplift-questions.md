---
_provenance:
  writtenBy: stardust:uplift
  writtenAt: 2026-10-13T16:06:00Z
  againstInput: https://main--da-impl-det-blog--blefebvre.aem.live/
  readArtifacts:
    - stardust/current/_brand-extraction.json
    - stardust/current/pages/index.json
    - stardust/current/brand-review.html
    - stardust/current/PRODUCT.md
  referenceResearch:
    tier: "WebFetch (tier 2 — Refero MCP not available)"
  referencesUsed:
    - { name: "simonwillison.net", url: "https://simonwillison.net/", serves: "variant B compositional anchor (year/month archive as navigable structure)", tag: "off-toolbox" }
    - { name: "overreacted.io", url: "https://overreacted.io/", serves: "variant C register check — personal long-form dev blog, still list, no motion devices", tag: "off-toolbox" }
    - { name: "brittanychiang.com", url: "https://brittanychiang.com/", serves: "checked as a code-syntax-as-structure anchor for B — rejected: current site uses standard type for section labels", tag: "n/a (not used)" }
---

# "What if…" candidates — https://main--da-impl-det-blog--blefebvre.aem.live/

## Picked

### Variant C · Voice-register pivot
Source: catalog (#5)
What if: "What if the blog read like the author's field notebook — first-person notes foregrounded and revealed at reading pace — instead of a stack of product-announcement headlines?"
Cinematic register: editorial
Evidence: `_brand-extraction.json#voice` carries a tonal contrast between the product-announcement voice ("We've released a new tool to help on your journey in pursuit of an optimal Dispatcher configuration.") and the first-person practitioner voice ("This post covers some gotchas that I encountered while adding support to an existing app of mine."); `voice.tone.evidence` records the first-person register; the listing currently leads with 60px product-name titles (`type.headingFamily.sizes`), so the personal voice survives only inside summaries.
Motion bet: reading-paced reveals (opacity-only, 900ms, 140ms stagger) bring each entry's summary up before its title settles, the brand's gradient link underline draws in on hover, and a 10vh micro-parallax on the lead entry — motion that slows the reader down rather than performing.

### Variant B · Signature-gesture extension
Source: catalog (#4)
What if: "What if the `implementationDetails()` function-call wordmark — and its salmon underline — became the site's structural voice instead of appearing once in the header?"
Captured trait amplified: the function-call wordmark + 4px salmon underline
Evidence: `_brand-extraction.json#logo.synthesizedBasis` (text wordmark "implementationDetails()" in Merriweather 300 with a 4px underline); `palette[accent-1]` `rgba(255,105,97,.5)` occurs once (header `.nav-title` text-decoration-color); tension `T-logo-variants` (one variant, header-only); tension `T-color-imbalance` (accents used in a single context).
Composition bet: section heads set as calls in the wordmark's voice — `latest()`, `archive(2013–2023)` — each carrying the salmon underline as the single accent; the listing becomes a lead entry plus a year-indexed archive with the year labels underlined in salmon (simonwillison.net-style year/month archive, rendered in the brand's own serif). Static.

## Disqualified

- **Display-typography amplification (#1)** — disqualified because the display family (Lato 900) is not reserved for small uses: it already carries every post title at 2.998rem, and Lato is a generic humanist sans with no signature axis to amplify.
- **Photography re-foregrounding (#2)** — disqualified because the home page carries no photography at all (5 images, all 16–20px social icons; `heroImage: null`).
- **Live-data promotion (#3)** — disqualified because the site exposes no live or operational data.
- **Audience-routing reframe (#7)** — disqualified because the page serves one audience (readers of the newest posts) with two CTA verbs (Newer, Older); there is no multi-audience compression to untangle.
- **Motif vocabulary swap (#8)** — disqualified because the home page has one composition primitive (the post row); the pager and icon row are controls, not alternative content primitives.

## Considered but not picked

- **Color-ladder re-weighting (#6)** — real trigger (salmon `rgba(255,105,97,.5)` used once; `#fafafa` surface used only on the footer and pager), but promoting salmon to a surface overlaps B's trait (the same salmon underline) and would make B and C amplify adjacent traits; B absorbs the salmon as an accent marker instead.
