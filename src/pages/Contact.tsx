import React from 'react';

const calendlyLink = 'https://calendly.com/propertydext/15min';
const formspreeEndpoint = 'https://formspree.io/f/mojboraw';

const contactProjectOptions = [
  'AI workflow audit',
  'AI implementation roadmap',
  'Real Estate AI PM pilot',
  'Prompt and template system',
  'Team training or adoption support',
  'Human-reviewed workflow report',
  'Not sure yet',
];

const contactTimelineOptions = [
  'This week',
  'Next 2–4 weeks',
  'This quarter',
  'Exploring options',
];

export function Contact() {
  const [status, setStatus] = React.useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = React.useState('');

  async function handleContactSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch(formspreeEndpoint, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) {
        const result = (await response.json().catch(() => null)) as { errors?: Array<{ message?: string }> } | null;
        const message = result?.errors?.map((item) => item.message).filter(Boolean).join(' ') || 'The message could not be sent. Please email hello@practicalaisystems.com or book a call.';
        throw new Error(message);
      }

      form.reset();
      setStatus('success');
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'The message could not be sent. Please email hello@practicalaisystems.com or book a call.');
    }
  }

  return (
    <>
      <section className="contact-hero section-shell">
        <div className="contact-hero-grid">
          <div className="contact-hero-copy">
            <p className="eyebrow">Contact</p>
            <h1>Let’s make AI useful for the workflow that is slowing you down.</h1>
            <p className="hero-lede">Tell me what is happening in your business, where work gets stuck, and what kind of practical AI + project management support you want next.</p>
          </div>
          <div className="contact-summary-card">
            <p className="card-topline">Best fit</p>
            <h3>Small businesses and real estate teams that need practical systems, not hype.</h3>
            <ul>
              <li>Workflow audits and bottleneck diagnosis</li>
              <li>Prompt packs, tracker structures, and SOP support</li>
              <li>Human-reviewed AI PM implementation plans</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="contact-section section-shell">
        <div className="contact-layout">
          <form className="contact-form-card" onSubmit={handleContactSubmit}>
            <input type="hidden" name="_subject" value="New Practical AI Systems contact request" />
            <input type="text" name="_gotcha" className="visually-hidden" tabIndex={-1} autoComplete="off" />

            <div className="contact-form-heading">
              <p className="eyebrow">Start here</p>
              <h2>Send a project note</h2>
              <p>Use the form for consulting requests, Real Estate AI PM questions, workflow reviews, or human-reviewed report requests.</p>
            </div>

            {status === 'success' && (
              <div className="form-alert success" role="status">
                Thanks — your message was sent. I’ll review your workflow note and follow up soon.
              </div>
            )}

            {status === 'error' && (
              <div className="form-alert error" role="alert">
                {errorMessage}
              </div>
            )}

            <div className="contact-form-grid two-col">
              <label>
                Name *
                <input name="name" type="text" required placeholder="Your name" />
              </label>
              <label>
                Email *
                <input name="email" type="email" required placeholder="you@example.com" />
              </label>
              <label>
                Company or team
                <input name="company" type="text" placeholder="Business or team name" />
              </label>
              <label>
                Role
                <input name="role" type="text" placeholder="Owner, operator, realtor, PM..." />
              </label>
              <label>
                What do you need help with? *
                <select name="project_type" required defaultValue="">
                  <option value="" disabled>Select a project type</option>
                  {contactProjectOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </label>
              <label>
                Preferred timeline
                <select name="timeline" defaultValue="">
                  <option value="">Select a timeline</option>
                  {contactTimelineOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </label>
            </div>

            <label>
              What workflow or business problem should we look at first? *
              <textarea name="message" required rows={7} placeholder="Example: buyer follow-up is scattered across texts, email, and CRM, and I need a simple tracker + AI prompts for weekly updates." />
            </label>

            <fieldset className="contact-checkbox-group">
              <legend>Optional context</legend>
              <label><input type="checkbox" name="context" value="I want a 15-minute review call" /> I want a 15-minute review call</label>
              <label><input type="checkbox" name="context" value="I want a human-reviewed report" /> I want a human-reviewed report</label>
              <label><input type="checkbox" name="context" value="I am using the Real Estate AI PM pilot" /> I am using the Real Estate AI PM pilot</label>
            </fieldset>

            <button className="button primary contact-submit" type="submit" disabled={status === 'submitting'}>
              {status === 'submitting' ? 'Sending…' : 'Send message'}
            </button>
            <p className="contact-privacy-note">This form is powered by Formspree. Please do not send private client, financial, legal, or compliance-sensitive details.</p>
          </form>

          <aside className="contact-side-panel">
            <div className="contact-info-card">
              <p className="eyebrow">Direct options</p>
              <h3>Prefer a faster path?</h3>
              <p>Email or book a short review if you already know the workflow you want to improve.</p>
              <a href="mailto:hello@practicalaisystems.com">hello@practicalaisystems.com</a>
              <a href={calendlyLink} target="_blank" rel="noreferrer">Book a 15-minute review</a>
            </div>
            <div className="contact-info-card muted-card">
              <p className="eyebrow">What happens next</p>
              <ol>
                <li>I review the workflow problem and desired outcome.</li>
                <li>You get a practical next-step recommendation.</li>
                <li>If there is a fit, we scope a small system or report.</li>
              </ol>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
