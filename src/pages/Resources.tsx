import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { fallbackCatalog } from '../lib/catalog';
import { supabase } from '../lib/supabase';
import type { Resource } from '../lib/types';

function Card({ resource }: { resource: Resource }) { return <article className="library-resource-card"><div><span className="library-badge">{resource.category}</span><span className="library-type">{resource.resource_type}</span></div><h3>{resource.title}</h3><p>{resource.description}</p><footer>{resource.status === 'available' && (resource.resource_files || []).map((file) => <a className="library-download" key={file.id} href={file.public_url} download>{file.language_code === 'it' ? '🇮🇹 Scarica PDF Italiano' : '🇺🇸 Download English PDF'}</a>)}</footer></article>; }

function AuthPanel() {
  const { profile, session } = useAuth(); const navigate = useNavigate();
  const [mode, setMode] = React.useState<'login' | 'create'>('login'); const [identifier, setIdentifier] = React.useState(''); const [username, setUsername] = React.useState(''); const [email, setEmail] = React.useState(''); const [privacy, setPrivacy] = React.useState(false); const [marketing, setMarketing] = React.useState(false); const [message, setMessage] = React.useState(''); const [busy, setBusy] = React.useState(false);
  const google = async () => { setBusy(true); const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: 'https://aipmlab.propertydex.xyz/library' } }); if (error) setMessage('Google sign-in could not start. Please try again.'); setBusy(false); };
  const openLibrary = () => { supabase.grantLibraryAccess(); navigate('/library'); };
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setMessage('');
    if (mode === 'login') {
      const candidate = identifier.trim().toLowerCase(); if (candidate.length < 2) return setMessage('Enter your username or email.');
      setBusy(true); try { if (await supabase.libraryMemberExists(candidate)) openLibrary(); else setMessage('No Library account matches that username or email.'); } catch { setMessage('We could not check your Library account. Please try again.'); } finally { setBusy(false); } return;
    }
    const candidate = username.trim(); const address = email.trim().toLowerCase();
    if (candidate.length < 2 || candidate.length > 40) return setMessage('Choose a username between 2 and 40 characters.');
    if (!/^\S+@\S+\.\S+$/.test(address)) return setMessage('Enter a valid email address.');
    if (!privacy) return setMessage('Accept the Resource Library Privacy Notice to continue.');
    setBusy(true); try { if (await supabase.registerLibraryMember(candidate, address)) openLibrary(); else setMessage('That username is already in use with another email.'); } catch (error) { const detail = error instanceof Error ? error.message : 'Please try again.'; setMessage(`We could not create your Library account: ${detail}`); } finally { setBusy(false); }
  };
  if (profile || session || supabase.hasLibraryAccess()) return <div className="library-access-form"><h2>Your Library account is ready.</h2><button className="button primary" onClick={() => navigate('/library')}>Open My Library</button></div>;
  return <form className="library-access-form" onSubmit={submit}><div className="library-auth-tabs"><button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>Log In</button><button type="button" className={mode === 'create' ? 'active' : ''} onClick={() => setMode('create')}>Create Account</button></div>{mode === 'login' ? <><p className="eyebrow">MEMBER ACCESS</p><h2>Log in to your AI PM LAB Library</h2><p>Use your username or email, or continue with Google.</p><label>Username or email<input placeholder="Enter your username or email" value={identifier} onChange={(event) => setIdentifier(event.target.value)} /></label><button className="button primary" disabled={busy}>Continue</button><button className="button secondary" type="button" disabled={busy} onClick={() => void google()}>Continue with Google</button><small>No password required.</small></> : <><p className="eyebrow">FREE MEMBER ACCESS</p><h2>Create your free Library account</h2><p>Save resources and return to your Library without creating a password.</p><label>Username<input placeholder="Choose your Library username" value={username} onChange={(event) => setUsername(event.target.value)} /></label><label>Email address<input type="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} /></label><label className="check"><input type="checkbox" checked={privacy} onChange={(event) => setPrivacy(event.target.checked)} />I agree to the <Link to="/resource-library-privacy-notice">Resource Library Privacy Notice</Link> and understand that my details will be used to create and maintain my Library account.</label><label className="check"><input type="checkbox" checked={marketing} onChange={(event) => setMarketing(event.target.checked)} />Send me occasional exclusive AI PM LAB resources, templates, and Library updates.</label><button className="button primary" disabled={busy}>Create Account</button><button className="button secondary" type="button" disabled={busy} onClick={() => void google()}>Continue with Google</button></>}{message && <p className="form-error">{message}</p>}</form>;
}

export function Resources() {
  const [items, setItems] = React.useState<Resource[]>(fallbackCatalog);
  React.useEffect(() => { void supabase.catalog().then(setItems).catch(() => undefined); }, []);
  const pub = items.filter((item) => item.access_level === 'public' && item.status === 'available').slice(0, 3);
  const pre = items.filter((item) => item.access_level === 'free_member').slice(0, 4);
  const libraryCta = <a className="button primary" href="#library-access">View Library</a>;

  return <>
    <section className="resources-page-shell resources-hero"><div className="section-shell resources-hero-inner"><p className="eyebrow">FREE AI + WORKFLOW RESOURCES</p><h1>Practical AI resources for clearer work, better decisions, and stronger workflows.</h1><p className="hero-lede">Open tools for a stronger first step, plus a free Library for the complete collection.</p><div className="resources-library-cta">{libraryCta}</div></div></section>
    <section className="section-shell library-section"><p className="eyebrow">OPEN RESOURCES</p><h2>Start with these practical tools.</h2><div className="library-grid">{pub.map((resource) => <Card key={resource.id} resource={resource} />)}</div></section>
    <section className="section-shell resources-library-cta-wrap"><div className="resources-library-cta">{libraryCta}</div></section>
    <section className="section-shell library-section"><p className="eyebrow">MEMBER PREVIEW</p><h2>More resources in the free Library.</h2><div className="library-grid">{pre.map((resource) => <Card key={resource.id} resource={{ ...resource, resource_files: [] }} />)}</div></section>
    <section className="section-shell library-access-wrap" id="library-access"><AuthPanel /></section>
  </>;
}
