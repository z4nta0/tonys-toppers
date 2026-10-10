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
   - **Known axe violations**, already on the live site and fixed in their own
     steps: the footer's phone link told apart by color alone (step 6), the
     hidden Netlify form repeating the contact form's ids (step 7), and the
     404 page with no `h1` (step 11).
3. **ESLint**, set up from ease-my-life's `eslint.config.ts`.
4. **Playwright and axe** in all three engines, with baseline screenshots
   taken before anything moves, so later steps can prove nothing changed on
   screen.
5. **Directory structure**, matching reese-roofing and seal-and-shield
   (`pages/home/`, `pages/not-found/`, `ui/`, `styles/`, `assets/`,
   `utils/`), with `ui/section-link.ts` replacing `HashLink` and the product
   photos imported rather than served from `public/`.
6. **Formatting, naming, and comment pass**, one file per commit, with the
   copy fixes (no em dashes, "Down syndrome" capitalized).
7. **Contact form fixes**: the success message waits for Netlify's answer,
   the browser's required-field checks come back on, and the hidden form in
   `index.html` becomes valid HTML.
8. **Hooks and CSS modules**, including the product filter buttons moving
   from a partial tablist to `aria-pressed` toggles.
9. **Design tokens** in five commits: role colors and self-hosted fonts, the
   type and spacing scale, durations and easing, elevation shadows, and
   class and keyframe names.
10. **Horizontal layout comparison** (see above), then a WAVE and
    accessibility review.
11. **New features**: the 404 page, security headers, image optimization,
    SEO, social previews and the favicon set, and interaction feedback.
