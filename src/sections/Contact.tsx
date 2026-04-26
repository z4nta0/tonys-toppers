import { useState, type FormEvent, type ChangeEvent } from 'react';

type InterestOption = 'A beaded pen' | 'A wine stopper' | 'A custom piece' | 'Just saying hi';

interface FormState {
  name: string;
  email: string;
  interest: InterestOption;
  message: string;
}

const INITIAL: FormState = {
  name: '',
  email: '',
  interest: 'A beaded pen',
  message: '',
};

const INTEREST_OPTIONS: InterestOption[] = [
  'A beaded pen',
  'A wine stopper',
  'A custom piece',
  'Just saying hi',
];

export default function Contact() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // No backend wired up yet — this is a UI-only success state.
    setSubmitted(true);
    setForm(INITIAL);
    window.setTimeout(() => setSubmitted(false), 6000);
  };

  return (
    <section id="contact" className="section contact-section">
      <div className="container">
        <div className="contact-grid">
          <div className="contact-info">
            <div className="section-label">Get in Touch</div>
            <h2>
              Want a piece, or have a <em>question?</em>
            </h2>
            <p>
              Tony loves hearing from people who appreciate his work. Reach out directly or drop a
              note below — he'll get back to you.
            </p>

            <a href="tel:4177330681" className="contact-direct">
              <div className="icon">☎</div>
              <div>
                <div className="label">Call or text</div>
                <div className="value">(417) 733-0681</div>
              </div>
            </a>
            <div className="contact-direct">
              <div className="icon">📍</div>
              <div>
                <div className="label">Based in</div>
                <div className="value" style={{ fontSize: '1.15rem' }}>
                  Bolivar, Missouri
                </div>
              </div>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            {submitted && (
              <div className="form-success" role="status">
                ✓ Thanks! Your message is ready — Tony will be in touch soon.
              </div>
            )}
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="name">Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-field">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-field">
              <label htmlFor="interest">I'm interested in</label>
              <select
                id="interest"
                name="interest"
                value={form.interest}
                onChange={handleChange}
              >
                {INTEREST_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Tell Tony what you have in mind..."
                required
              />
            </div>
            <button type="submit" className="form-submit">
              Send Message →
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
