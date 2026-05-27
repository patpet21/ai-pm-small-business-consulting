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
  workflowReadinessScore?: number | string;
  workflowMaturity?: string;
  workflowDetected?: string;
  executiveSummary?: string;
  executivePmSummary?: string;
  problemStatement?: string;
  pmProblemStatement?: string;
  mainBottleneck?: string;
  recommendedPriority?: string;
  recommendedFirstStep?: string;
  suggestedSimpleSystem?: string;
  recommendedSimpleSystem?: string;
  topWorkflowGaps?: string[];
  wbsTaskBreakdown?: WbsItem[];
  taskBreakdown?: WbsItem[];
  scarfTrustCheck?: ScarfCheck;
  aiUseTransparencySummary?: TransparencySummary;
  humanReviewedReportPreview?: string[];
  aiOpportunities?: string[];
  aiPmWorkflowOpportunities?: string[];
  quickWin?: string;
  sevenDayRoadmap?: string[];
  sevenDayImplementationRoadmap?: Array<{ day?: string; focus?: string; action?: string }>;
  riskNotes?: string;
  nextStep?: string;
  ctaPrimary?: string;
  ctaSecondary?: string;
  calendlyUrl?: string;
  disclaimer?: string;
};

type ApiResponse = { success?: boolean; message?: string; submissionId?: string; instantSnapshot?: Snapshot; preliminaryReport?: Snapshot };

const initialData: IntakeData = {
  name: '', email: '', role: '', marketLocation: '', teamSize: '', workflowType: '', currentProcess: '',
  informationStartsFrom: '', currentTools: '', mainPainPoints: '', timeLostPerWeek: '', aiUsageToday: '', desiredOutput: '', openToCall: '', additionalNotes: '',
};
const stepLabels = ['About you', 'Workflow to improve', 'Current process', 'Pain points', 'AI and tools', 'Desired output'];
const REVIEW_PENDING = 'This will be reviewed in the human-reviewed report.';
const DEFAULT_DISCLAIMER = 'This preliminary snapshot is AI-generated and has not been reviewed by a human. It is not legal, tax, financial, investment, brokerage, or compliance advice.';

const asText = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');
const asArray = <T,>(value: unknown): T[] => (Array.isArray(value) ? value as T[] : []);

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

  const nextStep = () => {
    const validation = validateStep(step);
    if (validation) return setError(validation);
    setError('');
    setStep((prev) => Math.min(prev + 1, stepLabels.length - 1));
  };

  const prevStep = () => {
    setError('');
    setStep((prev) => Math.max(prev - 1, 0));
  };

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = validateStep(step);
    if (validation) return setError(validation);
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch(REAL_ESTATE_AI_PM_PROXY_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = (await res.json()) as ApiResponse;
      setResponse(json);
      setSubmitted(true);
      setFallbackSuccess(!(json.success && json.instantSnapshot));
    } catch {
      setSubmitted(true);
      setFallbackSuccess(true);
    } finally {
      setSubmitting(false);
    }
  }

  const report = response?.instantSnapshot || response?.preliminaryReport;
  const score = Number(report?.workflowReadinessScore);
  const hasScore = Number.isFinite(score);
  const topGaps = asArray<string>(report?.topWorkflowGaps).filter(Boolean).slice(0, 3);
  const wbs = asArray<WbsItem>(report?.wbsTaskBreakdown?.length ? report?.wbsTaskBreakdown : report?.taskBreakdown);
  const opportunities = asArray<string>(report?.aiOpportunities?.length ? report?.aiOpportunities : report?.aiPmWorkflowOpportunities).filter(Boolean).slice(0, 3);
  const roadmap = asArray<string>(report?.sevenDayRoadmap).filter(Boolean);
  const roadmapLegacy = asArray<{ day?: string; focus?: string; action?: string }>(report?.sevenDayImplementationRoadmap)
    .map((item, idx) => {
      const day = asText(item.day) || `Day ${idx + 1}`;
      const body = [asText(item.focus), asText(item.action)].filter(Boolean).join(' — ');
      return body ? `${day}: ${body}` : '';
    })
    .filter(Boolean);
  const finalRoadmap = roadmap.length ? roadmap : roadmapLegacy;
  const reportPreview = asArray<string>(report?.humanReviewedReportPreview).filter(Boolean);

  const scarf = report?.scarfTrustCheck;
  const scarfEntries: Array<{ title: string; data?: ScarfItem }> = [
    { title: 'Status', data: scarf?.status },
    { title: 'Certainty', data: scarf?.certainty },
    { title: 'Autonomy', data: scarf?.autonomy },
    { title: 'Relatedness', data: scarf?.relatedness },
    { title: 'Fairness', data: scarf?.fairness },
  ];

  const ctaPrimary = asText(report?.ctaPrimary) || 'Book a 15-minute review';
  const ctaSecondary = asText(report?.ctaSecondary) || 'Request human-reviewed report';
  const calendlyUrl = asText(report?.calendlyUrl) || 'https://calendly.com/propertydext/30min';

  if (submitted) {
    return (
      <section className="section-shell pilot-success">
        <p className="eyebrow">Real Estate AI PM Pilot</p>
        <h1>Thank you — your intake was received.</h1>
        <p className="hero-lede">Here is your Preliminary AI PM Workflow Snapshot.</p>
        <p className="success-note">This report is automatically generated from your intake answers and has not yet been reviewed by a human. A complete human-reviewed AI PM Workflow Report can be prepared within 3 business days.</p>

        {!fallbackSuccess && report ? (
          <div className="resource-card snapshot-card">
            <p><strong>Submission ID:</strong> {asText(response?.submissionId) || 'Pending assignment'}</p>

            <div className="snapshot-grid report-section-gap">
              <div className="score-card">
                <p className="score-label">AI PM Workflow Readiness Score</p>
                <p className="score-value">{hasScore ? `${score}/100` : REVIEW_PENDING}</p>
              </div>
              {!!asText(report.workflowMaturity) && <div><h3>Workflow Maturity</h3><p>{asText(report.workflowMaturity)}</p></div>}
              {!!asText(report.workflowDetected) && <div><h3>Workflow Detected</h3><p>{asText(report.workflowDetected)}</p></div>}
              {!!asText(report.mainBottleneck) && <div><h3>Main Bottleneck</h3><p>{asText(report.mainBottleneck)}</p></div>}
              {!!asText(report.recommendedPriority) && <div><h3>Recommended Priority</h3><p>{asText(report.recommendedPriority)}</p></div>}
            </div>

            {!!asText(report.executiveSummary) && (
              <div className="snapshot-grid report-section-gap"><div className="snapshot-full"><h3>Executive Summary</h3><p>{asText(report.executiveSummary)}</p></div></div>
            )}

            {!!(asText(report.problemStatement) || asText(report.pmProblemStatement)) && (
              <div className="snapshot-grid report-section-gap"><div className="snapshot-full"><h3>Problem Statement</h3><p>{asText(report.problemStatement) || asText(report.pmProblemStatement)}</p></div></div>
            )}

            <div className="snapshot-grid report-section-gap">
              <div className="snapshot-full">
                <h3>Top 3 Workflow Gaps</h3>
                {topGaps.length ? <ul>{topGaps.map((item) => <li key={item}>{item}</li>)}</ul> : <p>{REVIEW_PENDING}</p>}
              </div>

              <div className="snapshot-full">
                <h3>WBS-Based Task Breakdown</h3>
                {wbs.length ? (
                  <div className="rows-list">
                    {wbs.map((item, idx) => (
                      <div className="row-card" key={`${asText(item.taskName)}-${idx}`}>
                        <p><strong>Task:</strong> {asText(item.taskName) || REVIEW_PENDING}</p>
                        <p><strong>Owner Type:</strong> {asText(item.ownerType) || REVIEW_PENDING}</p>
                        <p><strong>Output:</strong> {asText(item.output) || REVIEW_PENDING}</p>
                        <p><strong>Acceptance Criteria:</strong> {asText(item.acceptanceCriteria) || REVIEW_PENDING}</p>
                      </div>
                    ))}
                  </div>
                ) : <p>{REVIEW_PENDING}</p>}
              </div>
            </div>

            <div className="snapshot-grid report-section-gap">
              <div className="snapshot-full">
                <h3>SCARF Trust & AI Adoption Check</h3>
                <div className="scarf-grid">
                  {scarfEntries.map((entry) => (
                    <div key={entry.title} className="scarf-card">
                      <h4>{entry.title}</h4>
                      {entry.data ? (
                        <>
                          <p><strong>Risk:</strong> {asText(entry.data.risk) || REVIEW_PENDING}</p>
                          <p><strong>Recommendation:</strong> {asText(entry.data.recommendation) || REVIEW_PENDING}</p>
                        </>
                      ) : <p>{REVIEW_PENDING}</p>}
                    </div>
                  ))}
                </div>
              </div>

              <div className="snapshot-full">
                <h3>AI Use Transparency Summary</h3>
                {report.aiUseTransparencySummary ? (
                  <div className="charter-grid">
                    <p><strong>Input Used:</strong> {asText(report.aiUseTransparencySummary.inputUsed) || REVIEW_PENDING}</p>
                    <p><strong>Output Generated:</strong> {asText(report.aiUseTransparencySummary.outputGenerated) || REVIEW_PENDING}</p>
                    <p><strong>Human Validation:</strong> {asText(report.aiUseTransparencySummary.humanValidation) || REVIEW_PENDING}</p>
                    <p><strong>Sensitive Data Warning:</strong> {asText(report.aiUseTransparencySummary.sensitiveDataWarning) || REVIEW_PENDING}</p>
                  </div>
                ) : <p>{REVIEW_PENDING}</p>}
              </div>
            </div>

            <div className="snapshot-grid report-section-gap">
              <div>
                <h3>AI + PM Opportunities</h3>
                {opportunities.length ? <ul>{opportunities.map((item) => <li key={item}>{item}</li>)}</ul> : <p>{REVIEW_PENDING}</p>}
              </div>
              {!!asText(report.quickWin) && <div className="quick-win-card"><h3>Quick Win</h3><p>{asText(report.quickWin)}</p></div>}
              <div className="snapshot-full">
                <h3>7-Day Implementation Roadmap</h3>
                {finalRoadmap.length ? <ol className="roadmap-list">{finalRoadmap.map((item, idx) => <li key={`${idx}-${item}`}>{item}</li>)}</ol> : <p>{REVIEW_PENDING}</p>}
              </div>
            </div>

            <div className="snapshot-grid report-section-gap">
              <div className="snapshot-full">
                <h3>Human-Reviewed Report Preview</h3>
                <p>The complete human-reviewed report can include:</p>
                {reportPreview.length ? <ul>{reportPreview.map((item) => <li key={item}>{item}</li>)}</ul> : <p>{REVIEW_PENDING}</p>}
              </div>
              <div className="snapshot-full"><h3>Next Step</h3><p>{asText(report.nextStep) || 'Free AI Snapshot → Human-Reviewed Report → Workflow Setup Sprint → Monthly Support'}</p></div>
              <div className="snapshot-full"><h3>Disclaimer</h3><p>{asText(report.disclaimer) || DEFAULT_DISCLAIMER}</p></div>
            </div>
          </div>
        ) : (
          <p className="resource-card">Thank you — your intake was received. We will review it and prepare a full human-reviewed AI PM Workflow Report within 3 business days.</p>
        )}

        <div className="hero-actions">
          <a className="button primary" href={calendlyUrl} target="_blank" rel="noreferrer">{ctaPrimary}</a>
          <a className="button secondary" href={calendlyUrl} target="_blank" rel="noreferrer">{ctaSecondary}</a>
          <Link className="button secondary" to="/">Back to Home</Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="page-intro section-shell">
        <p className="eyebrow">Real Estate AI PM Pilot</p>
        <h1>AI PM Workflow Pilot for Real Estate Professionals</h1>
        <p className="hero-lede">Use AI to organize real estate work, not just write better captions.</p>
      </section>
      <section id="pilot-wizard" className="section-shell detail-card">
        <p className="eyebrow">Pilot intake wizard</p><h2>{progressText}</h2><a className="back-home-link" href="/">← Back to Home</a>
        <p className="tiny-disclaimer">Not tokenization. Not legal, financial, tax, investment, brokerage, or compliance advice.</p>
        <form className="pilot-form" onSubmit={onSubmit}>
          {step === 0 && <div className="form-grid two-col"><label>Name *<input value={data.name} onChange={(e) => updateField('name', e.target.value)} /></label><label>Email *<input type="email" value={data.email} onChange={(e) => updateField('email', e.target.value)} /></label><label>Role *<select value={data.role} onChange={(e) => updateField('role', e.target.value)}><option value="">Select</option>{['Realtor','Broker','Property Manager','Real Estate Investor','Contractor','Small Real Estate Team','Other'].map((item)=><option key={item} value={item}>{item}</option>)}</select></label><label>Market location *<input value={data.marketLocation} onChange={(e) => updateField('marketLocation', e.target.value)} /></label><label>Team size<select value={data.teamSize} onChange={(e) => updateField('teamSize', e.target.value)}><option value="">Select</option>{['Just me','2–5 people','6–10 people','10+ people'].map((item)=><option key={item} value={item}>{item}</option>)}</select></label></div>}
          {step === 1 && <label>Workflow type to improve *<select value={data.workflowType} onChange={(e) => updateField('workflowType', e.target.value)}><option value="">Select</option>{['Lead intake','Buyer follow-up','Seller follow-up','Listing preparation','Open house preparation','Transaction checklist','Vendor coordination','Client communication','Weekly client updates','Property project tracking','Content-to-client follow-up','Other'].map((item)=><option key={item} value={item}>{item}</option>)}</select></label>}
          {step === 2 && <div className="form-grid"><label>Information usually starts from<select value={data.informationStartsFrom} onChange={(e) => updateField('informationStartsFrom', e.target.value)}><option value="">Select</option>{['Email','Phone calls','Text messages','Instagram / Social media','Zillow / Realtor.com / leads platform','CRM','Google Sheets','Paper / memory','Other'].map((item)=><option key={item} value={item}>{item}</option>)}</select></label><label>Describe how this workflow happens today *<textarea value={data.currentProcess} onChange={(e) => updateField('currentProcess', e.target.value)} rows={6} /></label></div>}
          {step === 3 && <div className="form-grid two-col"><label>Main pain points *<select value={data.mainPainPoints} onChange={(e) => updateField('mainPainPoints', e.target.value)}><option value="">Select</option>{['Missed follow-ups','Scattered notes','Repeated messages','No clear next steps','Tasks are not organized','I lose time after calls or meetings','No system for updates','Too many tools','Everything is manual','Other'].map((item)=><option key={item} value={item}>{item}</option>)}</select></label><label>Time lost per week<select value={data.timeLostPerWeek} onChange={(e) => updateField('timeLostPerWeek', e.target.value)}><option value="">Select</option>{['Less than 1 hour','1–3 hours','3–5 hours','5+ hours'].map((item)=><option key={item} value={item}>{item}</option>)}</select></label></div>}
          {step === 4 && <div className="form-grid two-col"><label>AI usage today<select value={data.aiUsageToday} onChange={(e) => updateField('aiUsageToday', e.target.value)}><option value="">Select</option>{['Yes, often','Sometimes','I tried it but not consistently','Not really'].map((item)=><option key={item} value={item}>{item}</option>)}</select></label><label>Current tools<select value={data.currentTools} onChange={(e) => updateField('currentTools', e.target.value)}><option value="">Select</option>{['Gmail / Outlook','Google Sheets','Google Docs','Trello','ClickUp','Asana','Notion','CRM','No real system','Other'].map((item)=><option key={item} value={item}>{item}</option>)}</select></label></div>}
          {step === 5 && <div className="form-grid"><label>Desired output *<select value={data.desiredOutput} onChange={(e) => updateField('desiredOutput', e.target.value)}><option value="">Select</option>{['Workflow map','Simple task tracker','Follow-up templates','AI prompt templates','Client communication templates','Weekly update structure','Recommended tools','7-day implementation plan','Short call to review the workflow'].map((item)=><option key={item} value={item}>{item}</option>)}</select></label><label>Open to call?<select value={data.openToCall} onChange={(e) => updateField('openToCall', e.target.value)}><option value="">Select</option>{['Yes','No','Maybe'].map((item)=><option key={item} value={item}>{item}</option>)}</select></label><label>Additional notes<textarea value={data.additionalNotes} onChange={(e) => updateField('additionalNotes', e.target.value)} rows={5} /></label></div>}
          {error && <p className="form-error">{error}</p>}
          {submitting && <p className="form-wait-message">Please wait while we prepare your result page...</p>}
          <div className="wizard-actions">
            {step > 0 && <button type="button" className="button secondary" onClick={prevStep}>Back</button>}
            {step < stepLabels.length - 1 ? <button type="button" className="button primary" onClick={nextStep}>Next</button> : <button type="submit" className="button primary" disabled={submitting}>{submitting ? 'Please wait...' : 'Submit pilot intake'}</button>}
          </div>
        </form>
      </section>
      <footer className="section-shell pilot-footer">
        <div className="pilot-footer-grid">
          <div><p className="pilot-footer-brand">Practical AI Systems</p><p>AI + Project Management workflow consulting for small businesses.</p></div>
          <div><p className="pilot-footer-title">Contact</p><p><a href="mailto:hello@practicalaisystems.com">hello@practicalaisystems.com</a></p><p><a href="https://calendly.com/propertydext/15min" target="_blank" rel="noreferrer">Book a 15-minute review</a></p></div>
          <div><p className="pilot-footer-title">Navigation</p><p><a href="/">Home</a></p><p><a href="/real-estate-ai-pm-pilot">Real Estate AI PM Pilot</a></p></div>
        </div>
      </footer>
    </>
  );
}
