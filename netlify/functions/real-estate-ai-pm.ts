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
type AppsScriptResult = { ok: boolean; status: number; body: string; parsed?: UpstreamResponse; parseError?: string; timedOut?: boolean };
type VoiceValidationResult = { valid: boolean; matches: string[] };
type StructuralValidationResult = { valid: boolean; missing: string[] };

const APPS_SCRIPT_START_TIMEOUT_MS = 7000;
const APPS_SCRIPT_STATUS_TIMEOUT_MS = 7000;

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

async function postToAppsScript(payload: Record<string, unknown>, timeoutMs: number): Promise<AppsScriptResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const upstream = await fetch(APPS_SCRIPT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    const body = await upstream.text();
    console.log('Apps Script response status:', upstream.status);
    if (!upstream.ok) console.error('Apps Script response body if non-OK:', shortDetails(body));

    try {
      return { ok: upstream.ok, status: upstream.status, body, parsed: JSON.parse(body) as UpstreamResponse };
    } catch (error) {
      return { ok: upstream.ok, status: upstream.status, body, parseError: error instanceof Error ? error.message : 'Unknown JSON parse error' };
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('Apps Script request timed out before Netlify sandbox timeout.', { timeoutMs, action: payload.action });
      return { ok: false, status: 504, body: `Apps Script request timed out after ${timeoutMs}ms.`, timedOut: true };
    }

    throw error;
  } finally {
    clearTimeout(timeout);
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
  const appsScriptResult = await postToAppsScript(payload, APPS_SCRIPT_START_TIMEOUT_MS);
  const appsScriptStartCallFinishedAt = Date.now();
  console.log('appsScriptStartCallFinishedAt:', new Date(appsScriptStartCallFinishedAt).toISOString());
  console.log('appsScriptStartCallDurationMs:', appsScriptStartCallFinishedAt - appsScriptStartCallStartedAt);

  if (appsScriptResult.timedOut) {
    return jsonResponse(504, {
      success: false,
      submissionId,
      status: 'AI_GENERATION_FAILED',
      message: 'Apps Script start did not return quickly. The live Code.gs deployment is likely still running the legacy synchronous processSubmission() flow.',
      errorSource: 'apps_script_start_timeout',
      details: appsScriptResult.body,
    });
  }
  if (!appsScriptResult.ok) {
    return jsonResponse(502, { success: false, message: 'AI PM workflow generation could not start.', errorSource: 'apps_script', details: shortDetails(appsScriptResult.body) });
  }
  if (!appsScriptResult.parsed) {
    return jsonResponse(502, { success: false, message: 'AI PM workflow generation could not start.', errorSource: 'apps_script_parse', details: appsScriptResult.parseError || 'Apps Script did not return valid JSON.' });
  }

  const returnedSubmissionId = typeof appsScriptResult.parsed.submissionId === 'string' ? appsScriptResult.parsed.submissionId : '';
  const normalizedStatus = normalizeWorkflowStatus(appsScriptResult.parsed.status);
  if ((returnedSubmissionId && returnedSubmissionId !== submissionId) || appsScriptResult.parsed.instantSnapshot || normalizedStatus === 'AI_GENERATED') {
    return jsonResponse(502, {
      success: false,
      submissionId,
      status: 'AI_GENERATION_FAILED',
      message: 'Apps Script start returned a legacy synchronous submission response instead of a fast PROCESSING job. Replace Code.gs with the async dispatcher and redeploy the Web App.',
      errorSource: 'legacy_apps_script_start_response',
      upstreamSubmissionId: returnedSubmissionId || undefined,
      upstreamStatus: appsScriptResult.parsed.status || 'MISSING_STATUS',
      upstreamMessage: appsScriptResult.parsed.message,
    });
  }

  const response = jsonResponse(200, {
    success: appsScriptResult.parsed.success !== false,
    submissionId: returnedSubmissionId || submissionId,
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

  const appsScriptResult = await postToAppsScript(buildStatusPayload(submissionId), APPS_SCRIPT_STATUS_TIMEOUT_MS);
  if (appsScriptResult.timedOut) {
    return jsonResponse(504, {
      success: false,
      submissionId,
      status: 'AI_GENERATION_FAILED',
      message: 'Apps Script status did not return quickly. The live Code.gs deployment is likely still running the legacy synchronous processSubmission() flow.',
      errorSource: 'apps_script_status_timeout',
      details: appsScriptResult.body,
    });
  }
  if (!appsScriptResult.ok) {
    return jsonResponse(502, { success: false, message: 'AI PM workflow status could not be loaded.', errorSource: 'apps_script', details: shortDetails(appsScriptResult.body) });
  }
  if (!appsScriptResult.parsed) {
    return jsonResponse(502, { success: false, message: 'AI PM workflow status could not be loaded.', errorSource: 'apps_script_parse', details: appsScriptResult.parseError || 'Apps Script did not return valid JSON.' });
  }

  const parsed = appsScriptResult.parsed;
  const normalizedStatus = normalizeWorkflowStatus(parsed.status);
  const returnedSubmissionId = typeof parsed.submissionId === 'string' ? parsed.submissionId : '';
  const snapshotAiStatus = normalizeWorkflowStatus(parsed.instantSnapshot?.aiStatus);
  console.log('Polling status:', parsed.status);
  console.log('Normalized polling status:', normalizedStatus || 'MISSING_STATUS');
  console.log('instantSnapshot exists:', Boolean(parsed.instantSnapshot));
  console.log('instantSnapshot.aiStatus:', parsed.instantSnapshot?.aiStatus);

  if (returnedSubmissionId && returnedSubmissionId !== submissionId) {
    console.warn('Apps Script status response submissionId mismatch; treating upstream response as a legacy synchronous fallback.', {
      requestedSubmissionId: submissionId,
      returnedSubmissionId,
      upstreamStatus: parsed.status,
      upstreamMessage: parsed.message,
    });

    return jsonResponse(502, {
      success: false,
      submissionId,
      status: 'AI_GENERATION_FAILED',
      message: 'The Apps Script deployment is still running the legacy synchronous handler. Replace Code.gs with the async dispatcher and redeploy the Web App.',
      errorSource: 'legacy_apps_script_dispatcher',
      upstreamSubmissionId: returnedSubmissionId,
      upstreamStatus: parsed.status || 'LEGACY_RESPONSE_IGNORED',
      upstreamMessage: parsed.message || 'Ignored mismatched Apps Script response.',
    });
  }

  if (snapshotAiStatus === 'AI_GENERATION_FAILED') {
    const snapshotErrorMessage = typeof parsed.instantSnapshot?.errorMessage === 'string' ? parsed.instantSnapshot.errorMessage : undefined;
    const technicalError = typeof parsed.instantSnapshot?.technicalError === 'string' ? parsed.instantSnapshot.technicalError : undefined;
    return jsonResponse(200, {
      success: false,
      submissionId: parsed.submissionId || submissionId,
      status: 'AI_GENERATION_FAILED',
      message: snapshotErrorMessage || parsed.message || 'AI PM workflow generation failed.',
      technicalError,
    });
  }

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
