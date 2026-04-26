import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="section" style={{ paddingTop: '160px' }}>
      <div className="container" style={{ textAlign: 'center', padding: '60px 0' }}>
        <div className="section-label" style={{ justifyContent: 'center' }}>
          404
        </div>
        <h2 className="section-title" style={{ marginBottom: '20px' }}>
          Page not <em>found.</em>
        </h2>
        <p style={{ color: 'var(--ink-soft)', marginBottom: '32px' }}>
          That page doesn't exist — but Tony's pens and stoppers do.
        </p>
        <Link to="/" className="btn btn-primary">
          Back home →
        </Link>
      </div>
    </section>
  );
}
