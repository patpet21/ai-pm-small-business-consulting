declare const process: { env: Record<string, string | undefined> };

const APPS_SCRIPT_ENDPOINT =
  process.env.REAL_ESTATE_AI_PM_APPS_SCRIPT_ENDPOINT ||
  'https://script.google.com/macros/s/AKfycbw-4odu_K3po27Dv3n5hEzjezxBR-kM06fBNWMdkU1RwRhDucpdSpt7LE1NzKpS1f8fMw/exec';

const REPORT_VOICE_REQUIREMENTS = [
  'CLIENT-FACING VOICE: Write directly to the person reading the report.',
  'CLIENT-FACING VOICE: Use “you,” “your,” and “your team.”',
  'CLIENT-FACING VOICE: Do not use the submitter’s name in the generated report.',
  'CLIENT-FACING VOICE: Do not describe the submitter in third person.',
  'CLIENT-FACING VOICE: Do not write “the client,” “the submitter,” or “the user.”',
  'CLIENT-FACING VOICE: Do not write like an internal analyst memo.',
  'CLIENT-FACING VOICE: Keep the output specific to the intake data.',
  'CLIENT-FACING VOICE: Apply this voice requirement to every generated client-facing field, including executiveSummary, problemStatement, mainBottleneck, recommendedPriority, recommendedFirstStep, suggestedSimpleSystem, topWorkflowGaps, first48HourFix, wbsTaskBreakdown, aiPromptPack, scarfTrustCheck, aiOpportunities, quickWin, sevenDayRoadmap, riskNotes, and nextStep.',
];

const COMPLIANCE_SENSITIVE_REQUIREMENTS = [
  'Do not provide legal, tax, financial, investment, brokerage, licensing, or compliance advice.',
  'If a workflow touches recordkeeping, brokerage, legal, licensing, or compliance-sensitive requirements, describe it as an item for professional review.',
  'Use this wording when needed: “Confirm compliance-sensitive requirements with your broker, legal counsel, or appropriate professional advisor.”',
  'Do not tell the user they must comply with a specific rule or guideline unless that information is provided by the user.',
];
type Event = { httpMethod?: string; body?: string | null; path?: string; queryStringParameters?: Record<string, string | undefined> | null };
type Result = { statusCode: number; headers?: Record<string, string>; body: string };
type IntakePayload = Record<string, unknown>;
type Snapshot = Record<string, unknown>;
type UpstreamResponse = { success?: boolean; message?: string; submissionId?: string; status?: string; instantSnapshot?: Snapshot };
type AppsScriptResult = { ok: boolean; status: number; body: string; parsed?: UpstreamResponse; parseError?: string };
type VoiceValidationResult = { valid: boolean; matches: string[] };
type StructuralValidationResult = { valid: boolean; missing: string[] };


function createSubmissionId(): string {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, '0');
  const datePart = `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}-${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}${pad(now.getUTCSeconds())}`;
  const randomPart = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `RE-AI-${datePart}-${randomPart}`;
}

function buildStartPayload(intakePayload: IntakePayload) {
  return {
    action: 'start',
    submissionId: intakePayload.submissionId,
    name: intakePayload.name,
    email: intakePayload.email,
    role: intakePayload.role,
    marketLocation: intakePayload.marketLocation,
    teamSize: intakePayload.teamSize,
    workflowType: intakePayload.workflowType,
    currentProcess: intakePayload.currentProcess,
    informationStartsFrom: intakePayload.informationStartsFrom,
    currentTools: intakePayload.currentTools,
    mainPainPoints: intakePayload.mainPainPoints,
    timeLostPerWeek: intakePayload.timeLostPerWeek,
    aiUsageToday: intakePayload.aiUsageToday,
    desiredOutput: intakePayload.desiredOutput,
    openToCall: intakePayload.openToCall,
    additionalNotes: intakePayload.additionalNotes,
  };
}

function buildStatusPayload(submissionId: string) {
  return { action: 'status', submissionId };
}

function normalizeWorkflowStatus(status: unknown): string {
  return typeof status === 'string' ? status.trim().toUpperCase() : '';
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
  const startEndpointReceivedAt = Date.now();
  console.log('startEndpointReceivedAt:', new Date(startEndpointReceivedAt).toISOString());

  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { success: false, message: 'Method not allowed', errorSource: 'method_not_allowed' });
  }

  const intakePayload = JSON.parse(event.body || '{}') as IntakePayload;
  const submissionId = typeof intakePayload.submissionId === 'string' && intakePayload.submissionId.trim()
    ? intakePayload.submissionId.trim()
    : createSubmissionId();
  const payload = buildStartPayload({ ...intakePayload, submissionId });
  console.log('Start payload sent to Apps Script:', JSON.stringify(payload));

  const appsScriptStartCallStartedAt = Date.now();
  console.log('appsScriptStartCallStartedAt:', new Date(appsScriptStartCallStartedAt).toISOString());
  const appsScriptResult = await postToAppsScript(payload);
  const appsScriptStartCallFinishedAt = Date.now();
  console.log('appsScriptStartCallFinishedAt:', new Date(appsScriptStartCallFinishedAt).toISOString());
  console.log('appsScriptStartCallDurationMs:', appsScriptStartCallFinishedAt - appsScriptStartCallStartedAt);

  if (!appsScriptResult.ok) {
    return jsonResponse(502, { success: false, message: 'AI PM workflow generation could not start.', errorSource: 'apps_script', details: shortDetails(appsScriptResult.body) });
  }
  if (!appsScriptResult.parsed) {
    return jsonResponse(502, { success: false, message: 'AI PM workflow generation could not start.', errorSource: 'apps_script_parse', details: appsScriptResult.parseError || 'Apps Script did not return valid JSON.' });
  }

  const response = jsonResponse(200, {
    success: appsScriptResult.parsed.success !== false,
    submissionId: appsScriptResult.parsed.submissionId || submissionId,
    status: appsScriptResult.parsed.status || 'PROCESSING',
  });
  console.log('startEndpointDurationMs:', Date.now() - startEndpointReceivedAt);
  return response;
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
  const normalizedStatus = normalizeWorkflowStatus(parsed.status);
  console.log('Polling status:', parsed.status);
  console.log('Normalized polling status:', normalizedStatus || 'MISSING_STATUS');
  console.log('instantSnapshot exists:', Boolean(parsed.instantSnapshot));
  console.log('instantSnapshot.aiStatus:', parsed.instantSnapshot?.aiStatus);

  if (normalizedStatus === 'PROCESSING' || normalizedStatus === 'GENERATING') {
    return jsonResponse(200, { success: true, submissionId: parsed.submissionId || submissionId, status: normalizedStatus });
  }

  if (normalizedStatus === 'AI_GENERATION_FAILED' || parsed.success === false) {
    return jsonResponse(200, { success: false, submissionId: parsed.submissionId || submissionId, status: 'AI_GENERATION_FAILED', message: parsed.message || 'AI PM workflow generation failed.' });
  }

  if (normalizedStatus === 'AI_GENERATED' || parsed.instantSnapshot) {
    if (!parsed.instantSnapshot) {
      return jsonResponse(200, { success: true, submissionId: parsed.submissionId || submissionId, status: 'PROCESSING', upstreamStatus: parsed.status || 'AI_GENERATED_WITHOUT_SNAPSHOT' });
    }

    const structuralValidation = validateSnapshotStructure(parsed.instantSnapshot);
    if (!structuralValidation.valid) {
      console.warn('AI snapshot structural validation warning:', structuralValidation.missing);
    }

    const voiceValidation = validateClientFacingVoice(parsed.instantSnapshot, undefined);
    if (!voiceValidation.valid) {
      console.warn('AI snapshot voice validation warning:', voiceValidation.matches);
    }

    return jsonResponse(200, {
      ...parsed,
      status: 'AI_GENERATED',
      structuralValidationWarning: structuralValidation.valid ? undefined : structuralValidation,
    } as Record<string, unknown>);
  }

  console.warn('Apps Script returned no recognized status and no snapshot; treating as PROCESSING.', parsed);
  return jsonResponse(200, { success: true, submissionId: parsed.submissionId || submissionId, status: 'PROCESSING', upstreamStatus: parsed.status || 'MISSING_STATUS' });
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
