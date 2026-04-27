import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HashLink } from './HashLink';

const SECTIONS = [
  { id: 'home', label: 'Home' },
  { id: 'products', label: 'Products' },
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

  return (
    <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
      <Link to="/" className="nav-brand" onClick={close}>
        <img src="/images/logo-notext.svg" alt="Tony's Toppers logo" />
        <span>Tony's Toppers</span>
      </Link>

      <ul className={`nav-links${open ? ' open' : ''}`}>
        {SECTIONS.map((s) => (
          <li key={s.id}>
            <HashLink
              to={`/#${s.id}`}
              className={onHome && activeId === s.id ? 'active' : ''}
              onNavigate={close}
            >
              {s.label}
            </HashLink>
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
