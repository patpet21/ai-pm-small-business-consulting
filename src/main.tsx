import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';

const calendlyLink = 'https://calendly.com/propertydext/15min';

const services = [
  'Workflow audits for the places work slows down',
  'Client follow-up systems that create clear next steps',
  'Document, estimate, and report templates your team can reuse',
  'Task management improvements that make ownership visible',
  'Communication routines for fewer dropped details',
  'Decision support for owners who need cleaner information',
];

const deliverables = [
  {
    title: 'Workflow audit',
    text: 'A clear look at where follow-up, documents, estimates, reports, tasks, and communication are breaking down.',
  },
  {
    title: 'AI use-case map',
    text: 'A practical map of where tools like ChatGPT and Claude can help—and where they should stay out of the way.',
  },
  {
    title: 'Prompt and template starter pack',
    text: 'Reusable prompts, checklists, and document structures for the work your team repeats every week.',
  },
  {
    title: 'Recommended tools and setup',
    text: 'A lean tool recommendation based on your current operations, not a stack of unnecessary software.',
  },
  {
    title: 'Simple implementation roadmap',
    text: 'A prioritized plan that turns the best ideas into owners, timelines, and practical next actions.',
  },
];

const processSteps = [
  {
    title: 'Map the real workflow',
    text: 'We identify how work actually moves through the business and where owners, teams, or clients lose clarity.',
  },
  {
    title: 'Choose the right AI support',
    text: 'We match AI use cases to real operations: follow-up, documents, estimates, reports, tasks, communication, and decisions.',
  },
  {
    title: 'Install simple routines',
    text: 'Your team gets templates, prompts, handoffs, and a roadmap they can use without becoming technical experts.',
  },
];

const useCases = [
  'Turn call notes into follow-up emails, assigned tasks, and next steps.',
  'Create consistent estimates, proposals, and project summaries.',
  'Summarize weekly progress across clients, jobs, or departments.',
  'Convert messy internal requests into clear work tickets.',
  'Build repeatable checklists for recurring decisions and reviews.',
  'Improve owner visibility without adding another meeting.',
];

const audiences = [
  'Contractors',
  'Real estate professionals',
  'Local service businesses',
  'Consultants',
  'Small teams using scattered tools',
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
          <a className="nav-cta" href={calendlyLink} target="_blank" rel="noreferrer">
            Start a workflow review
          </a>
        </nav>

        <div className="hero-grid" id="top">
          <div className="hero-copy">
            <p className="eyebrow">AI + Project Management Consulting</p>
            <h1>
              Most small businesses do not have an AI problem. <span>They have a workflow problem.</span>
            </h1>
            <p className="hero-lede">
              Practical AI Systems helps owners turn AI curiosity into cleaner operations. We connect tools like
              ChatGPT and Claude to the work that already runs your business: client follow-up, documents, estimates,
              reports, task management, communication, decision-making, and internal workflows.
            </p>
            <div className="hero-actions">
              <a className="button primary" href={calendlyLink} target="_blank" rel="noreferrer">
                Book a 15-minute review
              </a>
              <a className="button secondary" href="#deliverables">
                See what you get
              </a>
            </div>
          </div>

          <aside className="hero-card" aria-label="Consulting focus areas">
            <div className="card-topline">Where AI becomes useful</div>
            <ul>
              <li>Follow-up that becomes a system instead of a memory test</li>
              <li>Documents and estimates that follow one clear standard</li>
              <li>Reports that show owners what needs attention</li>
              <li>Tasks and decisions that turn into accountable next steps</li>
            </ul>
          </aside>
        </div>
      </section>

      <section className="problem section-shell">
        <div className="section-kicker">The problem</div>
        <div className="split">
          <h2>Buying another AI tool will not fix a messy handoff.</h2>
          <div className="copy-stack">
            <p>
              Small businesses rarely need a complicated AI strategy on day one. They need clearer ways to capture
              information, decide what matters, assign work, follow up, and keep clients moving.
            </p>
            <p>
              Random prompts and one-off experiments can be interesting, but they do not create operating leverage. The
              value appears when AI is tied to repeatable workflows your team can trust.
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
              We help you decide where AI belongs, what should stay human, and how each tool should support the way your
              business actually operates. The outcome is not more noise. It is fewer dropped balls, clearer standards,
              and better decisions.
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

      <section className="deliverables section-shell" id="deliverables">
        <div className="section-header">
          <div>
            <div className="section-kicker">What you get</div>
            <h2>Concrete deliverables your business can use immediately.</h2>
          </div>
          <p>
            Every engagement is built around practical outputs, not vague advice. You leave with a clearer operating
            picture and a focused plan for using AI where it will actually help.
          </p>
        </div>
        <div className="deliverable-grid">
          {deliverables.map((deliverable) => (
            <article className="deliverable-card" key={deliverable.title}>
              <h3>{deliverable.title}</h3>
              <p>{deliverable.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="services section-shell" id="services">
        <div className="section-header">
          <div>
            <div className="section-kicker">Services</div>
            <h2>Focused consulting for owners who want results, not hype.</h2>
          </div>
          <p>
            Start with a workflow review, then move into implementation support, team training, and operating playbooks
            only where the business needs them.
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

      <section className="audience section-shell">
        <div className="audience-panel">
          <div>
            <div className="section-kicker">Who this is for</div>
            <h2>Built for small businesses that need practical systems, not AI theater.</h2>
          </div>
          <ul className="audience-list">
            {audiences.map((audience) => (
              <li key={audience}>{audience}</li>
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
          <a className="button primary light" href={calendlyLink} target="_blank" rel="noreferrer">
            Book a 15-minute review
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
