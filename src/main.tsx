import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Link, NavLink, Route, Routes } from 'react-router-dom';
import { RealEstateAIPMPilot } from './pages/RealEstateAIPMPilot';
import './styles.css';

const calendlyLink = 'https://calendly.com/propertydext/15min';

const workflowAreas = [
  'Client follow-up',
  'Documents',
  'Estimates',
  'Reports',
  'Task management',
  'Communication',
  'Decision-making',
  'Internal operations',
];

const deliverables = [
  'Workflow audit',
  'AI use-case map',
  'Prompt and template starter pack',
  'Recommended tools and setup',
  'Simple implementation roadmap',
];

const serviceBlocks = [
  {
    title: 'AI Workflow Audit',
    for: 'Owners and small teams that know work is slipping but are not sure where AI should fit.',
    problem:
      'Follow-up, documents, estimates, reports, and internal handoffs are scattered across too many tools or too many people.',
    gets: [
      'A practical workflow review',
      'Clear AI use-case priorities',
      'A short list of process fixes before software changes',
      'A simple implementation roadmap',
    ],
  },
  {
    title: 'AI + PM System Setup',
    for: 'Businesses ready to connect AI outputs to tasks, ownership, communication, and recurring operating routines.',
    problem:
      'AI creates drafts and summaries, but the work still does not become an assigned next step or a repeatable process.',
    gets: [
      'Recommended tool structure',
      'Task and communication workflows',
      'Reusable templates for everyday work',
      'Team guidance for practical adoption',
    ],
  },
  {
    title: 'Claude / ChatGPT Business Playbook',
    for: 'Small teams that want clear, safe, non-technical ways to use Claude or ChatGPT in day-to-day operations.',
    problem:
      'People are using AI randomly, with inconsistent prompts, unclear standards, and no shared way to apply the results.',
    gets: [
      'Prompt and template starter pack',
      'Use-case guidance by workflow',
      'Do-and-do-not-use rules for your team',
      'Examples for follow-up, documents, reporting, and decisions',
    ],
  },
];

const resourceSections = [
  {
    title: 'AI Workflow Checklist',
    points: [
      'Pick one workflow before picking another tool.',
      'Write down where information enters, who owns it, and what happens next.',
      'Look for repeated tasks: follow-up emails, estimate drafts, weekly summaries, and internal updates.',
      'Decide what AI can draft, summarize, classify, or turn into tasks.',
    ],
  },
  {
    title: 'Prompt Templates for Small Business',
    points: [
      '“Turn these call notes into a client follow-up email with next steps and open questions.”',
      '“Summarize this project update for an owner who needs risks, decisions, and deadlines.”',
      '“Create a checklist from this messy request so a team member can complete it without another meeting.”',
      '“Rewrite this estimate explanation so it is clear, direct, and professional.”',
    ],
  },
  {
    title: 'Common AI Mistakes',
    points: [
      'Trying to automate a workflow no one has clearly defined.',
      'Letting each team member invent their own prompts and standards.',
      'Using AI for client-facing work without review, context, or accountability.',
      'Buying another app when the real issue is ownership and handoff clarity.',
    ],
  },
  {
    title: 'Simple Workflow Examples',
    points: [
      'Call notes → summary → client email → assigned task → follow-up date.',
      'Site visit notes → estimate draft → internal review → client-ready proposal.',
      'Weekly team updates → risk summary → owner decisions → project tasks.',
      'Client request → clarified scope → task checklist → status update.',
    ],
  },
];

const useCaseDetails = [
  {
    title: 'Contractors',
    problem: 'Job details, site notes, estimate changes, and client follow-up often live in texts, calls, and memory.',
    help: 'AI can turn notes and photos into summaries, estimate explanations, task lists, and follow-up drafts.',
    system: 'A simple intake-to-estimate workflow with standard prompts, review steps, and assigned next actions.',
  },
  {
    title: 'Real estate professionals',
    problem: 'Client communication, property details, transaction tasks, and vendor coordination can become fragmented.',
    help: 'AI can summarize conversations, draft updates, organize deal tasks, and prepare client-ready communication.',
    system: 'A transaction coordination workflow that converts notes into follow-ups, documents, reminders, and decision points.',
  },
  {
    title: 'Local service businesses',
    problem: 'New inquiries, scheduling, service notes, reviews, and repeat communication are handled inconsistently.',
    help: 'AI can standardize responses, summarize service history, draft updates, and create internal handoff notes.',
    system: 'A client request workflow from intake to service completion with templates for each recurring touchpoint.',
  },
  {
    title: 'Consultants',
    problem: 'Discovery notes, client recommendations, proposals, and status reports take too long to convert into clear outputs.',
    help: 'AI can structure insights, draft deliverables, prepare meeting summaries, and keep action items visible.',
    system: 'A consulting delivery workflow that turns meetings into decisions, tasks, summaries, and polished client materials.',
  },
  {
    title: 'Small internal teams',
    problem: 'Work is spread across email, chat, spreadsheets, project tools, and informal conversations.',
    help: 'AI can consolidate updates, clarify requests, draft internal documentation, and surface decisions that need attention.',
    system: 'A lightweight operating rhythm for requests, updates, decisions, and weekly visibility.',
  },
];

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'Resources', to: '/resources' },
  { label: 'Use Cases', to: '/use-cases' },
  { label: 'About', to: '/about' },
  { label: 'Real Estate Pilot', to: '/real-estate-ai-pm-pilot' },
];

function CTAButton({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <a className={`button primary${light ? ' light' : ''}`} href={calendlyLink} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
}

function SiteHeader() {
  return (
    <header className="site-header section-shell">
      <Link className="brand" to="/" aria-label="Practical AI Systems home">
        <img className="brand-logo" src="https://i.ibb.co/5g7gFLQz/Logo-PRDX.jpg" alt="Practical AI Systems logo" />
        Practical AI Systems
      </Link>
      <nav className="nav-links" aria-label="Main navigation">
        {navItems.map((item) => (
          <NavLink className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} key={item.to} to={item.to}>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <a className="nav-cta" href={calendlyLink} target="_blank" rel="noreferrer">
        Book a Call
      </a>
    </header>
  );
}

function PageIntro({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <section className="page-intro section-shell">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="hero-lede">{text}</p>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="cta section-shell" id="contact">
      <div className="cta-panel">
        <p className="eyebrow">Ready to make AI practical?</p>
        <h2>Start with the workflow you already know is slowing the business down.</h2>
        <CTAButton light>Book a 15-minute review</CTAButton>
      </div>
    </section>
  );
}

function Home() {
  return (
    <>
      <section className="hero section-shell">
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">AI + Project Management Consulting</p>
            <h1>
              Most small businesses do not have an AI problem. <span>They have a workflow problem.</span>
            </h1>
            <p className="hero-lede">
              Practical AI Systems helps owners turn AI curiosity into cleaner operations. We connect tools like
              ChatGPT and Claude to real workflows: client follow-up, documents, estimates, reports, task management,
              communication, decision-making, and internal operations.
            </p>
            <div className="hero-actions">
              <CTAButton>Book a 15-minute review</CTAButton>
              <Link className="button secondary" to="/services">
                Explore services
              </Link>
            </div>
          </div>
          <aside className="hero-card" aria-label="Workflow areas">
            <div className="card-topline">Where AI becomes useful</div>
            <ul>
              {workflowAreas.map((area) => (
                <li key={area}>{area}</li>
              ))}
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

      <section className="deliverables section-shell">
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
            <article className="deliverable-card" key={deliverable}>
              <h3>{deliverable}</h3>
            </article>
          ))}
        </div>
      </section>


      <section className="section-shell detail-card pilot-home-cta">
        <p className="eyebrow">New: Real Estate AI PM Pilot</p>
        <h2>New: Real Estate AI PM Pilot</h2>
        <p>
          Most real estate professionals are not losing time because they lack another AI tool. They lose time because
          leads, follow-ups, tasks, documents, vendors, and decisions are not connected.
        </p>
        <p>
          This free pilot helps realtors, brokers, property managers, and small real estate teams turn one messy
          workflow into a simple AI-assisted project management system.
        </p>
        <div className="hero-actions">
          <Link className="button primary" to="/real-estate-ai-pm-pilot">
            Apply for the Free Pilot
          </Link>
          <Link className="button secondary" to="/real-estate-ai-pm-pilot">
            See How It Works
          </Link>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}

function Services() {
  return (
    <>
      <PageIntro
        eyebrow="Services"
        title="Practical AI systems for owners who want results, not hype."
        text="Start with the workflow, then connect AI and project management tools only where they make operations clearer."
      />
      <section className="section-shell service-detail-grid">
        {serviceBlocks.map((service) => (
          <article className="detail-card" key={service.title}>
            <h2>{service.title}</h2>
            <div className="detail-stack">
              <div>
                <strong>Who it is for</strong>
                <p>{service.for}</p>
              </div>
              <div>
                <strong>The problem it solves</strong>
                <p>{service.problem}</p>
              </div>
              <div>
                <strong>What you get</strong>
                <ul>
                  {service.gets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
            <CTAButton>Book a call</CTAButton>
          </article>
        ))}
      </section>
    </>
  );
}

function Resources() {
  return (
    <>
      <PageIntro
        eyebrow="Resources"
        title="Useful starting points for applying AI to real small business workflows."
        text="These examples are designed to help you think clearly before buying another tool or asking your team to change everything at once."
      />
      <section className="section-shell resource-grid">
        {resourceSections.map((section) => (
          <article className="resource-card" key={section.title}>
            <h2>{section.title}</h2>
            <ul>
              {section.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>
    </>
  );
}

function UseCases() {
  return (
    <>
      <PageIntro
        eyebrow="Use cases"
        title="Practical AI examples by business type."
        text="The best use cases are not flashy. They remove friction from the work your team already repeats every week."
      />
      <section className="section-shell use-case-detail-grid">
        {useCaseDetails.map((useCase) => (
          <article className="detail-card" key={useCase.title}>
            <h2>{useCase.title}</h2>
            <div className="detail-stack three-column-text">
              <div>
                <strong>Common workflow problem</strong>
                <p>{useCase.problem}</p>
              </div>
              <div>
                <strong>How AI can help</strong>
                <p>{useCase.help}</p>
              </div>
              <div>
                <strong>Simple system</strong>
                <p>{useCase.system}</p>
              </div>
            </div>
          </article>
        ))}
      </section>
      <FinalCTA />
    </>
  );
}

function About() {
  return (
    <>
      <PageIntro
        eyebrow="About"
        title="Practical systems for business owners who need clarity, not buzzwords."
        text="Practical AI Systems is led by Peter, an AI + Project Management Systems Consultant focused on turning complex ideas into usable operations."
      />
      <section className="section-shell about-profile">
        <img src="https://i.ibb.co/nx5qk7T/Progetto-senza-titolo-3.png" alt="Peter, founder of Practical AI Systems" />
        <div className="about-card">
          <div className="section-kicker">Founder profile</div>
          <h2>Peter</h2>
          <p className="profile-title">Founder / AI + Project Management Systems Consultant</p>
          <p>
            Peter is an engineer by background and a builder by instinct. With experience across civil engineering,
            construction, real estate coordination, blockchain, digital ventures, and business operations, he focuses on
            turning complex ideas into practical systems.
          </p>
          <p>
            He started exploring crypto and blockchain in 2017, later applying that curiosity to real estate
            tokenization, decision-support tools, and practical AI workflows.
          </p>
          <p>
            Today, through Practical AI Systems, Peter helps small businesses use AI tools like ChatGPT and Claude in a
            structured, useful way: not as random tools, but as part of real business operations.
          </p>
          <ul className="credential-list">
            <li>Civil engineering background</li>
            <li>Construction and real estate experience</li>
            <li>Blockchain and digital business experience</li>
            <li>Project coordination mindset</li>
            <li>Focus on practical AI systems, not hype</li>
          </ul>
        </div>
      </section>
      <FinalCTA />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <SiteHeader />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/use-cases" element={<UseCases />} />
          <Route path="/about" element={<About />} />
          <Route path="/real-estate-ai-pm-pilot" element={<RealEstateAIPMPilot />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
