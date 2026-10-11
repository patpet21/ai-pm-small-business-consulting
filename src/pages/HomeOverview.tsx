import { Link } from 'react-router-dom';

const capabilities = [
  { icon: '01', title: 'Project Coordination', description: 'Help turn scope, timelines, people, tasks, and follow-ups into an organized project delivery process.', points: ['Priorities & milestones', 'Vendor and stakeholder follow-ups', 'Action and issue tracking'] },
  { icon: '02', title: 'Business Operations', description: 'Make recurring activities clearer, from customer requests to internal handoffs and reporting.', points: ['Process mapping', 'Ownership & handoffs', 'Practical operating routines'] },
  { icon: '03', title: 'AI & Workflow Improvement', description: 'Evaluate where practical AI, better templates, and lightweight automation can support real work.', points: ['Workflow review', 'Human-controlled AI use', 'Useful automations when appropriate'] },
  { icon: '04', title: 'Digital Project Support', description: 'Plan and support the implementation of websites, dashboards, forms, and other small digital solutions.', points: ['Requirements & scope', 'Implementation coordination', 'Documentation & handover'] },
];

export function HomeOverview() {
  return (
    <div className="hub-page">
      <section className="hub-hero section-shell" aria-labelledby="hub-home-title">
        <div className="hub-hero-copy">
          <div className="hub-kicker"><span className="hub-kicker-dot" /> AI PM LAB · BY TRIGOSAT CONSULTING</div>
          <h1 id="hub-home-title">Project management.<br /><em>Smarter operations.</em><br />Practical AI.</h1>
          <p className="hub-lead">I help businesses and project teams coordinate work, improve everyday processes, and turn digital tools and AI into practical, human-controlled solutions.</p>
          <div className="hub-actions">
            <Link className="hub-button hub-button-primary" to="/projects">Explore my work <span aria-hidden="true">↗</span></Link>
            <Link className="hub-button hub-button-outline" to="/contact">Discuss a project <span aria-hidden="true">→</span></Link>
          </div>
          <div className="hub-hero-note"><span className="hub-tick">✓</span> Practical coordination, clear ownership, useful technology.</div>
        </div>
        <aside className="hub-system-panel" aria-label="Example of a structured project workflow">
          <div className="hub-system-top"><span>HOW I APPROACH THE WORK</span><span className="hub-system-signal"><i /> STRUCTURED DELIVERY</span></div>
          <div className="hub-system-heading">From a business need to a usable process.</div>
          <div className="hub-system-steps">
            <div><span>01</span><strong>Understand</strong><small>Needs, constraints, stakeholders</small></div>
            <div><span>02</span><strong>Organize</strong><small>Scope, tasks, owners, milestones</small></div>
            <div><span>03</span><strong>Coordinate</strong><small>Updates, decisions, follow-ups</small></div>
            <div><span>04</span><strong>Improve</strong><small>Tools, AI support, handover</small></div>
          </div>
          <p className="hub-system-bottom">AI supports the process. People stay responsible for decisions.</p>
        </aside>
      </section>

      <section className="hub-intent section-shell" aria-label="Choose what brings you here">
        <Link className="hub-intent-card" to="/about">
          <span className="hub-icon-box">◈</span><span><strong>Hiring or exploring a collaboration?</strong><small>See my professional background, coordination experience, and applied projects.</small></span><span className="hub-card-arrow" aria-hidden="true">↗</span>
        </Link>
        <Link className="hub-intent-card" to="/contact">
          <span className="hub-icon-box">◇</span><span><strong>Need help with a project or process?</strong><small>Share the challenge. We can explore a practical next step.</small></span><span className="hub-card-arrow" aria-hidden="true">↗</span>
        </Link>
      </section>

      <section className="hub-section section-shell" aria-labelledby="hub-services-heading">
        <div className="hub-section-header">
          <div><span className="hub-overline">WHAT I DO</span><h2 id="hub-services-heading">Real work. Clearer systems.</h2></div>
          <p>Project management is the foundation. Technology and AI are tools used when they make the work better.</p>
        </div>
        <div className="hub-capabilities">
          {capabilities.map((item) => (
            <article className="hub-capability" key={item.title}>
              <span className="hub-capability-number">{item.icon}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <ul>{item.points.map((point) => <li key={point}>{point}</li>)}</ul>
            </article>
          ))}
        </div>
        <div className="hub-section-link"><Link to="/services">Explore services & capabilities <span aria-hidden="true">↗</span></Link></div>
      </section>

      <section className="hub-case-band" aria-labelledby="hub-case-heading">
        <div className="section-shell hub-case-layout">
          <div>
            <span className="hub-overline hub-overline-light">SELECTED COORDINATION EXPERIENCE</span>
            <h2 id="hub-case-heading">Coordinating a retail technology project in New York.</h2>
            <p>Supporting an on-site retail technology effort involving vendors, technical teams, store operations, issue tracking and communication between US and international stakeholders.</p>
            <Link className="hub-button hub-button-light" to="/projects">View the case study <span aria-hidden="true">↗</span></Link>
          </div>
          <div className="hub-case-evidence">
            <div><span>PROJECT ENVIRONMENT</span><strong>Retail operations & IT implementation</strong></div>
            <div><span>COORDINATION FOCUS</span><strong>Stakeholders, vendors, open issues, handoffs</strong></div>
            <div><span>WORKING STYLE</span><strong>On-site support + structured follow-up</strong></div>
            <small>A summary of work performed, not a claim of full project ownership or a customer endorsement.</small>
          </div>
        </div>
      </section>

      <section className="hub-section section-shell" aria-labelledby="hub-work-title">
        <div className="hub-section-header">
          <div><span className="hub-overline">SELECTED WORK</span><h2 id="hub-work-title">Projects that show the approach.</h2></div>
          <p>A mix of real-world coordination, working software, research, and digital prototypes — with each clearly identified.</p>
        </div>
        <div className="hub-work-grid">
          <Link className="hub-work-card" to="/projects">
            <span className="hub-work-media hub-work-media-operations"><b>PM</b><i>PROJECT COORDINATION</i></span>
            <span className="hub-work-type">PRACTICAL EXPERIENCE</span><h3>NYC Retail IT Coordination</h3><p>Working across store operations, vendors, and technical handoffs.</p><span className="hub-work-more">Explore case study ↗</span>
          </Link>
          <Link className="hub-work-card" to="/products#privacygate">
            <span className="hub-work-media hub-work-media-privacy"><b>PG</b><i>PRIVACY SOFTWARE</i></span>
            <span className="hub-work-type">SOFTWARE PROJECT</span><h3>PrivacyGate</h3><p>Privacy-focused tooling for safer handling of information before using AI.</p><span className="hub-work-more">Explore product ↗</span>
          </Link>
          <Link className="hub-work-card" to="/projects#real-estate">
            <span className="hub-work-media hub-work-media-realestate"><b>RE</b><i>WORKFLOW PILOT</i></span>
            <span className="hub-work-type">PROTOTYPE & RESEARCH</span><h3>Real Estate AI PM</h3><p>A project workflow diagnostic exploring practical improvements for real estate operations.</p><span className="hub-work-more">Explore pilot ↗</span>
          </Link>
        </div>
        <div className="hub-section-link"><Link to="/projects">View projects, case studies & digital demos <span aria-hidden="true">↗</span></Link></div>
      </section>

      <section className="hub-two-column section-shell">
        <div className="hub-panel">
          <span className="hub-overline">PRODUCTS & EXPERIMENTS</span><h2>Ideas made tangible.</h2><p>Explore PrivacyGate, PropertyDEX and other tools developed and studied inside the AI PM LAB ecosystem.</p>
          <Link to="/products">Explore products & links <span aria-hidden="true">↗</span></Link>
        </div>
        <div className="hub-panel hub-panel-secondary">
          <span className="hub-overline">FREE RESOURCES</span><h2>Learn, test, improve.</h2><p>Explore practical checklists, AI workflow materials, the Resource Library, and the Real Estate AI PM Pilot.</p>
          <Link to="/resources">Browse the resources <span aria-hidden="true">↗</span></Link>
        </div>
      </section>

      <section className="hub-cta section-shell">
        <div><span className="hub-overline hub-overline-light">START WITH THE REAL PROBLEM</span><h2>Have a project, a coordination challenge, or a process that needs clarity?</h2><p>Tell me what you're trying to accomplish. The right first step may be project coordination, a clearer workflow, or a small digital solution — not necessarily another AI tool.</p></div>
        <Link className="hub-button hub-button-light" to="/contact">Get in touch <span aria-hidden="true">↗</span></Link>
      </section>
    </div>
  );
}
