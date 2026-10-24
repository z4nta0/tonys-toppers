# Tony's Toppers

The website for Tony's Toppers, the handmade craft business of Tony Mawhiney in Bolivar, Missouri. Tony designs and beads every piece by hand (pen toppers, wine stoppers, keychains, dog necklaces, car freshies, name badge reels, phone grips, and straw charms) and sells them at craft fairs and events around the area. The site is a showcase for Tony and his work, not a shop. It's built and maintained by [techgeek.dev](https://techgeek.dev/), whose portfolio links to it.

Live at [tonystoppers.com](https://tonystoppers.com/).

## Stack

- **Node.js** 22.22 or newer (React Router 8 requires it)
- **Vite 8** dev server / bundler
- **React 19** + **TypeScript 6**
- **React Router 8** (the home page at the root path and a 404 page for every other path)
- **ESLint 9** with typescript-eslint, and **Playwright** with axe-core for the test suites
- Deployed on **Netlify**, which serves `index.html` for every path (`public/_redirects`), sends the security headers in `public/_headers`, and receives the contact form through Netlify Forms

## Getting started

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Checks

```bash
npm run lint       # ESLint across the repo
npm run typecheck  # TypeScript across src/, the configs, tests/, and the design/ scripts
```

## Tests

```bash
npm test                    # every suite
npm run test:accessibility  # axe-core plus scripted keyboard, naming, reflow, and motion checks
npm run test:interaction    # that every link and button gives hover, press, and focus feedback, with and without reduced motion
npm run test:rendering      # full-page screenshots of each page state against approved baselines
npm run test:responsive     # the pages from 320 to 1,920px and the phone menu up to 900px: no sideways scroll, spill, or overlap
npm run test:seo            # titles, descriptions, canonical, robots, and social tags, structured data, the preview card, icons, robots.txt, and the sitemap
```

Each suite runs in Chromium, Firefox, and WebKit against its own dev server on port 5192, so a dev server already running on 5173 is left alone. Reports land in `tests/output/` (git-ignored); `npx playwright show-report tests/output/report` opens the HTML report. The rendering suite's approved screenshots live in `tests/rendering/baselines/` and match to the pixel, so after a change meant to alter how the page looks, review the diff in the report, then run `npm run test:rendering -- --update-snapshots` and commit the new baselines with the change. The baselines were captured on Linux, and font rendering differs between systems, so on macOS or Windows refresh them locally before relying on the comparison. If a browser is missing, `npx playwright install chromium firefox webkit` installs all three.

## Build

```bash
npm run build
npm run preview
```

## Images

The photos, the social preview card, and the icons are all rendered by scripts, so they can be rebuilt whenever something changes:

```bash
npm run photos    # resizes design/photos/ into WebP copies in src/ and writes their sizes to src/pages/home/photo-sizes.ts
npm run og-image  # captures design/og-image/card.html as public/og-image.jpg
npm run icons     # renders favicon.ico, the PNG icons, and the Apple touch icon from public/favicon.svg
```

To add a product photo, drop the original into `design/photos/products/`, named after its category and the next number (`keychain-2.jpg`), run `npm run photos`, and give it a description in `PHO_ALT_OBJ` in `src/pages/home/catalog.ts`. The catalog reads each category's photos straight from the folder. Apps cache a link's preview card for days, so a changed card should get a new file name (`og-image-2.jpg`), with every tag in `index.html` that points at it updated.

## Project structure

```
src/
├── assets/            Self-hosted fonts and the resized product and booth photos
├── pages/
│   ├── home/          Home page and its sections (hero, products, fairs, about, contact), each with its own .module.css, plus catalog.ts (the photos and their categories), photo-sizes.ts (generated), Tony's photos, and the full logo
│   └── not-found/     The 404 page every unknown path shows, with its .module.css
├── ui/                Shared components (nav, footer), each with its own .module.css, section-link.ts (section links that work from any page), and the bar's logo mark
├── styles/            fonts.css (@font-face) + styles.css (design tokens, base element styles, the shared focus ring, and the shared entrance keyframes)
├── utils/             motion.ts (the reduced-motion check for JavaScript scrolling)
├── app.tsx            Root component and the route table
└── main.tsx           Entry point
public/                Files served at fixed addresses: the icons, the social card, robots.txt, sitemap.xml, and Netlify's _headers and _redirects
tests/
├── accessibility/     axe-core scan and scripted checks
├── interaction/       hover, press, and focus feedback checks
├── rendering/         screenshot comparisons and their baselines/
├── responsive/        layout checks across screen widths
├── seo/               head tags, structured data, preview card, icon, and crawler file checks
├── support/           the page states the suites visit
└── playwright.config.ts

design/                Source artwork, not served
├── icons/             render.mts, which builds the icon set in public/ (npm run icons)
├── og-image/          card.html and render.mts, which builds public/og-image.jpg (npm run og-image)
└── photos/            The original photos and render.mts, which builds their WebP copies (npm run photos)
```

## Design notes

- **Type pairing:** Fraunces, a soft serif, for headings, names, and the logo text, with Outfit for body text and buttons, both self-hosted (`src/assets/fonts/`, declared in `src/styles/fonts.css`), so a visit makes no third-party requests.
- **Palette:** A warm cream page (`#fdf9ee`) with a deeper cream band behind the Products and About sections, ink (`#1a1a2e`) for text, outlines, and the buttons' hard offset shadows, navy (`#1e3a8a`) for buttons, links, and the Contact band, and a sunny yellow (`#fbbf24`) for highlights, stickers, and the hard shadows behind the portrait and the contact form.
- **Logo usage:** The **full logo** (`src/pages/home/logo.svg`) sits in the badge on Tony's About portrait. The **mark** (`src/ui/logo-notext.svg`) leads the nav bar, and `public/favicon.svg` is its copy on a white disc for browser tabs.
- **Motion:** The hero's glows float, Tony's cartoon drifts in a small circle, the hero rises in on load, the product cards rise in one after another, and the contact form's notes rise in when a message is sent. Links, buttons, and rows respond to hover, press, and keyboard focus with a color shift, a small lift or press-in, and a focus ring that eases in. All of it, along with the smooth section scrolling, turns off when a visitor's system asks for reduced motion, leaving only the instant color and position changes.

## Contact form

The form posts to Netlify Forms as `contactForm`. Netlify finds the form by reading the deployed HTML, before React has rendered anything, so `index.html` carries a hidden, bare copy of it with the same name and field names. A field added to or renamed in `src/pages/home/contact.tsx` has to be changed in that copy too, or Netlify won't record it.

## License

See [LICENSE](LICENSE).
