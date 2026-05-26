import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { REAL_ESTATE_AI_PM_PROXY_ENDPOINT } from '../config/endpoints';

type IntakeData = {
  name: string; email: string; role: string; marketLocation: string; teamSize: string; workflowType: string;
  currentProcess: string; informationStartsFrom: string; currentTools: string; mainPainPoints: string;
  timeLostPerWeek: string; aiUsageToday: string; desiredOutput: string; openToCall: string; additionalNotes: string;
};

type WorkflowCharter = { purpose?: string; objective?: string; scope?: string; outOfScope?: string; assumptions?: string; successCriteria?: string };
type StakeholderRow = { stakeholder?: string; role?: string; interestNeed?: string; communicationNeed?: string };
type RiskRow = { risk?: string; impact?: string; likelihood?: string; mitigation?: string };
type TaskRow = { task?: string; owner?: string; priority?: string; nextAction?: string };
type RoadmapRow = { day?: string; focus?: string; action?: string };

type Snapshot = {
  workflowDetected?: string; mainBottleneck?: string; recommendedFirstStep?: string; suggestedSimpleSystem?: string;
  aiOpportunities?: string[]; nextStep?: string; disclaimer?: string;
  executivePmSummary?: string; pmProblemStatement?: string; workflowChart?: string;
  initialWorkflowCharter?: WorkflowCharter; stakeholderMap?: StakeholderRow[]; riskRegister?: RiskRow[];
  taskBreakdown?: TaskRow[]; aiPmWorkflowOpportunities?: string[]; recommendedSimpleSystem?: string;
  sevenDayImplementationRoadmap?: RoadmapRow[]; humanReviewNextStep?: string;
};

type ApiResponse = { success?: boolean; message?: string; submissionId?: string; instantSnapshot?: Snapshot; preliminaryReport?: Snapshot };

const initialData: IntakeData = {
  name: '', email: '', role: '', marketLocation: '', teamSize: '', workflowType: '', currentProcess: '',
  informationStartsFrom: '', currentTools: '', mainPainPoints: '', timeLostPerWeek: '', aiUsageToday: '', desiredOutput: '', openToCall: '', additionalNotes: '',
};
const stepLabels = ['About you', 'Workflow to improve', 'Current process', 'Pain points', 'AI and tools', 'Desired output'];

const normalizeArray = <T,>(value: unknown): T[] => Array.isArray(value) ? value as T[] : [];

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
  const prevStep = () => { setError(''); setStep((prev) => Math.max(prev - 1, 0)); };

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = validateStep(step);
    if (validation) return setError(validation);
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch(REAL_ESTATE_AI_PM_PROXY_ENDPOINT, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
      });
      const json = (await res.json()) as ApiResponse;
      setResponse(json);
      setSubmitted(true);
      setFallbackSuccess(!(json.success && (json.preliminaryReport || json.instantSnapshot)));
    } catch {
      setSubmitted(true);
      setFallbackSuccess(true);
    } finally {
      setSubmitting(false);
    }
  }

  const report = response?.preliminaryReport || response?.instantSnapshot;
  const stakeholderMap = normalizeArray<StakeholderRow>(report?.stakeholderMap);
  const riskRegister = normalizeArray<RiskRow>(report?.riskRegister);
  const taskBreakdown = normalizeArray<TaskRow>(report?.taskBreakdown);
  const roadmap = normalizeArray<RoadmapRow>(report?.sevenDayImplementationRoadmap);
  const opportunities = report?.aiPmWorkflowOpportunities || report?.aiOpportunities || [];

  if (submitted) {
    return (
      <section className="section-shell pilot-success">
        <p className="eyebrow">Real Estate AI PM Pilot</p>
        <h1>Thank you — your intake was received.</h1>
        <p className="hero-lede">Here is your Preliminary AI PM Workflow Report.</p>
        <p className="success-note">This report is automatically generated from your intake answers and has not yet been reviewed by a human. A complete human-reviewed AI PM Workflow Report will be prepared within 3 business days.</p>

        {!fallbackSuccess && report ? (
          <div className="resource-card snapshot-card">
            <p><strong>Submission ID:</strong> {response?.submissionId || 'Pending assignment'}</p>

            <div className="snapshot-grid">
              <div className="snapshot-full"><h3>Executive PM Summary</h3><p>{report.executivePmSummary || report.workflowDetected || 'N/A'}</p></div>
              <div className="snapshot-full"><h3>PM Problem Statement</h3><p>{report.pmProblemStatement || report.mainBottleneck || 'N/A'}</p></div>
            </div>

            <div className="snapshot-grid report-section-gap">
              <div className="snapshot-full">
                <h3>Initial Workflow Charter</h3>
                <div className="charter-grid">
                  <p><strong>Purpose:</strong> {report.initialWorkflowCharter?.purpose || 'N/A'}</p>
                  <p><strong>Objective:</strong> {report.initialWorkflowCharter?.objective || report.recommendedFirstStep || 'N/A'}</p>
                  <p><strong>Scope:</strong> {report.initialWorkflowCharter?.scope || data.workflowType || 'N/A'}</p>
                  <p><strong>Out of scope:</strong> {report.initialWorkflowCharter?.outOfScope || 'Legal, tax, financial, brokerage and compliance advisory decisions.'}</p>
                  <p><strong>Assumptions:</strong> {report.initialWorkflowCharter?.assumptions || 'Current workflow data is based on intake answers.'}</p>
                  <p><strong>Success criteria:</strong> {report.initialWorkflowCharter?.successCriteria || data.desiredOutput || 'N/A'}</p>
                </div>
              </div>
              <div className="snapshot-full"><h3>Workflow Chart</h3><p>{report.workflowChart || 'Information comes in → Review/qualify → Assign next action → Track status → Follow up → Weekly review'}</p></div>
            </div>

            <div className="snapshot-grid report-section-gap">
              <div className="snapshot-full"><h3>Stakeholder Map</h3>{stakeholderMap.length ? stakeholderMap.map((row, idx) => <p key={idx}><strong>{row.stakeholder || 'Stakeholder'}:</strong> {row.role || 'Role not specified'} · {row.interestNeed || 'Need not specified'} · {row.communicationNeed || 'Communication need not specified'}</p>) : <p>N/A</p>}</div>
              <div className="snapshot-full"><h3>Risk Register</h3>{riskRegister.length ? riskRegister.map((row, idx) => <p key={idx}><strong>{row.risk || 'Risk'}:</strong> Impact: {row.impact || 'N/A'} · Likelihood: {row.likelihood || 'N/A'} · Mitigation: {row.mitigation || 'N/A'}</p>) : <p>N/A</p>}</div>
              <div className="snapshot-full"><h3>Task Breakdown</h3>{taskBreakdown.length ? taskBreakdown.map((row, idx) => <p key={idx}><strong>{row.task || 'Task'}:</strong> Owner: {row.owner || 'N/A'} · Priority: {row.priority || 'N/A'} · Next action: {row.nextAction || 'N/A'}</p>) : <p>N/A</p>}</div>
            </div>

            <div className="snapshot-grid report-section-gap">
              <div>
                <h3>AI + PM Opportunities</h3>
                <ul>{opportunities.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
              <div><h3>Recommended Simple System</h3><p>{report.recommendedSimpleSystem || report.suggestedSimpleSystem || 'N/A'}</p></div>
              <div className="snapshot-full"><h3>7-Day Implementation Roadmap</h3>{roadmap.length ? roadmap.map((row, idx) => <p key={idx}><strong>{row.day || `Day ${idx + 1}`}:</strong> {row.focus || ''}{row.action ? ` — ${row.action}` : ''}</p>) : <p>Day 1 map workflow → Day 2 define stages → Day 3 create tracker → Day 4 AI templates → Day 5 test on one live workflow → Day 6 review bottlenecks → Day 7 standardize process.</p>}</div>
              <div className="snapshot-full"><h3>Human Review Next Step</h3><p>{report.humanReviewNextStep || report.nextStep || 'A complete human-reviewed AI PM Workflow Report will be prepared within 3 business days.'}</p></div>
              <div className="snapshot-full"><h3>Disclaimer</h3><p>{report.disclaimer || 'This preliminary AI PM Workflow Report is automatically generated from the intake answers and has not yet been reviewed by a human. It is not legal, financial, tax, investment, brokerage, or compliance advice.'}</p></div>
            </div>
          </div>
        ) : (
          <p className="resource-card">Thank you — your intake was received. We will review it and prepare a full human-reviewed AI PM Workflow Report within 3 business days.</p>
        )}

        <div className="hero-actions">
          <a className="button primary" href="https://calendly.com/propertydext/15min" target="_blank" rel="noreferrer">Book a 15-minute review</a>
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
