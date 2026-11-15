import React from 'react';
import { Link } from 'react-router-dom';
import '../content-studio.css';

type Slide = { kicker: string; title: string; body: string };
type Example = { id: string; label: string; audience: string; problem: string; slides: Slide[]; caption: string };
type CreatorInfo = { nickname?: string; username?: string; avatarUrl?: string; privacyOptions: string[]; commentDisabled: boolean };
type StatusResult = { configured: boolean; connected: boolean; nickname?: string; error?: string };

const examples: Example[] = [
  {
    id: 'inbox', label: 'Customer requests', audience: 'Retail & service teams',
    problem: 'Customer messages arrive, but nobody knows who owns the next response.',
    slides: [
      { kicker: 'REAL OPERATIONAL PROBLEM', title: 'Who owns the customer request?', body: 'When messages arrive across different shifts, follow-ups can easily disappear.' },
      { kicker: 'BEFORE · THE BOTTLENECK', title: 'A crowded inbox is not a process.', body: 'Requests arrive. Team members check manually. The next action is unclear.' },
      { kicker: 'THE WORKFLOW', title: 'Turn messages into accountable tasks.', body: 'Receive an inquiry → log it → assign an owner → set a follow-up reminder.' },
      { kicker: 'HUMAN CONTROL', title: 'AI can suggest. People decide.', body: 'AI may categorize requests. A team member reviews priorities and approves replies.' },
      { kicker: 'PRACTICAL NEXT STEP', title: 'Start with one shared request queue.', body: 'Track the request, owner, due date and outcome. Test the process before expanding.' },
    ],
    caption: 'Customer requests getting lost? A simple shared queue with clear ownership and human-reviewed replies can make a difference. This is an illustrative process, not a claimed client result. #SmallBusiness #BusinessOperations #Workflow'
  },
  {
    id: 'property', label: 'Property maintenance', audience: 'Property managers',
    problem: 'Tenant maintenance emails sit in separate inboxes and urgent issues are missed.',
    slides: [
      { kicker: 'PROPERTY OPERATIONS', title: 'A maintenance email is not a ticket.', body: 'The problem begins when no one is responsible for the next step.' },
      { kicker: 'BEFORE · THE BOTTLENECK', title: 'Too many scattered updates.', body: 'Tenant reports, vendor replies and manager notes live in separate conversations.' },
      { kicker: 'THE WORKFLOW', title: 'Give every issue a clear path.', body: 'Capture request → flag urgency → assign vendor → track resolution.' },
      { kicker: 'HUMAN CONTROL', title: 'Escalations need real judgment.', body: 'A property manager checks critical incidents and confirms the right response.' },
      { kicker: 'PRACTICAL NEXT STEP', title: 'Make open issues visible.', body: 'A simple tracker can show location, owner, status and next action.' }
    ],
    caption: 'Property maintenance problems often start with missing ownership. Here is a practical intake-to-resolution workflow for small property teams. Concept example; always review urgent cases personally. #PropertyManagement #ProjectManagement'
  },
  {
    id: 'projects', label: 'Project coordination', audience: 'Independent consultants & teams',
    problem: 'Meeting actions are discussed, but deadlines and owners do not get recorded.',
    slides: [
      { kicker: 'PROJECT MANAGEMENT', title: 'Meetings should create actions.', body: 'A conversation without clear ownership is not a project plan.' },
      { kicker: 'BEFORE · THE BOTTLENECK', title: 'The follow-up disappears.', body: 'Notes sit in documents. Decisions are buried. Next steps are assumed.' },
      { kicker: 'THE WORKFLOW', title: 'Make each decision actionable.', body: 'Capture notes → identify tasks → assign owner → set due date.' },
      { kicker: 'HUMAN CONTROL', title: 'Review AI-extracted actions.', body: 'The project lead confirms commitments before notifying stakeholders.' },
      { kicker: 'PRACTICAL NEXT STEP', title: 'Build a 10-minute action review.', body: 'A weekly board can show open decisions, blockers and overdue actions.' }
    ],
    caption: 'If action items disappear after meetings, the problem is often the handoff. Here is a simple approach to task ownership, follow-ups and review. #ProjectManagement #Operations #AIAutomation'
  }
];

function rounded(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const rad = Math.min(r, w / 2, h / 2);
  ctx.beginPath(); ctx.moveTo(x + rad, y);
  ctx.arcTo(x + w, y, x + w, y + h, rad);
  ctx.arcTo(x + w, y + h, x, y + h, rad);
  ctx.arcTo(x, y + h, x, y, rad);
  ctx.arcTo(x, y, x + w, y, rad); ctx.closePath();
}
function wrap(ctx: CanvasRenderingContext2D, text: string, max: number) {
  const paragraphs = text.split('\n'); const lines: string[] = [];
  for (const paragraph of paragraphs) {
    let line = '';
    for (const word of paragraph.split(' ')) {
      if (!word) continue;
      const candidate = line ? line + ' ' + word : word;
      if (ctx.measureText(candidate).width > max && line) { lines.push(line); line = word; }
      else line = candidate;
    }
    lines.push(line);
  }
  return lines;
}
function renderSlide(ctx: CanvasRenderingContext2D, slide: Slide, index: number) {
  const w = 1080, h = 1920; const safeTitle = slide.title.slice(0, 180);
  ctx.clearRect(0, 0, w, h);
  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, '#041626'); bg.addColorStop(.48, '#09253b'); bg.addColorStop(1, '#081020');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
  const glow = ctx.createRadialGradient(720, 1150, 30, 690, 1160, 780);
  glow.addColorStop(0, 'rgba(47,196,192,.24)'); glow.addColorStop(.5, 'rgba(35,101,155,.10)'); glow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = glow; ctx.fillRect(0, 400, w, 1470);
  // Original pseudo-3D workflow geometry. Never add a third-party watermark to exported content.
  const nodes = [
    {x: 170, y: 1140, c: '#30c6c1', t: 'INPUT'},
    {x: 540, y: 1050, c: '#e5b36f', t: 'PROCESS'},
    {x: 830, y: 1240, c: '#61a8e3', t: 'OUTPUT'}
  ];
  ctx.lineWidth = 8; ctx.strokeStyle = 'rgba(143,221,223,.40)';
  ctx.beginPath(); ctx.moveTo(230, 1250); ctx.bezierCurveTo(380, 1040, 450, 1080, 540, 1140);
  ctx.bezierCurveTo(690, 1260, 760, 1360, 840, 1290); ctx.stroke();
  nodes.forEach((node, i) => {
    ctx.save(); ctx.shadowColor = node.c; ctx.shadowBlur = 55; ctx.shadowOffsetY = 20;
    ctx.fillStyle = '#0d3043'; rounded(ctx, node.x - 125, node.y - 85, 250, 170, 27); ctx.fill();
    ctx.restore();
    ctx.fillStyle = 'rgba(255,255,255,.06)'; rounded(ctx, node.x - 108, node.y - 98, 216, 45, 10); ctx.fill();
    ctx.strokeStyle = node.c; ctx.lineWidth = 3; rounded(ctx, node.x - 125, node.y - 85, 250, 170, 27); ctx.stroke();
    ctx.fillStyle = node.c; ctx.beginPath(); ctx.arc(node.x - 70, node.y - 2, 18, 0, Math.PI * 2); ctx.fill();
    ctx.font = 'bold 26px sans-serif'; ctx.fillStyle = '#f6fbff'; ctx.fillText(node.t, node.x - 35, node.y + 6);
    ctx.font = 'bold 20px sans-serif'; ctx.fillStyle = '#9dc4d0'; ctx.fillText('0' + (i + 1), node.x - 100, node.y + 63);
  });
  // Text layout is also used by downloads, not merely a CSS mockup.
  ctx.fillStyle = '#e9bb7b'; ctx.font = 'bold 26px sans-serif'; ctx.letterSpacing = '5px';
  ctx.fillText((slide.kicker || 'WORKFLOW STORY').slice(0, 43).toUpperCase(), 90, 140);
  ctx.letterSpacing = '0px'; ctx.fillStyle = '#f9fbfd';
  let size = 76; let lines: string[] = [];
  do { ctx.font = 'bold ' + size + 'px sans-serif'; lines = wrap(ctx, safeTitle || 'Your headline', 890); if(lines.length <= 5)break; size-=4; } while(size > 44);
  let y = 285; lines.slice(0, 6).forEach(t => { ctx.fillText(t, 90, y); y += size * 1.12; });
  ctx.fillStyle = '#c1d6df'; ctx.font = '34px sans-serif'; let bodyLines = wrap(ctx, slide.body.slice(0, 460), 880);
  let by = Math.max(y + 80, 610);
  bodyLines.slice(0, 9).forEach(t => { ctx.fillText(t, 90, by); by += 52; });
  ctx.strokeStyle = 'rgba(247,250,253,.16)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(90, 1635); ctx.lineTo(990, 1635); ctx.stroke();
  ctx.fillStyle = '#adbdc9'; ctx.font = '28px sans-serif'; ctx.fillText('A PRACTICAL WORKFLOW STORY', 90, 1703);
  ctx.fillStyle = '#e5b36f'; ctx.font = 'bold 29px sans-serif'; ctx.fillText(String(index + 1).padStart(2, '0') + ' / 05', 868, 1703);
}
function canvasJpeg(slide: Slide, idx: number, quality = 0.82): string {
  const canvas = document.createElement('canvas'); canvas.width = 1080; canvas.height = 1920;
  const ctx = canvas.getContext('2d'); if (!ctx) throw new Error('Canvas rendering is unavailable.');
  renderSlide(ctx, slide, idx); return canvas.toDataURL('image/jpeg', quality);
}
const privacyLabels: Record<string,string> = {
  PUBLIC_TO_EVERYONE: 'Everyone', MUTUAL_FOLLOW_FRIENDS: 'Friends',
  FOLLOWER_OF_CREATOR: 'Followers', SELF_ONLY: 'Only me (private)'
};

export function TikTokStudio() {
  const [exampleId, setExampleId] = React.useState(examples[0].id);
  const [slides, setSlides] = React.useState<Slide[]>(examples[0].slides);
  const [selected, setSelected] = React.useState(0);
  const [caption, setCaption] = React.useState(examples[0].caption);
  const [title, setTitle] = React.useState(examples[0].slides[0].title);
  const [account, setAccount] = React.useState<StatusResult | null>(null);
  const [creator, setCreator] = React.useState<CreatorInfo | null>(null);
  const [privacy, setPrivacy] = React.useState('');
  const [comments, setComments] = React.useState(false);
  const [commercial, setCommercial] = React.useState(false);
  const [ownBrand, setOwnBrand] = React.useState(false);
  const [paidBrand, setPaidBrand] = React.useState(false);
  const [aiGenerated, setAiGenerated] = React.useState(false);
  const [consent, setConsent] = React.useState(false);
  const [result, setResult] = React.useState('');
  const [publishId, setPublishId] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => { const ctx = canvasRef.current?.getContext('2d'); if(ctx) renderSlide(ctx, slides[selected], selected); }, [slides, selected]);
  React.useEffect(() => {
    let mounted = true;
    fetch('/api/studio/status', { credentials: 'same-origin' })
      .then(async r => r.ok ? await r.json() as StatusResult : null)
      .then(async state => {
        if (!mounted || !state) { if(mounted)setAccount({configured:false,connected:false}); return; }
        setAccount(state);
        if (state.connected) {
          const creatorResp = await fetch('/api/studio/creator', {credentials:'same-origin'});
          const info = await creatorResp.json() as CreatorInfo & {error?:string};
          if(mounted && creatorResp.ok) setCreator(info);
          else if(mounted) setResult(info.error || 'Unable to retrieve TikTok creator settings.');
        }
      }).catch(()=>{if(mounted)setAccount({configured:false,connected:false});});
    return () => { mounted = false; };
  }, []);
  function selectExample(id: string) {
    const item = examples.find(e=>e.id===id) || examples[0];
    setExampleId(item.id); setSlides(item.slides.map(s=>({...s}))); setSelected(0); setTitle(item.slides[0].title); setCaption(item.caption); setResult('');
  }
  function update(field: keyof Slide, value: string) { setSlides(old => old.map((s,i)=>i===selected ? {...s,[field]:value} : s)); }
  function download() {
    const url = canvasJpeg(slides[selected],selected,.90);
    const a = document.createElement('a'); a.href = url; a.download = 'workflow-story-' + (selected+1) + '.jpg'; a.click();
  }
  async function postToTikTok() {
    if (!account?.connected || !creator || !privacy || !consent || busy) return;
    setBusy(true); setResult('');
    try {
      const images = slides.map((s,i)=>canvasJpeg(s,i,.78));
      const response = await fetch('/api/studio/post', {
        method:'POST', credentials:'same-origin',
        headers:{'Content-Type':'application/json','X-Studio-Request':'1'},
        body: JSON.stringify({images,title,caption,privacy,comments,commercial,ownBrand,paidBrand,aiGenerated,consent})
      });
      const data = await response.json() as {publishId?:string;error?:string;message?:string};
      if(!response.ok) throw new Error(data.error || 'Could not submit your carousel.');
      if(data.publishId) setPublishId(data.publishId);
      setResult('Content submitted to TikTok. Processing may take several minutes. Check the status below.');
    } catch(e) { setResult(e instanceof Error ? e.message : 'Upload failed.'); }
    finally { setBusy(false); }
  }
  async function checkStatus() {
    if(!publishId)return;
    setBusy(true);
    try {
      const response = await fetch('/api/studio/publish-status?id='+encodeURIComponent(publishId),{credentials:'same-origin'});
      const data=await response.json() as {status?:string;error?:string};
      setResult(response.ok?'TikTok status: '+(data.status||'processing'):data.error||'Status unavailable');
    } catch{setResult('Unable to check the publishing status.');}
    finally{setBusy(false);}
  }
  const cannotPost = busy || !creator || !privacy || !consent || !title.trim() || !caption.trim() ||
    (commercial && !ownBrand && !paidBrand) || (paidBrand && privacy==='SELF_ONLY');
  return (
    <div className="studio">
      <section className="studio-hero section-shell">
        <div className="studio-hero-content">
          <p className="studio-eyebrow">AI PM LAB / CONTENT STUDIO</p>
          <h1>Turn a real business problem into a useful content story.</h1>
          <p>For independent creators, consultants and small businesses. Choose a workflow, shape five clear slides, review every word and export your own vertical carousel.</p>
          <div className="studio-hero-actions">
            <a href="#studio-workspace" className="studio-action">Create a carousel <span aria-hidden="true">↗</span></a>
            <span>Free editor · No account required to download</span>
          </div>
        </div>
        <div className="studio-hero-art" aria-hidden="true">
          <div className="studio-art-panel studio-art-back"></div><div className="studio-art-panel studio-art-middle"></div>
          <div className="studio-art-panel studio-art-front"><span>01</span><span>PROBLEM</span><b>→</b><span>PROCESS</span><b>→</b><span>OUTCOME</span></div>
        </div>
      </section>

      <section className="studio-intro section-shell">
        <div><strong>01</strong><span>Identify a real operational problem</span></div>
        <div><strong>02</strong><span>Build and review five visual slides</span></div>
        <div><strong>03</strong><span>Download, or authorize TikTok sharing</span></div>
      </section>

      <section className="studio-workspace section-shell" id="studio-workspace">
        <div className="studio-section-heading"><p className="studio-eyebrow">YOUR CREATIVE WORKSPACE</p><h2>Make something practical.</h2><p>Choose a starter example or rewrite every field for your own business. Nothing here is posted automatically.</p></div>
        <div className="studio-grid">
          <div className="studio-editor">
            <div className="studio-block">
              <label htmlFor="studio-example">1 · Example workflow</label>
              <select id="studio-example" value={exampleId} onChange={e=>selectExample(e.target.value)}>
                {examples.map(e=><option value={e.id} key={e.id}>{e.label} — {e.audience}</option>)}
              </select>
              <p className="studio-helper">Realistic business situations. These are examples, not claims of client outcomes.</p>
            </div>
            <div className="studio-block">
              <label>2 · Select a slide to edit</label>
              <div className="studio-slide-tabs" role="group" aria-label="Select slide">
                {slides.map((s,i)=><button type="button" className={selected===i?'is-active':''} key={i} onClick={()=>setSelected(i)} aria-pressed={selected===i}>{String(i+1).padStart(2,'0')}</button>)}
              </div>
              <label htmlFor="studio-kicker">Eyebrow</label>
              <input id="studio-kicker" value={slides[selected].kicker} maxLength={43} onChange={e=>update('kicker',e.target.value)} />
              <label htmlFor="studio-headline">Headline</label>
              <textarea id="studio-headline" rows={2} maxLength={180} value={slides[selected].title} onChange={e=>update('title',e.target.value)} />
              <label htmlFor="studio-body">Explanation</label>
              <textarea id="studio-body" rows={4} maxLength={420} value={slides[selected].body} onChange={e=>update('body',e.target.value)} />
              <p className="studio-helper">Your edits immediately update the actual JPEG preview. No AI claims or branding are inserted into your images.</p>
            </div>
            <div className="studio-block">
              <label htmlFor="studio-caption">3 · TikTok caption (editable)</label>
              <textarea id="studio-caption" rows={5} maxLength={4000} value={caption} onChange={e=>setCaption(e.target.value)} />
              <label htmlFor="studio-post-title">Post title</label>
              <input id="studio-post-title" value={title} maxLength={90} onChange={e=>setTitle(e.target.value)} />
            </div>
          </div>
          <div className="studio-preview">
            <div className="studio-preview-top"><span>LIVE JPEG PREVIEW</span><span>1080 × 1920 · 9:16</span></div>
            <div className="studio-preview-inner"><canvas ref={canvasRef} width={1080} height={1920} aria-label={'Slide preview ' + (selected+1)} /></div>
            <div className="studio-preview-footer"><span>Slide {selected+1} of 5</span><button type="button" onClick={download}>Download this JPEG ↓</button></div>
            <p className="studio-helper">All five slides are reviewed individually before any upload. Click 01–05 to inspect the entire sequence.</p>
          </div>
        </div>
      </section>

      <section className="studio-publish section-shell">
        <div className="studio-section-heading"><p className="studio-eyebrow">OPTIONAL TIKTOK CONNECTION</p><h2>You choose what gets shared.</h2><p>Publishing requires account authorization, fresh creator settings, your privacy choice and an explicit confirmation.</p></div>
        <div className="studio-publish-grid">
          <div className="studio-block">
            <h3>Account & destination</h3>
            {!account ? <p>Checking connection...</p> : account.connected ? <p className="studio-connected">Connected account: <strong>{creator?.nickname || account.nickname || 'TikTok creator'}</strong></p> :
              <><p className="studio-helper">{account.configured?'Connect your TikTok account to access the official publishing options.':'TikTok connection is not configured on this site yet. The free carousel editor and JPEG download are available now.'}</p>
                <a className={'studio-action '+(!account.configured?'studio-disabled':'')} href={account.configured?'/api/studio/start':'#studio-workspace'} aria-disabled={!account.configured}>Connect TikTok</a></>
            }
            {creator && <>
              <label htmlFor="studio-privacy">Privacy (select manually)</label>
              <select id="studio-privacy" required value={privacy} onChange={e=>{setPrivacy(e.target.value);setConsent(false);}}>
                <option value="">Choose visibility...</option>
                {creator.privacyOptions.map(option=><option key={option} value={option} disabled={paidBrand&&option==='SELF_ONLY'}>{privacyLabels[option]||option}</option>)}
              </select>
              <label className="studio-check"><input type="checkbox" checked={comments} disabled={creator.commentDisabled} onChange={e=>setComments(e.target.checked)} /> Allow comments</label>
              <label className="studio-check"><input type="checkbox" checked={commercial} onChange={e=>{setCommercial(e.target.checked);setConsent(false);if(!e.target.checked){setOwnBrand(false);setPaidBrand(false);}}} /> This content promotes a business, product or service</label>
              {commercial && <div className="studio-disclosures">
                <label className="studio-check"><input type="checkbox" checked={ownBrand} onChange={e=>setOwnBrand(e.target.checked)} /> My own business (Promotional content)</label>
                <label className="studio-check"><input type="checkbox" checked={paidBrand} disabled={privacy==='SELF_ONLY'} onChange={e=>setPaidBrand(e.target.checked)} /> Paid partnership (Branded content)</label>
                {paidBrand && <p className="studio-helper">Branded content cannot be published privately.</p>}
              </div>}
              <label className="studio-check"><input type="checkbox" checked={aiGenerated} onChange={e=>setAiGenerated(e.target.checked)} /> These images contain AI-generated content</label>
              <label className="studio-check"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)} /> I reviewed all five slides and authorize this specific upload. By posting, I agree to TikTok's <a target="_blank" rel="noreferrer" href="https://www.tiktok.com/legal/page/global/music-usage-confirmation/en">Music Usage Confirmation</a>{paidBrand?<> and the <a target="_blank" rel="noreferrer" href="https://www.tiktok.com/legal/page/global/bc-policy/en">Branded Content Policy</a></>:null}.</label>
              <button type="button" className="studio-action studio-submit" onClick={postToTikTok} disabled={cannotPost}>{busy?'Submitting...':'Publish my five-slide carousel'}</button>
              {publishId && <button type="button" className="studio-status-check" onClick={checkStatus} disabled={busy}>Check TikTok publishing status</button>}
              <button type="button" className="studio-disconnect" onClick={async()=>{await fetch('/api/studio/disconnect',{method:'POST',headers:{'X-Studio-Request':'1'}});setAccount({configured:true,connected:false});setCreator(null);setPrivacy('');setResult('TikTok account disconnected.');}}>Disconnect TikTok</button>
            </>}
            {result && <p className="studio-result" role="status">{result}</p>}
          </div>
          <div className="studio-publish-aside">
            <h3>Built for creators, not a background posting bot.</h3>
            <p>Every creator controls their own original content. No automatic reuse of another account's posts, no forced watermarks, and no publishing until the account holder authorizes it.</p>
            <p>New integrations are tested privately first. Public visibility depends on TikTok's API audit and available account permissions.</p>
            <p>If you choose to publish, the prepared JPEG files are hosted at publicly retrievable, hard-to-guess links so TikTok can import them. Do not include confidential customer or client information.</p>
            <div className="studio-mini-steps"><span>Draft</span><b>→</b><span>Review</span><b>→</b><span>Authorize</span><b>→</b><span>Track status</span></div>
          </div>
        </div>
      </section>
      <section className="studio-last section-shell">
        <p>Need a complete business workflow behind your content?</p>
        <Link to="/contact">Discuss a tailored operations or content process →</Link>
        <div><Link to="/privacy">Privacy Policy</Link><Link to="/terms">Terms of Service</Link></div>
      </section>
    </div>
  );
}
