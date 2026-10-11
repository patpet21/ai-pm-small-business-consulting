import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { quoteServices } from './FreeQuote';

type Screen = 'home'|'quote'|'projects'|'products'|'opportunities'|'faq'|'answer';
const faqs = [
  { question:'What does AI PM LAB do?', answer:'AI PM LAB focuses on project coordination, business operations, workflow improvement and practical AI and digital solutions. The approach starts with the business problem, not with a tool.', link:'/services', linkText:'Explore services' },
  { question:'Is a quote really free?', answer:'Yes. The initial inquiry is free and carries no obligation. A price is not generated automatically; scope and feasibility need to be discussed before a proposal.', link:'/quote', linkText:'Request a free quote' },
  { question:'Do you create websites?', answer:'Digital projects, including websites, forms and dashboards, are available as a complementary capability. AI PM LAB is primarily about project management and operations.', link:'/quote?service=digital-project', linkText:'Discuss a digital project' },
  { question:'Do all solutions use AI?', answer:'No. A checklist, tracker or better responsibility structure can be more useful than automation. AI is introduced selectively, with human review where appropriate.', link:'/services', linkText:'See the approach' },
  { question:'Can we discuss a job or collaboration?', answer:'Yes. You can review the portfolio and professional background, then send a message about a role, internship or other professional collaboration.', link:'/contact', linkText:'Contact AI PM LAB' },
];
function ChatIcon() {
  return <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5 7.7 7.7 0 0 1-4.1-1.2L4 20l1.2-4.4A7.5 7.5 0 1 1 20 11.5Z"/><path d="M8.6 11.6h.01M12 11.6h.01M15.4 11.6h.01"/></svg>;
}
export function ProjectAssistant() {
  const location=useLocation();
  const navigate=useNavigate();
  const [open,setOpen]=React.useState(false);
  const [screen,setScreen]=React.useState<Screen>('home');
  const [service,setService]=React.useState<string>(quoteServices[0].id);
  const [faqIndex,setFaqIndex]=React.useState(0);
  const opener=React.useRef<HTMLButtonElement>(null);
  const closeButton=React.useRef<HTMLButtonElement>(null);
  React.useEffect(()=>{setOpen(false);setScreen('home');},[location.pathname]);
  React.useEffect(()=>{
    if(!open)return;
    const onEscape=(event:KeyboardEvent)=>{
      if(event.key==='Escape'){setOpen(false);opener.current?.focus();}
    };
    document.addEventListener('keydown',onEscape);
    closeButton.current?.focus();
    return ()=>document.removeEventListener('keydown',onEscape);
  },[open]);
  const go=(target:string)=>{setOpen(false);navigate(target);};
  const close=()=>{setOpen(false);opener.current?.focus();};
  if(location.pathname==='/library'||location.pathname==='/real-estate-ai-pm-pilot')return null;
  const selected=quoteServices.find(s=>s.id===service)??quoteServices[0];
  const faq=faqs[faqIndex];
  return <div className={'pm-assistant '+(open?'is-open':'')}>
    {open&&<section className="pm-assistant-panel" role="dialog" aria-modal="false" aria-label="AI PM LAB guided assistant">
      <header className="pm-assistant-header"><span className="pm-assistant-avatar">PM</span><span className="pm-assistant-head-copy"><strong>AI PM LAB Assistant</strong><small>Guided navigation · No AI or live agent</small></span><button ref={closeButton} className="pm-assistant-close" type="button" onClick={close} aria-label="Close assistant">×</button></header>
      <div className="pm-assistant-body">
        {screen==='home'&&<>
          <span className="pm-assistant-eyebrow">WELCOME</span><h2>What can I help you find?</h2><p>Choose a topic below. This is a guided menu, not an AI chatbot.</p>
          <div className="pm-assistant-menu">
            <button type="button" onClick={()=>setScreen('quote')}><span>◈</span><span><strong>Discuss a new project</strong><small>Choose a service and request a free quote</small></span><i>›</i></button>
            <button type="button" onClick={()=>setScreen('projects')}><span>▧</span><span><strong>Explore work & experience</strong><small>Practical experience and selected projects</small></span><i>›</i></button>
            <button type="button" onClick={()=>setScreen('products')}><span>◇</span><span><strong>Products & free resources</strong><small>PrivacyGate, PropertyDEX, Library and pilot</small></span><i>›</i></button>
            <button type="button" onClick={()=>setScreen('opportunities')}><span>↗</span><span><strong>Hiring or collaboration</strong><small>Professional experience and contact</small></span><i>›</i></button>
            <button type="button" onClick={()=>setScreen('faq')}><span>?</span><span><strong>Quick questions</strong><small>What AI PM LAB does and how it works</small></span><i>›</i></button>
          </div>
        </>}
        {screen==='quote'&&<>
          <button type="button" className="pm-assistant-back" onClick={()=>setScreen('home')}>← All topics</button>
          <span className="pm-assistant-eyebrow">START A PROJECT</span><h2>What area fits your request?</h2><p>Choose the closest match. You can describe the details in the next step.</p>
          <div className="pm-assistant-options">{quoteServices.map(s=><button key={s.id} type="button" className={service===s.id?'selected':''} onClick={()=>setService(s.id)}><span><strong>{s.label}</strong><small>{s.sub}</small></span><i>{service===s.id?'✓':'○'}</i></button>)}</div>
          <div className="pm-assistant-selected"><strong>{selected.label}</strong><small>Your choice will prefill the free quote form. No automatic pricing.</small></div>
          <button className="pm-assistant-primary" type="button" onClick={()=>go('/quote?service='+encodeURIComponent(selected.id))}>Continue to free quote ↗</button>
        </>}
        {screen==='projects'&&<>
          <button type="button" className="pm-assistant-back" onClick={()=>setScreen('home')}>← All topics</button><span className="pm-assistant-eyebrow">SELECTED WORK</span><h2>Explore projects and experience.</h2><p>See how coordination, digital implementation and workflow thinking come together.</p>
          <div className="pm-assistant-links"><button type="button" onClick={()=>go('/projects#retail-operations')}>NYC retail IT coordination ↗</button><button type="button" onClick={()=>go('/projects#real-estate')}>Real Estate AI PM Pilot ↗</button><button type="button" onClick={()=>go('/projects#web-demos')}>Small-business digital demos ↗</button></div>
          <button className="pm-assistant-primary" type="button" onClick={()=>go('/projects')}>Full portfolio ↗</button>
        </>}
        {screen==='products'&&<>
          <button type="button" className="pm-assistant-back" onClick={()=>setScreen('home')}>← All topics</button><span className="pm-assistant-eyebrow">PRODUCTS & RESOURCES</span><h2>Explore the AI PM LAB ecosystem.</h2><p>Find products, experiments and practical resources.</p>
          <div className="pm-assistant-links"><button type="button" onClick={()=>go('/products#privacygate')}>PrivacyGate & platform links ↗</button><button type="button" onClick={()=>go('/products')}>PropertyDEX & other projects ↗</button><button type="button" onClick={()=>go('/resources')}>Free resources & Library ↗</button><button type="button" onClick={()=>go('/real-estate-ai-pm-pilot')}>Real Estate AI PM Pilot ↗</button></div>
        </>}
        {screen==='opportunities'&&<>
          <button type="button" className="pm-assistant-back" onClick={()=>setScreen('home')}>← All topics</button><span className="pm-assistant-eyebrow">PROFESSIONAL OPPORTUNITIES</span><h2>Exploring a role or collaboration?</h2><p>Review the engineering and project coordination background, operations experience and selected digital work.</p>
          <div className="pm-assistant-links"><button type="button" onClick={()=>go('/about')}>Professional background ↗</button><button type="button" onClick={()=>go('/projects')}>Selected case studies ↗</button></div>
          <button className="pm-assistant-primary" type="button" onClick={()=>go('/contact')}>Contact about an opportunity ↗</button>
        </>}
        {screen==='faq'&&<>
          <button type="button" className="pm-assistant-back" onClick={()=>setScreen('home')}>← All topics</button><span className="pm-assistant-eyebrow">QUICK ANSWERS</span><h2>Frequently asked questions.</h2>
          <div className="pm-assistant-links">{faqs.map((entry,i)=><button type="button" key={entry.question} onClick={()=>{setFaqIndex(i);setScreen('answer');}}>{entry.question}<span>›</span></button>)}</div>
        </>}
        {screen==='answer'&&<>
          <button type="button" className="pm-assistant-back" onClick={()=>setScreen('faq')}>← More questions</button><span className="pm-assistant-eyebrow">QUICK ANSWER</span><h2>{faq.question}</h2><p className="pm-assistant-answer">{faq.answer}</p>
          <button type="button" className="pm-assistant-primary" onClick={()=>go(faq.link)}>{faq.linkText} ↗</button>
        </>}
      </div>
      <footer className="pm-assistant-footer"><span>●</span> Guided help · AI PM LAB <button type="button" onClick={()=>go('/contact')}>Contact ↗</button></footer>
    </section>}
    <button className="pm-assistant-launcher" ref={opener} type="button" aria-expanded={open} aria-haspopup="dialog" aria-label={open?'Close AI PM LAB assistant':'Open AI PM LAB guided assistant'} onClick={()=>open?close():setOpen(true)}>{open?<span className="pm-assistant-x">×</span>:<ChatIcon/>}<span>{open?'Close':'Project Assistant'}</span></button>
  </div>;
}
