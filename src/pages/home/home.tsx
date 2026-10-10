import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { useNavigate } from 'react-router'; // What: Use Navigate. Why: The hash should leave the address once the page has scrolled to it. How: This returns the router's navigate function.
import { HerSecCom } from './hero.tsx';
import { ProSecCom } from './products.tsx';
import About from './about.tsx';
import Contact from './contact.tsx';
import Fairs from './fairs.tsx'; // What: Fairs. Why: The craft fair gallery sits between the products and Tony's story. How: This is rendered after the products section.

export default function Home() {
  const { hash } = useLocation();

  const navRouFun = useNavigate(); // What: Navigate Router Function. Why: The hash should be cleared once the page has used it. How: This is the router's navigate function.


  useEffect( () => { // What: Hash Arrival Effect. Why: A visitor arriving from a section link or a shared address should land on that section, with no hash left in the address. How: This jumps to the section the hash names, then replaces the address with one without it.


    if ( !hash ) return; // What: No Hash Guard. Why: Most visits arrive without a hash. How: This does nothing when the hash is empty, including right after it's been cleared.



    document.getElementById( hash.slice( 1 ) )?.scrollIntoView( { behavior : 'instant' } ); // What: Arrival Scroll Call. Why: The visitor should land on the section, as a normal link arrival would. How: This jumps to the element the hash names, without the html element's smooth scrolling, since gliding down from the top of a freshly loaded page would be slow.

    void navRouFun( { hash : '' }, { replace : true } ); // What: Hash Clear Call. Why: The address should stay as clean as it does for in-page links. How: This replaces the current history entry with the same path and no hash; void marks the returned promise as deliberately unawaited.


  }, [ hash, navRouFun ] ); // What: Effect Dependency Array. Why: Each new hash has to be handled once. How: hash changes when a section link arrives, and navRouFun is listed because the effect calls it, though it stays the same between renders.

  return (
    <>
      <HerSecCom />
      <ProSecCom />
      <Fairs />
      <About />
      <Contact />
    </>
  );
}
