import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { fallbackCatalog } from '../lib/catalog';
import { supabase } from '../lib/supabase';
import type { Resource } from '../lib/types';

const tabs = ['Overview', 'Free Library', 'Premium Library', '1:1 Sessions', 'Saved Resources', 'My Account'] as const;
type Tab = typeof tabs[number];

const consultingPhases = [
  ['00', 'FREE WORKFLOW CLARITY CALL', 'Find the right activity and understand the wider problem.', 'We review one recurring activity, how it currently works, where it breaks, and what other people, documents, decisions, or follow-ups depend on it.', 'YOU LEAVE WITH', 'Fit assessment, priority workflow, and recommended next step'],
  ['01', 'FOCUS', 'Choose the activity that can create the most useful improvement.', 'We identify the recurring activity where lost time, unclear information, inconsistent outputs, or missed follow-up create the greatest operational impact.', 'YOU RECEIVE', 'Priority Workflow Brief'],
  ['02', 'MAP', 'Connect the activity to the complete project around it.', 'We map inputs, people, responsibilities, documents, decisions, dependencies, risks, handoffs, and next actions.', 'YOU RECEIVE', 'Current-State Workflow Map and Project Context'],
  ['03', 'DESIGN', 'Define how the work should operate from start to finish.', 'We establish clear steps, ownership, completion criteria, review points, communication needs, and where AI can provide practical support.', 'YOU RECEIVE', 'Future-State Workflow Blueprint and Ownership Structure'],
  ['04', 'BUILD AND TEST', 'Create the system and use it on real work.', 'We build the prompts, templates, tracker, document structure, SOP, communication routine, or review checklist needed for the workflow. Then we test and correct it.', 'YOU RECEIVE', 'Tested Workflow Prototype and Human Review Process'],
  ['05', 'INTEGRATE AND SCALE', 'Put the system into the project and prepare the next expansion.', 'We document the process, define measures, connect it to related project activities, and identify what workflow should be improved next.', 'YOU RECEIVE', 'Working Project System and 30-Day Scale Plan'],
] as const;

function LibrarySidebar({ active, onChange, username, onLogout }: { active: Tab; onChange: (tab: Tab) => void; username: string; onLogout: () => void }) {
  const [open, setOpen] = React.useState(false);
  const choose = (tab: Tab) => { onChange(tab); setOpen(false); };
  return <>
    <button className="library-mobile-launcher" type="button" aria-label="Open Library navigation" aria-expanded={open} onClick={() => setOpen(true)}><span>Library</span><span aria-hidden="true">☰</span></button>
    {open && <button className="library-menu-backdrop" type="button" aria-label="Close Library navigation" onClick={() => setOpen(false)} />}
    <aside className={`library-sidebar ${open ? 'is-open' : ''}`} aria-label="Library navigation">
      <div className="library-sidebar-brand"><span>AI PM LAB</span><small>Resource Library</small><button className="library-mobile-close" type="button" aria-label="Close Library navigation" onClick={() => setOpen(false)}>×</button></div>
      <nav className="library-nav" aria-label="Member dashboard sections">{tabs.map((tab) => <button type="button" className={active === tab ? 'active' : ''} key={tab} onClick={() => choose(tab)}>{tab}</button>)}</nav>
      <div className="library-member-mini"><span>Free Member</span><strong>@{username}</strong></div>
      <button className="library-signout" type="button" onClick={onLogout}>Sign out</button>
    </aside>
  </>;
}

function ResourceCards({ resources, saved, onToggle, onDownload }: { resources: Resource[]; saved: string[]; onToggle: (resource: Resource) => void; onDownload: (resource: Resource, fileId: string) => void }) {
  return <div className="library-grid">{resources.map((resource) => <article className="library-resource-card" key={resource.id}>
    <div className="library-resource-top"><div><span className="library-badge">{resource.category}</span><span className="library-type">{resource.resource_type}</span></div><button className={saved.includes(resource.id) ? 'library-save saved' : 'library-save'} type="button" onClick={() => onToggle(resource)}>{saved.includes(resource.id) ? 'Saved' : 'Save'}</button></div>
    <h3>{resource.title}</h3><p>{resource.description}</p>
    <footer>{resource.status === 'available' ? (resource.resource_files ?? []).map((file) => <a className="library-download" key={file.id} href={file.public_url} download onClick={() => onDownload(resource, file.id)}>{file.language_code === 'it' ? 'PDF Italiano' : 'English PDF'} <span>↓</span></a>) : <span className="library-status">Coming Soon</span>}</footer>
  </article>)}</div>;
}

function ConsultingJourney() {
  return <section className="library-journey">
    <div className="library-journey-intro"><p className="eyebrow">THE 1:1 CONSULTING JOURNEY</p><h1>One free call.<span>Five phases.</span>Your project system takes shape.</h1><p>These are not generic AI lessons. Each phase advances a real workflow inside your business or project.</p><p>We begin with one recurring activity, connect it to the wider project, build the necessary system, test it on real work, and prepare it for continued use.</p></div>
    <div className="library-phase-list">{consultingPhases.map(([number, label, title, copy, resultLabel, result]) => <article className="library-phase" key={number}><div className="library-phase-number">{number}</div><div className="library-phase-copy"><p>{label}</p><h3>{title}</h3><span>{copy}</span></div><div className="library-phase-result"><p>{resultLabel}</p><strong>{result}</strong></div></article>)}</div>
    <div className="library-system-callout"><div><p className="eyebrow">THE RESULT</p><h2>Your own practical AI + Project Management system.</h2><p>Not a collection of prompts. A tested working system built around your activity: instructions, templates, trackers, documents, ownership, review points, and a routine your team can actually use.</p></div><a className="button light" href="https://calendly.com/propertydext/15min" target="_blank" rel="noreferrer">Book a Free Workflow Clarity Call</a></div>
  </section>;
}

function Onboarding(){const{session,profile,refresh}=useAuth();const[username,setUsername]=React.useState(profile?.username||'');const[privacy,setPrivacy]=React.useState(false);const[marketing,setMarketing]=React.useState(profile?.marketing_consent||false);const[message,setMessage]=React.useState('');return <section className="library-account"><p className="eyebrow">COMPLETE YOUR LIBRARY PROFILE</p><h1>Welcome to AI PM LAB</h1><p>Your Google email is verified by your authentication provider.</p><label>Display name<input readOnly value={profile?.display_name||''}/></label><label>Email address<input readOnly value={profile?.email||session?.user.email||''}/></label><label>Choose your Library username<input value={username} onChange={e=>setUsername(e.target.value)}/></label><label className="check"><input type="checkbox" checked={privacy} onChange={e=>setPrivacy(e.target.checked)}/>I agree to the Resource Library Privacy Notice.</label><label className="check"><input type="checkbox" checked={marketing} onChange={e=>setMarketing(e.target.checked)}/>Send me occasional Library updates.</label>{message&&<p className="form-error">{message}</p>}<button className="button primary" onClick={async()=>{if(!session||!profile||!privacy)return setMessage('Choose a username and accept the Privacy Notice.');const x=await supabase.rpc('is_username_available',{candidate:username.trim()});if(x.data!==true&&username.trim().toLowerCase()!==profile.username.toLowerCase())return setMessage('That username is not available.');await supabase.saveProfile(session,{username:username.trim(),marketing_consent:marketing,privacy_accepted_at:new Date().toISOString(),auth_provider:'google',onboarding_completed:true});await refresh()}}>Open my Library</button></section>}

function Account(){const{profile,session,refresh,signOut}=useAuth();const[username,setUsername]=React.useState(profile?.username||'');const[marketing,setMarketing]=React.useState(profile?.marketing_consent||false);const[message,setMessage]=React.useState('');return <div className="library-account"><p className="eyebrow">MEMBER PROFILE</p><h1>My Account</h1><label>Username<input value={username} onChange={e=>setUsername(e.target.value)}/></label><label>Verified email<input readOnly value={profile?.email||session?.user.email||''}/></label><div className="library-account-note"><strong>Authentication method:</strong> {profile?.auth_provider==='google'?'Google':'Email'}<br/><strong>Membership:</strong> {profile?.membership_tier||'free'} Member</div><label className="check"><input type="checkbox" checked={marketing} onChange={e=>setMarketing(e.target.checked)}/>Receive occasional Library updates.</label><button className="button primary" onClick={async()=>{if(!session||!profile)return;const check=await supabase.rpc('is_username_available',{candidate:username.trim()});if(check.data!==true&&username.trim().toLowerCase()!==profile.username.toLowerCase())return setMessage('That username is not available.');await supabase.saveProfile(session,{username:username.trim(),marketing_consent:marketing});await refresh();setMessage('Profile updated.')}}>Save profile</button>{message&&<p>{message}</p>}<button className="button secondary" onClick={()=>void signOut()}>Sign out</button></div>}

export function Library() {
  const { loading, session, profile, signOut } = useAuth(); const navigate = useNavigate(); const [tab, setTab] = React.useState<Tab>('Overview'); const [items, setItems] = React.useState<Resource[]>(fallbackCatalog); const [saved, setSaved] = React.useState<string[]>([]); const [query, setQuery] = React.useState('');
  React.useEffect(() => { if (!loading && !session) navigate('/resources?access=required'); if (!loading && session && !profile) navigate('/resources#library-access'); }, [loading, session, profile, navigate]);
  React.useEffect(() => { if (session) { void supabase.catalog(session).then(setItems).catch(() => undefined); void supabase.bookmarks(session).then((rows) => setSaved(rows.map((row) => row.resource_id))).catch(() => undefined); } }, [session]);
  if (loading || !session) return <div className="library-loading">Preparing your Library…</div>;
  if (!profile || !profile.onboarding_completed) return <Onboarding />;
  const toggle = async (resource: Resource) => { const isSaved = saved.includes(resource.id); await supabase.toggleBookmark(session, resource.id, isSaved); await supabase.activity(session, resource.id, isSaved ? 'unsave' : 'save'); setSaved((current) => isSaved ? current.filter((id) => id !== resource.id) : [...current, resource.id]); };
  const download = (resource: Resource, fileId: string) => { void supabase.activity(session, resource.id, 'download', fileId); };
  const filtered = items.filter((resource) => `${resource.title} ${resource.description} ${resource.category}`.toLowerCase().includes(query.toLowerCase()));
  let content: React.ReactNode;
  if (tab === 'Overview') content = <><section className="library-welcome"><p className="eyebrow">MEMBER OVERVIEW</p><h1>Welcome back, <span>@{profile.username}</span></h1><p>Your calm space for practical tools, useful references, and the next step in building a better workflow.</p><div className="library-welcome-actions"><button className="button light" onClick={() => setTab('Free Library')}>Browse the Library</button><button className="library-text-button" onClick={() => setTab('1:1 Sessions')}>Explore the 1:1 journey →</button></div></section><section className="library-overview-grid"><article><span>START HERE</span><h3>Before You Prompt: The Clarity Checklist</h3><p>Use one clear framework before you ask AI to do the work.</p><button onClick={() => setTab('Free Library')}>Open resource library →</button></article><article><span>YOUR TOOLKIT</span><strong>{saved.length}</strong><p>Saved resources ready to revisit.</p><button onClick={() => setTab('Saved Resources')}>View saved resources →</button></article><article><span>ACCESS</span><h3>Free Library</h3><p>Active on this browser. Premium tools can be added later.</p></article></section></>;
  else if (tab === 'Free Library') content = <><div className="library-page-heading"><div><p className="eyebrow">FREE LIBRARY</p><h1>Practical tools for real work.</h1></div><input aria-label="Search the Library" placeholder="Search resources" value={query} onChange={(event) => setQuery(event.target.value)} /></div><ResourceCards resources={filtered} saved={saved} onToggle={(resource) => void toggle(resource)} onDownload={download} /></>;
  else if (tab === 'Saved Resources') content = <><div className="library-page-heading"><div><p className="eyebrow">PERSONAL TOOLKIT</p><h1>Saved resources</h1></div></div>{saved.length ? <ResourceCards resources={items.filter((resource) => saved.includes(resource.id))} saved={saved} onToggle={(resource) => void toggle(resource)} onDownload={download} /> : <div className="library-empty"><h2>Your toolkit starts here.</h2><p>Save useful resources to build your personal AI PM LAB toolkit.</p><button className="button primary" onClick={() => setTab('Free Library')}>Browse resources</button></div>}</>;
  else if (tab === 'Premium Library') content = <div className="library-empty"><p className="eyebrow">FUTURE ACCESS</p><h1>Premium tools can be added here when protected delivery and payments are introduced.</h1><p>Future premium resources may include editable workflow packs, advanced templates, implementation tools, and sector-specific systems.</p><button className="button primary" onClick={() => setTab('My Account')}>Request Premium Updates</button></div>;
  else if (tab === '1:1 Sessions') content = <ConsultingJourney />;
  else content = <Account />;
  return <div className="library-dashboard"><LibrarySidebar active={tab} onChange={setTab} username={profile.username} onLogout={() => void signOut()} /><main className="library-main"><header className="library-topbar"><div><span>AI PM LAB</span><small>Member Library</small></div><strong>Free Member</strong></header>{content}</main></div>;
}
