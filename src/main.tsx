import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Link, NavLink, Route, Routes } from 'react-router-dom';
import { Contact } from './pages/Contact';
import { RealEstateAIPMPilot } from './pages/RealEstateAIPMPilot';
import './styles.css';

const calendlyLink = 'https://calendly.com/propertydext/15min';

const startingPoints = [
  {
    title: 'AI Use Review',
    copy: 'For teams already using ChatGPT, Claude, Copilot, Gemini, or other AI tools and needing a clearer way to manage prompts, risks, outputs, reviews, and documentation.',
    deliverables: ['AI Use Map', 'Risk Checklist', 'Prompt Library Starter', 'Human Review Workflow', 'AI Use Log', '30-Day Action Plan'],
    cta: 'Start AI Use Review',
    to: '/contact',
  },
  {
    title: 'Real Estate AI PM Pilot',
    copy: 'For real estate teams, brokers, operators, property managers, and small developers who want to improve follow-up, documents, task visibility, client updates, vendors, and reporting.',
    deliverables: ['Workflow Diagnostic', 'Follow-Up Review', 'Document and Task Visibility', 'Bottleneck Analysis', 'AI + PM Improvement Plan', '7-Day Roadmap'],
    cta: 'Explore Real Estate Pilot',
    to: '/real-estate-ai-pm-pilot',
  },
];

const problemBullets = [
  'No clear owner for the next step',
  'No review process before using AI output',
  'No documentation of how AI was used',
  'No standard prompts or repeatable process',
  'No link between AI output, task ownership, and follow-up',
  'No simple way to track risks, decisions, or client updates',
];

const projectControlSteps = [
  {
    title: 'Intake',
    text: 'Request, context, constraint, and the real problem to solve.',
  },
  {
    title: 'Scope',
    text: 'What matters, what is out of scope, and what comes first.',
  },
  {
    title: 'Ownership',
    text: 'Who owns what, when it is due, and where handoffs happen.',
  },
  {
    title: 'Risks & Decisions',
    text: 'Open questions, blockers, tradeoffs, and decision points.',
  },
  {
    title: 'AI Support',
    text: 'Drafts, summaries, prompts, reports, SOPs, and project records.',
  },
  {
    title: 'Human Review & Delivery',
    text: 'Final check, approval, client update, follow-up, and monitoring.',
  },
];

const homeHelpCards = [
  {
    title: 'AI Use Review',
    copy: 'A practical review of how your team uses AI, where risks exist, and what controls should be created next.',
    includes: ['AI Use Map', 'Risk Checklist', 'AI Use Log starter', 'Prompt Library starter', 'Human Review Workflow', '30-Day Action Plan'],
    cta: 'Start AI Use Review',
    to: '/contact',
  },
  {
    title: 'Workflow System Setup',
    copy: 'Turn one business process into a clear operating system for follow-up, documents, client updates, weekly priorities, task ownership, or reporting.',
    includes: ['Workflow Map', 'Task and Ownership Structure', 'Document Organization', 'Follow-Up Routine', 'Reporting Template', 'Review Process'],
    cta: 'Build a Workflow System',
    to: '/contact',
  },
  {
    title: 'Real Estate AI PM Pilot',
    copy: 'A focused pilot for real estate teams that need better follow-up, document control, vendor coordination, client updates, weekly visibility, and deal status reporting.',
    includes: ['Workflow Diagnostic', 'Bottleneck Review', 'AI + PM Recommendations', 'Prompt Pack', 'Task Visibility Plan', '7-Day Roadmap'],
    cta: 'Explore Real Estate Pilot',
    to: '/real-estate-ai-pm-pilot',
  },
];

const homeAudienceCards = [
  {
    title: 'Real Estate Teams',
    copy: 'Lead follow-up, client updates, property documents, vendors, transaction tasks, and weekly deal visibility.',
  },
  {
    title: 'Small Business Owners',
    copy: 'Internal operations, recurring tasks, documents, follow-ups, team coordination, and weekly priorities.',
  },
  {
    title: 'Project-Based Teams',
    copy: 'Client work, events, launches, operations, reports, timelines, decisions, and handoffs.',
  },
  {
    title: 'Consultants & Service Professionals',
    copy: 'Discovery calls, proposals, recommendations, project plans, client deliverables, and reports.',
  },
];

const pilotFocusAreas = [
  'Buyer or seller follow-up',
  'Property notes and client updates',
  'Vendor coordination',
  'Document organization',
  'Weekly task visibility',
  'Deal and status reporting',
];

const freeResourceBullets = [
  'AI workflow checklist',
  'Prompt templates',
  'Simple workflow examples',
  'Common AI mistakes to avoid',
];

const aiSupportedPmCards = [
  'Scope clarity',
  'Stakeholder communication',
  'Task ownership',
  'Timeline planning',
  'Risk tracking',
  'Decision support',
  'Documentation',
  'Reporting',
  'SOP creation',
  'Follow-up routines',
];

const serviceBlocks = [
  {
    title: 'Project & Workflow Clarity Review',
    for: 'Businesses that need to clarify the problem, scope, stakeholders, priorities, and bottlenecks before adding tools.',
    problem: 'Unclear scope, shifting priorities, disconnected communication, and weak ownership make everyday work hard to manage.',
    gets: ['Problem and scope clarification', 'Stakeholder and priority mapping', 'Bottleneck diagnosis', 'Risk and decision review', 'Simple implementation roadmap'],
  },
  {
    title: 'AI-Augmented Project System Setup',
    for: 'Businesses ready to organize tasks, documents, communication, timelines, risks, and reporting into a usable system.',
    problem: 'Work needs structure around ownership, deadlines, documentation, communication, risk tracking, and human review.',
    gets: ['Project and workflow structure', 'Task ownership and timeline setup', 'Risk and decision tracking', 'Communication and reporting routines', 'Human review checkpoints'],
  },
  {
    title: 'ChatGPT / Claude PM Playbook',
    for: 'Teams that want practical AI templates for planning, meeting notes, stakeholder updates, risk logs, SOPs, reports, and decision support.',
    problem: 'People use AI inconsistently, with different standards, unclear review steps, and no shared project or operations process.',
    gets: ['Planning and meeting-note templates', 'Stakeholder update examples', 'Risk log and decision-support prompts', 'SOP and report templates', 'Human review checklist'],
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
    title: 'Prompt Templates',
    points: [
      '“Turn these call notes into a client follow-up email with next steps and open questions.”',
      '“Summarize this project update for an owner who needs risks, decisions, and deadlines.”',
      '“Create a checklist from this request so a team member can complete it without another meeting.”',
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
    title: 'Real estate professionals',
    problem: 'Client communication, property details, transaction tasks, and vendor coordination are often fragmented across tools and conversations.',
    help: 'AI can summarize conversations, draft updates, organize deal tasks, and prepare client-ready communication for review.',
    system: 'A transaction coordination workflow that converts notes into follow-ups, documents, reminders, and decision points.',
  },
  {
    title: 'Contractors',
    problem: 'Job details, site notes, estimate changes, and client follow-up often live in texts, calls, and memory.',
    help: 'AI can turn notes and photos into summaries, estimate explanations, task lists, and follow-up drafts.',
    system: 'A simple intake-to-estimate workflow with standard prompts, review steps, and assigned next actions.',
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
  { label: 'Real Estate Pilot', to: '/real-estate-ai-pm-pilot' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

function CTAButton({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <a className={`button primary${light ? ' light' : ''}`} href={calendlyLink} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
}

function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className={`site-header section-shell${isMenuOpen ? ' menu-open' : ''}`}>
      <Link className="brand" to="/" aria-label="Practical AI Systems home" onClick={() => setIsMenuOpen(false)}>
        <img className="brand-logo" src="https://i.ibb.co/5g7gFLQz/Logo-PRDX.jpg" alt="Practical AI Systems logo" />
        Practical AI Systems
      </Link>
      <button
        className="mobile-menu-toggle"
        type="button"
        aria-expanded={isMenuOpen}
        aria-controls="primary-navigation"
        onClick={() => setIsMenuOpen((open) => !open)}
      >
        <span className="mobile-menu-bars" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        Menu
      </button>
      <nav className="nav-links" id="primary-navigation" aria-label="Main navigation">
        {navItems.map((item) => (
          <NavLink className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} key={item.to} to={item.to} onClick={() => setIsMenuOpen(false)}>
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
      <div className="cta-panel final-funnel-cta">
        <p className="eyebrow">Start simple</p>
        <h2>Want to make your workflow clearer?</h2>
        <p>Start with one workflow, one bottleneck, and one practical next step.</p>
        <div className="hero-actions">
          <CTAButton light>Book a 15-Minute Review</CTAButton>
          <Link className="button secondary light-outline" to="/contact">Contact Peter</Link>
        </div>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="site-footer section-shell">
      <div className="site-footer-grid">
        <div>
          <img className="site-footer-logo" src="https://i.ibb.co/5g7gFLQz/Logo-PRDX.jpg" alt="Practical AI Systems logo" />
          <p className="site-footer-brand">Practical AI Systems</p>
          <p>AI-supported workflow systems for real operations.</p>
        </div>
        <div>
          <p className="site-footer-title">Contact</p>
          <p><a href="mailto:hello@practicalaisystems.com">hello@practicalaisystems.com</a></p>
          <p><a href={calendlyLink} target="_blank" rel="noreferrer">Book a 15-minute review</a></p>
        </div>
        <div>
          <p className="site-footer-title">Navigation</p>
          {navItems.map((item) => (
            <p key={item.to}><Link to={item.to}>{item.label}</Link></p>
          ))}
        </div>
      </div>
    </footer>
  );
}

function Home() {
  return (
    <>
      <section className="hero section-shell home-funnel-hero premium-hero">
        <div className="premium-hero-grid">
          <div className="premium-hero-copy">
            <p className="hero-eyebrow-pill">AI PM Lab</p>
            <h1>Turn AI use into operational control.</h1>
            <p className="hero-lede">
              AI PM Lab helps small businesses, project-based teams, and real estate professionals organize how AI is used, where workflows break, who owns the next step, and what system should be created next.
            </p>
            <p className="trust-line">Start with one workflow. Map the problem. Add AI only where it improves clarity, speed, documentation, or control.</p>
            <div className="hero-actions premium-hero-actions">
              <Link className="button primary" to="/contact">Start with an AI Use Review</Link>
              <Link className="button secondary" to="/real-estate-ai-pm-pilot">Explore Real Estate AI PM Pilot</Link>
            </div>
            <div className="hero-proof-row" aria-label="AI PM Lab positioning">
              <span>AI use maps</span>
              <span>Prompt controls</span>
              <span>Review workflows</span>
              <span>Next actions</span>
            </div>
            <p className="home-positioning-line">AI + Project Management systems for business, projects, and real estate workflows.</p>
          </div>

          <aside className="hero-signal-panel execution-panel" aria-label="Project Control Layer framework visual">
            <div className="signal-panel-header">
              <p className="card-topline">Project Control Layer</p>
              <strong>From AI outputs and broken workflows to clear operational control.</strong>
              <span>Map the workflow, define ownership, document AI use, review outputs, and connect decisions to follow-up.</span>
            </div>
            <div className="execution-framework-grid">
              {projectControlSteps.map((step, index) => (
                <div className="execution-node" key={step.title}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <strong>{step.title}</strong>
                  <p>{step.text}</p>
                </div>
              ))}
            </div>
            <div className="execution-outcome-bar">
              <span>Maps</span>
              <span>Prompts</span>
              <span>Logs</span>
            </div>
          </aside>
        </div>
      </section>

      <section className="section-shell funnel-section home-starting-points">
        <div className="section-header single-column-header">
          <div>
            <div className="section-kicker">Two starting points</div>
            <h2>Choose your starting point.</h2>
          </div>
          <p>Start with the path that matches your current problem.</p>
        </div>
        <div className="starting-point-grid">
          {startingPoints.map((point) => (
            <article className="detail-card starting-point-card" key={point.title}>
              <h3>{point.title}</h3>
              <p>{point.copy}</p>
              <ul>
                {point.deliverables.map((item) => <li key={item}>{item}</li>)}
              </ul>
              <Link className="button secondary" to={point.to}>{point.cta}</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="problem section-shell">
        <div className="split">
          <div>
            <div className="section-kicker">The problem</div>
            <h2>AI does not fix messy workflows. It exposes them.</h2>
          </div>
          <div className="copy-stack">
            <p>
              Many teams already use AI for emails, summaries, reports, client updates, research, documents, and planning. But without structure, AI outputs stay disconnected from real execution.
            </p>
          </div>
        </div>
        <div className="issue-grid">
          {problemBullets.map((issue) => <article className="compact-card issue-card" key={issue}>{issue}</article>)}
        </div>
      </section>

      <section className="section-shell workflow-visual-section">
        <div className="section-header single-column-header">
          <div>
            <div className="section-kicker">Project Control Layer</div>
            <h2>The Project Control Layer</h2>
          </div>
          <p>From scattered information to clear scope, owners, risks, decisions, documentation, and follow-up.</p>
        </div>
        <div className="workflow-step-grid project-control-grid">
          {projectControlSteps.map((step, index) => (
            <article className="workflow-step-card project-control-card" key={step.title}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{step.title}</strong>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="solution section-shell">
        <div className="section-header single-column-header">
          <div>
            <div className="section-kicker">How I can help</div>
            <h2>How I can help.</h2>
          </div>
          <p>Practical support for the work your team already does.</p>
        </div>
        <div className="help-card-grid home-help-grid">
          {homeHelpCards.map((card) => (
            <article className="detail-card help-card" key={card.title}>
              <h3>{card.title}</h3>
              <p>{card.copy}</p>
              <strong>Includes</strong>
              <ul>
                {card.includes.map((item) => <li key={item}>{item}</li>)}
              </ul>
              <Link className="button secondary" to={card.to}>{card.cta}</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell funnel-section home-audience-section">
        <div className="section-header single-column-header">
          <div>
            <div className="section-kicker">Who this is for</div>
            <h2>Who this is for.</h2>
          </div>
        </div>
        <div className="audience-grid sector-grid home-audience-grid">
          {homeAudienceCards.map((audience) => (
            <article className="compact-card sector-card" key={audience.title}>
              <h3>{audience.title}</h3>
              <p>{audience.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell pilot-highlight">
        <div className="pilot-highlight-copy">
          <p className="eyebrow">Featured Pilot</p>
          <h2>Featured Pilot: Real Estate AI PM Pilot</h2>
          <p>A focused pilot for real estate professionals who want to organize one workflow before adding more tools or automation.</p>
          <p className="pilot-note">Limited pilot spots available.</p>
          <Link className="button primary" to="/real-estate-ai-pm-pilot">Explore Real Estate Pilot</Link>
        </div>
        <ul className="pilot-example-list">
          {pilotFocusAreas.map((example) => <li key={example}>{example}</li>)}
        </ul>
      </section>

      <section className="section-shell related-work-section home-related-work">
        <div className="section-header single-column-header">
          <div>
            <div className="section-kicker">Related work</div>
            <h2>Related Research: PropertyDEX</h2>
          </div>
          <p>PropertyDEX explores real estate innovation, digital property infrastructure, tokenization research, and future ownership models.</p>
        </div>
        <div className="related-work-grid single-related-card">
          <article className="detail-card">
            <h3>PropertyDEX</h3>
            <p>AI PM Lab focuses on practical AI + Project Management systems. PropertyDEX is the broader real estate innovation research track.</p>
            <a className="button secondary" href="https://propertydex.xyz" target="_blank" rel="noreferrer">Explore PropertyDEX</a>
          </article>
        </div>
      </section>

      <section className="cta section-shell home-final-cta">
        <div className="cta-panel final-funnel-cta">
          <p className="eyebrow">Start simple</p>
          <h2>Start with one workflow.</h2>
          <p>You do not need to automate everything. Start with one bottleneck, one workflow, and one practical next step.</p>
          <div className="hero-actions">
            <Link className="button primary light" to="/contact">Start with an AI Use Review</Link>
            <Link className="button secondary light-outline" to="/real-estate-ai-pm-pilot">Explore Real Estate Pilot</Link>
          </div>
        </div>
      </section>
    </>
  );
}

function Services() {
  const servicesPageServices = [
    {
      title: 'AI Use Review',
      for: 'Teams already using ChatGPT, Claude, Copilot, Gemini, Canva AI, Notion AI, or other AI tools without a clear process for prompts, outputs, review, risk, and documentation.',
      problem: 'AI is being used, but no one has a clear picture of who uses it, for what tasks, what data goes in, what outputs are used, who reviews them, and where the process is documented.',
      gets: ['AI Use Map', 'Risk Checklist', 'Prompt Library Starter', 'AI Use Log', 'Human Review Workflow', '30-Day Action Plan'],
      cta: 'Start AI Use Review',
      to: '/contact',
    },
    {
      title: 'Workflow Clarity Review',
      for: 'Businesses that need to clarify a workflow, project, client process, internal routine, or recurring bottleneck before adding tools or automation.',
      problem: 'Unclear scope, shifting priorities, scattered documents, disconnected communication, and weak ownership make everyday work hard to manage.',
      gets: ['Problem and scope clarification', 'Stakeholder and priority mapping', 'Bottleneck diagnosis', 'Risk and decision review', 'Workflow improvement roadmap'],
      cta: 'Book a Workflow Review',
      to: '/contact',
    },
    {
      title: 'Workflow System Setup',
      for: 'Teams ready to organize tasks, documents, communication, timelines, risks, reporting, and AI-supported work into a simple operating system.',
      problem: 'Work needs structure around ownership, deadlines, documentation, communication, risk tracking, human review, and recurring updates.',
      gets: ['Workflow map', 'Task ownership structure', 'Timeline and milestone setup', 'Risk and decision tracking', 'Communication and reporting routines', 'Human review checkpoints', 'Simple operating templates'],
      cta: 'Build a Workflow System',
      to: '/contact',
    },
    {
      title: 'Real Estate AI PM Pilot',
      for: 'Real estate professionals, brokers, operators, property managers, and small developers who want to improve one workflow before adding more tools or automation.',
      problem: 'Follow-ups, documents, property notes, vendors, client updates, transaction tasks, and reporting are often fragmented across email, texts, folders, spreadsheets, and memory.',
      gets: ['Workflow Diagnostic', 'Follow-Up Review', 'Document and Task Visibility', 'Bottleneck Analysis', 'AI + PM Improvement Plan', 'Prompt Pack', '7-Day Roadmap'],
      cta: 'Explore Real Estate Pilot',
      to: '/real-estate-ai-pm-pilot',
    },
  ];

  const servicesSupportItems = [
    'AI use mapping',
    'Scope clarity',
    'Stakeholder communication',
    'Task ownership',
    'Timeline planning',
    'Risk tracking',
    'Decision support',
    'Documentation',
    'Reporting',
    'SOP creation',
    'Follow-up routines',
    'Human review',
  ];

  const servicesBusinessExamples = [
    {
      title: 'Real estate professionals',
      challenge: 'Client communication, property details, transaction tasks, vendor coordination, and deal updates are fragmented across tools and conversations.',
      aiHelp: 'AI can summarize conversations, draft updates, organize deal tasks, and prepare client-ready communication for human review.',
      system: 'A transaction coordination workflow that converts notes into follow-ups, documents, reminders, and decision points.',
      output: 'Follow-up tracker, deal update template, prompt library, document checklist, weekly visibility report.',
    },
    {
      title: 'Contractors and renovation teams',
      challenge: 'Job details, site notes, estimate changes, materials, vendors, and client follow-up often live in texts, calls, photos, and memory.',
      aiHelp: 'AI can turn notes and photos into summaries, estimate explanations, task lists, and follow-up drafts.',
      system: 'A simple intake-to-estimate workflow with standard prompts, review steps, and assigned next actions.',
      output: 'Intake template, estimate explanation prompt, change request log, client update template, task tracker.',
    },
    {
      title: 'Local service businesses',
      challenge: 'New inquiries, scheduling, service notes, reviews, and repeat communication are handled inconsistently.',
      aiHelp: 'AI can standardize responses, summarize service history, draft updates, and create internal handoff notes.',
      system: 'A client request workflow from intake to service completion with templates for each recurring touchpoint.',
      output: 'Inquiry tracker, response templates, service note structure, review response prompts, follow-up routine.',
    },
    {
      title: 'Consultants and service professionals',
      challenge: 'Discovery notes, client recommendations, proposals, and status reports take too long to convert into clear outputs.',
      aiHelp: 'AI can structure insights, draft deliverables, prepare meeting summaries, and keep action items visible.',
      system: 'A consulting delivery workflow that turns meetings into decisions, tasks, summaries, and polished client materials.',
      output: 'Discovery summary template, proposal prompt, client report outline, action item tracker, decision log.',
    },
    {
      title: 'Small internal teams',
      challenge: 'Work is spread across email, chat, spreadsheets, project tools, and informal conversations.',
      aiHelp: 'AI can consolidate updates, clarify requests, draft internal documentation, and surface decisions that need attention.',
      system: 'A lightweight operating rhythm for requests, updates, decisions, and weekly visibility.',
      output: 'Weekly update template, request tracker, decision log, AI use log, review checklist.',
    },
  ];

  return (
    <>
      <PageIntro
        eyebrow="Services"
        title="Practical AI + Project Management systems for teams that need clarity, coordination, and control."
        text="Start with the work your business already does. Then clarify how AI is used, where workflows break, who owns the next step, what needs review, and what simple system should be created next."
      />
      <section className="section-shell services-hero-actions">
        <div className="hero-actions">
          <Link className="button primary" to="/contact">Start with an AI Use Review</Link>
          <Link className="button secondary" to="/contact">Book a Call</Link>
        </div>
      </section>

      <section className="section-shell service-detail-grid service-card-grid">
        <div className="section-header single-column-header services-section-title">
          <div>
            <div className="section-kicker">Services</div>
            <h2>Ways I can help</h2>
          </div>
        </div>
        {servicesPageServices.map((service) => (
          <article className="detail-card service-card" key={service.title}>
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
                  {service.gets.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            </div>
            <Link className="button secondary" to={service.to}>{service.cta}</Link>
          </article>
        ))}
      </section>

      <section className="section-shell ai-supported-pm-section">
        <div className="section-header single-column-header">
          <div>
            <div className="section-kicker">Practical support areas</div>
            <h2>What AI-supported PM can help with</h2>
          </div>
          <p>Use AI as support inside a managed workflow: clarify, plan, communicate, document, monitor, and review.</p>
        </div>
        <div className="pm-support-grid services-support-grid">
          {servicesSupportItems.map((item) => <article className="compact-card" key={item}>{item}</article>)}
        </div>
      </section>

      <section className="section-shell business-examples-section">
        <div className="section-header single-column-header">
          <div>
            <div className="section-kicker">Examples</div>
            <h2>Examples by business type</h2>
          </div>
        </div>
        <div className="use-case-detail-grid business-example-grid services-example-grid">
          {servicesBusinessExamples.map((useCase) => (
            <article className="detail-card" key={useCase.title}>
              <h3>{useCase.title}</h3>
              <div className="detail-stack three-column-text services-example-stack">
                <div>
                  <strong>Common workflow challenge</strong>
                  <p>{useCase.challenge}</p>
                </div>
                <div>
                  <strong>How AI can help</strong>
                  <p>{useCase.aiHelp}</p>
                </div>
                <div>
                  <strong>Simple system example</strong>
                  <p>{useCase.system}</p>
                </div>
                <div>
                  <strong>Operational output</strong>
                  <p>{useCase.output}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="cta section-shell services-final-cta">
        <div className="cta-panel final-funnel-cta">
          <p className="eyebrow">Start simple</p>
          <h2>Start with one workflow.</h2>
          <p>You do not need to automate everything. Start with one bottleneck, one workflow, and one practical next step.</p>
          <div className="hero-actions">
            <Link className="button primary light" to="/contact">Start with an AI Use Review</Link>
            <Link className="button secondary light-outline" to="/contact">Book a Call</Link>
          </div>
        </div>
      </section>
    </>
  );
}

function Resources() {
  const checklistItems = [
    'Where does the information enter?',
    'Who owns the next step?',
    'What output is needed?',
    'What can AI draft, summarize, classify, or structure?',
    'What must be reviewed by a human?',
    'Where is the final decision documented?',
    'What follow-up is required?',
    'What should never be entered into AI?',
  ];

  const aiUseMapFields = ['Team / role', 'AI tool used', 'Task or workflow', 'Input type', 'Output type', 'Risk level', 'Reviewer', 'Next action'];
  const aiUseMapExamples = [
    'Admin — Email draft — Client notes — Follow-up email — Manager review',
    'Broker — Property summary — Listing notes — Client update — Broker review',
    'Owner — Weekly report — Team updates — Priority list — Owner review',
  ];

  const promptTemplates = [
    {
      title: 'Client follow-up',
      prompt: 'Turn these notes into a clear client follow-up email with next steps, open questions, and a professional tone.',
    },
    {
      title: 'Owner or manager update',
      prompt: 'Summarize this project update for an owner who needs risks, decisions, deadlines, and next actions.',
    },
    {
      title: 'Task checklist',
      prompt: 'Create a checklist from this request so a team member can complete the work without another meeting.',
    },
    {
      title: 'Estimate or proposal explanation',
      prompt: 'Rewrite this estimate explanation so it is clear, direct, professional, and easy for a client to approve or question.',
    },
    {
      title: 'Human review',
      prompt: 'Review this AI-generated draft for missing context, unclear assumptions, sensitive data, and anything that should be checked before sending.',
    },
  ];

  const aiUseLogFields = ['Date', 'Tool', 'User / role', 'Workflow', 'Input type', 'Output created', 'Human reviewer', 'Final decision', 'Notes'];

  const commonMistakes = [
    'Automating a workflow no one has clearly defined.',
    'Letting every team member invent their own prompts and standards.',
    'Using AI for client-facing work without review.',
    'Uploading sensitive or confidential information without rules.',
    'Treating AI output as a decision instead of a draft.',
    'Buying another app when the real issue is ownership, handoffs, and follow-up.',
    'Creating summaries that do not become tasks, decisions, or next actions.',
  ];

  const workflowExamples = [
    {
      title: 'Client follow-up workflow',
      flow: 'Call notes → AI summary → human review → client email → assigned task → follow-up date',
    },
    {
      title: 'Real estate update workflow',
      flow: 'Property notes → client-ready summary → document checklist → next action → weekly deal update',
    },
    {
      title: 'Contractor or renovation workflow',
      flow: 'Site visit notes → estimate draft → internal review → client proposal → change request log',
    },
    {
      title: 'Small business workflow',
      flow: 'Client request → clarified scope → task checklist → owner assigned → status update',
    },
    {
      title: 'Internal team workflow',
      flow: 'Weekly updates → AI summary → risks and decisions → owner review → priority list',
    },
  ];

  const reviewReasons = [
    'Your team already uses AI but without a shared method.',
    'You do not know what data people enter into AI tools.',
    'You need standard prompts and review steps.',
    'Client communication takes too long.',
    'Follow-ups or documents are scattered.',
    'AI outputs are not connected to tasks or decisions.',
    'You want a simple 30-day action plan.',
  ];

  return (
    <>
      <PageIntro
        eyebrow="Free AI Workflow Resources"
        title="Practical starting points for using AI inside real business workflows."
        text="Before buying another tool or asking AI for more outputs, start by mapping the workflow, clarifying the next step, and deciding where human review is required."
      />
      <section className="section-shell resources-hero-actions">
        <div className="hero-actions">
          <a className="button primary" href="#ai-workflow-checklist">Start with the checklist</a>
          <Link className="button secondary" to="/contact">Book an AI Use Review</Link>
        </div>
      </section>

      <section className="section-shell resource-grid resources-starter-grid" id="ai-workflow-checklist">
        <article className="resource-card resources-wide-card">
          <p className="eyebrow">1. AI Workflow Checklist</p>
          <h2>Pick one workflow before picking another tool.</h2>
          <ul>
            {checklistItems.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </article>

        <article className="resource-card resources-wide-card">
          <p className="eyebrow">2. AI Use Map Starter</p>
          <h2>Before controlling AI, map where it is already being used.</h2>
          <p>An AI Use Map helps a team see who uses AI, for what task, with what input, what output is created, who reviews it, and what happens next.</p>
          <div className="resource-pill-grid">
            {aiUseMapFields.map((field) => <span key={field}>{field}</span>)}
          </div>
          <div className="resource-example-list">
            {aiUseMapExamples.map((example) => <p key={example}>{example}</p>)}
          </div>
        </article>
      </section>

      <section className="section-shell resources-section-block">
        <div className="section-header single-column-header">
          <div>
            <div className="section-kicker">3. Prompt Templates</div>
            <h2>Use prompts that connect AI output to a real workflow.</h2>
          </div>
        </div>
        <div className="resource-grid prompt-template-grid">
          {promptTemplates.map((template) => (
            <article className="resource-card" key={template.title}>
              <h2>{template.title}</h2>
              <p>{template.prompt}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell resource-grid resources-starter-grid">
        <article className="resource-card resources-wide-card">
          <p className="eyebrow">4. AI Use Log Starter</p>
          <h2>If AI supports business work, the use should leave a simple trace.</h2>
          <p>The goal is not bureaucracy. The goal is visibility: knowing how AI was used, what was reviewed, and what became part of the business process.</p>
          <div className="resource-pill-grid log-field-grid">
            {aiUseLogFields.map((field) => <span key={field}>{field}</span>)}
          </div>
        </article>

        <article className="resource-card resources-wide-card">
          <p className="eyebrow">5. Common AI Mistakes</p>
          <h2>Common AI Mistakes</h2>
          <ul>
            {commonMistakes.map((mistake) => <li key={mistake}>{mistake}</li>)}
          </ul>
        </article>
      </section>

      <section className="section-shell resources-section-block">
        <div className="section-header single-column-header">
          <div>
            <div className="section-kicker">6. Simple Workflow Examples</div>
            <h2>Simple Workflow Examples</h2>
          </div>
        </div>
        <div className="resource-grid workflow-example-grid">
          {workflowExamples.map((example) => (
            <article className="resource-card" key={example.title}>
              <h2>{example.title}</h2>
              <p>{example.flow}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell resources-review-section">
        <div className="resources-review-panel">
          <div>
            <p className="eyebrow">When to book a review</p>
            <h2>When to book an AI Use Review</h2>
            <p>These resources help you start. A review is useful when you want the workflow adapted to your actual business, team, documents, tools, risks, and follow-up process.</p>
            <div className="hero-actions">
              <Link className="button primary" to="/contact">Book an AI Use Review</Link>
              <Link className="button secondary" to="/services">Explore Services</Link>
            </div>
          </div>
          <ul>
            {reviewReasons.map((reason) => <li key={reason}>{reason}</li>)}
          </ul>
        </div>
      </section>

      <section className="cta section-shell resource-bottom-cta">
        <div className="cta-panel">
          <p className="eyebrow">Start simple</p>
          <h2>Start with one workflow.</h2>
          <p>Pick one workflow, map how information moves, decide where AI can help, and define who reviews the output before it becomes part of the work.</p>
          <Link className="button primary light" to="/contact">Book an AI Use Review</Link>
        </div>
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
  const focusAreas = [
    {
      title: 'AI Use Review',
      text: 'Mapping how AI is used, where risks exist, and what controls should be created.',
    },
    {
      title: 'Workflow Clarity',
      text: 'Turning scattered work into clear scope, owners, tasks, timelines, and follow-up.',
    },
    {
      title: 'Human-Reviewed AI Support',
      text: 'Using AI for drafts, summaries, prompts, reports, and documentation without removing human judgment.',
    },
    {
      title: 'Real Estate AI PM Pilot',
      text: 'Supporting real estate teams with follow-up, documents, vendors, client updates, and task visibility.',
    },
    {
      title: 'Tokenization Research',
      text: 'Ongoing research into real estate innovation, digital property infrastructure, and future ownership models.',
    },
  ];

  const backgroundItems = [
    'Civil engineering background',
    'Project Management graduate studies in the United States',
    'Business operations experience',
    'Hospitality and service management experience',
    'Real estate and tokenization research',
    'Practical AI workflow systems',
    'Human-reviewed implementation',
  ];

  return (
    <>
      <PageIntro
        eyebrow="About AI PM Lab"
        title="Practical AI + Project Management systems for teams that need clarity, structure, and control."
        text="AI PM Lab is led by Pietro Forestieri, a project management graduate student, engineering-trained operator, and practical AI systems builder focused on helping teams turn scattered work, AI use, documents, follow-ups, and decisions into simple systems people can actually use."
      />
      <section className="section-shell about-profile">
        <img src="https://i.ibb.co/nx5qk7T/Progetto-senza-titolo-3.png" alt="Pietro Forestieri, founder of AI PM Lab" />
        <div className="about-card">
          <div className="section-kicker">About Pietro</div>
          <h2>Pietro Forestieri</h2>
          <p className="profile-title">Founder / AI + Project Management Systems Consultant</p>
          <p>
            Pietro combines a civil engineering background, business operations experience, hospitality and service management exposure, real estate interest, and ongoing graduate study in Project Management in the United States.
          </p>
          <p>
            His work focuses on practical implementation: mapping workflows, clarifying ownership, organizing documents, creating prompt libraries, setting up AI use logs, and building human-reviewed systems that support real business execution.
          </p>
        </div>
      </section>

      <section className="section-shell about-focus-section">
        <div className="section-header single-column-header">
          <div>
            <div className="section-kicker">What I focus on</div>
            <h2>What I focus on</h2>
          </div>
        </div>
        <div className="help-card-grid about-focus-grid">
          {focusAreas.map((area) => (
            <article className="detail-card help-card" key={area.title}>
              <h3>{area.title}</h3>
              <p>{area.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell about-support-note">
        <div className="about-card">
          <div className="section-kicker">Practical support</div>
          <h2>Practical support, not empty AI hype.</h2>
          <p>
            AI PM Lab does not replace legal, HR, IT, compliance, or certified training providers. The focus is practical implementation: helping teams document how AI is used, improve workflows, create review steps, and prepare clearer materials that can be shared with internal or external advisors when needed.
          </p>
        </div>
      </section>

      <section className="section-shell about-profile about-learning-section">
        <div className="about-card">
          <div className="section-kicker">Continuous learning</div>
          <h2>Continuous learning</h2>
          <p>
            Pietro continues to study project management, responsible AI use, generative AI workflows, business analysis, and practical implementation through graduate coursework, PMI-related learning, professional certificates, and hands-on system building.
          </p>
        </div>
        <div className="about-card">
          <div className="section-kicker">Background</div>
          <h2>Background</h2>
          <ul className="credential-list">
            {backgroundItems.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      </section>

      <section className="cta section-shell about-final-cta">
        <div className="cta-panel final-funnel-cta">
          <p className="eyebrow">Start simple</p>
          <h2>Want to make your workflow clearer?</h2>
          <p>Start with one workflow, one bottleneck, and one practical next step.</p>
          <div className="hero-actions">
            <Link className="button primary light" to="/contact">Book an AI Use Review</Link>
            <Link className="button secondary light-outline" to="/contact">Contact Pietro</Link>
          </div>
        </div>
      </section>
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
          <Route path="/contact" element={<Contact />} />
          <Route path="/real-estate-ai-pm-pilot" element={<RealEstateAIPMPilot />} />
        </Routes>
      </main>
      <SiteFooter />
    </BrowserRouter>
  );
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element #root was not found.');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
