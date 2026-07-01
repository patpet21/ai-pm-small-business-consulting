/************************************************************
 * PROPERTYDEX / REAL ESTATE AI PM PILOT — FULL CODE.GS
 *
 * NON-DEVELOPER INSTALL:
 * 1) Open Apps Script > Code.gs.
 * 2) Select all existing Code.gs text.
 * 3) Replace it with this entire file.
 * 4) Save.
 * 5) Run testFullCodeInstall once.
 * 6) Deploy > Manage deployments > Edit > New version > Deploy.
 *
 * Optional Script Properties:
 * - GEMINI_API_KEY: Google Gemini API key. If missing, the script returns a
 *   rules-based preliminary snapshot instead of failing.
 * - GEMINI_MODEL: Gemini model name. Default: gemini-1.5-flash.
 * - SPREADSHEET_ID: Spreadsheet ID for saved status/intake rows. If missing,
 *   this script uses the bound spreadsheet or creates one automatically.
 ************************************************************/

const FULL_CODE_VERSION = '2026-05-29-full-v1';
const FULL_CONFIG = {
  spreadsheetIdProperty: 'SPREADSHEET_ID',
  geminiApiKeyProperty: 'GEMINI_API_KEY',
  geminiModelProperty: 'GEMINI_MODEL',
  defaultGeminiModel: 'gemini-1.5-flash',
  generatedSpreadsheetName: 'Real Estate AI PM Submissions'
};

function cleanValue(value) {
  if (value === null || value === undefined) return '';
  if (Array.isArray(value)) return value.map(cleanValue).filter(Boolean).join(', ');
  return String(value).trim();
}

function parseRequestData(e) {
  const raw = e && e.postData && e.postData.contents ? e.postData.contents : '';
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch (error) {
      return Object.assign({}, e && e.parameter ? e.parameter : {}, { rawBody: raw });
    }
  }
  return Object.assign({}, e && e.parameter ? e.parameter : {});
}

function createSubmissionId() {
  const now = new Date();
  const pad = function(value) { return String(value).padStart(2, '0'); };
  const datePart = now.getUTCFullYear() + pad(now.getUTCMonth() + 1) + pad(now.getUTCDate()) + '-' + pad(now.getUTCHours()) + pad(now.getUTCMinutes()) + pad(now.getUTCSeconds());
  const randomPart = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return 'RE-AI-' + datePart + '-' + randomPart;
}

function getConfigValue(key, fallbackValue) {
  const properties = PropertiesService.getScriptProperties();
  const directValue = cleanValue(properties.getProperty(key));
  if (directValue) return directValue;

  const upperValue = cleanValue(properties.getProperty(String(key).toUpperCase()));
  if (upperValue) return upperValue;

  if (typeof CONFIG !== 'undefined' && CONFIG && CONFIG[key]) return CONFIG[key];
  return fallbackValue;
}

function getSpreadsheet() {
  const properties = PropertiesService.getScriptProperties();
  const spreadsheetId = cleanValue(properties.getProperty(FULL_CONFIG.spreadsheetIdProperty));
  if (spreadsheetId) return SpreadsheetApp.openById(spreadsheetId);

  const active = SpreadsheetApp.getActiveSpreadsheet();
  if (active) {
    properties.setProperty(FULL_CONFIG.spreadsheetIdProperty, active.getId());
    return active;
  }

  const created = SpreadsheetApp.create(FULL_CONFIG.generatedSpreadsheetName);
  properties.setProperty(FULL_CONFIG.spreadsheetIdProperty, created.getId());
  return created;
}

function ensureSheetWithHeaders(ss, sheetName, headers) {
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) sheet = ss.insertSheet(sheetName);

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
    return sheet;
  }

  const existingHeaders = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), headers.length)).getValues()[0].map(cleanValue);
  const needsHeaderRefresh = headers.some(function(header, index) { return existingHeaders[index] !== header; });
  if (needsHeaderRefresh) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function getGeminiApiKey() {
  return getConfigValue(FULL_CONFIG.geminiApiKeyProperty, '');
}

function getGeminiModel() {
  return getConfigValue(FULL_CONFIG.geminiModelProperty, FULL_CONFIG.defaultGeminiModel);
}

function createInstantSnapshotWithGemini(data) {
  const fallbackSnapshot = buildRuleBasedInstantSnapshot(data, 'Rules-based fallback was available if Gemini returned malformed output.');
  const apiKey = getGeminiApiKey();

  if (!apiKey) {
    return buildRuleBasedInstantSnapshot(data, 'Gemini API key is not configured in Apps Script Script Properties, so this is a rules-based preliminary snapshot. Add GEMINI_API_KEY for model-generated wording.');
  }

  const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/' + encodeURIComponent(getGeminiModel()) + ':generateContent?key=' + encodeURIComponent(apiKey);
  const prompt = buildSnapshotPrompt(data);
  const payload = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.35,
      maxOutputTokens: 6000,
      responseMimeType: 'application/json'
    }
  };

  const response = UrlFetchApp.fetch(endpoint, {
    method: 'post',
    contentType: 'application/json',
    muteHttpExceptions: true,
    payload: JSON.stringify(payload)
  });

  const statusCode = response.getResponseCode();
  const body = response.getContentText();
  if (statusCode === 429 || statusCode === 503) {
    throw new Error('Gemini API error ' + statusCode + ': ' + body);
  }
  if (statusCode < 200 || statusCode >= 300) {
    throw new Error('Gemini API error ' + statusCode + ': ' + body);
  }

  const parsedBody = JSON.parse(body);
  const text = cleanValue(parsedBody && parsedBody.candidates && parsedBody.candidates[0] && parsedBody.candidates[0].content && parsedBody.candidates[0].content.parts && parsedBody.candidates[0].content.parts[0] && parsedBody.candidates[0].content.parts[0].text);
  const snapshot = parseJsonObjectFromText(text);
  return normalizeSnapshot(Object.assign({}, fallbackSnapshot, snapshot));
}

function buildSnapshotPrompt(data) {
  return [
    'You are creating a preliminary AI PM Workflow Snapshot for a real estate professional.',
    'Return ONLY valid JSON. No markdown. No code fence.',
    cleanValue(data.reportPromptInstructions),
    'Use direct client-facing language: you, your, your team. Do not say the client, the user, or the submitter.',
    'Do not provide legal, tax, financial, investment, brokerage, licensing, or compliance advice.',
    'If compliance-sensitive topics appear, say: Confirm compliance-sensitive requirements with your broker, legal counsel, or appropriate professional advisor.',
    'Required JSON fields:',
    JSON.stringify(buildRequiredSnapshotShape()),
    'Intake data:',
    JSON.stringify(data)
  ].join('\n\n');
}

function buildRequiredSnapshotShape() {
  return {
    workflowReadinessScore: 50,
    workflowMaturity: 'string',
    workflowDetected: 'string',
    executiveSummary: 'string',
    problemStatement: 'string',
    mainBottleneck: 'string',
    recommendedPriority: 'string',
    recommendedFirstStep: 'string',
    suggestedSimpleSystem: 'string',
    topWorkflowGaps: ['string', 'string', 'string'],
    first48HourFix: { title: 'string', description: 'string', trackerName: 'string', columns: ['Lead/Client', 'Next action'], statuses: ['New', 'In progress', 'Done'] },
    wbsTaskBreakdown: [{ taskName: 'string', ownerType: 'string', output: 'string', acceptanceCriteria: 'string' }],
    aiPromptPack: [{ title: 'string', prompt: 'string' }],
    scarfTrustCheck: [{ domain: 'Status', risk: 'string', recommendation: 'string' }],
    aiUseTransparencySummary: { inputUsed: 'string', outputGenerated: 'string', humanValidation: 'string', sensitiveDataWarning: 'string' },
    aiOpportunities: ['string', 'string', 'string'],
    quickWin: 'string',
    sevenDayRoadmap: ['string'],
    humanReviewedReportPreview: ['string'],
    riskNotes: ['string'],
    nextStep: 'string',
    ctaPrimary: 'Book a 15-minute review',
    ctaSecondary: 'Request human-reviewed report',
    disclaimer: 'string'
  };
}

function parseJsonObjectFromText(text) {
  const cleaned = cleanValue(text).replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch (error) {
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start !== -1 && end !== -1 && end > start) {
      return JSON.parse(cleaned.slice(start, end + 1));
    }
    throw error;
  }
}

function buildRuleBasedInstantSnapshot(data, fallbackNote) {
  const diagnostic = data.diagnostic || buildAsyncDiagnostic(data);
  const workflow = cleanValue(diagnostic.workflowDetected || data.workflowType) || 'Real estate workflow';
  const pain = cleanValue(data.mainPainPoints || diagnostic.mainBottleneck) || 'The workflow needs a clearer next-action system.';
  const process = cleanValue(data.currentProcess) || 'Your current process was not fully documented in the intake.';
  const source = cleanValue(data.informationStartsFrom) || 'your usual lead or client source';
  const tools = cleanValue(data.currentTools) || 'your current tools';

  return normalizeSnapshot({
    workflowReadinessScore: diagnostic.workflowReadinessScore || 45,
    workflowMaturity: diagnostic.workflowMaturity || 'Needs basic documentation',
    workflowDetected: workflow,
    executiveSummary: 'Your biggest opportunity is to turn this ' + workflow + ' into a visible, repeatable workflow your team can follow without relying on memory.',
    problemStatement: 'Right now, information starts from ' + source + ' and moves through ' + tools + ', but the next action, owner, and follow-up status are not clear enough at each step.',
    mainBottleneck: pain,
    recommendedPriority: diagnostic.recommendedPriority || 'Create one shared source of truth before adding more automation.',
    recommendedFirstStep: diagnostic.recommendedFirstStep || 'Write the next five recurring steps in a tracker with owner, status, due date, and client-facing next action.',
    suggestedSimpleSystem: 'Use one simple tracker plus a weekly review habit before connecting AI prompts or automations.',
    topWorkflowGaps: diagnostic.topWorkflowGaps || ['No single source of truth', 'Unclear next action ownership', 'Follow-up language is not standardized'],
    first48HourFix: {
      title: 'Build your first shared workflow tracker',
      description: 'Create a lightweight tracker for this workflow and use it for the next two business days before adding more tools.',
      trackerName: workflow + ' Action Tracker',
      columns: ['Client/Lead', 'Workflow stage', 'Last touch', 'Next action', 'Owner', 'Due date', 'Status', 'Notes'],
      statuses: ['New', 'Needs review', 'Waiting on client', 'In progress', 'Done']
    },
    wbsTaskBreakdown: [
      { taskName: 'Capture the request or lead', ownerType: 'Admin or assigned agent', output: 'A complete tracker row', acceptanceCriteria: 'Every new item has source, owner, and next action.' },
      { taskName: 'Draft the next client-facing message', ownerType: 'Agent or coordinator', output: 'Clear follow-up message', acceptanceCriteria: 'Message states what happens next and when.' },
      { taskName: 'Review open items weekly', ownerType: 'Team lead or solo owner', output: 'Updated priorities', acceptanceCriteria: 'No active item is missing a status or owner.' }
    ],
    aiPromptPack: [
      { title: 'Turn notes into next actions', prompt: 'You are helping organize my ' + workflow + '. Based on these notes, create a table with client/lead, current stage, missing information, next action, owner, due date, and a suggested follow-up message. Notes: [paste notes]' },
      { title: 'Draft a client follow-up', prompt: 'Draft a concise, professional real estate follow-up message for this situation. Use clear next steps, no legal or financial advice, and include what I need from the recipient. Situation: [paste situation]' },
      { title: 'Weekly workflow review', prompt: 'Review this workflow tracker and identify the top 3 stuck items, the likely bottleneck, and the next action I should take in the next 48 hours. Tracker rows: [paste rows]' }
    ],
    scarfTrustCheck: [
      { domain: 'Status', risk: 'Team members may feel exposed if the tracker is used to blame missed follow-ups.', recommendation: 'Frame the tracker as visibility for support, not surveillance.' },
      { domain: 'Certainty', risk: 'People may ignore the system if statuses are unclear.', recommendation: 'Use a small fixed status list and review it weekly.' },
      { domain: 'Autonomy', risk: 'AI suggestions may feel forced.', recommendation: 'Let the owner edit every AI-generated message before sending.' }
    ],
    aiUseTransparencySummary: {
      inputUsed: 'Your intake answers about role, market, workflow, tools, pain points, and desired output.',
      outputGenerated: 'A preliminary workflow diagnosis, tracker structure, prompt pack, and 7-day roadmap.',
      humanValidation: 'Review all recommendations before using them with clients or your team.',
      sensitiveDataWarning: 'Do not paste private client, financial, legal, or compliance-sensitive information into public AI tools.'
    },
    aiOpportunities: ['Convert messy notes into tracker rows', 'Draft consistent follow-up messages', 'Summarize open workflow items for a weekly review'],
    quickWin: 'Create the tracker today and move three active items into it before changing any software.',
    sevenDayRoadmap: ['Day 1: Create the tracker columns.', 'Day 2: Add active workflow items.', 'Day 3: Draft reusable follow-up prompts.', 'Day 4: Review stuck items.', 'Day 5: Standardize one client message.', 'Day 6: Assign ownership for every open item.', 'Day 7: Review what improved and what still needs human judgment.'],
    humanReviewedReportPreview: ['A deeper workflow map', 'Tool-specific implementation guidance', 'A more complete AI prompt library', 'A practical adoption plan for your team'],
    riskNotes: [fallbackNote, 'Confirm compliance-sensitive requirements with your broker, legal counsel, or appropriate professional advisor.', 'Keep human review in place for client-facing and compliance-sensitive work.'],
    nextStep: 'Book a short review and bring one real example from this workflow so the system can be refined around your actual work.',
    ctaPrimary: 'Book a 15-minute review',
    ctaSecondary: 'Request human-reviewed report',
    disclaimer: 'This preliminary snapshot is automatically generated and has not been reviewed by a human. It is not legal, tax, financial, investment, brokerage, or compliance advice.'
  });
}

function normalizeSnapshot(snapshot) {
  const normalized = snapshot || {};
  normalized.topWorkflowGaps = Array.isArray(normalized.topWorkflowGaps) ? normalized.topWorkflowGaps : [];
  normalized.wbsTaskBreakdown = Array.isArray(normalized.wbsTaskBreakdown) ? normalized.wbsTaskBreakdown : [];
  normalized.aiPromptPack = Array.isArray(normalized.aiPromptPack) ? normalized.aiPromptPack : [];
  normalized.scarfTrustCheck = Array.isArray(normalized.scarfTrustCheck) ? normalized.scarfTrustCheck : [];
  normalized.aiOpportunities = Array.isArray(normalized.aiOpportunities) ? normalized.aiOpportunities : [];
  normalized.sevenDayRoadmap = Array.isArray(normalized.sevenDayRoadmap) ? normalized.sevenDayRoadmap : [];
  normalized.humanReviewedReportPreview = Array.isArray(normalized.humanReviewedReportPreview) ? normalized.humanReviewedReportPreview : [];
  normalized.riskNotes = Array.isArray(normalized.riskNotes) ? normalized.riskNotes : [];
  normalized.first48HourFix = normalized.first48HourFix || { title: 'First 48-hour fix', columns: ['Client/Lead', 'Next action', 'Owner', 'Status'], statuses: ['New', 'In progress', 'Done'] };
  normalized.aiUseTransparencySummary = normalized.aiUseTransparencySummary || {};
  return normalized;
}

function testFullCodeInstall() {
  setupAsyncSnapshotStatusSheet();
  const diagnostic = buildAsyncDiagnostic({ workflowType: 'Install test', currentProcess: 'Test process', mainPainPoints: 'Test pain point' });
  const fallback = buildRuleBasedInstantSnapshot({ workflowType: 'Install test', diagnostic: diagnostic }, 'Install test fallback.');
  const statusResponse = handleStatus({ submissionId: '__INSTALL_TEST__' });
  const diagnosticFallbackOk = Boolean(diagnostic.workflowDetected);
  const snapshotFallbackOk = Boolean(fallback.first48HourFix && fallback.aiPromptPack && fallback.aiPromptPack.length);
  const statusRouteOk = Boolean(statusResponse && statusResponse.status === 'AI_GENERATION_FAILED' && statusResponse.message === 'Submission status was not found.');
  const result = {
    success: diagnosticFallbackOk && snapshotFallbackOk && statusRouteOk,
    version: FULL_CODE_VERSION,
    diagnosticFallbackOk: diagnosticFallbackOk,
    snapshotFallbackOk: snapshotFallbackOk,
    statusRouteOk: statusRouteOk,
    statusRouteNote: 'Expected fake install-test ID to return not found quickly without calling Gemini.'
  };
  Logger.log(JSON.stringify(result));
  return result;
}


/************************************************************
 * ASYNC BACKGROUND PROCESSING SECTION
 ************************************************************/

const ASYNC_STATUS_PROCESSING = 'PROCESSING';
const ASYNC_STATUS_GENERATING = 'GENERATING';
const ASYNC_STATUS_GENERATED = 'AI_GENERATED';
const ASYNC_STATUS_FAILED = 'AI_GENERATION_FAILED';
const MAX_TRANSIENT_GEMINI_RETRIES = 3;
const ASYNC_TRIGGER_HANDLER = 'processPendingAiSnapshots';
const ASYNC_TRIGGER_PROPERTY = 'asyncSnapshotTriggerQueuedAt';
const ASYNC_TRIGGER_STALE_MS = 2 * 60 * 1000;
const ASYNC_GENERATING_STALE_MS = 5 * 60 * 1000;
const ASYNC_WATCHDOG_HANDLER = 'recoverPendingAiSnapshots';
const ASYNC_WATCHDOG_PROPERTY = 'asyncSnapshotWatchdogQueuedAt';
const ASYNC_WATCHDOG_DELAY_MS = 60 * 1000;
const ASYNC_WATCHDOG_STALE_MS = 3 * 60 * 1000;

const ASYNC_STATUS_HEADERS = [
  'Submission ID',
  'Created At',
  'Updated At',
  'Status',
  'Intake JSON',
  'Snapshot JSON',
  'Error Message'
];

const CLIENT_FACING_VOICE_PROMPT_RULE = [
  'CLIENT-FACING VOICE:',
  'Write directly to the person reading the report.',
  'Use “you,” “your,” and “your team.”',
  'Do not use the submitter’s name in the generated report.',
  'Do not describe the submitter in third person.',
  'Do not write “the client,” “the submitter,” or “the user.”',
  'Do not write like an internal analyst memo.'
].join('\n');

const COMPLIANCE_SENSITIVE_PROMPT_RULE = [
  'LIMITATIONS FOR COMPLIANCE-SENSITIVE WORK:',
  'Do not provide legal, tax, financial, investment, brokerage, licensing, or compliance advice.',
  'If a workflow touches recordkeeping, brokerage, legal, licensing, or compliance-sensitive requirements, describe it as an item for professional review.',
  'Use this wording when needed: “Confirm compliance-sensitive requirements with your broker, legal counsel, or appropriate professional advisor.”',
  'Do not tell the user they must comply with a specific rule or guideline unless that information is provided by the user.'
].join('\n');

/************************************************************
 * 1. doPost action dispatcher
 *
 * CRITICAL:
 * - The doPost(e) dispatcher is intentionally placed at the END of this file.
 * - action=start must never call processSubmission().
 * - action=status must never call processSubmission().
 * - Gemini generation happens only in processPendingAiSnapshots().
 ************************************************************/
/************************************************************
 * 2. JSON response helper
 ************************************************************/
function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function normalizeAsyncStatus(value) {
  return cleanValue(value).toUpperCase();
}

/************************************************************
 * 3. setupSheets update: AI Snapshot Status tab
 *
 * Add this object to the sheets array inside your existing setupSheets():
 *
 * {
 *   name: getConfigValue('snapshotStatusSheet', 'AI Snapshot Status'),
 *   headers: ASYNC_STATUS_HEADERS
 * }
 *
 * Or call setupAsyncSnapshotStatusSheet() once after your existing setupSheets().
 ************************************************************/
function getStatusSheetName() {
  return getConfigValue('snapshotStatusSheet', 'AI Snapshot Status');
}

function getAiSnapshotStatusSheetConfig() {
  return {
    name: getStatusSheetName(),
    headers: ASYNC_STATUS_HEADERS
  };
}

function setupAsyncSnapshotStatusSheet() {
  const ss = getSpreadsheet();
  ensureSheetWithHeaders(ss, getStatusSheetName(), ASYNC_STATUS_HEADERS);
}

function getAsyncSnapshotStatusSheet() {
  const ss = getSpreadsheet();
  const sheetName = getStatusSheetName();
  let sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.getRange(1, 1, 1, ASYNC_STATUS_HEADERS.length).setValues([ASYNC_STATUS_HEADERS]);
    sheet.setFrozenRows(1);
    return sheet;
  }

  const currentHeaderWidth = Math.max(sheet.getLastColumn(), ASYNC_STATUS_HEADERS.length);
  const existingHeaders = sheet.getLastRow() > 0
    ? sheet.getRange(1, 1, 1, currentHeaderWidth).getValues()[0].map(cleanValue)
    : [];
  const needsHeaderRefresh = ASYNC_STATUS_HEADERS.some(function(header, index) {
    return existingHeaders[index] !== header;
  });

  if (sheet.getLastRow() === 0 || needsHeaderRefresh) {
    sheet.getRange(1, 1, 1, ASYNC_STATUS_HEADERS.length).setValues([ASYNC_STATUS_HEADERS]);
    sheet.setFrozenRows(1);
  }

  return sheet;
}

/************************************************************
 * 4. handleStart(data)
 *
 * Fast path only:
 * - create submissionId
 * - save Intake JSON
 * - status = PROCESSING
 * - schedule background processing
 * - return immediately
 ************************************************************/
function handleStart(data) {
  const startedAt = Date.now();
  Logger.log('handleStartStarted: ' + new Date(startedAt).toISOString());

  const submissionId = cleanValue(data.submissionId) || createSubmissionId();
  Logger.log('submissionId created: ' + submissionId);

  const intake = normalizeAsyncIntake(data, submissionId);
  const intakeJson = JSON.stringify(intake);

  upsertAsyncSnapshotStatus(submissionId, ASYNC_STATUS_PROCESSING, intakeJson, '', '');
  Logger.log('status row written: ' + submissionId);

  enqueueAsyncSnapshotGeneration();
  enqueueAsyncSnapshotWatchdog();
  Logger.log('trigger scheduled: processPendingAiSnapshots');
  Logger.log('handleStartFinished: ' + (Date.now() - startedAt) + 'ms');

  return {
    success: true,
    submissionId: submissionId,
    status: ASYNC_STATUS_PROCESSING
  };
}

/************************************************************
 * 5. handleStatus(data)
 ************************************************************/
function handleStatus(data) {
  const startedAt = Date.now();
  Logger.log('handleStatusStarted: ' + new Date(startedAt).toISOString());

  const submissionId = cleanValue(data.submissionId);
  Logger.log('submissionId: ' + submissionId);

  if (!submissionId) {
    Logger.log('handleStatusFinished: ' + (Date.now() - startedAt) + 'ms');
    return {
      success: false,
      status: ASYNC_STATUS_FAILED,
      message: 'Missing submissionId.'
    };
  }

  const row = findAsyncSnapshotStatusRow(submissionId);
  Logger.log('status found: ' + (row ? row.status : 'NOT_FOUND'));

  if (!row) {
    Logger.log('handleStatusFinished: ' + (Date.now() - startedAt) + 'ms');
    return {
      success: false,
      submissionId: submissionId,
      status: ASYNC_STATUS_FAILED,
      message: 'Submission status was not found.'
    };
  }

  const normalizedStatus = normalizeAsyncStatus(row.status) || ASYNC_STATUS_PROCESSING;

  if (normalizedStatus === ASYNC_STATUS_PROCESSING || normalizedStatus === ASYNC_STATUS_GENERATING) {
    // Keep status checks read-only and fast. Trigger and recovery work happens in
    // handleStart(), processPendingAiSnapshots(), and recoverPendingAiSnapshots()
    // so polling cannot starve time-based triggers or time out the Netlify proxy.
    Logger.log('handleStatusFinished: ' + (Date.now() - startedAt) + 'ms');
    return {
      success: true,
      submissionId: submissionId,
      status: normalizedStatus
    };
  }

  if (normalizedStatus === ASYNC_STATUS_GENERATED || row.snapshotJson) {
    Logger.log('handleStatusFinished: ' + (Date.now() - startedAt) + 'ms');
    return {
      success: true,
      submissionId: submissionId,
      status: ASYNC_STATUS_GENERATED,
      instantSnapshot: JSON.parse(row.snapshotJson)
    };
  }

  if (normalizedStatus === ASYNC_STATUS_FAILED) {
    Logger.log('handleStatusFinished: ' + (Date.now() - startedAt) + 'ms');
    return {
      success: false,
      submissionId: submissionId,
      status: ASYNC_STATUS_FAILED,
      message: row.errorMessage || 'AI PM workflow generation failed.'
    };
  }

  Logger.log('handleStatusFinished: ' + (Date.now() - startedAt) + 'ms');
  return {
    success: true,
    submissionId: submissionId,
    status: ASYNC_STATUS_PROCESSING
  };
}

/************************************************************
 * 6. Optional manual generate endpoint
 ************************************************************/
function handleGenerate(data) {
  return generateAsyncSnapshot(cleanValue(data.submissionId));
}

/************************************************************
 * 7. Trigger creation without duplicates
 ************************************************************/
function enqueueAsyncSnapshotGeneration() {
  const now = Date.now();
  const properties = PropertiesService.getScriptProperties();
  const queuedAt = Number(properties.getProperty(ASYNC_TRIGGER_PROPERTY) || 0);
  const triggerAlreadyQueued = hasAsyncSnapshotTrigger();

  if (triggerAlreadyQueued && queuedAt && now - queuedAt < ASYNC_TRIGGER_STALE_MS) {
    Logger.log('trigger already queued recently: ' + ASYNC_TRIGGER_HANDLER);
    return;
  }

  if (triggerAlreadyQueued) {
    Logger.log('removing stale trigger before requeue: ' + ASYNC_TRIGGER_HANDLER);
    removeAsyncSnapshotTriggers();
  }

  ScriptApp.newTrigger(ASYNC_TRIGGER_HANDLER)
    .timeBased()
    .after(1000)
    .create();
  properties.setProperty(ASYNC_TRIGGER_PROPERTY, String(now));
}

function enqueueAsyncSnapshotWatchdog() {
  const now = Date.now();
  const properties = PropertiesService.getScriptProperties();
  const queuedAt = Number(properties.getProperty(ASYNC_WATCHDOG_PROPERTY) || 0);
  const watchdogAlreadyQueued = hasAsyncSnapshotWatchdog();

  if (watchdogAlreadyQueued && queuedAt && now - queuedAt < ASYNC_WATCHDOG_STALE_MS) {
    Logger.log('watchdog already queued recently: ' + ASYNC_WATCHDOG_HANDLER);
    return;
  }

  if (watchdogAlreadyQueued) {
    Logger.log('removing stale watchdog before requeue: ' + ASYNC_WATCHDOG_HANDLER);
    removeAsyncSnapshotWatchdogs();
  }

  ScriptApp.newTrigger(ASYNC_WATCHDOG_HANDLER)
    .timeBased()
    .after(ASYNC_WATCHDOG_DELAY_MS)
    .create();
  properties.setProperty(ASYNC_WATCHDOG_PROPERTY, String(now));
}

function hasAsyncSnapshotTrigger() {
  return ScriptApp.getProjectTriggers().some(function(trigger) {
    const handler = trigger.getHandlerFunction();
    return handler === ASYNC_TRIGGER_HANDLER || handler === 'processPendingAsyncSnapshots';
  });
}

function removeAsyncSnapshotTriggers() {
  ScriptApp.getProjectTriggers().forEach(function(trigger) {
    const handler = trigger.getHandlerFunction();
    if (handler === ASYNC_TRIGGER_HANDLER || handler === 'processPendingAsyncSnapshots') {
      ScriptApp.deleteTrigger(trigger);
    }
  });
}

function hasAsyncSnapshotWatchdog() {
  return ScriptApp.getProjectTriggers().some(function(trigger) {
    return trigger.getHandlerFunction() === ASYNC_WATCHDOG_HANDLER;
  });
}

function removeAsyncSnapshotWatchdogs() {
  ScriptApp.getProjectTriggers().forEach(function(trigger) {
    if (trigger.getHandlerFunction() === ASYNC_WATCHDOG_HANDLER) {
      ScriptApp.deleteTrigger(trigger);
    }
  });
}

function clearAsyncSnapshotTriggerMarker() {
  PropertiesService.getScriptProperties().deleteProperty(ASYNC_TRIGGER_PROPERTY);
}

function clearAsyncSnapshotWatchdogMarker() {
  PropertiesService.getScriptProperties().deleteProperty(ASYNC_WATCHDOG_PROPERTY);
}

function isStaleAsyncStatus(updatedAt, staleAfterMs) {
  const updatedTime = updatedAt instanceof Date ? updatedAt.getTime() : new Date(updatedAt).getTime();
  return !updatedTime || Date.now() - updatedTime > staleAfterMs;
}

/************************************************************
 * 8. Background generation
 *
 * This is the only path that calls createInstantSnapshotWithGemini().
 ************************************************************/
function processPendingAiSnapshots() {
  Logger.log('generationStarted: processPendingAiSnapshots');
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(500)) {
    Logger.log('generationSkipped: another processPendingAiSnapshots run is active');
    enqueueAsyncSnapshotGeneration();
    return;
  }

  try {
    clearAsyncSnapshotTriggerMarker();
    removeAsyncSnapshotTriggers();

    const sheet = getAsyncSnapshotStatusSheet();
    if (!sheet || sheet.getLastRow() < 2) {
      Logger.log('generationFinished: no pending rows');
      return;
    }

    const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, ASYNC_STATUS_HEADERS.length).getValues();
    const maxSnapshotsPerRun = 1;
    let processedCount = 0;
    let hasMorePending = false;

    for (let i = 0; i < rows.length; i += 1) {
      const row = rows[i];
      const submissionId = cleanValue(row[0]);
      const status = normalizeAsyncStatus(row[3]);

      if (!submissionId || status !== ASYNC_STATUS_PROCESSING) continue;

      if (processedCount >= maxSnapshotsPerRun) {
        hasMorePending = true;
        continue;
      }

      Logger.log('submissionId: ' + submissionId);
      generateAsyncSnapshot(submissionId);
      processedCount += 1;
      Logger.log('generationFinished: ' + submissionId);
    }

    if (hasMorePending) {
      enqueueAsyncSnapshotGeneration();
      Logger.log('generationFinished: processed ' + processedCount + ', re-queued remaining PROCESSING rows');
      return;
    }

    Logger.log('generationFinished: processed ' + processedCount + ' PROCESSING rows');
  } finally {
    lock.releaseLock();
  }
}

function recoverPendingAiSnapshots() {
  Logger.log('watchdogStarted: recoverPendingAiSnapshots');
  clearAsyncSnapshotWatchdogMarker();
  removeAsyncSnapshotWatchdogs();

  const sheet = getAsyncSnapshotStatusSheet();
  if (!sheet || sheet.getLastRow() < 2) {
    Logger.log('watchdogFinished: no status rows');
    return;
  }

  const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, ASYNC_STATUS_HEADERS.length).getValues();
  let recoveredGeneratingCount = 0;
  let hasPendingWork = false;

  for (let i = 0; i < rows.length; i += 1) {
    const row = rows[i];
    const submissionId = cleanValue(row[0]);
    const updatedAt = row[2];
    const status = normalizeAsyncStatus(row[3]);
    const intakeJson = cleanValue(row[4]);

    if (!submissionId) continue;

    if (status === ASYNC_STATUS_PROCESSING) {
      hasPendingWork = true;
      continue;
    }

    if (status === ASYNC_STATUS_GENERATING && isStaleAsyncStatus(updatedAt, ASYNC_GENERATING_STALE_MS)) {
      upsertAsyncSnapshotStatus(submissionId, ASYNC_STATUS_PROCESSING, intakeJson, '', 'Recovered stale GENERATING status; queued a new generation attempt.');
      recoveredGeneratingCount += 1;
      hasPendingWork = true;
    }
  }

  if (hasPendingWork) {
    enqueueAsyncSnapshotGeneration();
  }

  Logger.log('watchdogFinished: recovered ' + recoveredGeneratingCount + ', pendingWork=' + hasPendingWork);
}

// Backward-compatible alias for older triggers created by earlier versions.
function processPendingAsyncSnapshots() {
  processPendingAiSnapshots();
}

function generateAsyncSnapshot(submissionId) {
  if (!submissionId) {
    throw new Error('Missing submissionId for generation.');
  }

  try {
    const statusRow = findAsyncSnapshotStatusRow(submissionId);
    if (!statusRow) {
      throw new Error('Could not find status row for submissionId: ' + submissionId);
    }

    if (statusRow.status === ASYNC_STATUS_GENERATED) {
      return {
        success: true,
        submissionId: submissionId,
        status: ASYNC_STATUS_GENERATED,
        instantSnapshot: JSON.parse(statusRow.snapshotJson)
      };
    }

    if (statusRow.status === ASYNC_STATUS_GENERATING) {
      return {
        success: true,
        submissionId: submissionId,
        status: ASYNC_STATUS_GENERATING
      };
    }

    upsertAsyncSnapshotStatus(submissionId, ASYNC_STATUS_GENERATING, statusRow.intakeJson, '', '');
    Logger.log('status updated: ' + ASYNC_STATUS_GENERATING + ' for ' + submissionId);

    const intake = JSON.parse(statusRow.intakeJson);
    const instantSnapshot = createInstantSnapshotForAsyncIntake(intake);

    upsertAsyncSnapshotStatus(
      submissionId,
      ASYNC_STATUS_GENERATED,
      statusRow.intakeJson,
      JSON.stringify(instantSnapshot),
      ''
    );
    Logger.log('status updated: ' + ASYNC_STATUS_GENERATED + ' for ' + submissionId);

    return {
      success: true,
      submissionId: submissionId,
      status: ASYNC_STATUS_GENERATED,
      instantSnapshot: instantSnapshot
    };
  } catch (error) {
    const existing = findAsyncSnapshotStatusRow(submissionId);
    const errorMessage = error && error.message ? error.message : String(error);

    if (existing && isTransientGeminiError(errorMessage)) {
      const nextAttempt = getTransientRetryAttempt(existing.errorMessage) + 1;

      if (nextAttempt <= MAX_TRANSIENT_GEMINI_RETRIES) {
        const retryMessage = buildTransientRetryMessage(nextAttempt, errorMessage);
        upsertAsyncSnapshotStatus(
          submissionId,
          ASYNC_STATUS_PROCESSING,
          existing.intakeJson,
          '',
          retryMessage
        );
        enqueueAsyncSnapshotGeneration();
        Logger.log('transient Gemini error; retry queued for ' + submissionId + ': attempt ' + nextAttempt);

        return {
          success: true,
          submissionId: submissionId,
          status: ASYNC_STATUS_PROCESSING,
          message: retryMessage
        };
      }
    }

    upsertAsyncSnapshotStatus(
      submissionId,
      ASYNC_STATUS_FAILED,
      existing ? existing.intakeJson : '',
      '',
      errorMessage
    );
    Logger.log('status updated: ' + ASYNC_STATUS_FAILED + ' for ' + submissionId);

    return {
      success: false,
      submissionId: submissionId,
      status: ASYNC_STATUS_FAILED,
      message: errorMessage
    };
  }
}

function isTransientGeminiError(errorMessage) {
  const text = cleanValue(errorMessage).toLowerCase();
  return (
    text.indexOf('gemini api error 429') !== -1 ||
    text.indexOf('gemini api error 503') !== -1 ||
    text.indexOf('resource_exhausted') !== -1 ||
    text.indexOf('unavailable') !== -1 ||
    text.indexOf('high demand') !== -1 ||
    text.indexOf('try again later') !== -1
  );
}

function getTransientRetryAttempt(errorMessage) {
  const match = cleanValue(errorMessage).match(/Transient Gemini retry (\d+)\//i);
  return match && match[1] ? Number(match[1]) || 0 : 0;
}

function buildTransientRetryMessage(attempt, errorMessage) {
  return 'Transient Gemini retry ' + attempt + '/' + MAX_TRANSIENT_GEMINI_RETRIES + ': ' + errorMessage;
}

function buildAsyncDiagnostic(intake) {
  if (typeof createDiagnostic === 'function') {
    return createDiagnostic(intake);
  }

  const painPoints = cleanValue(intake.mainPainPoints);
  const currentProcess = cleanValue(intake.currentProcess);
  const currentTools = cleanValue(intake.currentTools);
  const workflowType = cleanValue(intake.workflowType) || 'real estate workflow';
  const timeLost = cleanValue(intake.timeLostPerWeek);
  const aiUsage = cleanValue(intake.aiUsageToday) || 'Not specified';
  const desiredOutput = cleanValue(intake.desiredOutput);

  return {
    workflowDetected: workflowType,
    workflowMaturity: currentProcess && currentTools ? 'Documented but likely inconsistent' : 'Needs basic documentation',
    workflowReadinessScore: currentProcess && painPoints ? 55 : 35,
    mainBottleneck: painPoints || 'The current workflow has not been narrowed to one specific bottleneck yet.',
    recommendedPriority: 'Stabilize the repeatable steps in this workflow before adding more automation.',
    recommendedFirstStep: 'Write the current steps, owner, source of information, and next action in one shared tracker.',
    timeLostPerWeek: timeLost,
    aiUsageToday: aiUsage,
    currentProcess: currentProcess,
    currentTools: currentTools,
    desiredOutput: desiredOutput,
    topWorkflowGaps: [
      painPoints || 'Unclear handoff points',
      currentTools ? 'Tool usage may not be tied to one standard process' : 'No clear source of truth tool was provided',
      desiredOutput ? 'Desired outputs need to be mapped to daily operating steps' : 'Success criteria for the output are not yet defined'
    ]
  };
}

function createInstantSnapshotForAsyncIntake(intake) {
  const diagnostic = buildAsyncDiagnostic(intake);
  const instantSnapshot = createInstantSnapshotWithGemini({
    submissionId: intake.submissionId,
    reportPromptInstructions: [
      CLIENT_FACING_VOICE_PROMPT_RULE,
      COMPLIANCE_SENSITIVE_PROMPT_RULE
    ].join('\n\n'),
    role: intake.role,
    marketLocation: intake.marketLocation,
    teamSize: intake.teamSize,
    workflowType: intake.workflowType,
    currentProcess: intake.currentProcess,
    informationStartsFrom: intake.informationStartsFrom,
    currentTools: intake.currentTools,
    mainPainPoints: intake.mainPainPoints,
    timeLostPerWeek: intake.timeLostPerWeek,
    aiUsageToday: intake.aiUsageToday,
    desiredOutput: intake.desiredOutput,
    openToCall: intake.openToCall,
    additionalNotes: intake.additionalNotes,
    diagnostic: diagnostic
  });

  instantSnapshot.aiStatus = ASYNC_STATUS_GENERATED;
  return instantSnapshot;
}

/************************************************************
 * 9. Helpers to normalize, find, and update status rows
 ************************************************************/
function normalizeAsyncIntake(data, submissionId) {
  return {
    submissionId: submissionId,
    name: cleanValue(data.name),
    email: cleanValue(data.email),
    role: cleanValue(data.role),
    marketLocation: cleanValue(data.marketLocation),
    teamSize: cleanValue(data.teamSize),
    workflowType: cleanValue(data.workflowType),
    currentProcess: cleanValue(data.currentProcess),
    informationStartsFrom: cleanValue(data.informationStartsFrom),
    currentTools: cleanValue(data.currentTools),
    mainPainPoints: cleanValue(data.mainPainPoints),
    timeLostPerWeek: cleanValue(data.timeLostPerWeek),
    aiUsageToday: cleanValue(data.aiUsageToday),
    desiredOutput: cleanValue(data.desiredOutput),
    openToCall: cleanValue(data.openToCall),
    additionalNotes: cleanValue(data.additionalNotes)
  };
}

function findAsyncSnapshotStatusRow(submissionId) {
  const sheet = getAsyncSnapshotStatusSheet();
  if (!sheet || sheet.getLastRow() < 2) return null;

  const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, ASYNC_STATUS_HEADERS.length).getValues();
  for (let i = 0; i < rows.length; i += 1) {
    const row = rows[i];
    if (cleanValue(row[0]) === submissionId) {
      return {
        rowNumber: i + 2,
        submissionId: cleanValue(row[0]),
        createdAt: row[1],
        updatedAt: row[2],
        status: cleanValue(row[3]),
        intakeJson: cleanValue(row[4]),
        snapshotJson: cleanValue(row[5]),
        errorMessage: cleanValue(row[6])
      };
    }
  }

  return null;
}

function upsertAsyncSnapshotStatus(submissionId, status, intakeJson, snapshotJson, errorMessage) {
  const sheet = getAsyncSnapshotStatusSheet();
  const now = new Date();
  const existing = findAsyncSnapshotStatusRow(submissionId);

  if (existing) {
    sheet.getRange(existing.rowNumber, 3, 1, 5).setValues([[
      now,
      status,
      intakeJson,
      snapshotJson,
      errorMessage
    ]]);
    return;
  }

  sheet.appendRow([
    submissionId,
    now,
    now,
    status,
    intakeJson,
    snapshotJson,
    errorMessage
  ]);
}


/************************************************************
 * 10. Simple install smoke test
 *
 * Non-developer check after pasting/deploying this patch:
 * - In Apps Script, select testAsyncDispatcherInstall from the Run dropdown.
 * - It should log success:true and statusRouteOk:true for the fake install-test ID.
 * - That proves the async status route is installed and is not calling Gemini.
 ************************************************************/
function testAsyncDispatcherInstall() {
  const statusResponse = handleStatus({ submissionId: '__INSTALL_TEST__' });
  const diagnostic = buildAsyncDiagnostic({ workflowType: 'Install test', currentProcess: 'Test process', mainPainPoints: 'Test pain point' });
  const diagnosticFallbackOk = Boolean(diagnostic.workflowDetected);
  const statusRouteOk = Boolean(statusResponse && statusResponse.status === 'AI_GENERATION_FAILED' && statusResponse.message === 'Submission status was not found.');
  const result = {
    success: diagnosticFallbackOk && statusRouteOk,
    diagnosticFallbackOk: diagnosticFallbackOk,
    statusRouteOk: statusRouteOk,
    statusRouteNote: 'Expected fake install-test ID to return not found quickly without calling Gemini.'
  };
  Logger.log(JSON.stringify(result));
  return result;
}

/************************************************************
 * 11. doPost action dispatcher — MUST BE THE LAST doPost(e)
 *
 * CRITICAL INSTALL NOTE:
 * If Code.gs still contains an older doPost(e) after this function, Apps Script
 * will run the older legacy handler and /start will call processSubmission().
 * Paste this async block at the bottom of Code.gs or delete the old doPost(e).
 ************************************************************/
function doPost(e) {
  const data = parseRequestData(e);
  const action = cleanValue(data.action || '').toLowerCase();

  try {
    if (action === 'start') {
      return jsonResponse(handleStart(data));
    }

    if (action === 'status') {
      return jsonResponse(handleStatus(data));
    }

    if (action === 'generate') {
      return jsonResponse(handleGenerate(data));
    }

    // No default processSubmission() fallback here.
    // Missing or unknown actions must fail fast so /start and /status can never
    // accidentally run the old synchronous Gemini/report-generation flow.
    return jsonResponse({
      success: false,
      status: ASYNC_STATUS_FAILED,
      message: 'Unsupported action. Send action=start, action=status, or action=generate.'
    });
  } catch (error) {
    return jsonResponse({
      success: false,
      status: ASYNC_STATUS_FAILED,
      message: error.message
    });
  }
}
