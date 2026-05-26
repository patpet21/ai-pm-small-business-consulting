import { useMemo, useState } from 'react';

const APPS_SCRIPT_WEB_APP_URL =
  'https://script.google.com/macros/s/AKfycbw-4odu_K3po27Dv3n5hEzjezxBR-kM06fBNWMdkU1RwRhDucpdSpt7LE1NzKpS1f8fMw/exec';
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

export function RealEstateAIPMPilot() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<IntakeData>(initialData);
  const [error, setError] = useState('');

  const progressText = useMemo(() => `Step ${step + 1} of ${stepLabels.length}: ${stepLabels[step]}`, [step]);

  function updateField(field: keyof IntakeData, value: string) {
    setData((prev) => ({ ...prev, [field]: value }));
  }

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

  function nextStep() {
    const validation = validateStep(step);
    if (validation) {
      setError(validation);
      return;
    }
    setError('');
    setStep((prev) => Math.min(prev + 1, stepLabels.length - 1));
  }

  function prevStep() {
    setError('');
    setStep((prev) => Math.max(prev - 1, 0));
  }

  return (
    <>
      <section className="page-intro section-shell">
        <p className="eyebrow">Real Estate AI PM Pilot</p>
        <h1>AI PM Workflow Pilot for Real Estate Professionals</h1>
        <p className="hero-lede">Use AI to organize real estate work, not just write better captions.</p>
        <p className="hero-lede">
          Most real estate professionals are already experimenting with AI for emails, captions, and listing
          descriptions. That is useful, but limited. The bigger opportunity is workflow: lead intake, follow-up,
          listing preparation, transaction tasks, vendor coordination, client communication, and project visibility.
        </p>
        <div className="hero-actions">
          <a className="button primary" href="#pilot-wizard">Apply for the Free Pilot</a>
          <a className="button secondary" href="#pilot-wizard">See how it works</a>
        </div>
        <p className="hero-lede">
          You do not need to become an AI expert or learn five new apps. You explain where work gets messy. We turn it
          into a simple AI-assisted project management workflow.
        </p>
      </section>

      <section id="pilot-wizard" className="section-shell detail-card">
        <p className="eyebrow">Pilot intake wizard</p>
        <h2>{progressText}</h2>
        <p className="hero-lede">This is an AI + Project Management workflow diagnostic for real estate operations.</p>
        <p className="tiny-disclaimer">
          Not tokenization. Not legal, financial, tax, investment, brokerage, or compliance advice.
        </p>

        <form className="pilot-form" method="POST" action={APPS_SCRIPT_WEB_APP_URL}>
          {step === 0 && (
            <div className="form-grid two-col">
              <label>Name *<input name="name" value={data.name} onChange={(e) => updateField('name', e.target.value)} /></label>
              <label>Email *<input name="email" type="email" value={data.email} onChange={(e) => updateField('email', e.target.value)} /></label>
              <label>
                Role *
                <select name="role" value={data.role} onChange={(e) => updateField('role', e.target.value)}>
                  <option value="">Select</option>
                  {['Realtor', 'Broker', 'Property Manager', 'Real Estate Investor', 'Contractor', 'Small Real Estate Team', 'Other'].map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
              <label>Market location *<input name="marketLocation" value={data.marketLocation} onChange={(e) => updateField('marketLocation', e.target.value)} /></label>
              <label>
                Team size
                <select name="teamSize" value={data.teamSize} onChange={(e) => updateField('teamSize', e.target.value)}>
                  <option value="">Select</option>
                  {['Just me', '2–5 people', '6–10 people', '10+ people'].map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
            </div>
          )}

          {step === 1 && (
            <label>Workflow type to improve *
              <select name="workflowType" value={data.workflowType} onChange={(e) => updateField('workflowType', e.target.value)}>
                <option value="">Select</option>
                {['Lead intake', 'Buyer follow-up', 'Seller follow-up', 'Listing preparation', 'Open house preparation', 'Transaction checklist', 'Vendor coordination', 'Client communication', 'Weekly client updates', 'Property project tracking', 'Content-to-client follow-up', 'Other'].map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>
          )}

          {step === 2 && (
            <div className="form-grid">
              <label>
                Information usually starts from
                <select name="informationStartsFrom" value={data.informationStartsFrom} onChange={(e) => updateField('informationStartsFrom', e.target.value)}>
                  <option value="">Select</option>
                  {['Email', 'Phone calls', 'Text messages', 'Instagram / Social media', 'Zillow / Realtor.com / leads platform', 'CRM', 'Google Sheets', 'Paper / memory', 'Other'].map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
              <label>Describe how this workflow happens today *
                <textarea name="currentProcess" value={data.currentProcess} onChange={(e) => updateField('currentProcess', e.target.value)} rows={6} />
              </label>
            </div>
          )}

          {step === 3 && (
            <div className="form-grid two-col">
              <label>Main pain points *
                <select name="mainPainPoints" value={data.mainPainPoints} onChange={(e) => updateField('mainPainPoints', e.target.value)}>
                  <option value="">Select</option>
                  {['Missed follow-ups', 'Scattered notes', 'Repeated messages', 'No clear next steps', 'Tasks are not organized', 'I lose time after calls or meetings', 'No system for updates', 'Too many tools', 'Everything is manual', 'Other'].map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
              <label>Time lost per week
                <select name="timeLostPerWeek" value={data.timeLostPerWeek} onChange={(e) => updateField('timeLostPerWeek', e.target.value)}>
                  <option value="">Select</option>
                  {['Less than 1 hour', '1–3 hours', '3–5 hours', '5+ hours'].map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
            </div>
          )}

          {step === 4 && (
            <div className="form-grid two-col">
              <label>AI usage today
                <select name="aiUsageToday" value={data.aiUsageToday} onChange={(e) => updateField('aiUsageToday', e.target.value)}>
                  <option value="">Select</option>
                  {['Yes, often', 'Sometimes', 'I tried it but not consistently', 'Not really'].map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
              <label>Current tools
                <select name="currentTools" value={data.currentTools} onChange={(e) => updateField('currentTools', e.target.value)}>
                  <option value="">Select</option>
                  {['Gmail / Outlook', 'Google Sheets', 'Google Docs', 'Trello', 'ClickUp', 'Asana', 'Notion', 'CRM', 'No real system', 'Other'].map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
            </div>
          )}

          {step === 5 && (
            <div className="form-grid">
              <label>Desired output *
                <select name="desiredOutput" value={data.desiredOutput} onChange={(e) => updateField('desiredOutput', e.target.value)}>
                  <option value="">Select</option>
                  {['Workflow map', 'Simple task tracker', 'Follow-up templates', 'AI prompt templates', 'Client communication templates', 'Weekly update structure', 'Recommended tools', '7-day implementation plan', 'Short call to review the workflow'].map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
              <label>Open to call?
                <select name="openToCall" value={data.openToCall} onChange={(e) => updateField('openToCall', e.target.value)}>
                  <option value="">Select</option>
                  {['Yes', 'No', 'Maybe'].map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
              <label>Additional notes
                <textarea name="additionalNotes" value={data.additionalNotes} onChange={(e) => updateField('additionalNotes', e.target.value)} rows={5} />
              </label>
            </div>
          )}

          {error && <p className="form-error">{error}</p>}

          <div className="wizard-actions">
            {step > 0 && <button type="button" className="button secondary" onClick={prevStep}>Back</button>}
            {step < stepLabels.length - 1 ? (
              <button type="button" className="button primary" onClick={nextStep}>Next</button>
            ) : (
              <button type="submit" className="button primary">Submit pilot intake</button>
            )}
          </div>
        </form>
      </section>
    </>
  );
}
