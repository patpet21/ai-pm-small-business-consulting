import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';

export const quoteServices = [
  { id: 'project-coordination', label: 'Project Coordination', sub: 'Planning, milestones, vendors and project delivery' },
  { id: 'operations', label: 'Business Operations', sub: 'Recurring processes, handoffs and follow-ups' },
  { id: 'ai-workflows', label: 'AI & Workflow Improvement', sub: 'Process analysis and appropriate AI or automation' },
  { id: 'digital-project', label: 'Digital Projects', sub: 'Websites, dashboards, forms and implementation' },
  { id: 'real-estate', label: 'Real Estate / Construction', sub: 'Project and operational coordination in the built environment' },
  { id: 'other', label: 'Other / Not Sure', sub: 'Describe what you need and we can find the right fit' },
] as const;
type Service = typeof quoteServices[number]['id'];
type QuoteForm = {
  service: Service | ''; topics: string[]; description: string; objective: string; timeframe: string; budget: string;
  company: string; team: string; name: string; email: string; phone: string; contactMethod: string;
  consent: boolean; website: string;
};
const topics: Record<Service,string[]> = {
  'project-coordination': ['Scope & planning', 'Milestones', 'Vendor coordination', 'Project reporting', 'Issue tracking'],
  operations: ['Customer inquiries', 'Vendor follow-up', 'Process mapping', 'Documentation', 'Team handoffs'],
  'ai-workflows': ['AI use review', 'Repeatable templates', 'Automation feasibility', 'Human approvals', 'Workflow review'],
  'digital-project': ['Website design', 'Website improvements', 'Booking forms', 'Internal dashboard', 'Digital setup'],
  'real-estate': ['Vendor coordination', 'Property documents', 'Project tasks', 'Client follow-up', 'Reporting'],
  other: ['Not sure yet', 'Project planning', 'Business processes', 'Digital solution', 'Other'],
};
const initial: QuoteForm = { service:'', topics:[],description:'',objective:'',timeframe:'',budget:'',company:'',team:'',name:'',email:'',phone:'',contactMethod:'Email',consent:false,website:'' };
const steps = ['Service','Project','Scope','Contact'];

export function FreeQuote() {
  const [params] = useSearchParams();
  const chosen = quoteServices.find(s => s.id === params.get('service'))?.id ?? '';
  const [data,setData] = React.useState<QuoteForm>({...initial,service:chosen});
  const [step,setStep] = React.useState(0);
  const [error,setError] = React.useState('');
  const [sending,setSending] = React.useState(false);
  const [sent,setSent] = React.useState(false);
  const [tried,setTried] = React.useState(false);
  const top = React.useRef<HTMLDivElement>(null);

  function set<K extends keyof QuoteForm>(key:K,value:QuoteForm[K]) {
    setData(old=>({...old,[key]:value})); setError('');
  }
  function validate(n:number):string {
    if(n===0&&!data.service) return 'Choose one service category to continue.';
    if(n===1&&data.description.trim().length<15) return 'Describe your request in at least 15 characters.';
    if(n===3) {
      if(!data.name.trim()) return 'Please enter your name.';
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) return 'Please enter a valid email.';
      if(!data.consent) return 'Please authorize using the contact details to reply to you.';
    }
    return '';
  }
  function navigateStep(next:number) {
    if(next>step) {const message=validate(step);if(message){setError(message);return;}}
    setStep(next);setError('');top.current?.scrollIntoView({behavior:'auto',block:'start'});
  }
  function toggleTopic(topic:string) {
    setData(old=>({...old,topics:old.topics.includes(topic)?old.topics.filter(s=>s!==topic):[...old.topics,topic]}));
  }
  async function submit(e:React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if(step!==3||sending) return;
    const message=validate(3);if(message){setError(message);return;}
    setTried(true);setSending(true);setError('');
    const payload=new FormData();
    const fields:Record<string,string>={
      _subject:'AI PM LAB - Free Quote Request',
      _gotcha:data.website,
      source:'ai-pm-lab-guided-quote',
      request_type:'Free, no-obligation project scope discussion',
      service:quoteServices.find(s=>s.id===data.service)?.label??data.service,
      interests:data.topics.join(', ')||'Not specified',
      description:data.description.trim(),
      desired_result:data.objective.trim()||'Not specified',
      timeframe:data.timeframe||'To discuss',
      indicative_budget:data.budget||'To discuss',
      organization:data.company.trim()||'Not specified',
      team_size:data.team||'Not specified',
      name:data.name.trim(),
      email:data.email.trim(),
      phone:data.phone.trim()||'Not provided',
      preferred_contact:data.contactMethod,
      contact_permission:'Agreed - use details to reply to this request'
    };
    Object.entries(fields).forEach(([key,val])=>payload.append(key,val));
    try {
      const response=await fetch('https://formspree.io/f/mojboraw',{method:'POST',body:payload,headers:{Accept:'application/json'}});
      if(!response.ok) throw new Error('Your request could not be delivered. Please try again or email us.');
      setSent(true);top.current?.scrollIntoView({behavior:'auto',block:'start'});
    } catch(cause) {
      setError(cause instanceof Error?cause.message:'Unable to submit your request.');
    } finally {setSending(false);}
  }

  return <div className="quote-page hub-page">
    <section className="section-shell hub-subhero quote-intro" ref={top}>
      <span className="hub-overline">AI PM LAB / FREE QUOTE</span>
      <h1>Tell me about your project. <em>Let's find the right starting point.</em></h1>
      <p>Share your coordination, business operations, AI workflow or digital project needs. The inquiry is free and without obligation. It does not produce an instant price estimate.</p>
    </section>
    {sent ? <section className="section-shell quote-thanks" role="status">
      <div className="quote-thanks-icon">✓</div><span className="hub-overline">REQUEST SENT</span>
      <h2>Thank you. Your request has been submitted.</h2>
      <p>Your answers will help me review the situation and follow up about the next step. Costs, scope and delivery depend on further discussion; nothing is booked or priced automatically.</p>
      <Link className="hub-button hub-button-primary" to="/">Return to homepage ↗</Link>
    </section> : <section className="section-shell quote-layout">
      <div className="quote-card">
        <ol className="quote-progress" aria-label="Quote progress">{steps.map((item,i)=>
          <li key={item} className={i===step?'current':i<step?'completed':''} aria-current={i===step?'step':undefined}><span>{i<step?'✓':i+1}</span><small>{item}</small></li>
        )}</ol>
        <form onSubmit={submit} noValidate>
          <input type="text" name="website_verify" className="quote-honeypot" tabIndex={-1} autoComplete="off" value={data.website} onChange={e=>set('website',e.target.value)} aria-hidden="true"/>
          {step===0&&<div className="quote-stage">
            <p className="quote-stage-label">STEP 01 / 04</p><h2>What kind of support do you need?</h2><p>Choose the closest match, even if you have several requirements.</p>
            <div className="quote-options" role="radiogroup" aria-label="Type of service">{quoteServices.map((s,i)=>
              <label className={'quote-service '+(data.service===s.id?'selected':'')} key={s.id}>
                <input type="radio" name="service" checked={data.service===s.id} onChange={()=>setData(old=>({...old,service:s.id,topics:[]}))}/>
                <span className="quote-number">{String(i+1).padStart(2,'0')}</span><strong>{s.label}</strong><small>{s.sub}</small><span className="quote-check">{data.service===s.id?'✓':'○'}</span>
              </label>
            )}</div>
          </div>}
          {step===1&&<div className="quote-stage">
            <p className="quote-stage-label">STEP 02 / 04</p><h2>What would you like to improve or deliver?</h2><p>You don't need a formal brief. A few real details are enough.</p>
            <div className="quote-input-group"><span className="quote-label">Areas of interest <small>(optional, multiple choices)</small></span>
              <div className="quote-topics">{(topics[data.service||'other']).map(t=><label className={'quote-topic '+(data.topics.includes(t)?'chosen':'')} key={t}><input type="checkbox" checked={data.topics.includes(t)} onChange={()=>toggleTopic(t)}/><span>{data.topics.includes(t)?'✓':'+'} {t}</span></label>)}</div>
            </div>
            <label className="quote-input-group"><span className="quote-label">Describe the project or challenge <em>*</em></span><textarea value={data.description} maxLength={2500} rows={5} onChange={e=>set('description',e.target.value)} placeholder="What's happening today, and what do you need help with?" required/><small>At least 15 characters. Avoid sensitive company or customer details.</small></label>
            <label className="quote-input-group"><span className="quote-label">What would a useful outcome look like? <small>(optional)</small></span><textarea value={data.objective} maxLength={1800} rows={3} onChange={e=>set('objective',e.target.value)} placeholder="For example: clear task ownership, simpler follow-ups, or a working online booking flow."/></label>
          </div>}
          {step===2&&<div className="quote-stage">
            <p className="quote-stage-label">STEP 03 / 04</p><h2>Let's understand the scope.</h2><p>All these details are optional. Select “Not sure” whenever appropriate.</p>
            <div className="quote-input-grid">
              <label className="quote-input-group"><span className="quote-label">Desired timeline</span><select value={data.timeframe} onChange={e=>set('timeframe',e.target.value)}><option value="">Not sure</option><option>As soon as possible</option><option>Within 2–4 weeks</option><option>Within 1–3 months</option><option>Exploring for later</option></select></label>
              <label className="quote-input-group"><span className="quote-label">Indicative budget</span><select value={data.budget} onChange={e=>set('budget',e.target.value)}><option value="">Prefer to discuss / Not sure</option><option>Under $500</option><option>$500–$1,500</option><option>$1,500–$5,000</option><option>$5,000–$15,000</option><option>Above $15,000</option></select></label>
              <label className="quote-input-group"><span className="quote-label">Company or business</span><input value={data.company} onChange={e=>set('company',e.target.value)} maxLength={120} placeholder="Name (optional)"/></label>
              <label className="quote-input-group"><span className="quote-label">Team size</span><select value={data.team} onChange={e=>set('team',e.target.value)}><option value="">Not specified</option><option>Just me</option><option>2–10</option><option>11–50</option><option>50+</option></select></label>
            </div>
            <div className="quote-note"><strong>Scope first, price second.</strong> A tailored quote is possible only after reviewing the request and discussing any missing details.</div>
          </div>}
          {step===3&&<div className="quote-stage">
            <p className="quote-stage-label">STEP 04 / 04</p><h2>Where should I reply?</h2><p>I'll use these details only to follow up about your inquiry.</p>
            <div className="quote-input-grid">
              <label className="quote-input-group"><span className="quote-label">Full name <em>*</em></span><input required autoComplete="name" maxLength={120} value={data.name} onChange={e=>set('name',e.target.value)} placeholder="Your name"/></label>
              <label className="quote-input-group"><span className="quote-label">Email <em>*</em></span><input type="email" required autoComplete="email" maxLength={220} value={data.email} onChange={e=>set('email',e.target.value)} placeholder="you@company.com"/></label>
              <label className="quote-input-group"><span className="quote-label">Phone <small>(optional)</small></span><input type="tel" autoComplete="tel" maxLength={45} value={data.phone} onChange={e=>set('phone',e.target.value)} placeholder="+1 …"/></label>
              <label className="quote-input-group"><span className="quote-label">Preferred contact</span><select value={data.contactMethod} onChange={e=>set('contactMethod',e.target.value)}><option>Email</option><option>Phone</option><option>Video call</option></select></label>
            </div>
            <div className="quote-summary"><span className="hub-overline">REQUEST SUMMARY</span><strong>{quoteServices.find(s=>s.id===data.service)?.label}</strong><p>{data.description}</p><button type="button" onClick={()=>navigateStep(1)}>Edit project details ↗</button></div>
            <label className="quote-consent"><input type="checkbox" checked={data.consent} onChange={e=>set('consent',e.target.checked)} required/><span>I agree that AI PM LAB may use this information to respond to my inquiry. <em>*</em></span></label>
            <p className="quote-privacy">The request is transmitted through Formspree. Do not share passwords, sensitive client records, private financial details or confidential information.</p>
          </div>}
          {error&&<p className="quote-error" role="alert">{error}</p>}
          <div className="quote-actions">{step>0?<button type="button" className="quote-prev" onClick={()=>navigateStep(step-1)} disabled={sending}>← Back</button>:<Link to="/services" className="quote-prev">← Back to services</Link>}
            {step<3?<button type="button" className="hub-button hub-button-primary" onClick={()=>navigateStep(step+1)}>Continue →</button>:<button type="submit" className="hub-button hub-button-primary" disabled={sending}>{sending?'Sending…':tried?'Try again ↗':'Send free quote request ↗'}</button>}
          </div>
        </form>
      </div>
      <aside className="quote-sidebar"><div className="quote-aside-card"><span className="hub-overline">HOW IT WORKS</span><h3>One clear first step.</h3><ol><li><strong>Share your needs</strong><span>Tell me about the project and what matters to you.</span></li><li><strong>Review the scope</strong><span>Clarify feasibility, priorities and key questions.</span></li><li><strong>Agree on a plan</strong><span>Discuss a potential proposal or next step, if appropriate.</span></li></ol><p>Free inquiry. No obligation, automatic price or promised delivery date.</p></div><div className="quote-direct"><strong>Prefer a direct conversation?</strong><Link to="/contact">Contact AI PM LAB ↗</Link><a href="mailto:trigosatconsulting@gmail.com">trigosatconsulting@gmail.com</a></div></aside>
    </section>}
  </div>;
}
