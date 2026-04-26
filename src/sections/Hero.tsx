import { HashLink } from '../components/HashLink';

export default function Hero() {
  return (
    <section id="home" className="hero">
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="hero-inner">
        <div className="hero-text">
          <span className="hero-eyebrow">Handcrafted in Bolivar, Missouri</span>
          <h1>
            Beaded pens &amp; wine stoppers, <span className="accent">made with love.</span>
          </h1>
          <p className="lede">
            Tony Mawhiney designs and beads every piece by hand — color-coordinated, carefully
            chosen, and one of a kind. Small art for everyday moments.
          </p>
          <div className="hero-actions">
            <HashLink to="/#products" className="btn btn-primary">
              See the collection →
            </HashLink>
            <HashLink to="/#about" className="btn btn-ghost">
              Meet Tony
            </HashLink>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-logo">
            <img src="/images/logo.jpg" alt="Tony's Toppers logo" />
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
