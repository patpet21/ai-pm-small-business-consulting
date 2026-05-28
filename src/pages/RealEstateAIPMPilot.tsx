import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { REAL_ESTATE_AI_PM_PROXY_ENDPOINT } from '../config/endpoints';

type IntakeData = {
  name: string;
  email: string;
  role: string;
  marketLocation: string;
  teamSize: string;
  workflowType: string;
  currentProcess: string;
  informationStartsFrom: string;
  currentTools: string;
  mainPainPoints: string;
  timeLostPerWeek: string;
  aiUsageToday: string;
  desiredOutput: string;
  openToCall: string;
  additionalNotes: string;
};

type WbsItem = { taskName?: string; ownerType?: string; output?: string; acceptanceCriteria?: string };
type Fix = { title?: string; description?: string; trackerName?: string; columns?: string[]; statuses?: string[] };
type PromptItem = { title?: string; prompt?: string };
type ScarfItem = { domain?: string; risk?: string; recommendation?: string };
type Transparency = { inputUsed?: string; outputGenerated?: string; humanValidation?: string; sensitiveDataWarning?: string };
type Snapshot = {
  workflowReadinessScore?: number | string;
  workflowMaturity?: string;
  workflowDetected?: string;
  executiveSummary?: string;
  problemStatement?: string;
  mainBottleneck?: string;
  recommendedPriority?: string;
  recommendedFirstStep?: string;
  suggestedSimpleSystem?: string;
  topWorkflowGaps?: string[];
  first48HourFix?: Fix;
  wbsTaskBreakdown?: WbsItem[];
  aiPromptPack?: PromptItem[];
  scarfTrustCheck?: ScarfItem[];
  aiUseTransparencySummary?: Transparency;
  aiOpportunities?: string[];
  quickWin?: string;
  sevenDayRoadmap?: string[];
  humanReviewedReportPreview?: string[];
  riskNotes?: string[];
  nextStep?: string;
  ctaPrimary?: string;
  ctaSecondary?: string;
  calendlyUrl?: string;
  disclaimer?: string;
  aiStatus?: string;
};
type ApiResponse = { success?: boolean; message?: string; submissionId?: string; instantSnapshot?: Snapshot };

const initialData: IntakeData = {
  name: '',
  email: '',
  role: '',
  marketLocation: '',
  teamSize: '',
  workflowType: '',
  currentProcess: '',
  informationStartsFrom: '',
  currentTools: '',
  mainPainPoints: '',
  timeLostPerWeek: '',
  aiUsageToday: '',
  desiredOutput: '',
  openToCall: '',
  additionalNotes: '',
};
const stepLabels = ['About you', 'Workflow to improve', 'Current process', 'Pain points', 'AI and tools', 'Desired output'];
const ERR_MSG = 'Personalized AI generation failed. Please request a human-reviewed report.';
const FALLBACK_DISCLAIMER = 'This preliminary snapshot is AI-generated and has not been reviewed by a human. It is not legal, tax, financial, investment, brokerage, or compliance advice.';
const CALENDLY = 'https://calendly.com/propertydext/15min';

const isDisplayableText = (value: unknown): value is string => {
  if (typeof value !== 'string') return false;
  const normalized = value.trim().toLowerCase();
  return normalized !== '' && normalized !== 'n/a' && normalized !== 'undefined' && normalized !== 'null';
};
const hasValue = (value: unknown): boolean => {
  if (Array.isArray(value)) return value.some((item) => hasValue(item));
  if (typeof value === 'object' && value !== null) return Object.values(value).some((item) => hasValue(item));
  return isDisplayableText(value) || typeof value === 'number';
};
const safeText = (value: unknown, fallback = ''): string => (isDisplayableText(value) ? value.trim() : fallback);
const safeArray = <T,>(value: unknown, fallback: T[] = []): T[] => (Array.isArray(value) ? (value as T[]) : fallback);
const safeObjectArray = <T extends object>(value: unknown, fallback: T[] = []): T[] =>
  Array.isArray(value) ? (value.filter((item) => typeof item === 'object' && item !== null) as T[]) : fallback;
const textArray = (value: unknown, limit?: number): string[] => {
  const items = safeArray<unknown>(value)
    .map((item) => safeText(item))
    .filter(Boolean);
  return typeof limit === 'number' ? items.slice(0, limit) : items;
};

export function RealEstateAIPMPilot() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<IntakeData>(initialData);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState<number | null>(null);
  const progressText = useMemo(() => `Step ${step + 1} of ${stepLabels.length}: ${stepLabels[step]}`, [step]);
  const updateField = (field: keyof IntakeData, value: string) => setData((previous) => ({ ...previous, [field]: value }));

  const validateStep = (currentStep: number): string | null => {
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
  };

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationError = validateStep(step);
    if (validationError) return setError(validationError);
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch(REAL_ESTATE_AI_PM_PROXY_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = (await res.json()) as ApiResponse;
      console.log('instantSnapshot received:', json.instantSnapshot);
      console.log('instantSnapshot keys:', Object.keys(json.instantSnapshot || {}));
      console.log('first48HourFix:', json.instantSnapshot?.first48HourFix);
      console.log('aiPromptPack:', json.instantSnapshot?.aiPromptPack);
      setResponse(json);
      setSubmitted(true);
    } catch {
      setResponse({ success: false, message: ERR_MSG });
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  }

  const copyPrompt = async (prompt: string, index: number) => {
    if (!navigator.clipboard) return;
    await navigator.clipboard.writeText(prompt);
    setCopiedPrompt(index);
    window.setTimeout(() => setCopiedPrompt(null), 1800);
  };

  const report = response?.instantSnapshot;
  const aiGenerationFailed = report?.aiStatus === 'AI_GENERATION_FAILED' || response?.success === false;
  const requiredValid = !!report && !aiGenerationFailed && (hasValue(report.workflowDetected) || hasValue(report.first48HourFix) || hasValue(report.aiPromptPack));

  if (submitted) {
    if (!requiredValid) {
      return (
        <section className="section-shell pilot-success">
          <p className="eyebrow">Real Estate AI PM Pilot</p>
          <h1>Your Preliminary AI PM Workflow Snapshot is Ready</h1>
          <p className="resource-card">{ERR_MSG}</p>
          <div className="hero-actions">
            <a className="button primary" href={CALENDLY} target="_blank" rel="noreferrer">Book a 15-minute review</a>
            <a className="button secondary" href={CALENDLY} target="_blank" rel="noreferrer">Request human-reviewed report</a>
            <Link className="button secondary" to="/">Back to Home</Link>
          </div>
        </section>
      );
    }

    const topGaps = textArray(report.topWorkflowGaps, 3);
    const wbs = safeObjectArray<WbsItem>(report.wbsTaskBreakdown).filter((item) => hasValue(item));
    const prompts = safeObjectArray<PromptItem>(report.aiPromptPack).filter((item) => hasValue(item.prompt));
    const scarf = safeObjectArray<ScarfItem>(report.scarfTrustCheck).filter((item) => hasValue(item));
    const opportunities = textArray(report.aiOpportunities, 3);
    const roadmap = textArray(report.sevenDayRoadmap);
    const preview = textArray(report.humanReviewedReportPreview);
    const risks = textArray(report.riskNotes);
    const fix = report.first48HourFix;
    const fixColumns = textArray(fix?.columns);
    const fixStatuses = textArray(fix?.statuses);
    const transparency = report.aiUseTransparencySummary || {};
    const readiness = Number(report.workflowReadinessScore);
    const hasScore = Number.isFinite(readiness);
    const calendlyUrl = CALENDLY;
    const hasAiGeneratedBadge = report.aiStatus === 'AI_GENERATED';

    return (
      <section className="section-shell pilot-success">
        <p className="eyebrow">Real Estate AI PM Pilot</p>
        <h1>Your Preliminary AI PM Workflow Snapshot is Ready</h1>
        <p className="success-note">This report is automatically generated from your intake answers and has not yet been reviewed by a human. A complete human-reviewed AI PM Workflow Report can be prepared within 3 business days.</p>
        <div className="hero-actions">
          <a className="button primary" href={calendlyUrl} target="_blank" rel="noreferrer">{safeText(report.ctaPrimary, 'Book a 15-minute review')}</a>
          <a className="button secondary" href={calendlyUrl} target="_blank" rel="noreferrer">{safeText(report.ctaSecondary, 'Request human-reviewed report')}</a>
        </div>

        <div className="resource-card snapshot-card premium-report-card">
          <div className="report-hero-card">
            <div className="report-hero-copy">
              <p><strong>Submission ID:</strong> {safeText(response?.submissionId, '')}</p>
              <h2>{safeText(report.workflowDetected, 'AI PM Workflow Snapshot')}</h2>
              {hasAiGeneratedBadge && <span className="ai-status-badge">AI-generated preliminary snapshot</span>}
            </div>
            {hasScore && (
              <div className="score-card report-score-card">
                <p className="score-label">AI PM Workflow Readiness Score</p>
                <p className="score-value">{readiness}/100</p>
              </div>
            )}
          </div>

          <div className="snapshot-grid report-section-gap hero-metrics-grid">
            {hasValue(report.workflowMaturity) && <div className="metric-card"><h3>Workflow Maturity</h3><p>{safeText(report.workflowMaturity)}</p></div>}
            {hasValue(report.mainBottleneck) && <div className="metric-card"><h3>Main Bottleneck</h3><p>{safeText(report.mainBottleneck)}</p></div>}
            {hasValue(report.recommendedPriority) && <div className="metric-card"><h3>Recommended Priority</h3><p>{safeText(report.recommendedPriority)}</p></div>}
          </div>

          {hasValue(fix) && (
            <div className="first-fix-card report-section-gap">
              <div className="fix-header">
                <p className="eyebrow">Your First 48-Hour Fix</p>
                <h3>{safeText(fix?.title, 'Your First 48-Hour Fix')}</h3>
                {hasValue(fix?.description) && <p>{safeText(fix?.description)}</p>}
              </div>
              {hasValue(fix?.trackerName) && (
                <div className="tracker-name-card">
                  <span>Tracker name</span>
                  <strong>{safeText(fix?.trackerName)}</strong>
                </div>
              )}
              {fixColumns.length > 0 && (
                <div className="chip-section">
                  <h4>Tracker columns</h4>
                  <div className="chip-grid">{fixColumns.map((column) => <span className="report-chip" key={column}>{column}</span>)}</div>
                </div>
              )}
              {fixStatuses.length > 0 && (
                <div className="chip-section">
                  <h4>Status flow</h4>
                  <div className="status-badges">{fixStatuses.map((status) => <span className="status-badge" key={status}>{status}</span>)}</div>
                </div>
              )}
            </div>
          )}

          {(hasValue(report.executiveSummary) || hasValue(report.problemStatement) || topGaps.length > 0) && (
            <div className="snapshot-grid report-section-gap diagnosis-grid">
              {hasValue(report.executiveSummary) && <div className="snapshot-full diagnosis-card"><h3>Executive Summary</h3><p>{safeText(report.executiveSummary)}</p></div>}
              {hasValue(report.problemStatement) && <div className="snapshot-full diagnosis-card"><h3>Problem Statement</h3><p>{safeText(report.problemStatement)}</p></div>}
              {topGaps.length > 0 && <div className="snapshot-full diagnosis-card"><h3>Top 3 Workflow Gaps</h3><ul>{topGaps.map((gap) => <li key={gap}>{gap}</li>)}</ul></div>}
            </div>
          )}

          {prompts.length > 0 && (
            <div className="snapshot-grid report-section-gap">
              <div className="snapshot-full prompt-pack-section">
                <p className="eyebrow">Practical AI Output</p>
                <h3>Copy/Paste AI Prompt Pack</h3>
                <div className="prompt-grid">
                  {prompts.map((prompt, index) => {
                    const promptText = safeText(prompt.prompt);
                    return (
                      <div className="prompt-card" key={`${index}-${safeText(prompt.title, 'prompt')}`}>
                        <div className="prompt-card-header">
                          <h4>{safeText(prompt.title, `Prompt ${index + 1}`)}</h4>
                          <button type="button" className="copy-button" onClick={() => copyPrompt(promptText, index)} disabled={!promptText}>
                            {copiedPrompt === index ? 'Copied' : 'Copy'}
                          </button>
                        </div>
                        <p>{promptText}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {wbs.length > 0 && (
            <div className="snapshot-grid report-section-gap">
              <div className="snapshot-full">
                <h3>WBS-Based Workflow Breakdown</h3>
                <div className="rows-list wbs-grid">
                  {wbs.map((item, index) => (
                    <div className="row-card wbs-card" key={`${index}-${safeText(item.taskName, 'task')}`}>
                      {hasValue(item.taskName) && <h4>{safeText(item.taskName)}</h4>}
                      {hasValue(item.ownerType) && <p><strong>Owner Type:</strong> {safeText(item.ownerType)}</p>}
                      {hasValue(item.output) && <p><strong>Output:</strong> {safeText(item.output)}</p>}
                      {hasValue(item.acceptanceCriteria) && <p><strong>Acceptance Criteria:</strong> {safeText(item.acceptanceCriteria)}</p>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {hasValue(report.quickWin) && <div className="snapshot-grid report-section-gap"><div className="snapshot-full quick-win-card"><p className="eyebrow">Quick Win</p><h3>{safeText(report.quickWin)}</h3></div></div>}

          {roadmap.length > 0 && <div className="snapshot-grid report-section-gap"><div className="snapshot-full roadmap-card"><h3>7-Day Implementation Roadmap</h3><ol className="roadmap-list">{roadmap.map((item, index) => <li key={`${index}-${item}`}>{item}</li>)}</ol></div></div>}

          {scarf.length > 0 && (
            <div className="snapshot-grid report-section-gap">
              <div className="snapshot-full">
                <h3>SCARF Trust & AI Adoption Check</h3>
                <div className="scarf-grid">{scarf.map((item, index) => <div className="scarf-card" key={`${index}-${safeText(item.domain, 'scarf')}`}><h4>{safeText(item.domain)}</h4>{hasValue(item.risk) && <p><strong>Risk:</strong> {safeText(item.risk)}</p>}{hasValue(item.recommendation) && <p><strong>Recommendation:</strong> {safeText(item.recommendation)}</p>}</div>)}</div>
              </div>
            </div>
          )}

          {(hasValue(transparency.inputUsed) || hasValue(transparency.outputGenerated) || hasValue(transparency.humanValidation) || hasValue(transparency.sensitiveDataWarning)) && (
            <div className="snapshot-grid report-section-gap">
              <div className="snapshot-full">
                <h3>AI Use Transparency Summary</h3>
                <div className="charter-grid transparency-grid">
                  {hasValue(transparency.inputUsed) && <p><strong>Input used:</strong> {safeText(transparency.inputUsed)}</p>}
                  {hasValue(transparency.outputGenerated) && <p><strong>Output generated:</strong> {safeText(transparency.outputGenerated)}</p>}
                  {hasValue(transparency.humanValidation) && <p><strong>Human validation:</strong> {safeText(transparency.humanValidation)}</p>}
                  {hasValue(transparency.sensitiveDataWarning) && <p><strong>Sensitive data warning:</strong> {safeText(transparency.sensitiveDataWarning)}</p>}
                </div>
              </div>
            </div>
          )}

          {opportunities.length > 0 && <div className="snapshot-grid report-section-gap"><div className="snapshot-full"><h3>AI + PM Opportunities</h3><ul>{opportunities.map((item) => <li key={item}>{item}</li>)}</ul></div></div>}
          {risks.length > 0 && <div className="snapshot-grid report-section-gap"><div className="snapshot-full watchouts-card"><h3>Watch-outs / Risk Notes</h3><div className="risk-note-grid">{risks.map((item) => <p key={item}>{item}</p>)}</div></div></div>}
          {preview.length > 0 && <div className="snapshot-grid report-section-gap"><div className="snapshot-full"><h3>What the Human-Reviewed Report Adds</h3><ul>{preview.map((item) => <li key={item}>{item}</li>)}</ul></div></div>}
          {hasValue(report.nextStep) && <div className="snapshot-grid report-section-gap"><div className="snapshot-full"><h3>Next Step</h3><p>{safeText(report.nextStep)}</p></div></div>}
          <div className="snapshot-grid report-section-gap"><div className="snapshot-full"><h3>Disclaimer</h3><p>{safeText(report.disclaimer, FALLBACK_DISCLAIMER)}</p></div></div>
        </div>
        <div className="hero-actions">
          <a className="button primary" href={calendlyUrl} target="_blank" rel="noreferrer">{safeText(report.ctaPrimary, 'Book a 15-minute review')}</a>
          <a className="button secondary" href={calendlyUrl} target="_blank" rel="noreferrer">{safeText(report.ctaSecondary, 'Request human-reviewed report')}</a>
          <Link className="button secondary" to="/">Back to Home</Link>
        </div>
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
          <div className="wizard-actions">{step > 0 && <button type="button" className="button secondary" onClick={() => { setError(''); setStep((previous) => Math.max(previous - 1, 0)); }}>Back</button>}{step < stepLabels.length - 1 ? <button type="button" className="button primary" onClick={() => { const validationError = validateStep(step); if (validationError) setError(validationError); else { setError(''); setStep((previous) => Math.min(previous + 1, stepLabels.length - 1)); } }}>Next</button> : <button type="submit" className="button primary" disabled={submitting}>{submitting ? 'Please wait...' : 'Submit pilot intake'}</button>}</div>
        </form>
      </section>
    </>
  );
}
