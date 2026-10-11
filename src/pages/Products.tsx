import { Link } from 'react-router-dom';

const privacyDestinations = [
  { label: 'Official PrivacyGate website', detail: 'Overview & product information', url: 'https://privacygate.propertydex.xyz/', icon: '↗' },
  { label: 'Microsoft Store', detail: 'Windows desktop app', url: 'https://apps.microsoft.com/detail/9NMPZCVJLLZ3', icon: '▦' },
  { label: 'Microsoft Edge Add-ons', detail: 'Browser extension listing', url: 'https://microsoftedge.microsoft.com/addons/detail/privacygate-browser-prote/lbdkbiflhmlalbcblmglmccmmajnhfbd', icon: '◉' },
  { label: 'Google Workspace Marketplace', detail: 'PrivacyGate Gmail add-on listing', url: 'https://workspace.google.com/marketplace/app/privacygate/817932149819?flow_type=2', icon: '✉' },
];

export function Products() {
  return (
    <div className="hub-page">
      <section className="hub-subhero section-shell">
        <span className="hub-overline">AI PM LAB / PRODUCTS & TOOLS</span>
        <h1>Practical tools and <em>exploratory projects.</em></h1>
        <p>Products, prototypes and resources developed as part of AI PM LAB and related initiatives. Choose a project to visit its official destination.</p>
      </section>
      <section className="hub-section section-shell hub-products-area">
        <article className="hub-product-feature" id="privacygate">
          <div className="hub-product-copy"><span className="hub-overline">FEATURED PRODUCT · PRIVACY & AI</span><h2>PrivacyGate</h2><p className="hub-product-lead">A privacy-first approach to working with AI.</p><p>PrivacyGate explores ways to detect and replace sensitive details before they enter AI workflows. Open the official site or visit one of the platform listings.</p><a className="hub-button hub-button-primary" href="https://privacygate.propertydex.xyz/" target="_blank" rel="noopener noreferrer">Explore PrivacyGate ↗</a></div>
          <div className="hub-product-links"><span className="hub-overline">EXPLORE & INSTALL</span><div>{privacyDestinations.map((item)=>(
            <a className="hub-product-destination" key={item.label} href={item.url} target="_blank" rel="noopener noreferrer"><span className="hub-destination-icon" aria-hidden="true">{item.icon}</span><span><strong>{item.label}</strong><small>{item.detail}</small></span><span className="hub-destination-arrow" aria-hidden="true">↗</span></a>
          ))}</div><small>Store availability and installation depend on each platform; a listing link does not guarantee approval or regional access.</small></div>
        </article>
        <div className="hub-product-grid">
          <article className="hub-product-card"><span className="hub-overline">RESEARCH INITIATIVE</span><h3>PropertyDEX</h3><p>A separate real estate technology and tokenization research initiative. Explore the project website and its conceptual framework.</p><a href="https://propertydex.xyz" target="_blank" rel="noopener noreferrer">Project website ↗</a><a href="https://framework.propertydex.xyz/" target="_blank" rel="noopener noreferrer">PropertyDEX Framework ↗</a></article>
          <article className="hub-product-card"><span className="hub-overline">APPLIED LEARNING</span><h3>AI PM LAB Resources</h3><p>Practical guides, workflow templates, and a Resource Library for project and operational work.</p><Link to="/resources">Explore free resources ↗</Link><Link to="/library">Go to Resource Library ↗</Link></article>
          <article className="hub-product-card"><span className="hub-overline">WORKFLOW PILOT</span><h3>Real Estate AI PM</h3><p>An interactive prototype for exploring recurring tasks, coordination bottlenecks and workflow improvement opportunities.</p><Link to="/real-estate-ai-pm-pilot">Explore workflow pilot ↗</Link><Link to="/projects#real-estate">Read project context ↗</Link></article>
        </div>
      </section>
      <section className="hub-cta section-shell"><div><span className="hub-overline hub-overline-light">LOOKING FOR SERVICES?</span><h2>Tools are only one part of the work.</h2><p>For project coordination, process improvement, digital delivery or professional collaboration, explore the services behind the projects.</p></div><Link className="hub-button hub-button-light" to="/services">Explore capabilities ↗</Link></section>
    </div>
  );
}
