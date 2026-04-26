# Tony's Toppers

A single-page website for Tony Mawhiney's handcrafted beaded pens and wine stoppers business.

Built with **Node.js + React + TypeScript + React Router**, bundled with Vite.

## Stack

- **React 18** with **TypeScript** (strict mode)
- **React Router v6** — currently a single-page site, but the router is wired up so future
  routes (blog, shop, etc.) can be dropped in without restructuring.
- **Vite** for the dev server and production build
- Plain CSS with custom properties — no UI library, no CSS framework

## Architecture

The site is a single page (`/`) composed of four sections — **Hero**, **Products**, **About**,
and **Contact**. Each section is its own component under `src/sections/`, and `Home.tsx` simply
imports and stacks them. The navbar uses anchor links (`/#products`, etc.) that smooth-scroll
to the matching section, with active-section highlighting driven by an IntersectionObserver
scrollspy.

When more routes are needed later, add them to `src/App.tsx` alongside the existing `/` route.

## Project Structure

```
tonys-toppers/
├── public/
│   └── images/                  # Logo, portrait, cartoon, 24 product SVGs
├── src/
│   ├── components/
│   │   ├── Navbar.tsx           # Sticky nav, mobile menu, scrollspy active state
│   │   ├── HashLink.tsx         # Router-aware anchor link (handles cross-route hashes)
│   │   └── Footer.tsx
│   ├── sections/                # Composable page sections
│   │   ├── Hero.tsx             # Landing hero
│   │   ├── Products.tsx         # Filterable grid of pens & stoppers
│   │   ├── About.tsx            # Tony's bio with portrait
│   │   └── Contact.tsx          # Form + direct contact info
│   ├── pages/                   # Top-level routed pages
│   │   ├── Home.tsx             # Composes the four sections
│   │   └── NotFound.tsx         # 404
│   ├── data/
│   │   └── products.ts          # Typed product data
│   ├── App.tsx                  # Router setup
│   ├── main.tsx                 # Entry point with BrowserRouter
│   └── index.css                # Global styles + design tokens
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## Getting Started

Requires **Node.js 18+**.

```bash
# Install dependencies
npm install

# Start the dev server (http://localhost:5173)
npm run dev

# Type-check
npm run lint

# Build for production (output goes to dist/)
npm run build

# Preview the production build locally
npm run preview
```

## Adding a New Route Later

When the site grows beyond a single page:

1. Create the new page component in `src/pages/`, e.g. `Blog.tsx`.
2. Add a route in `src/App.tsx`:
   ```tsx
   <Route path="/blog" element={<Blog />} />
   ```
3. Add a link in `Navbar.tsx`. For routes that aren't anchors on the home page, use the
   standard `<NavLink>` from `react-router-dom` instead of `<HashLink>`.

## Notes

- **Product images are placeholders.** Generated SVGs of beaded pens and stoppers live in
  `public/images/product-01.svg` through `product-24.svg`. Once Tony has photos of his real
  pieces, drop them into `public/images/` and update `src/data/products.ts` to point at the new
  files.
- **The contact form is UI-only.** It shows a success message but doesn't actually deliver mail.
  To wire it up, point `handleSubmit` in `src/sections/Contact.tsx` at a service like Formspree,
  Netlify Forms, or your own endpoint.
- **Deploying to a static host** (Netlify, Vercel, GitHub Pages, etc.): run `npm run build` and
  upload the `dist/` folder. For React Router to handle deep links correctly, configure your
  host to fall back to `index.html` for unknown routes (Netlify and Vercel do this automatically;
  on Apache/Nginx you'll need a rewrite rule).
