import { Link } from 'react-router-dom';

const updated = 'November 15, 2026';
const email = 'trigosatconsulting@gmail.com';

function LegalHeader({ eyebrow, title, summary }: { eyebrow: string; title: string; summary: string }) {
  return (
    <section className="legal-hero section-shell">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="legal-lede">{summary}</p>
      <p className="legal-updated">Last updated: {updated}</p>
    </section>
  );
}

function LegalContact() {
  return (
    <section className="legal-panel" aria-labelledby="legal-contact-heading">
      <h2 id="legal-contact-heading">Questions or requests</h2>
      <p>For questions about these terms, your information, or a privacy request, contact AI PM LAB by Trigosat Consulting at <a href={`mailto:${email}`}>{email}</a>. You may also use our <Link to="/contact">contact page</Link>.</p>
    </section>
  );
}

export function PrivacyPolicy() {
  return (
    <article className="legal-page">
      <LegalHeader
        eyebrow="AI PM LAB · LEGAL"
        title="Privacy Policy"
        summary="How AI PM LAB by Trigosat Consulting handles information when you browse the website, contact us, use the resource library, request a workflow review, or connect an authorized third-party service."
      />
      <div className="legal-content section-shell">
        <section className="legal-panel">
          <h2>1. Who operates this website</h2>
          <p>AI PM LAB is a project of Trigosat Consulting. This policy covers the website at <a href="https://aipmlab.propertydex.xyz/">aipmlab.propertydex.xyz</a> and the related online features described here. Contact: <a href={`mailto:${email}`}>{email}</a>.</p>
        </section>
        <section className="legal-panel">
          <h2>2. Information collected</h2>
          <ul>
            <li><strong>Contact and quote requests:</strong> name, email, company or role (if provided), project details, preferences and messages entered into our forms.</li>
            <li><strong>Resource library:</strong> username, email address, optional marketing preference, account/session details, and records of resources viewed, saved or downloaded where these features are enabled.</li>
            <li><strong>Workflow and AI pilot intake:</strong> information you voluntarily provide about your operation, tools, challenges, goals and contact preferences so that a workflow snapshot or follow-up can be prepared.</li>
            <li><strong>Technical and analytics information:</strong> device/browser information, page interactions, approximate location and related identifiers that may be processed by the site host and Google Analytics.</li>
            <li><strong>Third-party account data (only if you connect one):</strong> account identification, permissions, authorization tokens and permitted publishing/status information required for the integration you choose. The proposed TikTok integration is not represented as active until implemented and authorized.</li>
          </ul>
          <p>Please avoid putting passwords, financial records, medical details, confidential client information or other sensitive data in public-facing forms.</p>
        </section>
        <section className="legal-panel">
          <h2>3. Why we use information</h2>
          <p>We use information to respond to inquiries, arrange discovery calls, provide requested resources, manage permitted accounts and sessions, prepare workflow analysis or consulting follow-up, maintain security, troubleshoot errors, understand website use and meet applicable legal obligations. Marketing messages, where offered, are based on the preference you choose.</p>
        </section>
        <section className="legal-panel">
          <h2>4. Services involved in processing</h2>
          <p>The website and its existing features use or may interact with Netlify (hosting and technical operations), Formspree (contact and quote forms), Calendly (booking), Supabase (resource-library profiles and session functions), Google Analytics (website measurement), and services that support the workflow pilot. These providers process information subject to their own terms and policies.</p>
          <p>When an optional connection to TikTok becomes available, TikTok's authorization screen will identify the requested permissions. Authorized information will be used for the requested account connection and permitted content-upload or publishing workflow, not to imply TikTok endorses AI PM LAB.</p>
        </section>
        <section className="legal-panel">
          <h2>5. Cookies and local storage</h2>
          <p>Google Analytics is loaded on this website and may use cookies or similar technologies for traffic measurement. Site features may also use browser local storage to maintain resource-library access or sign-in state. You can manage cookies in your browser; blocking them may affect some features. We do not describe the site as cookie-free.</p>
        </section>
        <section className="legal-panel">
          <h2>6. Sharing and international processing</h2>
          <p>Information may be shared with service providers where necessary to deliver the feature you request, respond to you, secure the site or comply with law. Different providers may process information in the United States or other jurisdictions. We do not authorize third parties to publish content to a connected social account beyond the permissions and actions approved through the integration.</p>
        </section>
        <section className="legal-panel">
          <h2>7. Retention and safeguards</h2>
          <p>Information is retained for as long as reasonably needed for the applicable request, service, security, recordkeeping or legal purpose. Retention can differ by provider and feature. We use reasonable administrative and technical measures, but no online service can guarantee absolute security.</p>
        </section>
        <section className="legal-panel">
          <h2>8. Your choices and rights</h2>
          <p>You may contact us to request access, correction or deletion of information associated with your use of this site, subject to identity verification and applicable legal obligations. You may withdraw optional marketing consent. If you later authorize TikTok or another external account, you may revoke access through the external platform's account settings and contact us about integration records. Rights may vary by jurisdiction.</p>
        </section>
        <section className="legal-panel">
          <h2>9. External links and children</h2>
          <p>Links to other sites are governed by their own privacy notices. AI PM LAB's business-oriented services are not directed to children under 13, and we do not knowingly seek personal information from children.</p>
        </section>
        <section className="legal-panel">
          <h2>10. Changes to this policy</h2>
          <p>We may update this policy as features or providers change. The date at the top of this page indicates the current version. Material changes should be reflected here before the relevant feature is used.</p>
        </section>
        <LegalContact />
        <p className="legal-crosslink">Also see our <Link to="/terms">Terms of Service</Link>.</p>
      </div>
    </article>
  );
}

export function TermsOfService() {
  return (
    <article className="legal-page">
      <LegalHeader
        eyebrow="AI PM LAB · LEGAL"
        title="Terms of Service"
        summary="The conditions for using AI PM LAB's website, educational resources and online project-management or operations tools."
      />
      <div className="legal-content section-shell">
        <section className="legal-panel">
          <h2>1. About the service</h2>
          <p>AI PM LAB is a Trigosat Consulting initiative focused on project coordination, operations improvement and practical AI-supported workflows. The website offers information, resources, request forms, workflow diagnostics and opportunities to discuss consulting services. Not all described tools or integrations are available to every visitor.</p>
        </section>
        <section className="legal-panel">
          <h2>2. Using the website</h2>
          <p>Use this site lawfully and responsibly. Do not attempt unauthorized access, misuse forms, upload malicious material, interfere with other users, or provide information you are not entitled to share. You are responsible for checking any information you submit and for your own account credentials.</p>
        </section>
        <section className="legal-panel">
          <h2>3. Information and AI-generated outputs</h2>
          <p>Materials, examples and preliminary AI-assisted workflow reports are provided for information and planning. AI-generated outputs can be incomplete or inaccurate and require human review before use. They are not legal, financial, tax, investment, HR, engineering, safety or other regulated professional advice. No particular outcome, savings or project result is guaranteed.</p>
        </section>
        <section className="legal-panel">
          <h2>4. Consulting engagements</h2>
          <p>Submitting a form or booking a call does not create a consulting contract. Any paid engagement, scope, deliverables, fees, deadlines and responsibilities must be confirmed separately in a written proposal or agreement. Free resources and introductory discussions do not create an obligation to purchase services.</p>
        </section>
        <section className="legal-panel">
          <h2>5. Ownership and permitted use</h2>
          <p>Unless otherwise stated, original website content, visual materials and downloadable resources are made available by AI PM LAB for their indicated purpose. You may use free materials for your own lawful internal learning and work, but may not falsely claim authorship, redistribute paid resources or resell the site's materials without permission. You retain rights to the materials and information you lawfully submit.</p>
        </section>
        <section className="legal-panel">
          <h2>6. Third-party services and social integrations</h2>
          <p>Features may rely on third parties, including hosting, form, booking, account, analytics and social platforms. Their terms also apply. If a TikTok connection is offered in the future, it will require authorization for the applicable scopes. You remain responsible for selecting, reviewing and having rights to publish the content you submit. A proposed integration is not a promise that TikTok has approved the app or will make a particular publishing capability available.</p>
        </section>
        <section className="legal-panel">
          <h2>7. Availability and changes</h2>
          <p>We may improve, suspend or discontinue features for operational, security or compliance reasons. We aim to keep the site useful, but do not guarantee uninterrupted access or error-free operation. Changes to externally provided services can affect available features.</p>
        </section>
        <section className="legal-panel">
          <h2>8. Responsibility and limitations</h2>
          <p>You are responsible for verifying important decisions and obtaining qualified professional advice where appropriate. To the extent permitted by applicable law, AI PM LAB and Trigosat Consulting are not responsible for losses caused by misuse of the website, unreviewed automated outputs, third-party service failures or circumstances outside reasonable control. Nothing in these terms excludes rights or liability that cannot lawfully be excluded.</p>
        </section>
        <section className="legal-panel">
          <h2>9. Contact and updates</h2>
          <p>Questions about these terms may be sent to <a href={`mailto:${email}`}>{email}</a>. We may update these terms as the service evolves. The updated date is shown above; continuing to use the website after changes may be subject to the revised terms, where permitted by law.</p>
        </section>
        <p className="legal-crosslink">Read our <Link to="/privacy">Privacy Policy</Link> for information about data handling.</p>
      </div>
    </article>
  );
}
