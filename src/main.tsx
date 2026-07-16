import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Link, NavLink, Route, Routes } from 'react-router-dom';
import { Contact } from './pages/Contact';
import { RealEstateAIPMPilot } from './pages/RealEstateAIPMPilot';
import { Resources } from './pages/Resources';
import { Library } from './pages/Library';
import { ResourceLibraryPrivacyNotice } from './pages/ResourceLibraryPrivacyNotice';
import { AuthProvider } from './auth/AuthProvider';
import './styles.css';

const calendlyLink = 'https://calendly.com/propertydext/15min';
const brandLogoUrl = 'https://i.ibb.co/4npftkCv/Logo-AI-PM-LAB-by-Trigosatconsulting.png';

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
  { label: 'Library', to: '/library' },
  { label: 'Real Estate Copilot', to: '/real-estate-ai-pm-pilot' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];


function trackClick(eventName: string, label: string) {
  const maybeWindow = window as typeof window & { gtag?: (...args: unknown[]) => void };
  maybeWindow.gtag?.('event', eventName, { event_category: 'engagement', event_label: label });
}

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
      <Link className="brand" to="/" aria-label="AI PM LAB by Trigosat Consulting home" onClick={() => setIsMenuOpen(false)}>
        <img className="brand-logo" src={brandLogoUrl} alt="AI PM LAB by Trigosat Consulting" />
        <span className="brand-text">
          <strong>AI PM LAB</strong>
          <span>by Trigosat Consulting</span>
        </span>
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
      <a className="nav-cta" href={calendlyLink} target="_blank" rel="noreferrer" onClick={() => trackClick('cta_click', 'Header free call')}>
        Book a Free Call
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
        <div className="site-footer-brand-block">
          <img className="site-footer-logo" src={brandLogoUrl} alt="AI PM LAB by Trigosat Consulting" />
          <div>
            <p className="site-footer-brand">AI PM LAB</p>
            <p className="site-footer-subbrand">by Trigosat Consulting</p>
            <p>AI + project workflow systems for real operations.</p>
          </div>
        </div>
        <div>
          <p className="site-footer-title">Contact</p>
          <p><a href="mailto:trigosatconsulting@gmail.com">trigosatconsulting@gmail.com</a></p>
          <p><a href={calendlyLink} target="_blank" rel="noreferrer">Book a Free Workflow Clarity Call</a></p>
          <p><a href="https://www.instagram.com/peter_forestieri/" target="_blank" rel="noreferrer" onClick={() => trackClick('footer_social_click', 'Instagram footer')}>@peter_forestieri</a></p>
        </div>
        <div>
          <p className="site-footer-title">Navigation</p>
          {navItems.map((item) => (
            <p key={item.to}><Link to={item.to}>{item.label}</Link></p>
          ))}
          <p><a href="https://propertydex.xyz" target="_blank" rel="noreferrer">PropertyDEX related research</a></p>
        </div>
      </div>
    </footer>
  );
}


const homeProblemCards = [
  {
    title: 'Everyone prompts differently',
    copy: 'The same task produces different answers depending on who opens the chat, what context they remember, and how they write the request.',
  },
  {
    title: 'Outputs look finished before they are verified',
    copy: 'AI can produce professional-looking work that is incomplete, inaccurate, or not ready to use.',
  },
  {
    title: 'No one owns the next action',
    copy: 'AI creates the draft, but no one has clearly defined who reviews it, decides, communicates, or follows up.',
  },
  {
    title: 'Work still lives in email, spreadsheets, and memory',
    copy: 'The tool may be faster while the overall process remains fragmented.',
  },
];

const systemProgression = [
  { stage: 'Recurring Task', copy: 'What needs to happen repeatedly?' },
  { stage: 'Workflow', copy: 'What information, steps, and people are involved?' },
  { stage: 'Project Control', copy: 'Who owns the work, what must be reviewed, and what decisions or risks need attention?' },
  { stage: 'Working System', copy: 'What prompts, templates, trackers, documents, and routines make the process repeatable?' },
  { stage: 'Scale', copy: 'What can be extended to the next workflow, project, or team?' },
];

const beforeItems = ['Random prompts', 'Different output every time', 'No clear reviewer', 'Tasks lost in chats', 'AI used individually', '“It saves time”'];
const afterItems = ['Reusable work instructions', 'Defined format and quality criteria', 'Named human reviewer and approval point', 'Documented handoff and next action', 'Shared workflow', 'Measurable operational improvement'];

const consultingPhases = [
  {
    number: '00',
    label: 'FREE WORKFLOW CLARITY CALL',
    title: 'Find the right activity and understand the wider problem.',
    copy: 'We review one recurring activity, how it currently works, where it breaks, and what other people, documents, decisions, or follow-ups depend on it.',
    resultLabel: 'YOU LEAVE WITH',
    result: 'Fit assessment, priority workflow, and recommended next step',
    note: 'Free and without obligation to continue.',
  },
  {
    number: '01',
    label: 'FOCUS',
    title: 'Choose the activity that can create the most useful improvement.',
    copy: 'We identify the recurring activity where lost time, unclear information, inconsistent outputs, or missed follow-up create the greatest operational impact.',
    resultLabel: 'YOU RECEIVE',
    result: 'Priority Workflow Brief',
  },
  {
    number: '02',
    label: 'MAP',
    title: 'Connect the activity to the complete project around it.',
    copy: 'We map inputs, people, responsibilities, documents, decisions, dependencies, risks, handoffs, and next actions.',
    resultLabel: 'YOU RECEIVE',
    result: 'Current-State Workflow Map and Project Context',
  },
  {
    number: '03',
    label: 'DESIGN',
    title: 'Define how the work should operate from start to finish.',
    copy: 'We establish clear steps, ownership, completion criteria, review points, communication needs, and where AI can provide practical support.',
    resultLabel: 'YOU RECEIVE',
    result: 'Future-State Workflow Blueprint and Ownership Structure',
  },
  {
    number: '04',
    label: 'BUILD AND TEST',
    title: 'Create the system and use it on real work.',
    copy: 'We build the prompts, templates, tracker, document structure, SOP, communication routine, or review checklist needed for the workflow. Then we test and correct it.',
    resultLabel: 'YOU RECEIVE',
    result: 'Tested Workflow Prototype and Human Review Process',
  },
  {
    number: '05',
    label: 'INTEGRATE AND SCALE',
    title: 'Put the system into the project and prepare the next expansion.',
    copy: 'We document the process, define measures, connect it to related project activities, and identify what workflow should be improved next.',
    resultLabel: 'YOU RECEIVE',
    result: 'Working Project System and 30-Day Scale Plan',
  },
];

const deliverables = [
  { title: 'Current-State Workflow Map', copy: 'See how the activity currently works and where time, information, responsibility, or follow-up is lost.' },
  { title: 'Project Context Map', copy: 'Connect the workflow to stakeholders, documents, decisions, risks, dependencies, and related project activities.' },
  { title: 'Future-State Workflow Blueprint', copy: 'Define how the work should operate, who owns each step, and what “complete” means.' },
  { title: 'Prompt and Template System', copy: 'Use repeatable instructions and structured inputs instead of rebuilding the same work every time.' },
  { title: 'Tracker, SOP, or Document Structure', copy: 'Keep tasks, decisions, status, handoffs, and follow-ups visible.' },
  { title: 'Human Review and Approval Process', copy: 'Make clear what must be checked, who is responsible, and what decisions remain human.' },
];

const copilotOutputs = ['Workflow diagnosis', 'Main bottleneck', 'Recommended priority', 'First practical improvement', 'Suggested tracker or process structure', 'Initial AI prompt support', 'Seven-day roadmap', 'Option to request human review'];

const audienceBlocks = [
  { title: 'Small businesses and service professionals', copy: 'When client communication, documents, follow-up, and internal tasks depend on a few people doing everything.' },
  { title: 'Project-based teams', copy: 'When updates, risks, decisions, handoffs, and responsibilities need greater visibility.' },
  { title: 'Operations and administrative teams', copy: 'When recurring work is spread across email, spreadsheets, shared files, and personal memory.' },
  { title: 'Real estate professionals', copy: 'When client follow-up, documents, vendors, property tasks, and transaction activity need a clearer process.' },
];

const approachPrinciples = [
  { title: 'Start with one real activity', copy: 'Do not redesign the whole business before proving value on one recurring part of the work.' },
  { title: 'Connect the wider project', copy: 'Map the people, documents, decisions, risks, responsibilities, and next actions that depend on the activity.' },
  { title: 'Add AI only where it helps', copy: 'AI should improve clarity, speed, documentation, analysis, or consistency—not create another disconnected tool.' },
  { title: 'Keep decisions human', copy: 'People remain responsible for approval, communication, commitments, and consequences.' },
];

function Home() {
  return (
    <>
      <section className="home-hero section-shell">
        <div className="home-hero-grid">
          <div className="home-hero-copy">
            <p className="eyebrow">1:1 AI + PROJECT WORKFLOW CONSULTING</p>
            <h1>Stop experimenting with AI.<span>Start with one real task—and build the system around it.</span></h1>
            <div className="home-hero-body">
              <p>Your team may already use ChatGPT, Claude, Copilot, or other AI tools. But the work around them is still fragmented: inputs change, outputs are inconsistent, ownership is unclear, and follow-up depends on email, spreadsheets, or memory.</p>
              <p>AI PM LAB starts with one recurring activity, maps the people, decisions, documents, risks, and handoffs around it, and turns it into a clear, repeatable, human-controlled project workflow.</p>
            </div>
            <div className="hero-actions home-hero-actions">
              <a className="button primary" href={calendlyLink} target="_blank" rel="noreferrer" onClick={() => trackClick('cta_click', 'Hero free workflow clarity call')}>Book a Free Workflow Clarity Call</a>
              <Link className="button secondary" to="/real-estate-ai-pm-pilot" onClick={() => trackClick('cta_click', 'Hero workflow copilot')}>Try the Free Workflow Copilot</Link>
            </div>
            <p className="home-trust-line">One real task. One connected workflow. A system designed to scale.</p>
            <p className="home-brand-line">AI PM LAB by Trigosat Consulting</p>
          </div>

          <aside className="home-hero-visual" aria-label="Task to workflow to project system to scale visual">
            {['TASK', 'WORKFLOW', 'PROJECT SYSTEM', 'SCALE'].map((item, index) => (
              <div className="hero-flow-step" key={item}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{item}</strong>
              </div>
            ))}
          </aside>
        </div>
      </section>

      <section className="home-section section-shell">
        <div className="home-section-heading">
          <p className="eyebrow">THE REAL PROBLEM</p>
          <h2>AI is not the problem.<span>The workflow around it is.</span></h2>
        </div>
        <div className="home-problem-grid">
          {homeProblemCards.map((card) => (
            <article className="home-card" key={card.title}>
              <h3>{card.title}</h3>
              <p>{card.copy}</p>
            </article>
          ))}
        </div>
        <p className="home-section-close">More tools will not fix an unclear process.</p>
      </section>

      <section className="home-section section-shell home-system-section">
        <div className="home-section-heading wide-heading">
          <p className="eyebrow">FROM ONE TASK TO A COMPLETE SYSTEM</p>
          <h2>One recurring activity can reveal the entire project around it.</h2>
          <p>A follow-up email is rarely just an email. It may depend on meeting notes, client information, an approval, a decision, an assigned owner, a deadline, and a future action.</p>
          <p>That is why AI PM LAB does not improve isolated outputs. We use one recurring activity to uncover and organize the wider project system.</p>
        </div>
        <div className="system-progression" aria-label="Recurring task to scalable project system progression">
          {systemProgression.map((stage, index) => (
            <article className="system-stage" key={stage.stage}>
              <span>{index + 1}</span>
              <h3>{stage.stage}</h3>
              <p>{stage.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section section-shell">
        <div className="home-section-heading">
          <p className="eyebrow">WHAT CHANGES</p>
          <h2>From scattered AI use to a working project system.</h2>
        </div>
        <div className="comparison-grid">
          <article className="comparison-card before-card">
            <h3>Before</h3>
            <ul>{beforeItems.map((item) => <li key={item}>{item}</li>)}</ul>
          </article>
          <article className="comparison-card after-card">
            <h3>After</h3>
            <ul>{afterItems.map((item) => <li key={item}>{item}</li>)}</ul>
          </article>
        </div>
        <p className="home-section-close">The goal is not to automate everything. The goal is to make one recurring activity clearer, connect it to the wider project, and create a system that can be repeated and improved.</p>
      </section>

      <section className="consulting-journey">
        <div className="section-shell">
          <div className="journey-heading">
            <p className="eyebrow">THE 1:1 CONSULTING JOURNEY</p>
            <h2>One free call.<span>Five phases.</span>Your project system takes shape.</h2>
            <p>These are not generic AI lessons. Each phase advances a real workflow inside your business or project.</p>
            <p>We begin with one recurring activity, connect it to the wider project, build the necessary system, test it on real work, and prepare it for continued use.</p>
            <p className="journey-note">The number of working sessions may vary depending on complexity. The phases and expected outcomes remain clear.</p>
          </div>
          <div className="journey-timeline">
            {consultingPhases.map((phase) => (
              <article className={phase.number === '00' ? 'journey-card free-call-card' : 'journey-card'} key={phase.number}>
                <div className="phase-number">{phase.number}</div>
                <div className="phase-main">
                  <p className="phase-label">{phase.label}</p>
                  <h3>{phase.title}</h3>
                  <p>{phase.copy}</p>
                  {phase.note ? <p className="phase-note">{phase.note}</p> : null}
                </div>
                <div className="phase-result">
                  <span>{phase.resultLabel}</span>
                  <strong>{phase.result}</strong>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section section-shell">
        <div className="home-section-heading">
          <p className="eyebrow">WHAT YOU RECEIVE</p>
          <h2>Not an isolated AI output.<span>A connected project workflow.</span></h2>
        </div>
        <div className="deliverable-grid home-deliverable-grid">
          {deliverables.map((item) => (
            <article className="deliverable-card home-deliverable-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
            </article>
          ))}
          <article className="deliverable-card home-deliverable-card scale-plan-card">
            <h3>30-Day Implementation and Scale Plan</h3>
            <p>Know what to launch first, what to measure, and which connected workflow should be improved next.</p>
          </article>
        </div>
        <p className="home-deliverable-note">Depending on the workflow, the package may also include an AI Use Map, AI Use Log, risk checklist, decision log, communication template, or reporting structure.</p>
      </section>

      <section className="home-section section-shell copilot-section">
        <div className="copilot-copy">
          <p className="eyebrow">FREE INTERACTIVE WORKFLOW DIAGNOSTIC</p>
          <h2>See what one clearer workflow could change.</h2>
          <p>Select your role, recurring activity, current tools, and main bottleneck. The AI PM Workflow Copilot generates a preliminary workflow snapshot, recommended priority, first practical fix, and suggested next step.</p>
          <p>Most questions use simple selections, so you do not need to prepare a long project brief.</p>
          <h3>Your preliminary result may include:</h3>
          <ul className="copilot-output-list">{copilotOutputs.map((item) => <li key={item}>{item}</li>)}</ul>
          <Link className="button primary" to="/real-estate-ai-pm-pilot" onClick={() => trackClick('cta_click', 'Workflow copilot section')}>Try the Free Workflow Copilot</Link>
          <p className="copilot-note">The current Copilot was first developed through the Real Estate AI PM Pilot. The preliminary result is AI-generated and does not replace the human-reviewed 1:1 consulting engagement.</p>
        </div>
        <aside className="copilot-preview" aria-label="Illustrative workflow copilot preview">
          <p className="card-topline">Sample workflow snapshot</p>
          <div><span>Role</span><strong>Operations lead</strong></div>
          <div><span>Recurring activity</span><strong>Client follow-up</strong></div>
          <div><span>Main bottleneck</span><strong>Unclear next action</strong></div>
          <div><span>Suggested first fix</span><strong>Define owner, review step, and follow-up tracker</strong></div>
        </aside>
      </section>

      <section className="home-section section-shell">
        <div className="home-section-heading">
          <p className="eyebrow">WHO THIS IS FOR</p>
          <h2>For small teams where the work is real, repeated, and difficult to track.</h2>
        </div>
        <div className="audience-grid home-audience-grid">
          {audienceBlocks.map((audience) => (
            <article className="compact-card sector-card" key={audience.title}>
              <h3>{audience.title}</h3>
              <p>{audience.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section section-shell real-work-section">
        <div className="home-section-heading">
          <p className="eyebrow">BUILT AROUND REAL WORK</p>
          <h2>Frameworks, tools, and workflows designed to be used.</h2>
        </div>
        <div className="real-work-grid">
          <article className="home-card real-work-card primary-work-card">
            <h3>AI PM LAB Resource Library</h3>
            <p>Practical prompt frameworks, communication toolkits, decision guides, and human-review checklists for everyday professional work.</p>
            <Link className="button secondary" to="/resources" onClick={() => trackClick('cta_click', 'Resource library CTA')}>Explore Free Resources</Link>
          </article>
          <article className="home-card real-work-card primary-work-card">
            <h3>Real Estate AI PM Pilot</h3>
            <p>An applied AI + Project Management case study for client follow-up, documentation, vendor coordination, task ownership, and operational visibility.</p>
            <Link className="button secondary" to="/real-estate-ai-pm-pilot">Explore the Real Estate Pilot</Link>
          </article>
          <article className="home-card real-work-card research-card">
            <p className="card-topline">RELATED PROPTECH RESEARCH</p>
            <h3>PropertyDEX</h3>
            <p>A separate research initiative exploring real estate innovation, tokenization, stakeholder roles, governance, and emerging digital ownership models.</p>
            <a className="text-link" href="https://propertydex.xyz" target="_blank" rel="noreferrer">Visit PropertyDEX →</a>
          </article>
        </div>
      </section>

      <section className="home-section section-shell approach-section">
        <div className="approach-copy">
          <p className="eyebrow">THE APPROACH</p>
          <h2>Practical before impressive.<span>Human control by design.</span></h2>
          <div className="principle-grid">
            {approachPrinciples.map((principle) => (
              <article className="home-card principle-card" key={principle.title}>
                <h3>{principle.title}</h3>
                <p>{principle.copy}</p>
              </article>
            ))}
          </div>
        </div>
        <aside className="founder-card">
          <img src={brandLogoUrl} alt="AI PM LAB by Trigosat Consulting" />
          <p>AI PM LAB is led by Peter Forestieri, combining an engineering background, business operations experience, and graduate-level project management training in the United States.</p>
          <p>AI PM LAB is a Trigosat Consulting initiative.</p>
        </aside>
      </section>

      <section className="section-shell home-final-cta-section">
        <div className="home-final-cta-panel">
          <p className="eyebrow">START SIMPLE</p>
          <h2>Bring one recurring activity.<span>Build the project system around it.</span></h2>
          <p>During the free Workflow Clarity Call, we identify where the work breaks, what depends on it, and whether a practical 1:1 engagement can turn it into a clearer, repeatable, human-controlled project workflow.</p>
          <div className="hero-actions">
            <a className="button primary light" href={calendlyLink} target="_blank" rel="noreferrer" onClick={() => trackClick('cta_click', 'Final free workflow clarity call')}>Book a Free Workflow Clarity Call</a>
            <Link className="button secondary light-outline" to="/real-estate-ai-pm-pilot">Try the Free Workflow Copilot</Link>
          </div>
          <p className="final-cta-note">No obligation. No full-business redesign. Start with one real activity and build from evidence.</p>
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

const aboutShapedApproach = [
  {
    title: 'Engineering mindset',
    copy: 'My engineering background taught me to look at systems, constraints, dependencies, risks, and the relationship between individual parts and the larger outcome.',
  },
  {
    title: 'Operational experience',
    copy: 'My work in business operations, administration, hospitality, and service environments showed me how much real work depends on emails, documents, payments, deadlines, vendors, handoffs, and repeated follow-up.',
  },
  {
    title: 'Project management structure',
    copy: 'Through the Master of Science in Project Management I am currently pursuing at Harrisburg University, I have strengthened the way I approach scope, ownership, stakeholders, risk, communication, decisions, and completion criteria.',
  },
  {
    title: 'Applied AI',
    copy: 'I use AI as a support layer for drafting, analysis, organization, documentation, and decision preparation. I do not treat it as a replacement for professional judgment or accountability.',
  },
];

const aboutMethodSteps = [
  {
    step: '01',
    title: 'Understand the real work',
    copy: 'I begin with one recurring activity, the people involved, the current process, and the points where time, information, or responsibility are being lost.',
  },
  {
    step: '02',
    title: 'Connect the wider project',
    copy: 'I map the documents, decisions, risks, dependencies, handoffs, and next actions surrounding the activity.',
  },
  {
    step: '03',
    title: 'Add practical AI support',
    copy: 'I introduce prompts, templates, trackers, document structures, summaries, or analysis steps only where they improve the workflow.',
  },
  {
    step: '04',
    title: 'Test, review, and document',
    copy: 'I test the process on real work, define the human-review points, and prepare a system that can be reused, measured, and improved.',
  },
];

const aboutSelectedWork = [
  {
    label: 'PRACTICAL RESOURCES',
    title: 'AI PM LAB Resource Library',
    copy: [
      'I have created a growing library of practical AI frameworks, professional prompt kits, communication tools, decision guides, and human-review checklists.',
      'Each resource is designed to improve real professional work without relying on hype, secret prompts, or unnecessary complexity.',
    ],
    examples: ['Before You Prompt: The Clarity Checklist — available now', 'From Vague Request to Professional Prompt — available now', 'The Difficult Conversation Prompt Kit — coming soon'],
    cta: 'Explore the Resource Library',
    to: '/resources',
  },
  {
    label: 'INTERACTIVE WORKFLOW DIAGNOSTIC',
    title: 'AI PM Workflow Copilot',
    copy: [
      'I created an interactive workflow diagnostic that uses structured intake questions to generate a preliminary workflow snapshot, identify bottlenecks, suggest a first practical improvement, and prepare the next human-reviewed conversation.',
      'The current version was first developed through the Real Estate AI PM Pilot and applies the AI PM LAB method to follow-up, documentation, coordination, task ownership, and operational visibility.',
    ],
    note: 'The preliminary result is AI-generated and does not replace a human-reviewed consulting engagement.',
    cta: 'Explore the Workflow Copilot',
    to: '/real-estate-ai-pm-pilot',
  },
  {
    label: 'RELATED PROPTECH RESEARCH',
    title: 'PropertyDEX Framework',
    copy: [
      'I developed the PropertyDEX Framework as an AI-assisted educational and simulation project exploring real estate tokenization, stakeholder roles, project workflows, governance requirements, and the controls that may be needed around emerging digital ownership models.',
      'The framework demonstrates how I combine research, project structure, AI-assisted development, governance thinking, and real estate process analysis in one applied project.',
    ],
    note: 'PropertyDEX is an exploratory and educational framework. It is not an investment platform, token offering, legal model, financial recommendation, or guarantee of future implementation.',
    cta: 'Explore the PropertyDEX Framework',
    href: 'https://framework.propertydex.xyz',
  },
];

const aboutBackgroundItems = [
  'Degree in Civil and Environmental Engineering',
  'Business operations and administrative coordination',
  'Hospitality and service-based operations',
  'Vendor, payment, document, and deadline coordination',
  'Currently pursuing a Master of Science in Project Management at Harrisburg University in the United States',
];

const aboutCurrentPracticeItems = [
  'AI-supported project and operational workflows',
  'Professional communication systems',
  'Prompt and human-review processes',
  'Workflow diagnostics and structured intake',
  'Real estate operations and PropTech research',
  'Practical framework and resource development',
];

const aboutWorkingPrinciples = [
  {
    title: 'Practical before impressive',
    copy: 'I start with one real activity and one specific problem. I do not add technology before understanding the work.',
  },
  {
    title: 'Connect the wider project',
    copy: 'I do not treat a recurring activity as an isolated task. I identify the people, information, decisions, dependencies, and next actions around it before designing the system.',
  },
  {
    title: 'Human control by design',
    copy: 'I use AI to draft, organize, compare, summarize, and prepare. People remain responsible for decisions, commitments, approvals, and consequences.',
  },
  {
    title: 'Clear information boundaries',
    copy: 'I use the minimum information required and define what the AI may use, produce, and recommend.',
  },
  {
    title: 'Responsible escalation',
    copy: 'I recognize when the work requires qualified legal, HR, compliance, cybersecurity, financial, tax, brokerage, engineering, or safety professionals.',
  },
];

function About() {
  return (
    <article className="about-page">
      <section className="section-shell about-hero">
        <div className="about-hero-copy">
          <p className="eyebrow">ABOUT AI PM LAB</p>
          <h1>I build practical AI + project workflows around the way real work gets done.</h1>
          <div className="about-hero-text">
            <p>I created AI PM LAB to help small businesses, professionals, and project teams move beyond isolated AI outputs and unclear processes.</p>
            <p>My work starts with one recurring activity, connects it to the people, documents, decisions, responsibilities, risks, and follow-up around it, and turns it into a clearer, repeatable, human-controlled project workflow.</p>
            <p>I combine an engineering background and hands-on business operations experience, and I am currently pursuing a Master of Science in Project Management at Harrisburg University in the United States.</p>
            <p className="about-institutional-line">AI PM LAB is a Trigosat Consulting initiative.</p>
          </div>
          <div className="hero-actions about-hero-actions">
            <a className="button primary" href={calendlyLink} target="_blank" rel="noreferrer">Book a Free Workflow Clarity Call</a>
            <Link className="button secondary" to="/resources">Explore Free Resources</Link>
          </div>
        </div>
        <figure className="about-photo-card">
          <img src="https://i.ibb.co/nx5qk7T/Progetto-senza-titolo-3.png" alt="Peter Forestieri, founder of AI PM LAB" />
          <figcaption>
            <strong>Peter Forestieri</strong>
            <span>Founder of AI PM LAB</span>
          </figcaption>
        </figure>
      </section>

      <section className="section-shell about-story">
        <div className="about-section-heading">
          <p className="eyebrow">WHY I CREATED AI PM LAB</p>
          <h2>The problem is rarely access to AI.<span>The problem is the workflow around it.</span></h2>
        </div>
        <div className="about-narrative-card">
          <p>I saw the same pattern repeatedly: people were using AI to draft emails, summarize documents, organize notes, and generate ideas, while the work around those outputs remained unclear.</p>
          <p>The input was inconsistent. No one had clearly defined who should review the result, what decision it supported, where it should be documented, or what should happen next.</p>
          <p>I created AI PM LAB to connect AI use with clearer project processes, practical controls, and accountable human decisions. One recurring activity becomes the starting point for understanding and improving the wider system around it.</p>
          <p className="about-distinct-line">I do not start with the tool. I start with the work—and then connect the project around it.</p>
        </div>
      </section>

      <section className="section-shell about-shaped-approach">
        <div className="about-section-heading">
          <p className="eyebrow">WHAT SHAPED MY APPROACH</p>
          <h2>Different experiences.<span>One practical way of thinking.</span></h2>
        </div>
        <div className="about-connected-grid">
          {aboutShapedApproach.map((item, index) => (
            <article className="about-connected-card" key={item.title}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell about-method">
        <div className="about-section-heading">
          <p className="eyebrow">HOW I WORK</p>
          <h2>Start with the work.<span>Connect the project.</span>Add AI where it helps.</h2>
        </div>
        <div className="about-method-list">
          {aboutMethodSteps.map((step) => (
            <article className="about-method-step" key={step.step}>
              <span>{step.step}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell about-selected-work">
        <div className="about-section-heading">
          <p className="eyebrow">SELECTED WORK</p>
          <h2>Built to be tested, used, and improved.</h2>
        </div>
        <div className="about-selected-grid">
          {aboutSelectedWork.map((work) => (
            <article className="about-selected-card" key={work.title}>
              <p className="card-topline">{work.label}</p>
              <h3>{work.title}</h3>
              {work.copy.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {work.examples ? (
                <ul>
                  {work.examples.map((example) => <li key={example}>{example}</li>)}
                </ul>
              ) : null}
              {work.note ? <p className="about-work-note">{work.note}</p> : null}
              {work.href ? (
                <a className="text-link" href={work.href} target="_blank" rel="noreferrer">{work.cta}</a>
              ) : (
                <Link className="button secondary" to={work.to ?? '/'}>{work.cta}</Link>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell about-foundation">
        <div className="about-section-heading">
          <p className="eyebrow">PROFESSIONAL FOUNDATION</p>
          <h2>The experience behind the method.</h2>
        </div>
        <div className="about-foundation-grid">
          <div className="about-foundation-column">
            <h3>Background</h3>
            <ul>{aboutBackgroundItems.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
          <div className="about-foundation-column">
            <h3>Current practice</h3>
            <ul>{aboutCurrentPracticeItems.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
        </div>
      </section>

      <section className="section-shell about-principles">
        <div className="about-section-heading">
          <p className="eyebrow">WORKING PRINCIPLES</p>
          <h2>Practical support with clear limits.</h2>
        </div>
        <div className="about-principles-grid">
          {aboutWorkingPrinciples.map((principle) => (
            <article className="about-principle-card" key={principle.title}>
              <h3>{principle.title}</h3>
              <p>{principle.copy}</p>
            </article>
          ))}
        </div>
        <p className="about-principles-note">AI PM LAB does not replace regulated, licensed, or specialist professional advice.</p>
      </section>

      <section className="section-shell about-page-cta">
        <div className="about-cta-panel">
          <p className="eyebrow">START SIMPLE</p>
          <h2>Bring one recurring activity.<span>We will look at the project around it.</span></h2>
          <p>During the free Workflow Clarity Call, we identify where the work becomes unclear, what depends on it, and whether a practical 1:1 engagement can turn it into a clearer, repeatable, human-controlled project workflow.</p>
          <div className="hero-actions">
            <a className="button primary light" href={calendlyLink} target="_blank" rel="noreferrer">Book a Free Workflow Clarity Call</a>
            <Link className="button secondary light-outline" to="/resources">Explore Free Resources</Link>
          </div>
          <p className="about-cta-note">No obligation. Start with one real activity and one practical next step.</p>
        </div>
      </section>
    </article>
  );
}


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
      <SiteHeader />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/library" element={<Library />} />
          <Route path="/resource-library-privacy-notice" element={<ResourceLibraryPrivacyNotice />} />
          <Route path="/use-cases" element={<UseCases />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/real-estate-ai-pm-pilot" element={<RealEstateAIPMPilot />} />
        </Routes>
      </main>
      <SiteFooter />
      </AuthProvider>
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
