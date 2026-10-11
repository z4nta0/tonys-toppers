# Project CLAUDE.md: tonys-toppers

A website for Tony's Toppers, the handmade craft business of Tony Mawhiney,
a family member's son who has Down syndrome (React, Vite, React Router,
deployed on Netlify at https://tonystoppers.com/). Tony lives in Bolivar,
Missouri and sells his pieces (pen toppers, wine stoppers, keychains, dog
necklaces, car freshies, name badge reels, phone grips, and straw charms) at
craft fairs and similar events around the area. Every rule in the user-level
CLAUDE.md applies here; this file records only what's specific to this
project. ease-my-life, reese-roofing, and seal-and-shield have already been
converted to those rules and serve as worked examples.

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

## Content
Decided 2026-10-10. Claude drafts the product photos' alt text and an About
paragraph covering all 8 categories, and the user confirms them for accuracy.
- **Photos showing more than one kind of piece** (decided 2026-10-10): ten
  photos had been listed under every category they show, as byte-for-byte
  copies, and the user moved the copies out. The four wide booth shots
  (`booth-1` to `booth-4`) live in the "At the craft fairs" gallery between
  Products and About Tony, and each category filter also shows the booth
  shots tagged with it, so Straw Charms isn't empty, while All lists only
  the pieces and sets, once each. The three small mixed displays
  (`pen-wine-set-1` to `-3`) are one card each, tagged as both pen toppers
  and wine stoppers. Each catalog entry lists every category it shows.
- **`booth-1` is a phone screenshot**, sharper than the copy that was moved
  out: step 11's image script crops off the phone's interface, keeping the
  original in `design/photos/`. The gallery's 4:5 crop already hides most
  of it; the product cards still show it until then.
- **The bar links to the gallery** as "Craft Fairs" (decided 2026-10-10),
  between Products and About Tony, in page order.

## Images
Decided 2026-10-10, under the user-level "## Images" rule. The original
photos are kept in `design/photos/`, outside the served tree, and a script
beside them writes resized WebP copies into `src/`. The logo and favicon
come from the existing SVGs (`logo.svg`, `logo-notext.svg`).

## Horizontal layout
Decided 2026-10-10. Everything else is converted first, the vertical rhythm
included; then the work stops so the user can compare the current numbers,
the vertical rhythm numbers, and the horizontal rhythm numbers before
choosing which fits best. The core design numbers match the other projects:
the plastic ratio, with 1rem as the 11px base and body text at Base Plus 1.

## Directory structure
Decided 2026-10-10, matching reese-roofing's and seal-and-shield's adaptation
of the user-level "### Directory structure" layout to a website with routes
rather than a web app with tabs.
```
src/
  main.tsx               entry point
  app.tsx                React Router setup, the bar, and the footer
  assets/                fonts/ (the self-hosted fonts) and products/ (the
                         64 product photos)
  pages/
    home/                the home page, its four sections, catalog.ts, and
                         the images only it shows (Tony's photos, the logo)
    not-found/           the 404 page
  ui/                    components used by 2 or more pages (nav, footer),
                         section-link.ts, and the bar's logo mark
  styles/                global CSS only (fonts.css, styles.css)
  utils/                 app-agnostic helpers (motion.ts)
```
Outside `src/`: `tests/` holds the Playwright suites (see "## Test suites").
- **`pages/` takes the place of `tabs/`.** Each route gets its own folder,
  and a component only that page uses (the hero, products, about, and
  contact sections) lives in that folder.
- **A page's main file is named after its folder, with no prefix**
  (`pages/home/home.tsx`), the same as the sibling projects.
- **The product data is `pages/home/catalog.ts`**, not `products.ts`,
  so it doesn't share a name with the products section beside it. It
  imports every photo through `import.meta.glob` and looks each card's up
  by file name.
- **The product photos live in `src/assets/products/`** (decided 2026-10-10
  by the user), though only the home page shows them, in one flat folder,
  since a folder per category would pass the two-level depth limit. Step
  11's optimization script writes their resized copies there, with the
  originals in `design/photos/`.
- **The bar, footer, and section links live in `ui/`**, since the 404 page
  uses the bar and footer too. Section links go through
  `ui/section-link.ts`, as in seal-and-shield, which scrolls in place on the
  home page and navigates home with the section's id as the hash from any
  other page; the home page jumps to that section on arrival and clears the
  hash. Unlike seal-and-shield's, its `modCliFun` leaves a Ctrl, Cmd,
  Shift, Alt, or middle click to the browser, so a section can still open in
  a new tab, as the old `HashLink` allowed.
- **The bar's logo mark is copied into `ui/`** while `public/images/` keeps
  its own copy as the favicon, until step 11's favicon set replaces it.

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
     Netlify form repeating the contact form's ids was rebuilt in step 6,
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
   button is disabled and reads Sending... while a request is out. The
   error note's reds are literal until step 9 gives them their status
   roles. The hidden form in `index.html` became a bare, valid copy of the
   real form's four fields in step 6, as in seal-and-shield. After the next
   deploy, the user sends a test submission to confirm Netlify still
   records every field.
8. **Hooks and CSS modules**: done 2026-10-10.
   - **State and hooks**: the bar's scrolled, open-menu, and active-link
     classes became `data-page-scroll-active`, `data-mobile-menu-open`, and
     `data-section-link-active`, and the photos carry the `proPhoIma` and
     `faiPhoIma` hooks the rendering suite masks them by.
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
   - **Found for later**: a product card's hover lift never shows, since its
     entrance animation's `both` fill holds `transform` (step 11's
     interaction feedback), and the form fields swap the browser's focus
     outline for a border color alone (step 9's focus rings).
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
     portrait ring's 43.7-second turn, the 100ms entrance delay and the
     cards' 30ms stagger stay literal, every curve folds into the standard
     ease, and `html` turns smooth scrolling off under reduced motion.
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
    accessibility review.
11. **New features**: the 404 page, security headers, image optimization,
    SEO, social previews and the favicon set, and interaction feedback. Once
    the photos carry their width and height, recheck WebKit's phone menu
    links: WebKit has no scroll anchoring, so a link far down the page lands
    a few hundred pixels short while the photos above it load and grow
    their cards, the same as before the section links arrived.

## Test suites
Added 2026-10-10, adapted from seal-and-shield's. Playwright suites live in
`tests/`, one project per suite and engine in `tests/playwright.config.ts`,
which starts its own dev server on port 5192 (never the usual 5173, nor the
sibling projects' 5190 and 5191) and stops it afterwards. Every suite runs in
Chromium, Firefox, and WebKit. Results, screenshots, and traces go to
`tests/output/` (git-ignored); `npx playwright show-report
tests/output/report` opens the HTML report. The states the suites visit (the
home page and the 404 page at 390px and 1,440px, plus the phone menu open at
390px) are listed in `tests/support/states.ts`. Its `opeStaFun` scrolls
through the page before checking it, since the product photos load lazily,
and skips animations that repeat forever (the hero's floating blobs, spinning
logo ring, and wobbling sticker) when waiting for the page to settle.
- `npm run test:accessibility`: the pre-commit accessibility scan. axe-core
  checks each state against WCAG 2.2 A and AA plus best practices
  (`axe.spec.ts`), and scripted checks (`scripted.spec.ts`) cover link and
  button names (a decorative arrow or emoji in a name fails), a Tab walk
  (order, traps, focus on screen, uncovered, and visible), reflow at 320px,
  and motion under reduced motion. axe's "needs review" results are printed
  and attached to the report rather than failing the run.
- `npm run test:rendering`: compares a full-page screenshot of every state with
  its baseline in `tests/rendering/baselines/`, with zero tolerance and a
  per-pixel color threshold of 0. The page's clock is fixed to one date rather
  than masking text, since the footer's year and Tony's age in the About
  section both come from it. WebKit drew the page differently from one
  full-page capture to the next in two places, so the page never held still
  long enough to compare: the 64 full-size product photos, which are masked
  (their boxes still show) through their `proPhoIma` and `faiPhoIma` hooks,
  and the hero's blurred blobs, which stay still because every capture runs
  under reduced motion, where the hero's module switches their floating off.
  The photo mask is retried without once step 11 shrinks the photos. Since
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
- `npm run test:responsive`: measures the home page, the 404 page, and the
  open menu at 14 widths from 320 to 1,920px (the 900px and 1,000px
  breakpoints and the pixel past each included), failing on sideways
  scrolling, an unclipped element past either edge, text spilling its box,
  or two reachable controls overlapping. Unlike seal-and-shield's, the spill
  check measures each line of an element's own text rather than its scroll
  width, since the hero's highlight bar reaches 4px past its italic line on
  purpose and counted as a spill at every width.
- `npm test` runs every suite.
