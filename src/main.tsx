import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';

const calendlyUrl = 'https://calendly.com/propertydext/15min';

const operations = [
  'Client follow-up',
  'Documents and estimates',
  'Reports and owner updates',
  'Task management',
  'Team communication',
  'Decision-making workflows',
];

const deliverables = [
  {
    title: 'Workflow audit',
    text: 'A clear review of where work slows down, gets repeated, or depends too much on memory.',
  },
  {
    title: 'AI use-case map',
    text: 'A practical view of where ChatGPT, Claude, or other tools can support the work without adding noise.',
  },
  {
    title: 'Prompt and template starter pack',
    text: 'Reusable prompts, document structures, follow-up templates, and operating checklists your team can start with.',
  },
  {
    title: 'Recommended tools and setup',
    text: 'Straightforward recommendations for the tools, accounts, and routines that fit your business as it works today.',
  },
  {
    title: 'Simple implementation roadmap',
    text: 'A step-by-step plan for turning the best opportunities into a working system your team can maintain.',
  },
];

const processSteps = [
  {
    title: 'Map the real workflow',
    text: 'We identify how work moves from request to decision to completion, including the handoffs that create delay.',
  },
  {
    title: 'Choose the useful AI moments',
    text: 'We focus on places where AI can help draft, summarize, organize, compare, or clarify work your team already does.',
  },
  {
    title: 'Turn it into a simple system',
    text: 'Your team gets templates, prompts, tool guidance, and a practical roadmap they can use without becoming technical experts.',
  },
];

const useCases = [
  'Turn call notes into follow-up emails, tasks, and next steps.',
  'Create consistent estimates, proposals, and project summaries.',
  'Summarize weekly progress across clients, jobs, or departments.',
  'Convert scattered internal requests into clear work tickets.',
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
          <a className="nav-cta" href={calendlyUrl} target="_blank" rel="noreferrer">
            Book a 15-minute call
          </a>
        </nav>

        <div className="hero-grid" id="top">
          <div className="hero-copy">
            <p className="eyebrow">AI + workflow consulting for small business</p>
            <h1>Most small businesses do not have an AI problem. They have a workflow problem.</h1>
            <p className="hero-lede">
              Practical AI Systems helps small business owners connect tools like ChatGPT and Claude to the daily
              operations that actually move the business: follow-up, documents, estimates, reports, task management,
              communication, and decisions.
            </p>
            <div className="hero-actions">
              <a className="button primary" href={calendlyUrl} target="_blank" rel="noreferrer">
                Book a 15-minute call
              </a>
              <a className="button secondary" href="#what-you-get">
                See what you get
              </a>
            </div>
          </div>

          <aside className="hero-card" aria-label="Workflow focus areas">
            <div className="card-topline">Where AI becomes useful</div>
            <ul>
              {operations.map((operation) => (
                <li key={operation}>{operation}</li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section className="problem section-shell">
        <div className="section-kicker">The problem</div>
        <div className="split">
          <h2>Opening an AI tool is easy. Making it fit the way your business runs is the hard part.</h2>
          <div className="copy-stack">
            <p>
              Most teams do not need another experiment. They need cleaner handoffs, faster follow-up, better document
              standards, and a reliable way to turn decisions into assigned work.
            </p>
            <p>
              When the workflow is unclear, AI produces random wins instead of repeatable value. The right starting
              point is the business process, not the software.
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
              goal is not to automate everything. The goal is to make everyday operations clearer, faster, and easier to
              manage.
            </p>
          </div>
          <div className="metrics-grid" aria-label="Consulting principles">
            <div>
              <strong>Clear</strong>
              <span>Simple operating steps before complex tools.</span>
            </div>
            <div>
              <strong>Useful</strong>
              <span>AI applied to work your team already needs to complete.</span>
            </div>
            <div>
              <strong>Maintainable</strong>
              <span>Prompts, templates, and routines that can survive a busy week.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="deliverables section-shell" id="what-you-get">
        <div className="section-header">
          <div>
            <div className="section-kicker">What you get</div>
            <h2>Concrete deliverables, not a vague AI strategy deck.</h2>
          </div>
          <p>
            The work is designed to give owners and teams a practical starting system they can understand, use, and
            improve over time.
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
        <div className="section-kicker">Practical use cases</div>
        <div className="use-case-layout">
          <h2>AI can support the ordinary work that keeps the business moving.</h2>
          <ul className="use-case-list">
            {useCases.map((useCase) => (
              <li key={useCase}>{useCase}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="audience section-shell">
        <div className="section-header compact">
          <div>
            <div className="section-kicker">Who this is for</div>
            <h2>Built for small teams that need practical leverage, not more complexity.</h2>
          </div>
        </div>
        <div className="audience-grid">
          {audiences.map((audience) => (
            <article className="audience-card" key={audience}>
              {audience}
            </article>
          ))}
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
          <a className="button primary light" href={calendlyUrl} target="_blank" rel="noreferrer">
            Book a 15-minute call
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
