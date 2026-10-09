# Migrating implementationdetails.dev to AEM Edge Delivery Services

## Starting point
implementationdetails.dev was a Jekyll blog on the Pixyll theme:
- 38 posts (2013–2023) at `/blog/YYYY/MM/DD/slug/`
- 10 paginated listing pages (`/`, `/page2/`…`/page10/`), 4 posts per page
- a contact form and a thank-you page
- an RSS feed
- old reveal.js slide decks and a résumé under `/assets/`

The goal was zero dead links once the domain moved to the new site, with listing pages built dynamically from the posts' original publish dates.

## Decisions made up front
- **Clean URLs:** posts moved to `/blog/YYYY/MM/DD/slug`, with no trailing slash. Every old URL redirects.
- **Pagination:** a single dynamic homepage driven by `?page=N`. `/pageN/` redirects there.
- **Kept:** the author bio, the Twitter share link and Disqus comments. The comments are keyed to the old URLs, so existing threads carried over.
- **Dropped:** the TinyLetter subscribe banner. TinyLetter shut down in 2024.
- **Static files:** the slide decks and résumé were committed to the code repo exactly as they were.
- **RSS:** the feed is generated from the site index instead of by Jekyll.

## Content migration
- **Templates:** pages were grouped into three: blog post, listing, and simple page.
- **Import scripts** turned every page into Edge Delivery content:
  - Theme chrome was stripped, and highlighted code was flattened to plain `<pre><code>`.
  - Internal links were rewritten to the new clean URLs.
  - Each post got metadata: title, description, original date, author.
  - The shared author bio became a single fragment.
- **Upload:** 42 documents, 109 images and the redirects sheet went to Document Authoring, then were previewed and published.
- **Verification:** an audit confirmed every internal link resolves.

## Making the blog dynamic
- **Site index:** captures title, description, date, author and template for every page.
- **`blog-list` block:** reads the index, sorts by original publish date, and shows 4 posts per page with Newer/Older links. All 10 original listing pages were checked post-for-post: they match exactly.
- **Post pages:** code adds the date, author and read time (the same words÷180 formula Pixyll used), the share link, the bio fragment and lazy-loaded Disqus.
- **Other blocks:** small `embed` (SlideShare) and `contact-form` (Formspree) blocks.
- **Sitemap and robots.txt** are built from the index.
- **RSS:** a script builds `/feed.xml` from the index. Its item IDs keep the old URL format so subscribers don't get duplicates.

## No dead links
- **163 redirects in total:**
  - every old post URL, with and without `index.html`
  - `/pageN`, with or without the slash
  - `/contact/` and `/thanks/`
  - the slide decks
  - 42 image URLs
- **Image URLs:** the live service only serves lowercase, hyphenated file names, so `app_screenshot.png` had to become `app-screenshot.png`. The old name redirects to the new one.
- **Slide decks:** plugins that reveal.js loads at runtime were found and fetched. File names containing spaces were renamed. A missing image path was fixed.

## Design, header and footer
- **Type scale:** the root font size steps 14 → 16 → 18 → 20px at 32, 48 and 64em, as in Pixyll.
- **Fonts:** Merriweather and Lato are now self-hosted. Pixyll only loaded weights 300 and 900, so regular text actually displayed at 300. Declaring the fonts the same way reproduced that look exactly.
- **Details:** the gradient link underline, framed images, code blocks, blockquotes and the 42rem reading column were all carried over.
- **Header:**
  - the site title with its salmon underline, plus five social icons as SVG versions of the Font Awesome 4 glyphs
  - stacked and centered on phones
  - heights identical to the original, element positions within 1–2px from 375 to 1440px
- **Footer:** the copyright line with matching height, colors and link behavior.
- **Validation:** every comparison was measured against the live original with an automated browser rather than judged by eye. Blocks scored 97–98% visual match.

## Lessons and gotchas
- **Trailing slashes:** they don't map naturally to Edge Delivery, so clean URLs plus redirects was the simpler choice.
- **Path normalization:** content paths are lowercased and underscores become hyphens. Code-repo files keep their names.
- **SVGs:** a stray blank line before `<svg>` was enough for the service to reject the file as "not an SVG".
- **Fonts:** match the weights the original actually *rendered*, not the CSS value it declared.
- **Validation tooling:** checks built for complex dropdown and hamburger menus can't run on a simple header. Those were recorded as not applicable rather than faked.

## Result
- Two pull requests were merged.
- All 159 resources are previewed and published.
- Old URLs, the feed, the sitemap and the slide decks all resolve on the new site.
- **Still optional:** a daily job to regenerate the RSS feed for new posts, which only matters if the blog gets new posts.
