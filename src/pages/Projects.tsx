import { Link } from 'react-router-dom';

export function Projects() {
  return (
    <div className="hub-page">
      <section className="hub-subhero section-shell">
        <span className="hub-overline">SELECTED WORK / CASE STUDIES</span>
        <h1>From coordination to implementation. <em>Work you can examine.</em></h1>
        <p>A transparent view of applied experience, software projects, research and demonstrations. Each example is labeled so you can distinguish real project support from prototypes.</p>
      </section>
      <section className="hub-section section-shell hub-projects-area">
        <article className="hub-project-feature" id="retail-operations">
          <div className="hub-project-feature-main"><span className="hub-overline">REAL-WORLD COORDINATION · NEW YORK CITY</span><h2>Retail technology & operations coordination</h2><p className="hub-project-intro">A multi-stakeholder technology improvement effort in a New York retail environment, involving store operations, local technical support and international contacts.</p>
            <div className="hub-project-facts"><div><strong>Situation</strong><p>IT, store needs and external vendors required coordinated communication, follow-ups and on-site troubleshooting.</p></div><div><strong>My contribution</strong><p>On-site coordination, translation between teams, organizing unresolved items, following up on technical activities and supporting handover.</p></div><div><strong>Examples of work</strong><p>Network and Wi-Fi improvement coordination, point-of-sale connectivity checks, device setup support and issue tracking.</p></div></div>
          </div>
          <aside className="hub-project-feature-side"><span>PROJECT MANAGEMENT SKILLS</span><ul><li>Stakeholder communication</li><li>Vendor coordination</li><li>Issue & action tracking</li><li>Technical implementation support</li><li>Operational follow-through</li></ul><small>Client details and internal project documentation are intentionally not disclosed. This is a description of support provided, not a customer testimonial.</small></aside>
        </article>
        <div className="hub-project-grid">
          <article className="hub-project-card" id="privacygate"><div className="hub-project-art hub-project-art-privacy">PG <span>PRIVACY TOOLING</span></div><span className="hub-project-label">SOFTWARE PROJECT</span><h3>PrivacyGate</h3><p>A privacy-focused toolset designed to help remove or replace sensitive details before sharing content with AI. Available channels include Windows, Edge and a Google Workspace listing, with availability controlled by the respective stores.</p><Link to="/products#privacygate">Explore the product and links ↗</Link></article>
          <article className="hub-project-card" id="real-estate"><div className="hub-project-art hub-project-art-property">RE <span>WORKFLOW EXPERIMENT</span></div><span className="hub-project-label">PROTOTYPE / PILOT</span><h3>Real Estate AI PM Workflow Pilot</h3><p>An interactive workflow diagnostic exploring follow-up, documents, coordination and task visibility for real estate professionals. AI-generated outputs are preliminary and require human review.</p><Link to="/real-estate-ai-pm-pilot">Open the pilot ↗</Link></article>
          <article className="hub-project-card" id="propertydex"><div className="hub-project-art hub-project-art-digital">PD <span>PROPTECH RESEARCH</span></div><span className="hub-project-label">RESEARCH INITIATIVE</span><h3>PropertyDEX</h3><p>An independent real estate technology initiative exploring digital project structures, information workflows and tokenization concepts. It is research and product exploration, not a completed client engagement.</p><a href="https://propertydex.xyz" target="_blank" rel="noopener noreferrer">Visit PropertyDEX ↗</a></article>
          <article className="hub-project-card" id="web-demos"><div className="hub-project-art hub-project-art-web">WEB <span>DIGITAL PROTOTYPES</span></div><span className="hub-project-label">SELECTED DEMONSTRATIONS</span><h3>Small-business website prototypes</h3><p>Practical website demos exploring services pages, appointment experiences, galleries and better digital access for local businesses. Demonstrations are not presented as commissioned client work.</p><a href="https://bellicapellihairdesigners.netlify.app/" target="_blank" rel="noopener noreferrer">Explore a website demo ↗</a></article>
        </div>
      </section>
      <section className="hub-cta section-shell"><div><span className="hub-overline hub-overline-light">PROFESSIONAL OPPORTUNITIES</span><h2>Need someone who connects people, tasks and technology?</h2><p>I'm interested in roles and projects that bring coordination, operations, digital systems and thoughtful AI use together.</p></div><Link className="hub-button hub-button-light" to="/contact">Get in touch ↗</Link></section>
    </div>
  );
}
