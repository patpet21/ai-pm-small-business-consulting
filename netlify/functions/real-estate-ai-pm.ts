const APPS_SCRIPT_ENDPOINT =
  process.env.REAL_ESTATE_AI_PM_APPS_SCRIPT_ENDPOINT ||
  'https://script.google.com/macros/s/AKfycbw-4odu_K3po27Dv3n5hEzjezxBR-kM06fBNWMdkU1RwRhDucpdSpt7LE1NzKpS1f8fMw/exec';

type Event = { httpMethod?: string; body?: string | null };
type Result = { statusCode: number; headers?: Record<string, string>; body: string };

export async function handler(event: Event): Promise<Result> {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ success: false, message: 'Method not allowed' }) };
  }

  try {
    const intakePayload = JSON.parse(event.body || '{}');
    const payload = {
      ...intakePayload,
      reportMode: 'preliminary_ai_pm_workflow_snapshot',
      reportSchemaVersion: '2026-05-27',
      requiredInstantSnapshotSchema: {
        workflowReadinessScore: 'number', workflowMaturity: 'string', workflowDetected: 'string', executiveSummary: 'string', problemStatement: 'string',
        mainBottleneck: 'string', recommendedPriority: 'string', topWorkflowGaps: ['string', 'string', 'string'],
        first48HourFix: { title: 'string', description: 'string', trackerName: 'string', columns: ['string'], statuses: ['string'] },
        wbsTaskBreakdown: [{ taskName: 'string', ownerType: 'string', output: 'string', acceptanceCriteria: 'string' }],
        aiPromptPack: [{ title: 'string', prompt: 'string' }],
        scarfTrustCheck: [{ domain: 'Status|Certainty|Autonomy|Relatedness|Fairness', risk: 'string', recommendation: 'string' }],
        aiUseTransparencySummary: { inputUsed: 'string', outputGenerated: 'string', humanValidation: 'string', sensitiveDataWarning: 'string' },
        aiOpportunities: ['string', 'string', 'string'], quickWin: 'string', sevenDayRoadmap: ['string'], humanReviewedReportPreview: ['string'],
        nextStep: 'string', ctaPrimary: 'Book a 15-minute review', ctaSecondary: 'Request human-reviewed report', calendlyUrl: 'https://calendly.com/propertydext/15min', disclaimer: 'string',
      },
      consultantPromptRules: [
        'Generate all report sections from the submitted intake data.',
        'Do not copy from predefined examples.',
        'Do not reuse the same tracker, prompts, WBS, gaps, or roadmap across different workflow types.',
        'Do not use generic lead-tracking content unless the intake is actually about lead tracking or buyer follow-up.',
        'If the workflow is about listing preparation, generate listing-specific tracker columns, listing-specific prompts, and listing-specific roadmap.',
        'If the workflow is about open house preparation, generate open-house-specific tracker columns, prompts, and roadmap.',
        'If the workflow is about vendor coordination, generate vendor-specific tracker columns, prompts, and roadmap.',
        'If the workflow is about transaction coordination, generate transaction-specific tracker columns, prompts, and roadmap.',
        'The output must feel like a personalized mini-consulting report, not a template.',
        'The output must be concrete enough that the user can take action within 48 hours.',
        'Do not invent legal, financial, tax, investment, brokerage, compliance, or licensing advice.',
        'Do not invent facts that are not in the intake.',
        'If information is missing, make a reasonable operational assumption and label it as an assumption.',
      ],
      intakeFieldsForAI: {
        workflowType: intakePayload.workflowType, currentProcess: intakePayload.currentProcess, informationStartsFrom: intakePayload.informationStartsFrom,
        currentTools: intakePayload.currentTools, mainPainPoints: intakePayload.mainPainPoints, timeLostPerWeek: intakePayload.timeLostPerWeek,
        aiUsageToday: intakePayload.aiUsageToday, desiredOutput: intakePayload.desiredOutput, additionalNotes: intakePayload.additionalNotes,
        role: intakePayload.role, marketLocation: intakePayload.marketLocation, teamSize: intakePayload.teamSize,
      },
    };

    const upstream = await fetch(APPS_SCRIPT_ENDPOINT, {
      method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload),
    });
    const text = await upstream.text();
    const parsed = JSON.parse(text);
    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(parsed) };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, message: 'Personalized AI generation failed. Please request a human-reviewed report.', error: error instanceof Error ? error.message : 'Unknown error' }),
    };
  }
}
