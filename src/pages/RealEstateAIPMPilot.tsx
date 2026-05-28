import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { REAL_ESTATE_AI_PM_PROXY_ENDPOINT } from '../config/endpoints';

type IntakeData = { name: string; email: string; role: string; marketLocation: string; teamSize: string; workflowType: string; currentProcess: string; informationStartsFrom: string; currentTools: string; mainPainPoints: string; timeLostPerWeek: string; aiUsageToday: string; desiredOutput: string; openToCall: string; additionalNotes: string };
type WbsItem = { taskName?: string; ownerType?: string; output?: string; acceptanceCriteria?: string };
type Fix = { title?: string; description?: string; trackerName?: string; columns?: string[]; statuses?: string[] };
type PromptItem = { title?: string; prompt?: string };
type ScarfItem = { domain?: string; risk?: string; recommendation?: string };
type Transparency = { inputUsed?: string; outputGenerated?: string; humanValidation?: string; sensitiveDataWarning?: string };
type Snapshot = {
  workflowReadinessScore?: number | string; workflowMaturity?: string; workflowDetected?: string; executiveSummary?: string; problemStatement?: string;
  mainBottleneck?: string; recommendedPriority?: string; topWorkflowGaps?: string[]; first48HourFix?: Fix; wbsTaskBreakdown?: WbsItem[];
  aiPromptPack?: PromptItem[]; scarfTrustCheck?: ScarfItem[]; aiUseTransparencySummary?: Transparency; aiOpportunities?: string[]; quickWin?: string;
  sevenDayRoadmap?: string[]; humanReviewedReportPreview?: string[]; nextStep?: string; ctaPrimary?: string; ctaSecondary?: string; calendlyUrl?: string; disclaimer?: string;
};
type ApiResponse = { success?: boolean; message?: string; submissionId?: string; instantSnapshot?: Snapshot };

const initialData: IntakeData = { name: '', email: '', role: '', marketLocation: '', teamSize: '', workflowType: '', currentProcess: '', informationStartsFrom: '', currentTools: '', mainPainPoints: '', timeLostPerWeek: '', aiUsageToday: '', desiredOutput: '', openToCall: '', additionalNotes: '' };
const stepLabels = ['About you', 'Workflow to improve', 'Current process', 'Pain points', 'AI and tools', 'Desired output'];
const ERR_MSG = 'Personalized AI generation failed. Please request a human-reviewed report.';
const FALLBACK_DISCLAIMER = 'This preliminary snapshot is AI-generated and has not been reviewed by a human. It is not legal, tax, financial, investment, brokerage, or compliance advice.';
const CALENDLY = 'https://calendly.com/propertydext/15min';

const hasValue = (v: unknown): boolean => !(v === null || v === undefined || (typeof v === 'string' && v.trim() === '') || (Array.isArray(v) && v.length === 0));
const safeText = (v: unknown, fallback = ''): string => (typeof v === 'string' && v.trim() ? v.trim() : fallback);
const safeArray = <T,>(v: unknown, fallback: T[] = []): T[] => (Array.isArray(v) ? v as T[] : fallback);
const safeObjectArray = <T extends object>(v: unknown, fallback: T[] = []): T[] => (Array.isArray(v) ? (v.filter((x) => typeof x === 'object' && x !== null) as T[]) : fallback);

export function RealEstateAIPMPilot() {
  const [step, setStep] = useState(0); const [data, setData] = useState<IntakeData>(initialData); const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false); const [submitted, setSubmitted] = useState(false); const [response, setResponse] = useState<ApiResponse | null>(null);
  const progressText = useMemo(() => `Step ${step + 1} of ${stepLabels.length}: ${stepLabels[step]}`, [step]);
  const updateField = (f: keyof IntakeData, v: string) => setData((p) => ({ ...p, [f]: v }));

  const validateStep = (s: number): string | null => {
    if (s === 0) { if (!data.name.trim()) return 'Please enter your name.'; if (!data.email.trim()) return 'Please enter your email.'; if (!data.role.trim()) return 'Please select your role.'; if (!data.marketLocation.trim()) return 'Please enter your market location.'; }
    if (s === 1 && !data.workflowType.trim()) return 'Please select a workflow type.';
    if (s === 2 && !data.currentProcess.trim()) return 'Please describe your current process.';
    if (s === 3 && !data.mainPainPoints.trim()) return 'Please select your main pain points.';
    if (s === 5 && !data.desiredOutput.trim()) return 'Please select your desired output.';
    return null;
  };

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); const v = validateStep(step); if (v) return setError(v);
    setError(''); setSubmitting(true);
    try {
      const res = await fetch(REAL_ESTATE_AI_PM_PROXY_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const json = (await res.json()) as ApiResponse;
      console.log('instantSnapshot received:', json.instantSnapshot);
      setResponse(json); setSubmitted(true);
    } catch { setSubmitted(true); }
    finally { setSubmitting(false); }
  }

  const report = response?.instantSnapshot;
  const requiredValid = !!report
    && Number.isFinite(Number(report.workflowReadinessScore))
    && hasValue(report.workflowDetected)
    && hasValue(report.mainBottleneck)
    && safeArray<string>(report.topWorkflowGaps).length > 0
    && hasValue(report.first48HourFix)
    && safeObjectArray<WbsItem>(report.wbsTaskBreakdown).length > 0
    && safeObjectArray<PromptItem>(report.aiPromptPack).length > 0
    && safeArray<string>(report.sevenDayRoadmap).length > 0
    && hasValue(report.aiUseTransparencySummary?.inputUsed)
    && hasValue(report.aiUseTransparencySummary?.outputGenerated)
    && hasValue(report.aiUseTransparencySummary?.humanValidation)
    && hasValue(report.aiUseTransparencySummary?.sensitiveDataWarning);

  if (submitted) {
    if (!requiredValid) {
      return <section className="section-shell pilot-success"><h1>Your Preliminary AI PM Workflow Snapshot is Ready</h1><p className="resource-card">{ERR_MSG}</p><div className="hero-actions"><a className="button primary" href={CALENDLY} target="_blank" rel="noreferrer">Book a 15-minute review</a><a className="button secondary" href={CALENDLY} target="_blank" rel="noreferrer">Request human-reviewed report</a><Link className="button secondary" to="/">Back to Home</Link></div></section>;
    }

    const topGaps = safeArray<string>(report.topWorkflowGaps).filter(Boolean).slice(0, 3);
    const wbs = safeObjectArray<WbsItem>(report.wbsTaskBreakdown);
    const prompts = safeObjectArray<PromptItem>(report.aiPromptPack);
    const scarf = safeObjectArray<ScarfItem>(report.scarfTrustCheck);
    const opportunities = safeArray<string>(report.aiOpportunities).filter(Boolean).slice(0, 3);
    const roadmap = safeArray<string>(report.sevenDayRoadmap).filter(Boolean);
    const preview = safeArray<string>(report.humanReviewedReportPreview).filter(Boolean);
    const fix = report.first48HourFix || {};
    const t = report.aiUseTransparencySummary || {};
    const readiness = Number(report.workflowReadinessScore);
    const scoreLabel = Number.isFinite(readiness) ? `${readiness}/100` : 'Not provided by AI';

    return (
      <section className="section-shell pilot-success">
        <p className="eyebrow">Real Estate AI PM Pilot</p>
        <h1>Your Preliminary AI PM Workflow Snapshot is Ready</h1>
        <p className="success-note">This report is automatically generated from your intake answers and has not yet been reviewed by a human. A complete human-reviewed AI PM Workflow Report can be prepared within 3 business days.</p>
        <div className="hero-actions"><a className="button primary" href={safeText(report.calendlyUrl, CALENDLY)} target="_blank" rel="noreferrer">{safeText(report.ctaPrimary, 'Book a 15-minute review')}</a><a className="button secondary" href={safeText(report.calendlyUrl, CALENDLY)} target="_blank" rel="noreferrer">{safeText(report.ctaSecondary, 'Request human-reviewed report')}</a></div>
        <div className="resource-card snapshot-card">
          <p><strong>Submission ID:</strong> {safeText(response?.submissionId, '')}</p>
          <div className="snapshot-grid report-section-gap"><div className="score-card"><p className="score-label">AI PM Workflow Readiness Score</p><p className="score-value">{scoreLabel}</p></div><div><h3>Workflow Detected</h3><p>{safeText(report.workflowDetected)}</p></div><div><h3>Workflow Maturity</h3><p>{safeText(report.workflowMaturity)}</p></div><div><h3>Main Bottleneck</h3><p>{safeText(report.mainBottleneck)}</p></div><div><h3>Recommended Priority</h3><p>{safeText(report.recommendedPriority)}</p></div></div>
          {hasValue(report.executiveSummary) && <div className="snapshot-grid report-section-gap"><div className="snapshot-full"><h3>Executive Summary</h3><p>{safeText(report.executiveSummary)}</p></div></div>}
          {hasValue(report.problemStatement) && <div className="snapshot-grid report-section-gap"><div className="snapshot-full"><h3>Problem Statement</h3><p>{safeText(report.problemStatement)}</p></div></div>}
          <div className="snapshot-grid report-section-gap"><div className="snapshot-full"><h3>Top 3 Workflow Gaps</h3><ul>{topGaps.map((g) => <li key={g}>{g}</li>)}</ul></div></div>
          <div className="snapshot-grid report-section-gap"><div className="snapshot-full"><h3>{safeText(fix.title, 'Your First 48-Hour Fix')}</h3><><p>{safeText(fix.description)}</p>{hasValue(fix.trackerName) && <p><strong>Tracker:</strong> {safeText(fix.trackerName)}</p>}{safeArray<string>(fix.columns).length > 0 && <><p><strong>Columns:</strong></p><ul>{safeArray<string>(fix.columns).map((c) => <li key={c}>{c}</li>)}</ul></>}{safeArray<string>(fix.statuses).length > 0 && <><p><strong>Statuses:</strong></p><ul>{safeArray<string>(fix.statuses).map((s) => <li key={s}>{s}</li>)}</ul></>}</></div></div>
          <div className="snapshot-grid report-section-gap"><div className="snapshot-full"><h3>WBS-Based Workflow Breakdown</h3><div className="rows-list">{wbs.map((i,idx)=><div className="row-card" key={idx}><p><strong>Task:</strong> {safeText(i.taskName)}</p><p><strong>Owner Type:</strong> {safeText(i.ownerType)}</p><p><strong>Output:</strong> {safeText(i.output)}</p><p><strong>Acceptance Criteria:</strong> {safeText(i.acceptanceCriteria)}</p></div>)}</div></div></div>
          <div className="snapshot-grid report-section-gap"><div className="snapshot-full"><h3>Copy/Paste AI Prompt Pack</h3><div className="rows-list">{prompts.map((p,idx)=><div className="row-card" key={idx}><p><strong>{safeText(p.title, `Prompt ${idx+1}`)}</strong></p><p>{safeText(p.prompt)}</p></div>)}</div></div></div>
          {scarf.length > 0 && <div className="snapshot-grid report-section-gap"><div className="snapshot-full"><h3>SCARF Trust & AI Adoption Check</h3><div className="scarf-grid">{scarf.map((s,idx)=><div className="scarf-card" key={idx}><h4>{safeText(s.domain, `Domain ${idx+1}`)}</h4><p><strong>Risk:</strong> {safeText(s.risk)}</p><p><strong>Recommendation:</strong> {safeText(s.recommendation)}</p></div>)}</div></div></div>}
          {hasValue(t) && <div className="snapshot-grid report-section-gap"><div className="snapshot-full"><h3>AI Use Transparency Summary</h3><div className="charter-grid"><p><strong>Input used:</strong> {safeText(t.inputUsed)}</p><p><strong>Output generated:</strong> {safeText(t.outputGenerated)}</p><p><strong>Human validation:</strong> {safeText(t.humanValidation)}</p><p><strong>Sensitive data warning:</strong> {safeText(t.sensitiveDataWarning)}</p></div></div></div>}
          {opportunities.length > 0 && <div className="snapshot-grid report-section-gap"><div className="snapshot-full"><h3>AI + PM Opportunities</h3><ul>{opportunities.map((o)=><li key={o}>{o}</li>)}</ul></div></div>}
          {hasValue(report.quickWin) && <div className="snapshot-grid report-section-gap"><div className="snapshot-full quick-win-card"><h3>Quick Win</h3><p>{safeText(report.quickWin)}</p></div></div>}
          <div className="snapshot-grid report-section-gap"><div className="snapshot-full"><h3>7-Day Implementation Roadmap</h3><ol className="roadmap-list">{roadmap.map((r,i)=><li key={`${i}-${r}`}>{r}</li>)}</ol></div></div>
          {preview.length > 0 && <div className="snapshot-grid report-section-gap"><div className="snapshot-full"><h3>What the Human-Reviewed Report Adds</h3><ul>{preview.map((p)=><li key={p}>{p}</li>)}</ul></div></div>}
          <div className="snapshot-grid report-section-gap"><div className="snapshot-full"><h3>Disclaimer</h3><p>{safeText(report.disclaimer, FALLBACK_DISCLAIMER)}</p></div></div>
        </div>
        <div className="hero-actions"><a className="button primary" href={safeText(report.calendlyUrl, CALENDLY)} target="_blank" rel="noreferrer">{safeText(report.ctaPrimary, 'Book a 15-minute review')}</a><a className="button secondary" href={safeText(report.calendlyUrl, CALENDLY)} target="_blank" rel="noreferrer">{safeText(report.ctaSecondary, 'Request human-reviewed report')}</a><Link className="button secondary" to="/">Back to Home</Link></div>
      </section>
    );
  }

  return (
    <>
      <section className="page-intro section-shell"><p className="eyebrow">Real Estate AI PM Pilot</p><h1>AI PM Workflow Pilot for Real Estate Professionals</h1><p className="hero-lede">Use AI to organize real estate work, not just write better captions.</p></section>
      <section id="pilot-wizard" className="section-shell detail-card"><p className="eyebrow">Pilot intake wizard</p><h2>{progressText}</h2><a className="back-home-link" href="/">← Back to Home</a><p className="tiny-disclaimer">Not tokenization. Not legal, financial, tax, investment, brokerage, or compliance advice.</p>
        <form className="pilot-form" onSubmit={onSubmit}>{/* unchanged fields */}
          {step === 0 && <div className="form-grid two-col"><label>Name *<input value={data.name} onChange={(e) => updateField('name', e.target.value)} /></label><label>Email *<input type="email" value={data.email} onChange={(e) => updateField('email', e.target.value)} /></label><label>Role *<select value={data.role} onChange={(e) => updateField('role', e.target.value)}><option value="">Select</option>{['Realtor','Broker','Property Manager','Real Estate Investor','Contractor','Small Real Estate Team','Other'].map((item)=><option key={item} value={item}>{item}</option>)}</select></label><label>Market location *<input value={data.marketLocation} onChange={(e) => updateField('marketLocation', e.target.value)} /></label><label>Team size<select value={data.teamSize} onChange={(e) => updateField('teamSize', e.target.value)}><option value="">Select</option>{['Just me','2–5 people','6–10 people','10+ people'].map((item)=><option key={item} value={item}>{item}</option>)}</select></label></div>}
          {step === 1 && <label>Workflow type to improve *<select value={data.workflowType} onChange={(e) => updateField('workflowType', e.target.value)}><option value="">Select</option>{['Lead intake','Buyer follow-up','Seller follow-up','Listing preparation','Open house preparation','Transaction checklist','Vendor coordination','Client communication','Weekly client updates','Property project tracking','Content-to-client follow-up','Other'].map((item)=><option key={item} value={item}>{item}</option>)}</select></label>}
          {step === 2 && <div className="form-grid"><label>Information usually starts from<select value={data.informationStartsFrom} onChange={(e) => updateField('informationStartsFrom', e.target.value)}><option value="">Select</option>{['Email','Phone calls','Text messages','Instagram / Social media','Zillow / Realtor.com / leads platform','CRM','Google Sheets','Paper / memory','Other'].map((item)=><option key={item} value={item}>{item}</option>)}</select></label><label>Describe how this workflow happens today *<textarea value={data.currentProcess} onChange={(e) => updateField('currentProcess', e.target.value)} rows={6} /></label></div>}
          {step === 3 && <div className="form-grid two-col"><label>Main pain points *<select value={data.mainPainPoints} onChange={(e) => updateField('mainPainPoints', e.target.value)}><option value="">Select</option>{['Missed follow-ups','Scattered notes','Repeated messages','No clear next steps','Tasks are not organized','I lose time after calls or meetings','No system for updates','Too many tools','Everything is manual','Other'].map((item)=><option key={item} value={item}>{item}</option>)}</select></label><label>Time lost per week<select value={data.timeLostPerWeek} onChange={(e) => updateField('timeLostPerWeek', e.target.value)}><option value="">Select</option>{['Less than 1 hour','1–3 hours','3–5 hours','5+ hours'].map((item)=><option key={item} value={item}>{item}</option>)}</select></label></div>}
          {step === 4 && <div className="form-grid two-col"><label>AI usage today<select value={data.aiUsageToday} onChange={(e) => updateField('aiUsageToday', e.target.value)}><option value="">Select</option>{['Yes, often','Sometimes','I tried it but not consistently','Not really'].map((item)=><option key={item} value={item}>{item}</option>)}</select></label><label>Current tools<select value={data.currentTools} onChange={(e) => updateField('currentTools', e.target.value)}><option value="">Select</option>{['Gmail / Outlook','Google Sheets','Google Docs','Trello','ClickUp','Asana','Notion','CRM','No real system','Other'].map((item)=><option key={item} value={item}>{item}</option>)}</select></label></div>}
          {step === 5 && <div className="form-grid"><label>Desired output *<select value={data.desiredOutput} onChange={(e) => updateField('desiredOutput', e.target.value)}><option value="">Select</option>{['Workflow map','Simple task tracker','Follow-up templates','AI prompt templates','Client communication templates','Weekly update structure','Recommended tools','7-day implementation plan','Short call to review the workflow'].map((item)=><option key={item} value={item}>{item}</option>)}</select></label><label>Open to call?<select value={data.openToCall} onChange={(e) => updateField('openToCall', e.target.value)}><option value="">Select</option>{['Yes','No','Maybe'].map((item)=><option key={item} value={item}>{item}</option>)}</select></label><label>Additional notes<textarea value={data.additionalNotes} onChange={(e) => updateField('additionalNotes', e.target.value)} rows={5} /></label></div>}
          {error && <p className="form-error">{error}</p>}
          {submitting && <p className="form-wait-message">Please wait while we prepare your result page...</p>}
          <div className="wizard-actions">{step > 0 && <button type="button" className="button secondary" onClick={() => { setError(''); setStep((p) => Math.max(p - 1, 0)); }}>Back</button>}{step < stepLabels.length - 1 ? <button type="button" className="button primary" onClick={() => { const v = validateStep(step); if (v) setError(v); else { setError(''); setStep((p) => Math.min(p + 1, stepLabels.length - 1)); } }}>Next</button> : <button type="submit" className="button primary" disabled={submitting}>{submitting ? 'Please wait...' : 'Submit pilot intake'}</button>}</div>
        </form>
      </section>
    </>
  );
}
