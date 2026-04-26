import { useState, useMemo } from 'react';
import { PRODUCTS, CATEGORIES, type ProductType } from '../data/products';

type Filter = 'all' | ProductType;

export default function Products() {
  const [filter, setFilter] = useState<Filter>('all');

  const visible = useMemo(
    () => (filter === 'all' ? PRODUCTS : PRODUCTS.filter((p) => p.type === filter)),
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
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              type="button"
              className={`filter-tab${filter === cat.value ? ' active' : ''}`}
              onClick={() => setFilter(cat.value)}
              role="tab"
              aria-selected={filter === cat.value}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="products-grid">
          {visible.map((p, idx) => (
            <article
              key={p.id}
              className={`product-card product-card--${p.type}`}
              style={{ animationDelay: `${idx * 30}ms` }}
            >
              <div className={`product-tag tag--${p.type}`}>{p.typeLabel}</div>
              <div className="product-img">
                <img src={p.img} alt={p.name} loading="lazy" />
              </div>
              <div className="product-info">
                <div className="product-name">{p.name}</div>
                <div className="product-type">{p.typeLabel}</div>
              </div>
            </article>
          ))}
        </div>

        <p className="placeholder-note">
          ↑ Placeholder images. Tony will swap in photos of his real, finished pieces.
        </p>
      </div>
    </section>
  );
}
