import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';

const services = [
  'AI workflow audits',
  'Client follow-up systems',
  'Document and estimate workflows',
  'Reporting and decision dashboards',
  'Task management improvements',
  'Internal communication playbooks',
];

const processSteps = [
  {
    title: 'Map the real workflow',
    text: 'We identify where work slows down, gets duplicated, or depends on memory instead of a reliable system.',
  },
  {
    title: 'Design the practical system',
    text: 'We choose the right AI and project management tools only after the operating process is clear.',
  },
  {
    title: 'Implement and train',
    text: 'Your team gets usable templates, handoffs, prompts, checklists, and guidance they can apply immediately.',
  },
];

const useCases = [
  'Turn call notes into follow-up emails, tasks, and next steps.',
  'Create consistent estimates, proposals, and project summaries.',
  'Summarize weekly progress across clients, jobs, or departments.',
  'Convert messy internal requests into clear work tickets.',
  'Build repeatable checklists for recurring decisions and reviews.',
  'Improve owner visibility without adding another meeting.',
];

function App() {
  return (
    <main>
      <section className="hero section-shell">
        <nav className="nav" aria-label="Main navigation">
          <a className="brand" href="#top" aria-label="Practical AI Systems home">
            <span className="brand-mark">PA</span>
            Practical AI Systems
          </a>
          <a className="nav-cta" href="#contact">
            Start a workflow review
          </a>
        </nav>

        <div className="hero-grid" id="top">
          <div className="hero-copy">
            <p className="eyebrow">AI + Project Management Consulting</p>
            <h1>Most small businesses do not have an AI problem. They have a workflow problem.</h1>
            <p className="hero-lede">
              Practical AI Systems helps small business owners connect tools like ChatGPT and Claude to the real work:
              follow-up, documents, estimates, reports, task management, communication, and decisions.
            </p>
            <div className="hero-actions">
              <a className="button primary" href="#contact">
                Book a practical review
              </a>
              <a className="button secondary" href="#services">
                See services
              </a>
            </div>
          </div>

          <aside className="hero-card" aria-label="Consulting focus areas">
            <div className="card-topline">What gets improved</div>
            <ul>
              <li>Client follow-up that does not fall through the cracks</li>
              <li>Documents and estimates that follow a clear standard</li>
              <li>Reports that help owners see what needs attention</li>
              <li>Task systems that turn decisions into accountable work</li>
            </ul>
          </aside>
        </div>
      </section>

      <section className="problem section-shell">
        <div className="section-kicker">The problem</div>
        <div className="split">
          <h2>AI tools are easy to open. They are harder to connect to how your business actually runs.</h2>
          <div className="copy-stack">
            <p>
              Many teams try AI by asking random questions, generating one-off documents, or testing a new app with no
              operational owner. That creates novelty, not better execution.
            </p>
            <p>
              The bigger issue is usually unclear handoffs, inconsistent follow-up, scattered information, and decisions
              that never become assigned work.
            </p>
          </div>
        </div>
      </section>

      <section className="solution section-shell">
        <div className="section-kicker">The solution</div>
        <div className="solution-panel">
          <div>
            <h2>Build practical AI systems around the workflow first.</h2>
            <p>
              We help you decide where AI belongs, where it does not, and how it should support your existing team. The
              goal is not more software. The goal is cleaner operations and better decisions.
            </p>
          </div>
          <div className="metrics-grid" aria-label="Consulting principles">
            <div>
              <strong>Clear</strong>
              <span>Simple processes before complex tools.</span>
            </div>
            <div>
              <strong>Useful</strong>
              <span>Systems designed for work your team already does.</span>
            </div>
            <div>
              <strong>Durable</strong>
              <span>Templates, prompts, and routines that keep working.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="services section-shell" id="services">
        <div className="section-header">
          <div>
            <div className="section-kicker">Services</div>
            <h2>Focused consulting for owners who want results, not hype.</h2>
          </div>
          <p>
            Engagements can start with a focused workflow review and expand into implementation support, team training,
            and operating playbooks.
          </p>
        </div>
        <div className="service-grid">
          {services.map((service) => (
            <article className="service-card" key={service}>
              <span aria-hidden="true">—</span>
              <h3>{service}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className="process section-shell">
        <div className="section-header compact">
          <div>
            <div className="section-kicker">How it works</div>
            <h2>A simple path from scattered work to reliable systems.</h2>
          </div>
        </div>
        <div className="process-grid">
          {processSteps.map((step, index) => (
            <article className="process-card" key={step.title}>
              <span className="step-number">0{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="use-cases section-shell">
        <div className="section-kicker">Example use cases</div>
        <div className="use-case-layout">
          <h2>AI can support the everyday work that keeps the business moving.</h2>
          <ul className="use-case-list">
            {useCases.map((useCase) => (
              <li key={useCase}>{useCase}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="about section-shell">
        <div className="about-card">
          <div className="section-kicker">About</div>
          <h2>Practical AI Systems is built for small business reality.</h2>
          <p>
            The work is part AI strategy, part project management, and part operational cleanup. We translate new tools
            into clear workflows that owners and teams can understand, adopt, and maintain.
          </p>
          <p>
            No technical theater. No pressure to automate everything. Just a disciplined look at where AI can reduce
            friction and make the business easier to run.
          </p>
        </div>
      </section>

      <section className="cta section-shell" id="contact">
        <div className="cta-panel">
          <p className="eyebrow">Ready to make AI practical?</p>
          <h2>Start with the workflow you already know is slowing the business down.</h2>
          <a className="button primary light" href="#contact">
            Request a workflow review
          </a>
        </div>
      </section>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
