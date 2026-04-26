import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../sections/Hero';
import Products from '../sections/Products';
import About from '../sections/About';
import Contact from '../sections/Contact';

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
