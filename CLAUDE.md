# Project CLAUDE.md: tonys-toppers

A website for Tony's Toppers, the handmade craft business of Tony Mawhiney,
a family member's son who has Down syndrome (React, Vite, React Router,
deployed on Netlify at https://tonystoppers.com/). Tony lives in Bolivar,
Missouri and sells his pieces (pen toppers, wine stoppers, keychains, dog
necklaces, car freshies, name badge reels, phone grips, and straw charms) at
craft fairs and similar events around the area. It's also a portfolio piece
by techgeek.dev, linked from https://techgeek.dev. Every rule in the
user-level CLAUDE.md applies here; this file records only what's specific to
this project. ease-my-life, reese-roofing, and seal-and-shield have already
been converted to those rules and serve as worked examples.

## Kind of site
Decided 2026-10-10. A real person and brand, so the site is indexed and gets
a sitemap, never the demo treatment. It's a showcase for Tony and his work,
not a shop, though it may become one later, so the product data stays in a
form a shop could build on.
- **Not local SEO**: Tony has no storefront, set hours, or service area, so
  there's no `LocalBusiness` structured data and no Google Business Profile.
  The city still appears in the title, description, and headings where it
  reads naturally, since most visitors will have met Tony at a fair and
  search for him afterward.
- **Structured data**: a `Person` for Tony as the maker, plus `Organization`
  and `WebSite` for Tony's Toppers, with the address given only as Bolivar,
  Missouri, and `sameAs` pointing to the Facebook page. Never a street
  address or a birth date.
- **One name, city, and phone everywhere**: "Tony's Toppers", Bolivar,
  Missouri, and (417) 733-0681 as a click-to-call link.
- **Author meta**: Tony's Toppers.
- **Canonical**: the site counts as one indexed page, since its only other
  route is the `noindex` 404 page (decided 2026-10-23, under the SEO rule), so
  the canonical stays in `index.html`, where crawlers that never run scripts
  can read it. The 404 page carries the home page's canonical beside its
  `noindex`, which is accepted, since the `noindex` keeps it out of search.

## Content
Decided 2026-10-10. Claude drafts the product photos' alt text and an About
paragraph covering all 8 categories, and the user confirms them for accuracy.
- **Bolivar is Tony's hometown** (confirmed by the user 2026-10-30), so
  comments may call it that, though the About story only says he lives there
  and moved to Grandview after high school.
- **Alt text**: done 2026-10-10 and confirmed by the user. Each photo's
  description lives in `catalog.ts`'s `PHO_ALT_OBJ`, keyed by file name, or
  in its booth row, under 100 characters and never repeating the card's
  name. A new photo needs its own row.
- **About paragraph**: done 2026-10-10 and confirmed by the user. Rather
  than a new paragraph, the story's growth paragraph names all eight kinds
  of piece where it said he expanded into wine stoppers.
- **Photos showing more than one kind of piece** (decided 2026-10-10): ten
  photos had been listed under every category they show, as byte-for-byte
  copies, and the user moved the copies out. The four wide booth shots
  (`booth-1` to `booth-4`) live in the "At the Craft Fairs" gallery between
  Products and About Tony, and each category filter also shows the booth
  shots tagged with it, so "Straw Charms" isn't empty, while "All" lists only
  the pieces and sets, once each. The three small mixed displays
  (`pen-wine-set-1` to `-3`) are one card each, tagged as both pen toppers
  and wine stoppers. Each catalog entry lists every category it shows
  (decided 2026-10-11: every kind its alt text names, so the booth shots
  also appear under "Keychains" and "Name Badge Reels"). Booth-3 is the only
  photo tagged "Straw Charms", and the user confirmed it shows them, so its
  alt text names them and the contact form offers "A straw charm".
- **`booth-1` is a phone screenshot**, sharper than the copy that was moved
  out: the image script crops off the phone's interface, keeping the
  original in `design/photos/products/`.
- **The bar links to the gallery** as "Craft Fairs" (decided 2026-10-10),
  between Products and About Tony, in page order.

## Images
Decided 2026-10-10, under the user-level "## Images" rule. The original photos
are kept in `design/photos/` (the pieces and booth shots in `products/`),
outside the served tree, and `npm run photos` (`design/photos/render.mts`)
writes resized WebP copies into `src/`, at quality 0.85, plus
`src/pages/home/photo-sizes.ts`, which gives every img its width and height.
Each is about three times its display size on a 1,920px screen, never more
than three times the largest size it's shown at (decided 2026-10-29, up from
twice, for the densest phone screens, taking the photos from 2,698 KB to 4,892
KB): a product photo fits within 843 by 1,125px, a booth shot within 1,044px
wide, and the cartoon within 1,065px, never enlarged past its original, while
the portrait keeps its 756px. Adding or replacing a photo means dropping the
original in and rerunning the script. Tony's cartoon stays lossy like the
photos (decided 2026-10-29): its original is a JPEG with halftone texture
rather than flat artwork, and lossless came to 751 KB against 69 KB with no
difference visible at 3x zoom. The logo and favicon come from the existing
SVGs (`logo.svg`, `logo-no-text.svg`), and `npm run icons` renders the raster
icons from `public/favicon.svg`.

## Horizontal layout
Decided 2026-10-10 by the user after comparing the current numbers with the
horizontal rhythm, following reese-roofing's and seal-and-shield's method.
The core design numbers match the other projects: the plastic ratio, with
1rem as the 11px base and body text at Base Plus 1. Built in three commits
so any of it can be rolled back with `git revert` (newest first, since the
later two read the first one's tokens): `d852b2f` (layout clamps and the
content cap), `4c0eafb` (hero picture), and `f615155` (grid card widths).
- **Fluid (horizontal rhythm)**: layout values only. The page gutter
  (`--gut-sid-pad`, seal-and-shield's own), the column gaps between section
  columns, the section head's gap, the grid gaps, the contact form card's
  side padding, the contact rows' side padding, and the buttons' side
  padding are each a `clamp()` of a `--hor-rhy-*` step between two
  `--spa-hor-*` steps.
- **Fixed (rem steps)**: everything inside a component: small gaps, the
  filter, tag, card, and field padding, and the bar links' padding.
- **Content cap**: a fixed `1920px / ρ` (about 1,449.4px), the same as the
  other projects, up from 1,200px. The bar's brand and links follow it too
  (decided 2026-10-18), as in hair-designs: the bar keeps spanning the
  screen, and its side padding grows to `max( gutter, ( 100% - cap ) / 2 )`,
  which only passes the gutter wider than about 1,539px. Checked in all three
  engines from 901px to 3,840px, scrolled and not: the brand and last link
  meet the content's edges, with no overlap, wrap, or sideways scroll.
- **Hero picture**: the portrait ring takes `max()` of a rhythm-step floor
  and a horizontal step, as seal-and-shield's logo does, and grows from
  about 183px to 243px below 900px. The stage fills its column at the
  ring's height plus room for its drift and the sticker, and hands the ring
  and sticker their widths (`--por-rin-wid`, `--her-sti-wid`). The ring
  turns around a point about 15px above its middle, so the portrait drifts
  in a small circle (fixed 2026-10-10: the stage used to collapse to no
  size, sending the portrait around a wide circle off the hero's edges).
  Firefox alone shows a brief cross flashing over the sticker now and
  then, which no screenshot catches; the user chose to leave it.
- **Grid cards**: the Products grid's minimum card width takes `max()` of
  about 138px and horizontal step 020, replacing the narrow-screen override,
  so a 320px screen shows one column. The Craft Fairs gallery's four booth
  shots step instead, so every row is full (decided 2026-10-23, under the Card
  Grids rule): four columns, two at 900px wide and below, and one at 360px and
  below, since two would fall under the 138px minimum below about 330px (about
  154px each at 361px, measured in all three engines), and a breakpoint rounds
  up to the next one in the set. That adds 360px to the breakpoints, beside
  900px and 1,000px. The Products grid keeps `auto-fill`, and its leftover
  cards sit centered in the last row at the others' width (decided
  2026-10-29), since filters of 7 and 5 pieces have no column count that fills
  every row: an observer in `products.tsx` reads how many columns the grid
  laid out, and the leftover cards move across by half the empty columns
  (`--pro-row-off`).

## Directory structure
Decided 2026-10-10, matching reese-roofing's and seal-and-shield's adaptation
of the user-level "### Directory structure" layout to a website with routes
rather than a web app with tabs.
```
src/
  main.tsx               entry point
  app.tsx                React Router setup, the bar, and the footer
  assets/                fonts/ (the self-hosted fonts) and products/ (the
                         54 resized product and booth photos)
  pages/
    home/                the home page, its five sections, catalog.ts,
                         photo-sizes.ts, and the images only it shows
                         (Tony's photos, the logo)
    not-found/           the 404 page
  ui/                    components used by 2 or more pages (nav, footer),
                         section-link.ts, scroll-top.ts, and the bar's logo
                         mark
  styles/                global CSS only (fonts.css, styles.css)
  utils/                 app-agnostic helpers (motion.ts, rhythm.ts)
```
Outside `src/`: `tests/` holds the Playwright suites (see "## Test suites").
- **`pages/` takes the place of `tabs/`.** Each route gets its own folder,
  and a component only that page uses (the hero and the Products, Craft
  Fairs, About, and Contact sections) lives in that folder.
- **A page's main file is named after its folder, with no prefix**
  (`pages/home/home.tsx`), the same as the sibling projects.
- **The product data is `pages/home/catalog.ts`**, not `products.ts`,
  so it doesn't share a name with the Products section beside it. It
  imports every photo through `import.meta.glob` and looks up each card's
  photo by file name.
- **The product photos live in `src/assets/products/`** (decided 2026-10-10
  by the user), though only the home page shows them, in one flat folder,
  since a folder per category would pass the two-level depth limit. Step
  11's optimization script writes their resized copies there, with the
  originals in `design/photos/`.
- **The bar, footer, and section links live in `ui/`**, since the 404 page
  uses the bar and footer too. Section links go through
  `ui/section-link.ts`, as in seal-and-shield, which scrolls in place on the
  home page and navigates home with the section's ID as the hash from any
  other page; the home page jumps to that section on arrival and clears the
  hash. Unlike seal-and-shield's, its `modCliFun` leaves a Ctrl, Cmd,
  Shift, Alt, or middle click to the browser, so a section can still open in
  a new tab, as the old `HashLink` allowed.
- **The bar's logo mark lives in `ui/`**, and `public/favicon.svg` is its
  own copy with a white disc behind the TT, so the favicon holds up on a
  dark tab bar.

## Main content
Decided 2026-10-23, under the user-level "## Skip Link And Modal Layers"
rule. The main content is each page between the bar and the footer: the
`<main>` in `app.tsx`, which wraps whichever route matches and carries
`id='main'` and `tabIndex={ -1 }`. The skip link is the first thing
`NavBarCom` renders, so every page starts with it, and it waits above the
screen until it's focused.

## Unused files
Decided 2026-10-10. An unused image is listed for the user to confirm before
it's removed. Any other file that nothing references is removed without
asking.

## Cleanup plan
Decided 2026-10-10, following seal-and-shield's order. Steps 1 through 10 go
on the `code-cleanup` branch, step 11 on `site-features`, and the final rule
passes on `close-out`.
1. **Project setup**: this file, the unused files removed, and Windows
   `:Zone.Identifier` download markers ignored. Done 2026-10-10.
2. **Dependency upgrades**, one major version at a time with a build check
   after each: Vite 8 with `@vitejs/plugin-react` 6, React 19, React Router 8
   (the single `react-router` package, replacing `react-router-dom`), then
   TypeScript 6.0. Each is checked against the previous build with full-page
   screenshots, a computed-style comparison of every element at rest, hovered,
   and focused, and axe, all in three engines. Chromium's phone screenshots
   vary run to run on the product photos, so they don't count as a match.
   - **Vite 8**: done 2026-10-10. Its CSS minifier keeps only the last of two
     declarations it treats as one property, so the nav's `backdrop-filter`
     now comes after its `-webkit-` prefix, or Chromium and Firefox lose the
     blur. It also writes colors as hex, which moves the nav's translucent
     background by one color level, and `background : none` as a position of
     `0px 0px`, which draws nothing different.
   - **React 19**: done 2026-10-10, with identical screenshots and behavior
     (filters, menu, section links, form typing, the 404 page's button) and
     no console errors. The production bundle grows from 58 to 81 KB
     gzipped, React 19's own size and in line with seal-and-shield.
   - **React Router 8**: done 2026-10-10, with every import moved to
     `react-router`, identical checks (a direct visit to `/#about` included),
     and `npm audit` clear of the old router's three moderate advisories.
   - **TypeScript 6.0**: done 2026-10-10. It only type checks (Vite
     compiles), so the source checking cleanly and a byte-for-byte identical
     build stood in for the browser checks.
   - **Known axe violations**, already on the live site and fixed in their own
     steps: the 404 page with no `h1` (step 11). The footer's phone link, told
     apart by color alone, gained an underline in step 6, and the hidden
     Netlify form repeating the contact form's IDs was rebuilt in step 6,
     before `index.html`'s formatting.
3. **ESLint**, set up from ease-my-life's `eslint.config.ts`. Done
   2026-10-10 with seal-and-shield's copy unchanged and the sibling
   projects' versions; the source lints with no findings.
4. **Playwright and axe** in all three engines, with baseline screenshots
   taken before anything moves, so later steps can prove nothing changed on
   screen. Done 2026-10-10 (see "## Test suites"). The accessibility suite
   fails on the live site's own problems, each fixed in a later step:
   - **No reduced motion** anywhere (the hero's blobs, logo ring, and sticker,
     and every product card's entrance): step 9.
   - **Decorative glyphs read aloud**: the arrows in "See the collection",
     "Send Message", and "Back home", and the contact links' ☎ and 📲
     icons: step 6.
   - **Form fields with no visible focus**: the name, email, interest, and
     message fields: step 9.
   - **Closed phone menu still focusable**: Tab reaches its four links while
     they're off screen: step 8.
   - **The known axe violations** listed under step 2.
   - **Needs review by hand**: axe can't judge the contrast of text over the
     hero's gradient and the photos.
5. **Directory structure**, matching reese-roofing and seal-and-shield (see
   "## Directory structure"). Done 2026-10-10 in six commits: the Netlify
   fallback moved to `public/_redirects`; the source files moved with only
   their import paths changed; Tony's photos and the logos imported rather
   than served from `public/`; the product photos moved to `src/assets/`;
   the fonts self-hosted (moved up from step 9, as in seal-and-shield, since
   the Google Fonts tags fit none of the HTML rules' head sections); and
   `ui/section-link.ts` replacing `HashLink` and its 50ms scroll timeout.
6. **Formatting, naming, and comment pass**, one file per commit, with the
   copy fixes (no em dashes, "Down syndrome" capitalized). Done 2026-10-10:
   `vite.config.ts` (adding the shipped-page minifier), `index.html` (after
   the hidden form's rebuild), and every TypeScript file under `src/`, each
   checked by every suite. The components are now `AppRooCom`, `NavBarCom`,
   `SitFooCom`, `HomPagCom`, `HerSecCom`, `ProSecCom`, `FaiSecCom`,
   `AboSecCom`, `ConSecCom`, and `NotFouCom`. Along the way, the footer's
   phone link gained an underline, every decorative arrow and emoji in a
   link's or button's name is hidden from screen readers (through an
   `aria-label` where a wrapper would have shifted a flex layout), the hero's
   sticker is hidden as decoration, and `catalog.ts` reads each category's
   photos from the folder. The README's em dashes go with its rewrite at
   close-out.
7. **Contact form fixes**: done 2026-10-10. The browser's required-field
   checks are back on, so an empty or malformed form isn't sent. Sending
   now waits for Netlify's answer: only an OK shows the thank-you note,
   while a rejection or a network failure keeps the visitor's details and
   shows an announced error note offering a retry or Tony's number, and the
   button is disabled and reads "Sending..." while a request is out. The
   error note's reds are literal until step 9 gives them their status
   roles. The hidden form in `index.html` became a bare, valid copy of the
   real form's four fields in step 6, as in seal-and-shield. The user sent
   a test submission after the 1.6.0 deploy, and Netlify recorded it.
8. **Hooks and CSS modules**: done 2026-10-10.
   - **State and hooks**: the bar's scrolled, open-menu, and active-link
     classes became `data-page-scroll-active`, `data-mobile-menu-open`, and
     `data-section-link-active`. The photos carried `proPhoIma` and
     `faiPhoIma` hooks for the rendering suite's mask until step 11's
     resized photos let it go.
   - **Accessibility fixes**: the product filters became a labelled group of
     `aria-pressed` toggles in place of a partial tablist, and the closed
     phone menu is `visibility: hidden` once its slide-out ends, so its links
     leave the Tab order and screen readers.
   - **Modules**: every component has its own `.module.css` (`ui/nav`,
     `ui/footer`, and the hero, products, fairs, about, contact, and 404
     pages), classes kept verbatim and read through `cssModObj`. The shared
     section, container, heading, label, note, and button classes are copied
     into each module that uses them, inline styles and outside overrides
     merged in, and every element once reached through a tag selector has a
     class of its own. Rule-less classes (`hero-text`, `bio-content`,
     `bio-stat`, `contact-info`, the per-section classes) and the unused
     category modifiers, stopper tag, and placeholder note are gone.
     `fadeUp` stays global behind `global()`, the hero's other keyframes
     moved into its module, and every animation and transition has a
     reduced-motion variant. `styles.css` holds only the tokens, base
     element styles, the mount element, and `fadeUp`.
   - **Verified** by comparing every element's computed style against the
     previous commit at rest, scrolled, with each control hovered and
     focused, and with the phone menu open, on both pages at both widths in
     all three engines (the form's notes too, against faked answers). The
     reduced-motion baselines were refreshed twice, for the hero and the
     cards, whose entrance animations no longer run there. With the motion
     variants in, the reduced-motion checks and the keyboard walks pass, and
     only the 404 page's missing `h1` still fails (step 11).
   - **Found for later**: a product card's hover lift never showed, since its
     entrance animation's `both` fill held `transform` (fixed in step 11's
     interaction feedback), and the form fields swapped the browser's focus
     outline for a border color alone (fixed in step 9's focus rings).
9. **Design tokens**: done 2026-10-10, in seven commits.
   - **Colors and fonts**: the core design numbers and the full color role
     set, with this site's colors by role: cream is the page and light text,
     white the surface, the deeper cream band a sunken shade, ink the main
     text, strong border, shadow, and dark surface, ink-soft the secondary
     text, navy the main accent, yellow the second, and the thank-you and
     error notes the success and error families. Single-use shades are
     relative colors of their roles, and alphas snap to a reciprocal power
     where one is within 10%. Outfit is the main font and Fraunces the
     secondary.
   - **Type and spacing**: the 68.75% root with body text at Base Plus 1,
     and every length on its step, measured from the old 16px rem. Outfit
     averages 2.28 characters per em, so the hero pitch caps at `pow-012`
     (about 67 characters) and the section notes at `pow-011` (about 50).
     **This project's `--bor-wid-xla` is `m04`** (about 4.73px, drawn as
     4px) rather than the usual `m05`, since the portrait's frame and the
     logo badge draw 4px borders and nothing draws 3px. The contact rows'
     inline size went, since every row's value now shares one step and
     still fits a line at every width.
   - **Durations and easing**: the animation family runs to `p20` for the
     portrait ring's 43.7-second turn, the 100ms entrance delay and the cards'
     30ms stagger stay literal, every curve folds into the standard ease
     (2026-10-23: except where the Interaction Feedback rule names a curve, so
     every hover lift, nudge, and press now decelerates, the product card's
     shadow leaving on accelerate), and `html` turns smooth scrolling off under
     reduced motion.
   - **Shadows**: the hovered card reads the medium elevation, and the hard
     offset shadows rest on `m05` with each button's hover and press offset
     written as the resting offset plus or minus its lift step.
   - **Focus ring**: the form fields grow a 2px ring on focus-visible.
   - **Names**: every class and keyframe has its three-segment name,
     matching seal-and-shield's for the shared pieces (`pagConDiv`,
     `eyeLabDiv`, `secTitHea`, `titAccEmp`, `butBasAnc`), and `fadeUp` is
     `blockEnterFadeIn`.
   - **Form field text stays at Base Plus 1** (decided 2026-10-10 by the
     user), though iOS Safari zooms the page when a field under 16px is
     tapped, the same as seal-and-shield.
10. **Horizontal layout comparison** (see above), then a WAVE and
    accessibility review. Done 2026-10-10. The horizontal layout is
    recorded under "## Horizontal layout". The user's review found three
    fixes, all made: the About section moved to the deeper cream to set it
    apart from the gallery, the hero's collapsed picture stage was rebuilt
    (see "## Horizontal layout"), and the portrait grows below 900px. WAVE's
    50 redundant and 4 long alt text alerts were fixed with the confirmed
    descriptions (see "## Content"), after which WAVE reports nothing and
    the user found no contrast problems over the hero or the photos.
11. **New features**: the 404 page, security headers, image optimization,
    SEO, social previews and the favicon set, and interaction feedback,
    plus a recheck of WebKit's phone menu links once the photos had their
    sizes. Done 2026-10-10 and released as 1.7.0.
    - **404 page**: done 2026-10-10, with an `h1`, its own title, `noindex`,
      and a "See the collection" button beside "Back home".
    - **Security headers**: done 2026-10-10, seal-and-shield's `_headers`,
      with Vite emitting every asset as a file (`assetsInlineLimit: 0`) so
      the policy needn't allow data URLs.
    - **Images**: done 2026-10-10 (see "## Images"), 56 photos from 6,351 KB
      to 2,698 KB, and the rendering suite's photo mask dropped.
    - **WebKit phone menu links**: rechecked 2026-10-10 once the photos had
      their sizes. Two more causes turned up and were fixed: the About
      portrait grew after load in WebKit, and WebKit resolves a rem on the
      root element against 16px, so `html`'s scroll padding read about 36px
      too tall. That one length on `html` uses `1em` times its rhythm step
      instead of the spacing token, since it's the only place a rem is read on
      the root element. Every section link now lands at 79px in all three
      engines. Since 2026-10-30 (decided by the user) that length rebuilds the
      bar's height token in em plus step p01 of room, about 102.8px, under the
      rule that a distance clearing part of the layout reads that part's own
      token.
    - **SEO**: done 2026-10-10. `index.html` carries the home page's title
      ("Tony's Toppers | Handmade Beaded Crafts in Bolivar, MO"), a
      122-character description naming Tony, Bolivar, and his pieces, the
      author and canonical tags, and one JSON-LD graph: an `Organization`
      (phone, Bolivar, MO with no street, the Facebook page in `sameAs`)
      founded by a `Person` for Tony (no birth date), and a `WebSite` it
      publishes. `public/` gains `robots.txt` (every crawler allowed) and a
      sitemap listing the home page. The hero's h1 stays as written; the
      eyebrow above it names Bolivar.
    - **Social previews and favicon set**: done 2026-10-10. `npm run og-image`
      captures `design/og-image/card.html` (Tony's cartoon, the name in the
      heavy serif, and "Handmade in Bolivar, MO" on the hero's highlight bar,
      over the hero's cream wash and glows) as `public/og-image.jpg`. Tony's
      cartoon stands in for the logo the Social Previews rule asks the card to
      be built from (decided 2026-10-30 by the user), since he is the brand.
      It's a JPEG at quality 90 (about 63 KB), since as a PNG the washes and
      portrait came to 441 KB, over WhatsApp's limit, and quality 85 showed
      faint blocking at 3x zoom. `npm run icons` renders the ICO, the 16 to
      512px PNGs, and an inset apple touch icon on white from
      `public/favicon.svg`, which the head lists first. The head gains `theme-
      color` (the cream), the full Open Graph and Twitter tags, and the
      structured data's logo and image. After the 1.7.0 deploy the user
      confirmed the favicon and the preview card, and submitted the sitemap to
      Google Search Console and Bing.
    - **Interaction feedback**: done 2026-10-10. Every link and button
      grows seal-and-shield's focus ring in from a zero-width outline (the
      global rule in `styles.css`), and every control with its own
      transition lists the two outline properties. The Contact band and the
      footer hand the ring yellow (`--foc-rin-col`), and the form card hands
      it back navy. Buttons, rows, and the filters press in to 0.97, and
      text links dim. New hovers: the brand turns navy while its mark tilts
      (the one flourish, on the overshoot easing), the toggle's bars turn
      navy, the active bar link turns navy, menu rows nudge 3.6px, the
      filters shade and lift, the secondary buttons and contact rows lift,
      and the form fields darken their borders. The product cards' entrance
      now fills `backwards`, so their hover lift finally shows.
    - **Close-out rulings** (decided 2026-10-11 by the user): the navy buttons
      with hard shadows (the hero's and 404 page's primary buttons, the form's
      "Send Message", the menu's call button) lighten to `--acc-hov-col` on
      hover as they lift, and press in to 0.97 back onto their resting shadow,
      like every other button. The product cards lift about 2px, the rule's
      size, not 6px, and show the normal cursor, since they aren't links,
      while keeping their navy hover border beside the fading shadow
      (confirmed 2026-10-29). The footer spells out Bolivar, Missouri, like
      the rest of the page; only the page title, the preview card, and the
      structured data use MO, where length or format needs it. The same holds
      for every Missouri town the page names, so Tony's story spells out
      Grandview, Missouri. The phone menu's panel decelerates as it slides in
      and accelerates as it slides out, and the Products band's filter strip
      sits above the band's dot grid like the heading and the cards. The
      contact form's thank-you and error notes fade out as they leave, as well
      as rising in. The portrait's hover tilt and the product photos' hover
      zoom run about 277ms, within the rule's range, and the phone menu's rows
      keep their sideways nudge on hover. Cards a filter drops leave the grid
      at once (confirmed 2026-10-29), since the new cards' staggered rise
      already animates the change, and an exit would hold every filter back a
      beat while the old cards played it.
12. **Close-out**: done 2026-10-11 on `close-out`. The README was rewritten for
    the finished site, and the rule pass ran seven full audits, each fixed and
    rechecked, as the findings fell from 82 to 2 (82, 36, 20, 7, 16, 11, 2),
    then a focused audit of the last new code, whose four findings were fixed.
    The user's rulings along the way are recorded above and in the rules doc:
    `Rcd` became `Rec`, a type sits 1 blank line above its declaration, every
    classed element's label expands its class, and plain lookups and lists are
    documented once. The user-level rules repo has both its Images rule and
    these rulings committed (`35e0e71`, `d3d6e15`).

## Test suites
Added 2026-10-10, adapted from seal-and-shield's. Playwright suites live in
`tests/`, one project per suite and engine in `tests/playwright.config.ts`,
which starts its own dev server on port 5192 (never the usual 5173, nor a
sibling project's port), plus a production preview on 5199 for the security
suite and the SEO suite's built page check, and stops both afterwards. Every
suite runs in Chromium, Firefox, and WebKit. Results, screenshots, and traces go to
`tests/output/` (git-ignored); `npx playwright show-report
tests/output/report` opens the HTML report. The states the suites visit (the
home page and the 404 page at 390px and 1,440px, plus the phone menu open at
390px) are listed in `tests/support/states.ts`. Its `opeStaFun` scrolls
through the page before checking it, since the product photos load lazily,
and skips animations that repeat forever (the hero's floating blobs, turning
portrait ring, and wobbling sticker) when waiting for the page to settle.
- `npm run test:accessibility`: the pre-commit accessibility scan. axe-core
  checks each state against WCAG 2.2 A and AA plus best practices
  (`axe.spec.ts`), and scripted checks (`scripted.spec.ts`) cover link and
  button names (a decorative arrow or emoji in a name fails), a Tab walk
  (order, traps, focus on screen, uncovered, and visible), reflow at 320px,
  and motion under reduced motion, both what's playing and every element's and
  layer's computed transitions and animations, so a reduced-motion variant
  missing anywhere fails. axe's "needs review" results are printed and
  attached to the report rather than failing the run. Since 2026-10-23 it also
  sends the contact form against a faked Netlify answer (the shared
  `tests/support/netlify.ts`), scanning the thank-you and error notes with axe
  and checking that each note's live region is in the page, empty, from the
  first render, that the send button keeps focus through the send, and that
  under reduced motion the notes play no motion and the thank-you note still
  leaves when the visitor types again and the error note when they send again,
  that a second failure while the first error is leaving is announced again
  (added 2026-10-29), and with each note shown at 320px the names and reflow
  checks run, plus a keyboard walk for the error note's phone link.
- `npm run test:interaction`: seal-and-shield's feedback check on every state
  (ported in full 2026-10-23). Each reachable link and button, form field,
  product card, Craft Fairs booth frame, and the About portrait's frame must
  look different in each state it responds to (hovered, pressed, or focused)
  and ease every property that change touches, on it or anything inside it,
  while real clicks are blocked; the stop one Tab press reaches must draw its
  focus ring at its full 2px; each toggled state (such as the chosen filter) is
  flipped off, on, and off again, must turn up in each page state its row
  names, and must ease each change (added 2026-10-30); under reduced motion the changes stay but nothing transitions; and the contact
  form error's phone link gets the same checks once a failed send is faked.
  Its behavior spec (added 2026-10-23)
  checks where links lead: every bar, menu, hero, and 404 page section link
  lands on its section with no hash left in the address, a Ctrl, Cmd, or
  middle click opens the section in a new tab without moving the page clicked
  from, a Ctrl, Cmd, or middle click on a menu link or the brand closes the
  menu (added 2026-10-30), an address with a hash lands on its section, a link
  to another page opens it at its top, back and forward (from a page scrolled
  further than the 404 page between can scroll) and a reload return to the
  exact earlier position, a fresh load opens at the top, a hash added to the
  address lands on its section, malformed saved positions raise no error
  (added 2026-10-29, with `ui/scroll-top.ts` recording and restoring positions
  itself), and the first Tab on each page reaches the skip link.
- `npm run test:rendering`: compares a full-page screenshot of every state with
  its baseline in `tests/rendering/baselines/`, with zero tolerance and a
  per-pixel color threshold of 0. The page's clock is fixed to one date rather
  than masking text, since the footer's year and Tony's age in the About
  section both come from it. WebKit drew the page differently from one
  full-page capture to the next in two places, so the page never held still
  long enough to compare: the full-size product photos, which were masked
  until step 11's resized photos held still in every engine (and are masked
  in WebKit alone again since 2026-10-29, when the photos grew to 3x and
  WebKit's captures of them stopped matching), and the hero's
  blurred blobs, which stay still because every capture runs under reduced
  motion, where the hero's module switches their floating off. Since
  the captures run under reduced motion, a change to a reduced-motion
  variant alters the baselines even when the full-motion page is untouched,
  so check that the diff stays within what the variant affects (step 8 did,
  once by capturing with full motion against the old baselines and once by
  reading the diff) before refreshing. After an intended visual change, refresh
  with `npm run test:rendering -- --update-snapshots` and commit the baselines
  with it. Baselines are captured on Linux. Chromium once failed the open menu
  state on its text's antialiasing alone, across the whole page, while all
  three engines ran at once, and passed every rerun after; a lone failure like
  that gets a rerun, not new baselines.
- `npm run test:responsive`: measures the home page and the 404 page at 15
  widths from 320 to 1,920px (the 900px and 1,000px breakpoints and the pixel
  past each included), and the open menu at the 8 of those up to 900px, where
  it shows, failing on sideways scrolling, an unclipped element past either
  edge, text spilling its box, two reachable controls overlapping, or a grid
  leaving uneven rows (the Card Grids rule, added 2026-10-23 with 361px, a
  pixel past the gallery's 360px step), where the Products grid may center
  several leftover cards. It also chooses each Products filter in turn at
  390px, 1,000px, and 1,440px (added 2026-10-29). Unlike seal-and-shield's,
  the spill check measures each line of an element's own text rather than its scroll width, since the hero's
  highlight bar reaches 4px past its italic line on purpose and counted as a
  spill at every width.
- `npm run test:seo`: checks the home page's title, description, author,
  canonical, lack of a robots tag, and single description; that the raw page,
  fetched without a browser, carries the full title and one 120 to 125
  character description; that the built page, fetched in Chromium from the
  production preview, carries the same title, one description, the canonical,
  the preview image, and structured data that parses (added 2026-10-30); that
  the structured data's name, phone, town, Facebook page, and node links match
  what the page shows, with no street address or birth date; the 404 page's
  `noindex`, title, and canonical; one h1 per page; every Open Graph and
  Twitter tag and the theme color, with absolute addresses and copy matching
  the page; the card's type, size, and bytes; every icon link; and
  `robots.txt` and the sitemap.
- `npm run test:security`: added 2026-10-23, from seal-and-shield's. It
  checks `public/_headers` against the security baseline (a strict
  Content-Security-Policy, HSTS for at least a year, nosniff, DENY framing,
  and the referrer and permissions policies), searches the build for private
  keys and provider tokens, and runs `npm audit` on the shipped
  dependencies, those three in Chromium only, since a file reads the same in
  every engine. Then it loads every state from a production build served by
  `vite preview` on port 5199, with the headers file's headers added to
  every response, and fails on any policy violation or any new tab link
  without `noopener` and `noreferrer`. WebKit reports a style attribute
  violation for every `select` element, even one built with no style of its
  own, so that one WebKit report is set aside.
- `npm test` runs every suite.
