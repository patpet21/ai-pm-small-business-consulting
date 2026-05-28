declare const process: { env: Record<string, string | undefined> };

const APPS_SCRIPT_ENDPOINT =
  process.env.REAL_ESTATE_AI_PM_APPS_SCRIPT_ENDPOINT ||
  'https://script.google.com/macros/s/AKfycbw-4odu_K3po27Dv3n5hEzjezxBR-kM06fBNWMdkU1RwRhDucpdSpt7LE1NzKpS1f8fMw/exec';

const REPORT_VOICE_REQUIREMENTS = [
  'REPORT VOICE: The report is displayed directly to the form submitter.',
  'REPORT VOICE: Write directly to the reader.',
  'REPORT VOICE: Use second-person language: “you,” “your,” and “your team.”',
  'REPORT VOICE: Do not describe the submitter in third person.',
  'REPORT VOICE: Do not use the submitter’s name as the grammatical subject of a sentence.',
  'REPORT VOICE: The submitter name is internal metadata only and must not be used in the instantSnapshot report text.',
  'REPORT VOICE: Do not use the submitter’s name or the possessive form of the submitter’s name in client-facing prose.',
  'REPORT VOICE: Do not use phrases like “the client,” “the submitter,” or “the user” in client-facing fields.',
  'REPORT VOICE: Do not write as an internal analyst memo.',
  'REPORT VOICE: Do not write as if the audience is PropertyDEX reviewing a lead.',
  'REPORT VOICE: Write as a practical consultant giving direct operational advice to the person who submitted the intake.',
  'REPORT VOICE: Keep the output specific to the intake data.',
  'REPORT VOICE: Do not use generic filler.',
  'REPORT VOICE: Do not hardcode any example sentence from these instructions into the output.',
  'REPORT VOICE: Apply this voice requirement to every generated client-facing field, including executiveSummary, problemStatement, mainBottleneck, recommendedPriority, recommendedFirstStep, suggestedSimpleSystem, topWorkflowGaps, first48HourFix, wbsTaskBreakdown, aiPromptPack, scarfTrustCheck, aiOpportunities, quickWin, sevenDayRoadmap, riskNotes, and nextStep.',
];
type Event = { httpMethod?: string; body?: string | null; path?: string; queryStringParameters?: Record<string, string | undefined> | null };
type Result = { statusCode: number; headers?: Record<string, string>; body: string };
type IntakePayload = Record<string, unknown>;
type Snapshot = Record<string, unknown>;
type UpstreamResponse = { success?: boolean; message?: string; submissionId?: string; status?: string; instantSnapshot?: Snapshot };
type AppsScriptResult = { ok: boolean; status: number; body: string; parsed?: UpstreamResponse; parseError?: string };
type VoiceValidationResult = { valid: boolean; matches: string[] };
type StructuralValidationResult = { valid: boolean; missing: string[] };

function buildStartPayload(intakePayload: IntakePayload) {
  return {
    ...intakePayload,
    action: 'start',
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
      ...REPORT_VOICE_REQUIREMENTS,
    ],
    reportVoiceRequirements: REPORT_VOICE_REQUIREMENTS,
    intakeFieldsForAI: {
      role: intakePayload.role, marketLocation: intakePayload.marketLocation, teamSize: intakePayload.teamSize,
      workflowType: intakePayload.workflowType, currentProcess: intakePayload.currentProcess,
      informationStartsFrom: intakePayload.informationStartsFrom, currentTools: intakePayload.currentTools,
      mainPainPoints: intakePayload.mainPainPoints, timeLostPerWeek: intakePayload.timeLostPerWeek,
      aiUsageToday: intakePayload.aiUsageToday, desiredOutput: intakePayload.desiredOutput,
      openToCall: intakePayload.openToCall, additionalNotes: intakePayload.additionalNotes,
    },
  };
}

function buildStatusPayload(submissionId: string) {
  return { action: 'status', submissionId };
}

function jsonResponse(statusCode: number, body: Record<string, unknown>): Result {
  return { statusCode, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) };
}

function shortDetails(value: string, maxLength = 700): string {
  return value.length > maxLength ? `${value.slice(0, maxLength)}...` : value;
}

async function postToAppsScript(payload: Record<string, unknown>): Promise<AppsScriptResult> {
  const upstream = await fetch(APPS_SCRIPT_ENDPOINT, {
    method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload),
  });
  const body = await upstream.text();
  console.log('Apps Script response status:', upstream.status);
  if (!upstream.ok) console.error('Apps Script response body if non-OK:', shortDetails(body));

  try {
    return { ok: upstream.ok, status: upstream.status, body, parsed: JSON.parse(body) as UpstreamResponse };
  } catch (error) {
    return { ok: upstream.ok, status: upstream.status, body, parseError: error instanceof Error ? error.message : 'Unknown JSON parse error' };
  }
}

function validateClientFacingVoice(snapshot: Snapshot | undefined, submitterName: unknown): VoiceValidationResult {
  if (!snapshot) return { valid: false, matches: ['missing instantSnapshot'] };

  const blockedPhrases = ['the client', 'the submitter', 'the user'];
  const name = typeof submitterName === 'string' ? submitterName.trim().toLowerCase() : '';
  const namePatterns = name ? [`${name} is`, `${name} has`, `${name} manages`, `${name} needs`, `${name}’s`, `${name}'s`] : [];
  const blocked = [...blockedPhrases, ...namePatterns];
  const texts: string[] = [];
  const pushText = (value: unknown) => {
    if (typeof value === 'string') texts.push(value);
  };

  pushText(snapshot.executiveSummary);
  pushText(snapshot.problemStatement);
  pushText(snapshot.mainBottleneck);
  pushText(snapshot.recommendedPriority);
  pushText(snapshot.recommendedFirstStep);
  pushText(snapshot.quickWin);
  if (Array.isArray(snapshot.riskNotes)) snapshot.riskNotes.forEach(pushText);
  if (Array.isArray(snapshot.sevenDayRoadmap)) snapshot.sevenDayRoadmap.forEach(pushText);

  const combined = texts.join('\n').toLowerCase();
  const matches = blocked.filter((phrase) => phrase && combined.includes(phrase));
  return { valid: matches.length === 0, matches };
}

function validateSnapshotStructure(snapshot: Snapshot | undefined): StructuralValidationResult {
  const missing: string[] = [];
  const isObject = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);
  const hasArrayItems = (value: unknown): boolean => Array.isArray(value) && value.length > 0;

  if (!isObject(snapshot?.first48HourFix)) missing.push('first48HourFix');
  if (!isObject(snapshot?.first48HourFix) || !hasArrayItems(snapshot.first48HourFix.columns)) missing.push('first48HourFix.columns');
  if (!hasArrayItems(snapshot?.aiPromptPack)) missing.push('aiPromptPack');
  if (!hasArrayItems(snapshot?.topWorkflowGaps)) missing.push('topWorkflowGaps');
  if (!hasArrayItems(snapshot?.wbsTaskBreakdown)) missing.push('wbsTaskBreakdown');
  if (!hasArrayItems(snapshot?.sevenDayRoadmap)) missing.push('sevenDayRoadmap');

  return { valid: missing.length === 0, missing };
}

function isStatusRoute(event: Event): boolean {
  return Boolean(event.path?.endsWith('/status') || event.queryStringParameters?.submissionId);
}

async function handleStart(event: Event): Promise<Result> {
  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { success: false, message: 'Method not allowed', errorSource: 'method_not_allowed' });
  }

  const intakePayload = JSON.parse(event.body || '{}') as IntakePayload;
  const payload = buildStartPayload(intakePayload);
  console.log('Start payload sent to Apps Script:', JSON.stringify(payload));
  const appsScriptResult = await postToAppsScript(payload);

  if (!appsScriptResult.ok) {
    return jsonResponse(502, { success: false, message: 'AI PM workflow generation could not start.', errorSource: 'apps_script', details: shortDetails(appsScriptResult.body) });
  }
  if (!appsScriptResult.parsed) {
    return jsonResponse(502, { success: false, message: 'AI PM workflow generation could not start.', errorSource: 'apps_script_parse', details: appsScriptResult.parseError || 'Apps Script did not return valid JSON.' });
  }
  if (!appsScriptResult.parsed.submissionId) {
    return jsonResponse(502, { success: false, message: 'AI PM workflow generation did not return a submission ID.', errorSource: 'missing_submission_id' });
  }

  return jsonResponse(200, {
    success: appsScriptResult.parsed.success !== false,
    submissionId: appsScriptResult.parsed.submissionId,
    status: appsScriptResult.parsed.status || 'PROCESSING',
  });
}

async function handleStatus(event: Event): Promise<Result> {
  if (event.httpMethod !== 'GET') {
    return jsonResponse(405, { success: false, message: 'Method not allowed', errorSource: 'method_not_allowed' });
  }

  const submissionId = event.queryStringParameters?.submissionId;
  if (!submissionId) {
    return jsonResponse(400, { success: false, message: 'Missing submissionId.', errorSource: 'missing_submission_id' });
  }

  const appsScriptResult = await postToAppsScript(buildStatusPayload(submissionId));
  if (!appsScriptResult.ok) {
    return jsonResponse(502, { success: false, message: 'AI PM workflow status could not be loaded.', errorSource: 'apps_script', details: shortDetails(appsScriptResult.body) });
  }
  if (!appsScriptResult.parsed) {
    return jsonResponse(502, { success: false, message: 'AI PM workflow status could not be loaded.', errorSource: 'apps_script_parse', details: appsScriptResult.parseError || 'Apps Script did not return valid JSON.' });
  }

  const parsed = appsScriptResult.parsed;
  console.log('Polling status:', parsed.status);
  console.log('instantSnapshot exists:', Boolean(parsed.instantSnapshot));
  console.log('instantSnapshot.aiStatus:', parsed.instantSnapshot?.aiStatus);

  if (parsed.status === 'PROCESSING') {
    return jsonResponse(200, { success: true, submissionId: parsed.submissionId || submissionId, status: 'PROCESSING' });
  }

  if (parsed.status === 'AI_GENERATION_FAILED' || parsed.success === false) {
    return jsonResponse(200, { success: false, submissionId: parsed.submissionId || submissionId, status: 'AI_GENERATION_FAILED', message: parsed.message || 'AI PM workflow generation failed.' });
  }

  if (parsed.status === 'AI_GENERATED') {
    if (!parsed.instantSnapshot) {
      return jsonResponse(502, { success: false, submissionId, status: 'AI_GENERATION_FAILED', message: 'AI snapshot was not returned by the backend.', errorSource: 'missing_instant_snapshot' });
    }

    const structuralValidation = validateSnapshotStructure(parsed.instantSnapshot);
    if (!structuralValidation.valid) {
      console.error('AI snapshot structural validation failed:', structuralValidation.missing);
      return jsonResponse(422, { success: false, submissionId, status: 'AI_GENERATION_FAILED', message: 'The AI snapshot was incomplete. Please try again or request a human-reviewed report.', errorSource: 'snapshot_validation', structuralValidation });
    }

    const voiceValidation = validateClientFacingVoice(parsed.instantSnapshot, undefined);
    if (!voiceValidation.valid) {
      console.warn('AI snapshot voice validation warning:', voiceValidation.matches);
    }

    return jsonResponse(200, parsed as Record<string, unknown>);
  }

  return jsonResponse(502, { success: false, submissionId, status: 'AI_GENERATION_FAILED', message: 'AI PM workflow returned an unknown status.', errorSource: 'unknown_status' });
}

export async function handler(event: Event): Promise<Result> {
  const startedAt = Date.now();
  console.log('Real Estate AI PM async request received:', { method: event.httpMethod, path: event.path });

  try {
    if (isStatusRoute(event)) {
      return await handleStatus(event);
    }
    return await handleStart(event);
  } catch (error) {
    console.error('Netlify function error:', error instanceof Error ? error.message : error);
    return jsonResponse(500, {
      success: false,
      message: 'AI PM workflow generation failed.',
      errorSource: 'netlify_function',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  } finally {
    console.log('Real Estate AI PM async duration:', `${Date.now() - startedAt}ms`);
  }
}
