/************************************************************
 * PROPERTYDEX / REAL ESTATE AI PM PILOT — ASYNC CODE.GS PATCH
 *
 * Paste this block at the VERY BOTTOM of Code.gs, or DELETE/REPLACE the old synchronous doPost(e).
 * Apps Script uses the last function doPost(e) definition in the file; if an old
 * doPost(e) appears after this block, action=start/status will still run the
 * legacy processSubmission() flow.
 * This patch assumes your existing Code.gs still provides:
 * - CONFIG
 * - getSpreadsheet()
 * - getConfigValue(key, fallbackValue)
 * - parseRequestData(e)
 * - cleanValue(value)
 * - createSubmissionId()
 * - ensureSheetWithHeaders(ss, sheetName, headers)
 * - createInstantSnapshotWithGemini(data)
 * - processSubmission(data) only if you intentionally add a separate legacy route
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
 * - It should log a fast JSON response with status AI_GENERATION_FAILED and
 *   message "Submission status was not found." for the fake install-test ID.
 * - That proves the async status route is installed and is not calling Gemini.
 ************************************************************/
function testAsyncDispatcherInstall() {
  const response = handleStatus({ submissionId: '__INSTALL_TEST__' });
  const diagnostic = buildAsyncDiagnostic({ workflowType: 'Install test', currentProcess: 'Test process', mainPainPoints: 'Test pain point' });
  Logger.log(JSON.stringify({ statusResponse: response, diagnosticFallbackOk: Boolean(diagnostic.workflowDetected) }));
  return response;
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
