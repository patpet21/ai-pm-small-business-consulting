import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { REAL_ESTATE_AI_PM_PROXY_ENDPOINT } from '../config/endpoints';

type IntakeData = {
  name: string; email: string; role: string; marketLocation: string; teamSize: string; workflowType: string;
  currentProcess: string; informationStartsFrom: string; currentTools: string; mainPainPoints: string;
  timeLostPerWeek: string; aiUsageToday: string; desiredOutput: string; openToCall: string; additionalNotes: string;
};

type WbsItem = { taskName?: string; ownerType?: string; output?: string; acceptanceCriteria?: string };
type ScarfItem = { risk?: string; recommendation?: string };
type ScarfCheck = { status?: ScarfItem; certainty?: ScarfItem; autonomy?: ScarfItem; relatedness?: ScarfItem; fairness?: ScarfItem };
type TransparencySummary = { inputUsed?: string; outputGenerated?: string; humanValidation?: string; sensitiveDataWarning?: string };

type Snapshot = {
  workflowReadinessScore?: number | string; workflowMaturity?: string; workflowDetected?: string;
  executiveSummary?: string; problemStatement?: string; mainBottleneck?: string; recommendedPriority?: string;
  topWorkflowGaps?: string[]; wbsTaskBreakdown?: WbsItem[]; scarfTrustCheck?: ScarfCheck;
  aiUseTransparencySummary?: TransparencySummary; humanReviewedReportPreview?: string[];
  aiOpportunities?: string[]; quickWin?: string; sevenDayRoadmap?: string[]; nextStep?: string;
  ctaPrimary?: string; ctaSecondary?: string; calendlyUrl?: string; disclaimer?: string;
};

type ApiResponse = { success?: boolean; message?: string; submissionId?: string; instantSnapshot?: Snapshot; preliminaryReport?: Snapshot };

const initialData: IntakeData = {
  name: '', email: '', role: '', marketLocation: '', teamSize: '', workflowType: '', currentProcess: '',
  informationStartsFrom: '', currentTools: '', mainPainPoints: '', timeLostPerWeek: '', aiUsageToday: '', desiredOutput: '', openToCall: '', additionalNotes: '',
};
const stepLabels = ['About you', 'Workflow to improve', 'Current process', 'Pain points', 'AI and tools', 'Desired output'];
const HUMAN_REVIEW_FALLBACK = 'This will be reviewed in the human-reviewed report.';
const DISCLAIMER_FALLBACK = 'This preliminary snapshot is AI-generated and has not been reviewed by a human. It is not legal, tax, financial, investment, brokerage, or compliance advice.';
const CALENDLY_URL = 'https://calendly.com/propertydext/15min';

const hasValue = (value: unknown): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value as object).length > 0;
  return true;
};
const safeText = (value: unknown, fallback = ''): string => (typeof value === 'string' && value.trim() ? value.trim() : fallback);
const safeArray = <T,>(value: unknown, fallback: T[] = []): T[] => (Array.isArray(value) && value.length ? value as T[] : fallback);
const safeObjectArray = <T extends object>(value: unknown, fallback: T[] = []): T[] => {
  if (!Array.isArray(value)) return fallback;
  const cleaned = value.filter((item) => typeof item === 'object' && item !== null) as T[];
  return cleaned.length ? cleaned : fallback;
};

const fallbackWbs: WbsItem[] = [
  { taskName: 'Intake Request', ownerType: 'Workflow owner or assistant', output: 'Request or lead captured in one place', acceptanceCriteria: 'The item includes source, date, contact, need, and next action.' },
  { taskName: 'Review / Qualify', ownerType: 'Responsible team member', output: 'Request reviewed and categorized', acceptanceCriteria: 'Priority, urgency, and required follow-up are clearly defined.' },
  { taskName: 'Assign Owner', ownerType: 'Workflow owner', output: 'Task assigned to one accountable person', acceptanceCriteria: 'Every open item has one owner and no unclear responsibility.' },
  { taskName: 'Track Status', ownerType: 'Task owner', output: 'Status updated in tracker', acceptanceCriteria: 'Status shows New, Contacted, Waiting, Closed, or equivalent.' },
  { taskName: 'Follow Up', ownerType: 'Task owner', output: 'Follow-up message or update sent', acceptanceCriteria: 'Next action and follow-up date are recorded.' },
  { taskName: 'Weekly Review', ownerType: 'Workflow owner', output: 'Open items reviewed', acceptanceCriteria: 'Blocked, delayed, and high-priority items are identified.' },
];

const fallbackRoadmap = [
  'Day 1: List every step in the current workflow.', 'Day 2: Create one central tracker.', 'Day 3: Define simple status labels.',
  'Day 4: Assign an owner and next action for each open item.', 'Day 5: Create two reusable AI follow-up templates.',
  'Day 6: Review open tasks and identify delays.', 'Day 7: Run a weekly review and close completed items.',
];

export function RealEstateAIPMPilot() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<IntakeData>(initialData);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [fallbackSuccess, setFallbackSuccess] = useState(false);
  const [response, setResponse] = useState<ApiResponse | null>(null);

  const progressText = useMemo(() => `Step ${step + 1} of ${stepLabels.length}: ${stepLabels[step]}`, [step]);
  const updateField = (field: keyof IntakeData, value: string) => setData((prev) => ({ ...prev, [field]: value }));

  function validateStep(currentStep: number): string | null {
    if (currentStep === 0) {
      if (!data.name.trim()) return 'Please enter your name.';
      if (!data.email.trim()) return 'Please enter your email.';
      if (!data.role.trim()) return 'Please select your role.';
      if (!data.marketLocation.trim()) return 'Please enter your market location.';
    }
    if (currentStep === 1 && !data.workflowType.trim()) return 'Please select a workflow type.';
    if (currentStep === 2 && !data.currentProcess.trim()) return 'Please describe your current process.';
    if (currentStep === 3 && !data.mainPainPoints.trim()) return 'Please select your main pain points.';
    if (currentStep === 5 && !data.desiredOutput.trim()) return 'Please select your desired output.';
    return null;
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = validateStep(step);
    if (validation) return setError(validation);
    setError(''); setSubmitting(true);
    try {
      const res = await fetch(REAL_ESTATE_AI_PM_PROXY_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const json = (await res.json()) as ApiResponse;
      console.log('instantSnapshot', json.instantSnapshot);
      setResponse(json); setSubmitted(true); setFallbackSuccess(!(json.success && json.instantSnapshot));
    } catch {
      setSubmitted(true); setFallbackSuccess(true);
    } finally { setSubmitting(false); }
  }

  const report = response?.instantSnapshot || response?.preliminaryReport;
  const detected = safeText(report?.workflowDetected, 'Workflow diagnosis in progress');
  const bottleneck = safeText(report?.mainBottleneck, 'The workflow likely relies on scattered updates and manual follow-up.');
  const priority = safeText(report?.recommendedPriority, 'Create one visible next-action tracking system.');
  const maturity = safeText(report?.workflowMaturity, 'Emerging');
  const rawScore = Number(report?.workflowReadinessScore);
  const score = Number.isFinite(rawScore) ? rawScore : (/manual|scattered|fragmented|memory/i.test(`${detected} ${bottleneck}`) ? 58 : /structured|defined|standardized/i.test(`${detected} ${bottleneck}`) ? 75 : 65);

  const topGaps = safeArray<string>(report?.topWorkflowGaps, []).filter(Boolean).slice(0, 3);
  const deterministicGaps = topGaps.length ? topGaps : [
    'Leads or requests are entering from multiple channels without one central intake point.',
    'Follow-up depends on memory instead of a visible next-action system.',
    'Task ownership is not consistently documented for each open item.',
  ];

  const isLeadFlow = /lead|buyer|follow-up|listing|open house/i.test(`${detected} ${data.workflowType}`);
  const isVendorFlow = /vendor/i.test(`${detected} ${data.workflowType}`);
  const fixColumns = isLeadFlow
    ? ['Lead Name', 'Source', 'Date Received', 'Current Status', 'Owner', 'Next Action', 'Follow-Up Date', 'Last Contact', 'Notes', 'Priority']
    : isVendorFlow
      ? ['Request', 'Vendor', 'Owner', 'Status', 'Deadline', 'Next Action', 'Last Update', 'Notes']
      : ['Request', 'Source', 'Owner', 'Status', 'Priority', 'Deadline', 'Next Action', 'Last Update', 'Notes'];

  const wbs = safeObjectArray<WbsItem>(report?.wbsTaskBreakdown, fallbackWbs);
  const scarf = report?.scarfTrustCheck || {
    status: { risk: 'Team members may feel AI is replacing their judgment.', recommendation: 'Position AI as a support tool, not the decision-maker.' },
    certainty: { risk: 'People may not know where updates and tasks are stored.', recommendation: 'Use one visible tracker with clear status labels.' },
    autonomy: { risk: 'Users may feel the system is making decisions without them.', recommendation: 'Keep priority and client-facing decisions under human review.' },
    relatedness: { risk: 'Automation may make communication feel less personal.', recommendation: 'Use AI for drafts, but review relationship-sensitive messages manually.' },
    fairness: { risk: 'Loud or urgent requests may get priority over structured criteria.', recommendation: 'Use consistent priority rules for all tasks.' },
  };
  const transparency = report?.aiUseTransparencySummary || {
    inputUsed: 'Intake answers only.', outputGenerated: 'Preliminary AI PM workflow snapshot.', humanValidation: 'Required before final recommendations.',
    sensitiveDataWarning: 'Do not enter legal, tax, financial, investment, brokerage, compliance, confidential client, or sensitive personal data into AI tools.',
  };
  const opportunities = safeArray<string>(report?.aiOpportunities, isLeadFlow ? [
    'Draft short personalized follow-up emails from call or chat notes.',
    'Summarize lead conversations into needs, urgency, and next step.',
    'Prioritize open leads by follow-up urgency and stage.',
  ] : isVendorFlow ? [
    'Draft vendor follow-up emails with deadlines and next actions.',
    'Generate concise status summaries for open vendor requests.',
    'Create weekly vendor progress reports with blockers and owners.',
  ] : [
    'Convert incoming messages into structured tasks with owners.',
    'Draft client/vendor updates from tracker status changes.',
    'Generate weekly summaries of open, blocked, and completed items.',
  ]).slice(0, 3);
  const quickWin = safeText(report?.quickWin, 'Create one shared tracker with source, owner, status, next action, follow-up date, and last update.');
  const roadmap = safeArray<string>(report?.sevenDayRoadmap, fallbackRoadmap);
  const reviewedPreview = safeArray<string>(report?.humanReviewedReportPreview, [
    'deeper workflow diagnosis', 'custom tracker structure', 'stakeholder/vendor map', 'risk register', 'AI prompt pack',
    'SCARF trust check', '7-day implementation plan', 'recommended service tier', 'next-step roadmap',
  ]);
  const disclaimer = safeText(report?.disclaimer, DISCLAIMER_FALLBACK);

  if (submitted) {
    return (
      <section className="section-shell pilot-success">
        <p className="eyebrow">Real Estate AI PM Pilot</p>
        <h1>Your Preliminary AI PM Workflow Snapshot is Ready</h1>
        <p className="success-note">This report is automatically generated from your intake answers and has not yet been reviewed by a human. A complete human-reviewed AI PM Workflow Report can be prepared within 3 business days.</p>
        {!fallbackSuccess && report ? (
          <>
            <div className="hero-actions"><a className="button primary" href={CALENDLY_URL} target="_blank" rel="noreferrer">Book a 15-minute review</a><a className="button secondary" href={CALENDLY_URL} target="_blank" rel="noreferrer">Request human-reviewed report</a></div>
            <div className="resource-card snapshot-card">
              <p><strong>Submission ID:</strong> {safeText(response?.submissionId, 'Pending assignment')}</p>
              <div className="snapshot-grid report-section-gap">
                <div className="score-card"><p className="score-label">AI PM Workflow Readiness Score</p><p className="score-value">{score}/100</p></div>
                <div><h3>Workflow Detected</h3><p>{detected}</p></div>
                <div><h3>Workflow Maturity</h3><p>{maturity}</p></div>
                <div><h3>Main Bottleneck</h3><p>{bottleneck}</p></div>
                <div><h3>Recommended Priority</h3><p>{priority}</p></div>
              </div>

              <div className="snapshot-grid report-section-gap"><div className="snapshot-full"><h3>Immediate Diagnosis — Top 3 Workflow Gaps</h3><ul>{deterministicGaps.map((g) => <li key={g}>{g}</li>)}</ul></div></div>

              <div className="snapshot-grid report-section-gap">
                <div className="snapshot-full quick-win-card"><h3>Your First 48-Hour Fix</h3><p>Start with one shared tracker and use these columns:</p><ul>{fixColumns.map((c) => <li key={c}>{c}</li>)}</ul><p><strong>Suggested statuses:</strong> New, Contacted, Waiting, Closed.</p></div>
              </div>

              <div className="snapshot-grid report-section-gap"><div className="snapshot-full"><h3>WBS-Based Workflow Breakdown</h3><div className="rows-list">{wbs.map((item, idx) => <div className="row-card" key={`${item.taskName}-${idx}`}><p><strong>Task:</strong> {safeText(item.taskName, HUMAN_REVIEW_FALLBACK)}</p><p><strong>Owner Type:</strong> {safeText(item.ownerType, HUMAN_REVIEW_FALLBACK)}</p><p><strong>Output:</strong> {safeText(item.output, HUMAN_REVIEW_FALLBACK)}</p><p><strong>Acceptance Criteria:</strong> {safeText(item.acceptanceCriteria, HUMAN_REVIEW_FALLBACK)}</p></div>)}</div></div></div>

              <div className="snapshot-grid report-section-gap"><div className="snapshot-full"><h3>Copy/Paste AI Prompt Pack</h3>{isVendorFlow ? <ul><li>Write a concise vendor follow-up email with deadline, pending item, and clear next step.</li><li>Summarize current vendor status across open requests into: on-track, delayed, blocked, and required decisions.</li><li>Create a weekly vendor report highlighting completed, open, delayed, and escalation items.</li></ul> : <ul><li>Write a short, professional follow-up message for a real estate lead who contacted me about buying a property. Keep the tone warm, clear, and not pushy. Ask one simple next-step question.</li><li>Summarize this lead conversation into: client need, budget or range if mentioned, location preference, urgency, next action, and follow-up date. Do not invent missing details.</li><li>Review this list of open real estate leads and identify which ones need follow-up, which are blocked, and which should be closed. Give me a simple priority list.</li></ul>}</div></div>

              <div className="snapshot-grid report-section-gap"><div className="snapshot-full"><h3>SCARF Trust & AI Adoption Check</h3><div className="scarf-grid">{(['status','certainty','autonomy','relatedness','fairness'] as const).map((k) => <div key={k} className="scarf-card"><h4>{k[0].toUpperCase()+k.slice(1)}</h4><p><strong>Risk:</strong> {safeText(scarf[k]?.risk, HUMAN_REVIEW_FALLBACK)}</p><p><strong>Recommendation:</strong> {safeText(scarf[k]?.recommendation, HUMAN_REVIEW_FALLBACK)}</p></div>)}</div></div></div>

              <div className="snapshot-grid report-section-gap"><div className="snapshot-full"><h3>AI Use Transparency Summary</h3><div className="charter-grid"><p><strong>Input used:</strong> {safeText(transparency.inputUsed, HUMAN_REVIEW_FALLBACK)}</p><p><strong>Output generated:</strong> {safeText(transparency.outputGenerated, HUMAN_REVIEW_FALLBACK)}</p><p><strong>Human validation:</strong> {safeText(transparency.humanValidation, HUMAN_REVIEW_FALLBACK)}</p><p><strong>Sensitive data warning:</strong> {safeText(transparency.sensitiveDataWarning, HUMAN_REVIEW_FALLBACK)}</p></div></div></div>

              <div className="snapshot-grid report-section-gap"><div><h3>AI + PM Opportunities</h3><ul>{opportunities.map((o) => <li key={o}>{o}</li>)}</ul></div><div className="quick-win-card"><h3>Quick Win</h3><p>{quickWin}</p></div><div className="snapshot-full"><h3>7-Day Implementation Roadmap</h3><ol className="roadmap-list">{roadmap.map((r, i) => <li key={`${i}-${r}`}>{r}</li>)}</ol></div></div>

              <div className="snapshot-grid report-section-gap"><div className="snapshot-full"><h3>What the Human-Reviewed Report Adds</h3><ul>{reviewedPreview.map((p) => <li key={p}>{p}</li>)}</ul></div><div className="snapshot-full"><h3>Disclaimer</h3><p>{disclaimer}</p></div></div>
            </div>
            <div className="hero-actions"><a className="button primary" href={CALENDLY_URL} target="_blank" rel="noreferrer">Book a 15-minute review</a><a className="button secondary" href={CALENDLY_URL} target="_blank" rel="noreferrer">Request human-reviewed report</a><Link className="button secondary" to="/">Back to Home</Link></div>
          </>
        ) : <p className="resource-card">Thank you — your intake was received. We will review it and prepare a full human-reviewed AI PM Workflow Report within 3 business days.</p>}
      </section>
    );
  }

  return (
    <>
      <section className="page-intro section-shell"><p className="eyebrow">Real Estate AI PM Pilot</p><h1>AI PM Workflow Pilot for Real Estate Professionals</h1><p className="hero-lede">Use AI to organize real estate work, not just write better captions.</p></section>
      <section id="pilot-wizard" className="section-shell detail-card"><p className="eyebrow">Pilot intake wizard</p><h2>{progressText}</h2><a className="back-home-link" href="/">← Back to Home</a><p className="tiny-disclaimer">Not tokenization. Not legal, financial, tax, investment, brokerage, or compliance advice.</p>
        <form className="pilot-form" onSubmit={onSubmit}>
          {step === 0 && <div className="form-grid two-col"><label>Name *<input value={data.name} onChange={(e) => updateField('name', e.target.value)} /></label><label>Email *<input type="email" value={data.email} onChange={(e) => updateField('email', e.target.value)} /></label><label>Role *<select value={data.role} onChange={(e) => updateField('role', e.target.value)}><option value="">Select</option>{['Realtor','Broker','Property Manager','Real Estate Investor','Contractor','Small Real Estate Team','Other'].map((item)=><option key={item} value={item}>{item}</option>)}</select></label><label>Market location *<input value={data.marketLocation} onChange={(e) => updateField('marketLocation', e.target.value)} /></label><label>Team size<select value={data.teamSize} onChange={(e) => updateField('teamSize', e.target.value)}><option value="">Select</option>{['Just me','2–5 people','6–10 people','10+ people'].map((item)=><option key={item} value={item}>{item}</option>)}</select></label></div>}
          {step === 1 && <label>Workflow type to improve *<select value={data.workflowType} onChange={(e) => updateField('workflowType', e.target.value)}><option value="">Select</option>{['Lead intake','Buyer follow-up','Seller follow-up','Listing preparation','Open house preparation','Transaction checklist','Vendor coordination','Client communication','Weekly client updates','Property project tracking','Content-to-client follow-up','Other'].map((item)=><option key={item} value={item}>{item}</option>)}</select></label>}
          {step === 2 && <div className="form-grid"><label>Information usually starts from<select value={data.informationStartsFrom} onChange={(e) => updateField('informationStartsFrom', e.target.value)}><option value="">Select</option>{['Email','Phone calls','Text messages','Instagram / Social media','Zillow / Realtor.com / leads platform','CRM','Google Sheets','Paper / memory','Other'].map((item)=><option key={item} value={item}>{item}</option>)}</select></label><label>Describe how this workflow happens today *<textarea value={data.currentProcess} onChange={(e) => updateField('currentProcess', e.target.value)} rows={6} /></label></div>}
          {step === 3 && <div className="form-grid two-col"><label>Main pain points *<select value={data.mainPainPoints} onChange={(e) => updateField('mainPainPoints', e.target.value)}><option value="">Select</option>{['Missed follow-ups','Scattered notes','Repeated messages','No clear next steps','Tasks are not organized','I lose time after calls or meetings','No system for updates','Too many tools','Everything is manual','Other'].map((item)=><option key={item} value={item}>{item}</option>)}</select></label><label>Time lost per week<select value={data.timeLostPerWeek} onChange={(e) => updateField('timeLostPerWeek', e.target.value)}><option value="">Select</option>{['Less than 1 hour','1–3 hours','3–5 hours','5+ hours'].map((item)=><option key={item} value={item}>{item}</option>)}</select></label></div>}
          {step === 4 && <div className="form-grid two-col"><label>AI usage today<select value={data.aiUsageToday} onChange={(e) => updateField('aiUsageToday', e.target.value)}><option value="">Select</option>{['Yes, often','Sometimes','I tried it but not consistently','Not really'].map((item)=><option key={item} value={item}>{item}</option>)}</select></label><label>Current tools<select value={data.currentTools} onChange={(e) => updateField('currentTools', e.target.value)}><option value="">Select</option>{['Gmail / Outlook','Google Sheets','Google Docs','Trello','ClickUp','Asana','Notion','CRM','No real system','Other'].map((item)=><option key={item} value={item}>{item}</option>)}</select></label></div>}
          {step === 5 && <div className="form-grid"><label>Desired output *<select value={data.desiredOutput} onChange={(e) => updateField('desiredOutput', e.target.value)}><option value="">Select</option>{['Workflow map','Simple task tracker','Follow-up templates','AI prompt templates','Client communication templates','Weekly update structure','Recommended tools','7-day implementation plan','Short call to review the workflow'].map((item)=><option key={item} value={item}>{item}</option>)}</select></label><label>Open to call?<select value={data.openToCall} onChange={(e) => updateField('openToCall', e.target.value)}><option value="">Select</option>{['Yes','No','Maybe'].map((item)=><option key={item} value={item}>{item}</option>)}</select></label><label>Additional notes<textarea value={data.additionalNotes} onChange={(e) => updateField('additionalNotes', e.target.value)} rows={5} /></label></div>}
          {error && <p className="form-error">{error}</p>}
          {submitting && <p className="form-wait-message">Please wait while we prepare your result page...</p>}
          <div className="wizard-actions">{step > 0 && <button type="button" className="button secondary" onClick={() => { setError(''); setStep((prev) => Math.max(prev - 1, 0)); }}>Back</button>}{step < stepLabels.length - 1 ? <button type="button" className="button primary" onClick={() => { const v = validateStep(step); if (v) setError(v); else { setError(''); setStep((prev) => Math.min(prev + 1, stepLabels.length - 1)); } }}>Next</button> : <button type="submit" className="button primary" disabled={submitting}>{submitting ? 'Please wait...' : 'Submit pilot intake'}</button>}</div>
        </form>
      </section>
    </>
  );
}
