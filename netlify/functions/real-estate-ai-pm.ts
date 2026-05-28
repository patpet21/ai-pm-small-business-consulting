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
      reportSchemaVersion: '2026-05-28',
      requiredInstantSnapshotSchema: {
        workflowReadinessScore: 'number', workflowMaturity: 'string', workflowDetected: 'string', executiveSummary: 'string',
        problemStatement: 'string', mainBottleneck: 'string', recommendedPriority: 'string', recommendedFirstStep: 'string',
        suggestedSimpleSystem: 'string', topWorkflowGaps: ['string', 'string', 'string'],
        first48HourFix: { title: 'string', description: 'string', trackerName: 'string', columns: ['string'], statuses: ['string'] },
        wbsTaskBreakdown: [{ taskName: 'string', ownerType: 'string', output: 'string', acceptanceCriteria: 'string' }],
        aiPromptPack: [{ title: 'string', prompt: 'string' }],
        scarfTrustCheck: [{ domain: 'Status|Certainty|Autonomy|Relatedness|Fairness', risk: 'string', recommendation: 'string' }],
        aiUseTransparencySummary: { inputUsed: 'string', outputGenerated: 'string', humanValidation: 'string', sensitiveDataWarning: 'string' },
        aiOpportunities: ['string', 'string', 'string'], quickWin: 'string', sevenDayRoadmap: ['string'],
        humanReviewedReportPreview: ['string'], riskNotes: ['string'], nextStep: 'string',
        ctaPrimary: 'Book a 15-minute review', ctaSecondary: 'Request human-reviewed report', calendlyUrl: 'https://calendly.com/propertydext/15min', disclaimer: 'string',
      },
      consultantPromptRules: [
        'Generate the full client-facing report from intake data only.',
        'Do not use predefined examples or template report text.',
        'Do not reuse the same tracker columns, WBS, prompt pack, gaps, or roadmap across workflows.',
        'Match all content to the submitted workflow type and process details.',
        'Do not use lead-tracking content unless workflow is lead tracking or buyer follow-up.',
        'For listing preparation, generate listing-specific report content.',
        'For open house preparation, generate open-house-specific report content.',
        'For vendor coordination, generate vendor-specific report content.',
        'For transaction coordination, generate transaction-specific report content.',
        'No legal, financial, tax, investment, brokerage, licensing, or compliance advice.',
        'Do not invent facts not present in intake; if needed, mark operational assumptions explicitly.',
      ],
      intakeFieldsForAI: {
        role: intakePayload.role, marketLocation: intakePayload.marketLocation, teamSize: intakePayload.teamSize,
        workflowType: intakePayload.workflowType, currentProcess: intakePayload.currentProcess,
        informationStartsFrom: intakePayload.informationStartsFrom, currentTools: intakePayload.currentTools,
        mainPainPoints: intakePayload.mainPainPoints, timeLostPerWeek: intakePayload.timeLostPerWeek,
        aiUsageToday: intakePayload.aiUsageToday, desiredOutput: intakePayload.desiredOutput,
        additionalNotes: intakePayload.additionalNotes,
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
      body: JSON.stringify({ success: false, message: 'AI generation failed for this submission. Please request a human-reviewed report.', error: error instanceof Error ? error.message : 'Unknown error' }),
    };
  }
}
