export default function About() {
  return (
    <section id="about" className="section about-section">
      <div className="container">
        <div className="bio-grid">
          <div className="bio-photo-wrap">
            <div className="bio-photo">
              <img src="/images/tony-portrait.jpg" alt="Portrait of Tony Mawhiney" />
            </div>
            <div className="bio-cartoon">
              <img src="/images/logo.svg" alt="Tony's Toppers logo" />
            </div>
          </div>

          <div className="bio-content">
            <div className="section-label">Meet the Maker</div>
            <h2>
              Tony Mawhiney — <em>artist, crafter, kind soul.</em>
            </h2>
            <p>
              Tony is a 42-year-old young man with down syndrome living in Bolivar, Missouri. He's quiet at first, but
              once you know him you won't find a kinder, more polite person — and you wouldn't have
              to look hard to know it.
            </p>
            <p>
              After graduating high school, Tony moved to Grandview, MO, where he had his own
              apartment and attended Longview Jr. College through the Ace program. He's always been
              artistic and crafty. In high school, a painting of his was chosen through a contest
              that traveled around Missouri for a year before being hung in the State Capitol.
            </p>
            <p>
              A while back, a friend showed him some beaded pens she'd made and he mentioned he'd
              love to try it. She sent him a starter package — assorted beads, silicone shapes, and
              a few pens — and he was hooked. He carefully chose and color-coordinated every bead
              on that very first pen, and that was the beginning of his business.
            </p>
            <p>
              Since that day Tony has grown his inventory of beads, expanded into wine stoppers
              alongside the pens, and named his business <strong>Tony's Toppers</strong>. He's very
              proud of it, and he loves sharing pictures of finished pieces with friends and
              family. They're all made with love.
            </p>

            <div className="bio-stats">
              <div className="bio-stat">
                <span className="num">42</span>
                <div className="label">Years young</div>
              </div>
              <div className="bio-stat">
                <span className="num">100%</span>
                <div className="label">Handmade</div>
              </div>
              <div className="bio-stat">
                <span className="num">1of1</span>
                <div className="label">Every piece</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
