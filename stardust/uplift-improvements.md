---
_provenance:
  writtenBy: stardust:uplift
  writtenAt: 2026-10-13T16:02:00Z
  againstInput: https://main--da-impl-det-blog--blefebvre.aem.live/
  readArtifacts:
    - stardust/current/_brand-extraction.json
    - stardust/current/pages/index.json
    - stardust/current/brand-review.html
    - stardust/current/_computed-styles.json
    - Lighthouse 12.8.2 run 2026-10-13 (home / post / contact, mobile + desktop)
  referenceResearch:
    tier: "WebFetch (tier 2 — Refero MCP not available)"
  referencesUsed:
    - { name: "overreacted.io (Dan Abramov)", url: "https://overreacted.io/", serves: "improvement 4 counter-example", tag: "off-toolbox", observation: "one unpaginated chronological list of ~60 posts — title, date, one-line subtitle; author line + avatar in header" }
    - { name: "simonwillison.net", url: "https://simonwillison.net/", serves: "improvement 4 counter-example", tag: "off-toolbox", observation: "year/month archive links and tag counts; moderately dense list" }
    - { name: "jvns.ca (Julia Evans)", url: "https://jvns.ca/", serves: "improvements 3 + 6 counter-example", tag: "off-toolbox", observation: "title-only dense list, recent 10 then topic-grouped archive; one-line author intro at the top" }
---

# Improvements — https://main--da-impl-det-blog--blefebvre.aem.live/

1. **[contrast-or-density]** Muted grey meta text fails WCAG AA — `#7a7a7a` measures 4.29:1 on `#fff` (dates, `.blog-list-date`) and 4.11:1 on the `#fafafa` footer band (tension `T-contrast`; Lighthouse `color-contrast` on home, post and contact) · the Pixyll muted-grey token was tuned for looks, not legibility · fix: step the captured neutral one tone darker on its own ramp (≈`#6b6b6b`, 5.33:1 on paper / 5.11:1 on surface) for every meta/footer use; ink `#333` stays.

2. **[contrast-or-density]** Footer and meta type drop below legibility on phones — footer text computes to 9.9px at 360px (`0.707rem` at a 14px root; Lighthouse `font-size`: 60.8% of contact-page text < 12px), and the disabled "Newer" pager item plus "Page 1 of 10" sit at `opacity: .5` (Lighthouse flags `span.disabled`, `p.blog-list-page-meta`) · fixed-ratio `small` sizing inherited from a desktop-first theme · fix: floor small text at 0.875rem with a 12px minimum, and render pager meta at full AA contrast instead of half-opacity.

3. **[dated-pattern]** Oversized headline list reads as four posters, not an index — post titles are Lato 900 at 59.96px over 20px summaries (≈3:1, no intermediate step; tension `T-scale`), so the four posts fill ~1,660px at 1440 and a reader sees ~1.5 posts per viewport · the 2014 Pixyll "giant title" listing; contemporary developer blogs (jvns.ca, overreacted.io) run titles at roughly 1.25–1.6× body so 8–12 entries scan per screen · fix: introduce a modular scale (major-third) with listing titles at ~1.6rem and keep the 3rem display size for the page's single lead entry.

4. **[missed-opportunity]** Ten years of writing hidden behind "Older" nine times — the captured pager reads "Page 1 of 10" (`pages/index.json` body) with only Newer/Older controls; there is no year, topic or full-list entry point, so 2013–2020 posts are reachable only by paging · page-by-page blog pagination; overreacted.io shows every post on one page and simonwillison.net exposes a year/month archive · fix: keep the four latest posts, then add a compact year-grouped archive of all posts (title + date only) generated from the same query index, with the pager retained for deep links.

5. **[missed-opportunity]** The author is invisible on the front page — the only identity on the home page is the footer credit "Bruce Lefebvre" at 9.9–14px and five unlabelled icons; nothing says who writes this or why their AEM notes are worth reading (`_brand-extraction.json#voice.navItems` are icon labels only; `PRODUCT.md § Positioning`) · Pixyll's title-only masthead · fix: a one-line author intro under the wordmark using the existing post-footer bio copy (`/fragments/author-bio`), as jvns.ca does — no new claims.

6. **[ia-clutter]** Summaries repeat the title's job instead of helping triage — each row stacks date → 60px title → 20px summary with 2rem padding and a hairline, giving every post equal, maximal weight; the newest (Oct 2023) and a 2021 post look identical (`pages/index.json` headings + body) · uniform-card listing with no lead · fix: give the newest post a lead treatment (display title + summary) and list the rest as compact rows (date · title · one-line summary), the jvns.ca recent-list pattern.
