import carJpgUrl from './tony-cartoon.jpg'; // What: Cartoon JPG URL. Why: The hero shows Tony's cartoon portrait, and Vite fingerprints and checks an imported image. How: This imports the image's built URL for the hero's img.


import { modCliFun } from '../../ui/section-link.ts';    // What: Modified Click Function. Why: A button opened in a new tab should be left to the browser. How: scrSecFun steps aside when this is true.
import { useSecLinFun } from '../../ui/section-link.ts'; // What: Use Section Link Function. Why: Both hero buttons reach a section the same way the bar does. How: This returns visSecFun, which scrolls to the section.

export default function Hero() {
  const visSecFun = useSecLinFun(); // What: Visit Section Function. Why: The hero's buttons reach their sections through the same shared path as the bar. How: This scrolls to the section, smoothly unless the visitor asked for reduced motion.

  const scrSecFun = ( cliEveObj : React.MouseEvent< HTMLAnchorElement >, secIdeStr : string ) => { // What: Scroll Section Function. Why: Both hero buttons scroll in place instead of jumping or leaving a hash in the address. How: This leaves a modified click to the browser, and otherwise cancels the link's own jump and hands the section to visSecFun.


    if ( modCliFun( cliEveObj ) ) return; // What: Modified Click Guard. Why: A Ctrl, Cmd, or middle click asks the browser to open the link its own way. How: This leaves the click alone.



    cliEveObj.preventDefault(); // What: Default Jump Cancel. Why: The browser would otherwise jump to the hash instantly and leave it in the address. How: This stops the link's own navigation.

    visSecFun( secIdeStr ); // What: Section Visit Call. Why: The visitor should land on the section the button names. How: This scrolls it into view.


  };

  return (
    <section id="home" className="hero">
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="hero-inner">
        <div className="hero-text">
          <span className="hero-eyebrow">Handcrafted in Bolivar, Missouri</span>
          <h1>
            Crafted by hand &amp; <span className="accent">made with love.</span>
          </h1>
          <p className="lede">
            Tony Mawhiney designs and beads every piece by hand — color-coordinated, carefully
            chosen, and one of a kind. Small art for everyday moments.
          </p>
          <div className="hero-actions">
            <a
              href="/#products"
              className="btn btn-primary"
              onClick={ ( cliEveObj ) => scrSecFun( cliEveObj, 'products' ) }
            >
              See the collection →
            </a>
            <a
              href="/#about"
              className="btn btn-ghost"
              onClick={ ( cliEveObj ) => scrSecFun( cliEveObj, 'about' ) }
            >
              Meet Tony
            </a>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-logo">
            <img src={ carJpgUrl } alt="Cartoon illustration of Tony" />
          </div>
          <div className="hero-sticker">
            Made
            <br />
            with
            <br />
            love ♥
          </div>
        </div>
      </div>
    </section>
  );
}
