import { useState, useMemo } from 'react';
import { CAT_RCD_ARR } from './catalog.ts';
import { PRO_RCD_ARR } from './catalog.ts';
import type { CatSluTyp } from './catalog.ts';

type Filter = 'all' | CatSluTyp;

export default function Products() {
  const [filter, setFilter] = useState<Filter>('all');

  const visible = useMemo(
    () => (filter === 'all' ? PRO_RCD_ARR.filter((p) => !p.faiBoo) : PRO_RCD_ARR.filter((p) => p.catArr.includes(filter))), // What: Visible Products. Why: All lists every piece and set once, while a category also shows the booth shots tagged with it. How: This leaves the booth shots out of All, and otherwise keeps every photo tagged with the chosen category.
    [filter]
  );

  return (
    <section id="products" className="section products-section">
      <div className="container">
        <div className="section-head products-head">
          <div>
            <div className="section-label">The Collection</div>
            <h2 className="section-title">
              Every piece, <em>one of a kind.</em>
            </h2>
          </div>
          <p className="section-sub">
            Tony hand-selects beads and silicone shapes for each piece, color-coordinating until
            it's just right. No two are the same.
          </p>
        </div>

        <div className="filter-tabs" role="tablist" aria-label="Filter products by category">
          <button
            type="button"
            className={`filter-tab${filter === 'all' ? ' active' : ''}`}
            onClick={() => setFilter('all')}
            role="tab"
            aria-selected={filter === 'all'}
          >
            All
          </button>
          {CAT_RCD_ARR.map((cat) => (
            <button
              key={cat.sluStr}
              type="button"
              className={`filter-tab${filter === cat.sluStr ? ' active' : ''}`}
              onClick={() => setFilter(cat.sluStr)}
              role="tab"
              aria-selected={filter === cat.sluStr}
            >
              {cat.labStr}
            </button>
          ))}
        </div>

        <div className="products-grid">
          {visible.map((p, idx) => (
            <article
              key={p.ideStr}
              className={`product-card product-card--${p.catArr[0]}`}
              style={{ animationDelay: `${idx * 30}ms` }}
            >
              <div className={`product-tag tag--${p.catArr[0]}`}>{p.labStr}</div>
              <div className="product-img">
                <img src={p.imaStr} alt={p.altStr} loading="lazy" />
              </div>
              <div className="product-info">
                <div className="product-name">{p.namStr}</div>
                <div className="product-type">{p.labStr}</div>
              </div>
            </article>
          ))}
        </div>

        {/* <p className="placeholder-note">
          ↑ Placeholder images. Tony will swap in photos of his real, finished pieces.
        </p> */}
      </div>
    </section>
  );
}
