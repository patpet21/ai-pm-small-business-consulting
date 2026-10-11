import { Link } from 'react-router-dom';

const offers = [
  {
    number: '01', title: 'Project Coordination & Delivery Support',
    summary: 'Practical help making project work visible, organized and easier to move forward.',
    examples: ['Project scope, tasks and milestones', 'Stakeholder and vendor coordination', 'Meeting follow-ups and action logs', 'Issues, risks and status updates'],
    outcome: 'A clearer project plan, defined next steps and an agreed tracking rhythm.',
  },
  {
    number: '02', title: 'Business Operations & Workflow Improvement',
    summary: 'Review a recurring business process and find simpler ways to manage it.',
    examples: ['Map a current process from request to completion', 'Clarify handoffs and task ownership', 'Organize customer or vendor follow-ups', 'Set up reusable checklists and reporting'],
    outcome: 'A documented workflow with owners, checkpoints and usable templates.',
  },
  {
    number: '03', title: 'Practical AI & Automation Support',
    summary: 'Use AI selectively to support repeatable work without losing human oversight.',
    examples: ['AI use and workflow reviews', 'Prompt and document templates', 'Routine task automation feasibility', 'Human review and approval steps'],
    outcome: 'A realistic improvement plan, with a small test when appropriate.',
  },
  {
    number: '04', title: 'Digital Project Implementation',
    summary: 'Coordinate the requirements and delivery of lightweight digital tools.',
    examples: ['Dashboards, forms and internal trackers', 'Website and booking project coordination', 'Simple digital integrations', 'Testing, documentation and handover'],
    outcome: 'A scoped digital project with a practical handover, not technology for its own sake.',
  },
];

export function ServicesOverview() {
  return (
    <div className="hub-page">
      <section className="hub-subhero section-shell">
        <span className="hub-overline">AI PM LAB / SERVICES</span>
        <h1>Project and operations support, <em>with technology where it helps.</em></h1>
        <p>Every organization works differently. My role is to help understand the challenge, coordinate the work and shape a solution that people can actually use.</p>
        <div className="hub-actions"><Link className="hub-button hub-button-primary" to="/quote">Get a Free Quote ↗</Link><Link className="hub-button hub-button-outline" to="/projects">See applied work →</Link></div>
      </section>
      <section className="hub-section section-shell hub-services-area" aria-labelledby="offer-heading">
        <div className="hub-section-header"><div><span className="hub-overline">HOW I CAN HELP</span><h2 id="offer-heading">Four connected capabilities.</h2></div><p>Project coordination is the core, supported by process improvement and implementation skills.</p></div>
        <div className="hub-offer-list">{offers.map((offer) => (
          <article className="hub-offer" key={offer.number}>
            <div className="hub-offer-title"><span>{offer.number} / SERVICE</span><h3>{offer.title}</h3><p>{offer.summary}</p></div>
            <div className="hub-offer-details"><strong>Possible activities</strong><ul>{offer.examples.map(x=><li key={x}>{x}</li>)}</ul></div>
            <div className="hub-offer-outcome"><span>EXAMPLE DELIVERABLE</span><p>{offer.outcome}</p><Link to="/quote">Request a quote ↗</Link></div>
          </article>
        ))}</div>
      </section>
      <section className="hub-two-column section-shell">
        <div className="hub-panel"><span className="hub-overline">SECTOR APPLICATIONS</span><h2>Real estate, construction, retail & smaller teams.</h2><p>From property and vendor processes to retail technology coordination, project needs often involve the same fundamentals: clear ownership, useful information, and reliable follow-up.</p><Link to="/projects">Explore applications ↗</Link></div>
        <div className="hub-panel hub-panel-secondary"><span className="hub-overline">SPECIALIST WORKFLOWS</span><h2>Already exploring AI for your projects?</h2><p>The original AI Use Review, workflow consulting framework, and Real Estate AI PM Pilot remain accessible.</p><Link to="/services/workflows">Explore AI workflow consulting ↗</Link><Link to="/real-estate-ai-pm-pilot">Open Real Estate AI PM Pilot ↗</Link></div>
      </section>
      <section className="hub-section section-shell">
        <div className="hub-section-header"><div><span className="hub-overline">WORKING METHOD</span><h2>Understand. Structure. Test. Hand over.</h2></div><p>We start with the problem, not a promise to automate everything.</p></div>
        <div className="hub-method-grid">
          <div><span>01</span><strong>Understand</strong><p>Define needs, constraints, stakeholders and the result that matters.</p></div>
          <div><span>02</span><strong>Structure</strong><p>Organize the steps, owners, inputs, priorities and checkpoints.</p></div>
          <div><span>03</span><strong>Test</strong><p>Trial a manageable solution and refine what does not work.</p></div>
          <div><span>04</span><strong>Hand over</strong><p>Document the process, next actions and how to maintain it.</p></div>
        </div>
      </section>
      <section className="hub-cta section-shell"><div><span className="hub-overline hub-overline-light">LET'S TALK</span><h2>One problem is enough to start.</h2><p>Share an operational challenge, a project to coordinate or a small implementation idea. Scope and feasibility come first.</p></div><Link className="hub-button hub-button-light" to="/quote">Request a Free Quote ↗</Link></section>
    </div>
  );
}
