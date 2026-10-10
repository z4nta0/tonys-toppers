import { useEffect } from 'react';
import { useLocation } from 'react-router';
import Hero from './hero.tsx';
import Products from './products.tsx';
import About from './about.tsx';
import Contact from './contact.tsx';

export default function Home() {
  const { hash } = useLocation();

  // If the page loads with a hash (e.g. /#products from a shared link),
  // wait for the sections to render, then scroll to it.
  useEffect(() => {
    if (!hash) return;
    const el = document.querySelector(hash);
    if (el) {
      window.setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  }, [hash]);

  return (
    <>
      <Hero />
      <Products />
      <About />
      <Contact />
    </>
  );
}
