import lntSvgUrl from './logo-notext.svg'; // What: Logo-No-Text SVG URL. Why: The bar shows the logo's mark without its wordmark, and Vite fingerprints and checks an imported image. How: This imports the mark's built URL for the brand's img.


import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { modCliFun } from './section-link.ts';    // What: Modified Click Function. Why: A section link opened in a new tab should be left to the browser. How: navSecFun steps aside when this is true.
import { useSecLinFun } from './section-link.ts'; // What: Use Section Link Function. Why: Section links have to work from every page, not only the home page. How: This returns visSecFun, which scrolls in place or navigates home.

const SECTIONS = [
  { id: 'home', label: 'Home' },
  { id: 'products', label: 'Products' },
  { id: 'fairs', label: 'Craft Fairs' },
  { id: 'about', label: 'About Tony' },
  { id: 'contact', label: 'Contact' },
] as const;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>('home');
  const { pathname } = useLocation();

  // Toggle the "scrolled" pill-shadow state on the nav.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scrollspy — only active when we're on the home route.
  useEffect(() => {
    if (pathname !== '/') return;

    const ids = SECTIONS.map((s) => s.id);
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry closest to the top of the viewport that's currently visible.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      {
        // Trigger when a section's top crosses ~25% down from the top of the viewport.
        rootMargin: '-25% 0px -65% 0px',
        threshold: 0,
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  const close = () => setOpen(false);
  const onHome = pathname === '/';

  const visSecFun = useSecLinFun(); // What: Visit Section Function. Why: Every section link reaches its section through one shared path. How: This scrolls to the section on the home page, or navigates home to it from any other page.

  const navSecFun = ( cliEveObj : React.MouseEvent< HTMLAnchorElement >, secIdeStr : string ) => { // What: Navigate Section Function. Why: A section link should reach its section without a full page load or a hash left in the address. How: This leaves a modified click to the browser, and otherwise cancels the link's own navigation, closes the menu, and hands the section to visSecFun.


    if ( modCliFun( cliEveObj ) ) return; // What: Modified Click Guard. Why: A Ctrl, Cmd, or middle click asks the browser to open the link its own way. How: This leaves the click alone.



    cliEveObj.preventDefault(); // What: Default Navigation Cancel. Why: The browser would otherwise jump or reload and leave the hash in the address. How: This stops the link's own navigation.


    visSecFun( secIdeStr ); // What: Section Visit Call. Why: The visitor should land on the section they chose. How: This scrolls to it, or navigates home to it from another page.


    close(); // What: Menu Close Call. Why: The menu should get out of the way once a link is chosen. How: This closes it after the scroll starts, since WebKit stopped a smooth scroll begun right after the menu closed about 250px short of the section.


  };

  return (
    <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
      <Link to="/" className="nav-brand" onClick={close}>
        <img src={ lntSvgUrl } alt="Tony's Toppers logo" />
        <span>Tony's Toppers</span>
      </Link>

      <ul className={`nav-links${open ? ' open' : ''}`}>
        {SECTIONS.map((s) => (
          <li key={s.id}>
            <a
              href={`/#${s.id}`}
              className={onHome && activeId === s.id ? 'active' : ''}
              onClick={ ( cliEveObj ) => navSecFun( cliEveObj, s.id ) }
            >
              {s.label}
            </a>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="nav-toggle"
        aria-label="Toggle menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span />
        <span />
        <span />
      </button>
    </nav>
  );
}
