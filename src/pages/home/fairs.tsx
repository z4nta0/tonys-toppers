import { PRO_RCD_ARR } from './catalog.ts'; // What: Products. Why: The booth shots live in the catalog beside the pieces they show. How: The gallery keeps only the entries marked as booth shots.

const BOOTH_SHOTS = PRO_RCD_ARR.filter((p) => p.faiBoo); // What: Booth Shots. Why: Only the craft fair table photos belong in the gallery. How: This keeps the catalog entries marked as booth shots, in catalog order.

export default function Fairs() {
  return (
    <section id="fairs" className="section fairs-section">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="section-label">At the Craft Fairs</div>
            <h2 className="section-title">
              Come see Tony <em>at his table.</em>
            </h2>
          </div>
          <p className="section-sub">
            Tony sets up at craft fairs and events around Bolivar, Missouri. Here's what you'll
            find when you stop by.
          </p>
        </div>

        <div className="fairs-grid">
          {BOOTH_SHOTS.map((shot) => (
            <figure key={shot.ideStr} className="fair-photo">
              <img src={shot.imaStr} alt={shot.altStr} loading="lazy" />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
