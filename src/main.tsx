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
const sectorCards = [
  {
    title: 'Real Estate Teams',
    copy: 'Lead follow-up, client updates, property documents, vendors, transaction tasks.',
    cta: 'Explore Real Estate Pilot',
    to: '/real-estate-ai-pm-pilot',
  },
  {
    title: 'Events & Nonprofits',
    copy: 'Fundraising events, stakeholder communication, budgets, timelines, sponsors, volunteers, post-event reporting.',
    cta: 'View Services',
    to: '/services',
  },
  {
    title: 'Contractors & Renovation Teams',
    copy: 'Estimates, site notes, change requests, vendors, materials, timelines, client updates.',
    cta: 'View Services',
    to: '/services',
  },
  {
    title: 'Consultants & Service Professionals',
    copy: 'Discovery calls, proposals, recommendations, project plans, client deliverables, reports.',
    cta: 'View Services',
    to: '/services',
  },
  {
    title: 'Small Business Owners',
    copy: 'Internal operations, recurring tasks, documents, follow-ups, team coordination, weekly priorities.',
    cta: 'Book a Review',
    href: calendlyLink,
  },
  {
    title: 'Founders & Operators',
    copy: 'Ideas, business models, launch plans, roadmaps, risks, decisions, and execution systems.',
    cta: 'Book a Call',
    href: calendlyLink,
  },
];

const issueCards = [
  'Follow-ups are hard to track',
  'Documents are spread across tools',
  'Notes do not become next steps',
  'Tasks are not clearly owned',
  'Client updates take too long',
  'AI is used inconsistently',
];

const workflowSteps = [
  'Client message',
  'AI support / documentation',
  'Human review',
  'Next action',
  'Owner assigned',
  'Follow-up tracked',
];

const helpCards = [
  {
    title: 'Organize the Workflow',
    text: 'Clarify how information enters the business, who owns the next step, where documents live, and how follow-up is tracked.',
    button: 'View Services',
    to: '/services',
  },
  {
    title: 'Add Practical AI Support',
    text: 'Use AI to support planning, documentation, reporting, communication, and decision support without removing human review or accountability.',
    button: 'View Resources',
    to: '/resources',
  },
  {
    title: 'Build Simple Operating Systems',
    text: 'Create repeatable routines for client communication, internal updates, tasks, documents, and weekly visibility.',
    button: 'Book a Call',
    href: calendlyLink,
  },
];

const pilotExamples = [
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
            <p className="hero-eyebrow-pill">Practical AI Systems</p>
            <h1>AI + Project Management Systems for Small Businesses and Project-Based Teams</h1>
            <p className="hero-lede">
              I help owners, operators, and small teams turn ideas, client work, events, operations, and business workflows into structured projects with clear scope, tasks, timelines, risks, documents, communication, and AI-supported execution.
            </p>
            <div className="hero-actions premium-hero-actions">
              <CTAButton>Book a 15-Minute Review</CTAButton>
              <Link className="button secondary" to="/services">Explore What I Do</Link>
              <Link className="button pilot-link" to="/real-estate-ai-pm-pilot">Real Estate AI PM Pilot</Link>
            </div>
            <p className="trust-line">Not just automation. Project structure, decision support, documentation, and practical delivery systems.</p>
            <div className="hero-proof-row" aria-label="Practical focus areas">
              <span>Follow-up</span>
              <span>Documents</span>
              <span>Tasks</span>
              <span>Decisions</span>
            </div>
            <p className="trust-line">Start with the workflow. Add AI only where it makes the work clearer, faster, or easier to manage.</p>
            <div className="hero-proof-row" aria-label="Practical focus areas">
              <span>Follow-up</span>
              <span>Documents</span>
              <span>Tasks</span>
              <span>Decisions</span>
            </div>
            <p className="trust-line">Start with the workflow. Add AI only where it makes the work clearer, faster, or easier to manage.</p>
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
              <strong>From unclear work to structured project control.</strong>
              <span>Scope, priorities, ownership, risks, timelines, communication, and human-reviewed AI outputs in one practical operating layer.</span>
            </div>
            <div className="execution-framework-grid">
              <div className="execution-node"><span>01</span><strong>Intake / Problem</strong><p>Requests, constraints, context, and the real issue to solve</p></div>
              <div className="execution-node"><span>02</span><strong>Scope / Priorities</strong><p>What matters, what is out of scope, and what comes first</p></div>
              <div className="execution-node"><span>03</span><strong>Owners / Timeline</strong><p>Accountability, milestones, handoffs, and due dates</p></div>
              <div className="execution-node"><span>04</span><strong>Risks / Decisions</strong><p>Open questions, tradeoffs, blockers, and decision points</p></div>
              <div className="execution-node"><span>05</span><strong>AI Support / Documentation</strong><p>Drafts, summaries, reports, SOPs, and project records</p></div>
              <div className="execution-node"><span>06</span><strong>Review / Delivery</strong><p>Human-reviewed outputs, follow-up, monitoring, and delivery</p></div>
            </div>
            <div className="execution-outcome-bar">
              <span>Scope clarity</span>
              <span>Decision support</span>
              <span>Delivery control</span>
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
      <section className="section-shell beyond-automation-section">
        <div className="beyond-automation-panel">
          <div>
            <p className="eyebrow">How this is different</p>
            <h2>More than prompts. More than automation.</h2>
          </div>
          <p>
            We help businesses clarify workflows, define ownership, improve coordination, strengthen follow-up, structure recurring work, identify risks, improve reporting, and introduce AI in a practical, controlled way. The goal is not to replace management. The goal is to strengthen project clarity, decisions, and delivery.
          </p>
        </div>
      </section>

      <section className="section-shell funnel-section">
        <div className="section-header single-column-header">
          <div>
            <div className="section-kicker">Who this is for</div>
            <h2>Who this is for</h2>
          </div>
        </div>
        <div className="audience-grid sector-grid">
          {sectorCards.map((sector) => (
            <article className="compact-card sector-card" key={sector.title}>
              <h3>{sector.title}</h3>
              <p>{sector.copy}</p>
              {sector.to ? (
                <Link className="text-link" to={sector.to}>{sector.cta}</Link>
              ) : (
                <a className="text-link" href={sector.href} target="_blank" rel="noreferrer">{sector.cta}</a>
              )}
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
            <h2>AI is useful only when the workflow is clear.</h2>
          </div>
          <div className="copy-stack">
            <p>
              Many businesses are already using tools like ChatGPT or Claude, but the results often stay separate from
              the real work. A summary does not help if no one owns the next step. A draft does not help if there is no
              review process. A checklist does not help if it is not connected to a deadline, a client update, or a team routine.
            </p>
          </div>
        </div>
        <div className="issue-grid">
          {problemBullets.map((issue) => <article className="compact-card issue-card" key={issue}>{issue}</article>)}
          {issueCards.map((issue) => <article className="compact-card issue-card" key={issue}>{issue}</article>)}
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
            <div className="section-kicker">Simple process</div>
            <h2>From scattered information to clear next actions.</h2>
          </div>
          <p>The goal is not to automate everything. The goal is to create a simple path from information to decision, task, and follow-up.</p>
        </div>
        <div className="workflow-step-grid">
          {workflowSteps.map((step, index) => (
            <article className="workflow-step-card" key={step}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{step}</strong>
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
      <section className="solution section-shell">
        <div className="section-header single-column-header">
          <div>
            <div className="section-kicker">How I can help</div>
            <h2>Practical support for the work your business already does.</h2>
          </div>
        </div>
        <div className="help-card-grid">
          {helpCards.map((card) => (
            <article className="detail-card help-card" key={card.title}>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
              {card.to ? <Link className="button secondary" to={card.to}>{card.button}</Link> : <a className="button secondary" href={card.href} target="_blank" rel="noreferrer">{card.button}</a>}
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
          <p>A focused pilot for real estate professionals who want to organize one workflow: leads, follow-up, documents, vendors, client updates, tasks, or weekly visibility.</p>
          <Link className="button primary" to="/real-estate-ai-pm-pilot">Apply for the Free Pilot</Link>
        </div>
        <ul className="pilot-example-list">
          {pilotExamples.map((example) => <li key={example}>{example}</li>)}
        </ul>
      </section>

      <section className="section-shell resources-highlight">
        <div>
          <p className="eyebrow">Free resources</p>
          <h2>Free Workflow Resources</h2>
          <p>Start with practical examples, checklist questions, prompt templates, and simple workflow structures before changing your tools.</p>
          <Link className="button secondary" to="/resources">View Free Resources</Link>
        </div>
        <ul>
          {freeResourceBullets.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </section>

      <section className="section-shell related-work-section">
        <div className="section-header single-column-header">
          <div>
            <div className="section-kicker">Related work</div>
            <h2>Explore Related Work</h2>
          </div>
        </div>
        <div className="related-work-grid">
          <article className="detail-card">
            <h3>PropertyDEX</h3>
            <p>Research and development around real estate innovation, digital property infrastructure, and future ownership models.</p>
            <a className="button secondary" href="https://propertydex.xyz" target="_blank" rel="noreferrer">Visit PropertyDEX</a>
          </article>
          <article className="detail-card">
            <h3>PropertyDEX Framework</h3>
            <p>A decision-support framework for analyzing real estate project readiness, documentation, structure, and execution complexity.</p>
            <a className="button secondary" href="https://framework.propertydex.xyz" target="_blank" rel="noreferrer">Explore Framework</a>
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
  return (
    <>
      <PageIntro
        eyebrow="Services"
        title="Practical project systems for owners who want clarity, coordination, and control."
        text="Start with the work your business already does. Then clarify scope, priorities, ownership, timelines, communication, risks, and where AI can support delivery."
      />
      <section className="section-shell service-detail-grid service-card-grid">
        {serviceBlocks.map((service) => (
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
            <CTAButton>Book a Call</CTAButton>
          </article>
        ))}
      </section>

      <section className="section-shell ai-supported-pm-section">
        <div className="section-header single-column-header">
          <div>
            <div className="section-kicker">Practical support areas</div>
            <h2>What AI-supported PM can help with</h2>
          </div>
          <p>Use AI as support inside a managed project or operations system: clarify, plan, communicate, document, monitor, and review.</p>
        </div>
        <div className="pm-support-grid">
          {aiSupportedPmCards.map((item) => <article className="compact-card" key={item}>{item}</article>)}
        </div>
      </section>

      <section className="section-shell business-examples-section">
        <div className="section-header single-column-header">
          <div>
            <div className="section-kicker">Examples</div>
            <h2>Examples by Business Type</h2>
          </div>
        </div>
        <div className="use-case-detail-grid business-example-grid">
          {useCaseDetails.map((useCase) => (
            <article className="detail-card" key={useCase.title}>
              <h3>{useCase.title}</h3>
              <div className="detail-stack three-column-text">
                <div>
                  <strong>Common workflow challenge</strong>
                  <p>{useCase.problem}</p>
                </div>
                <div>
                  <strong>How AI can help</strong>
                  <p>{useCase.help}</p>
                </div>
                <div>
                  <strong>Simple system example</strong>
                  <p>{useCase.system}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function Resources() {
  return (
    <>
      <PageIntro
        eyebrow="Resources"
        title="Free Workflow Resources"
        text="Useful starting points for applying AI to real business workflows before buying another tool."
      />
      <section className="section-shell resource-grid">
        {resourceSections.map((section) => (
          <article className="resource-card" key={section.title}>
            <h2>{section.title}</h2>
            <ul>
              {section.points.map((point) => <li key={point}>{point}</li>)}
            </ul>
          </article>
        ))}
      </section>
      <section className="cta section-shell resource-bottom-cta">
        <div className="cta-panel">
          <p className="eyebrow">Apply this to your work</p>
          <h2>Want this adapted to your business?</h2>
          <CTAButton light>Book a 15-Minute Review</CTAButton>
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
  return (
    <>
      <PageIntro
        eyebrow="About"
        title="Practical systems for business owners who need clarity, not buzzwords."
        text="Practical AI Systems is led by Peter, a practical AI systems consultant focused on turning complex ideas, scattered information, and recurring business work into simple systems people can actually use."
      />
      <section className="section-shell about-profile">
        <img src="https://i.ibb.co/nx5qk7T/Progetto-senza-titolo-3.png" alt="Peter, founder of Practical AI Systems" />
        <div className="about-card">
          <div className="section-kicker">Founder profile</div>
          <h2>Peter</h2>
          <p className="profile-title">Founder / Practical AI Systems Consultant</p>
          <p>
            Peter is an engineer by background and a builder by instinct. With experience across civil engineering,
            construction, real estate coordination, digital ventures, and business operations, he focuses on turning
            complex ideas into practical systems.
          </p>
          <p>
            Through Practical AI Systems, Peter helps small businesses use tools like ChatGPT and Claude in a structured,
            useful way: not as random tools, but as part of real business operations.
          </p>
          <p className="soft-related-note">
            Peter has also explored emerging digital business models and real estate innovation since 2017, including
            blockchain-based real estate concepts and decision-support tools.
          </p>
          <ul className="credential-list">
            <li>Civil engineering background</li>
            <li>Construction and real estate experience</li>
            <li>Business operations experience</li>
            <li>Practical AI systems</li>
            <li>Workflow clarity</li>
            <li>Human-reviewed implementation</li>
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
          <Route path="/contact" element={<Contact />} />
          <Route path="/real-estate-ai-pm-pilot" element={<RealEstateAIPMPilot />} />
        </Routes>
      </main>
      <SiteFooter />
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
