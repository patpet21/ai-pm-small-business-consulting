/************************************************************
 * PROPERTYDEX / REAL ESTATE AI PM PILOT — ASYNC STATUS LAYER
 *
 * Paste these changes into the existing Google Apps Script backend.
 * Keep the existing private CONFIG object, Gemini helpers, sheet helpers,
 * prompt/schema logic, and final instantSnapshot generator in the script.
 ************************************************************/

const ASYNC_STATUS_PROCESSING = 'PROCESSING';
const ASYNC_STATUS_GENERATING = 'GENERATING';
const ASYNC_STATUS_GENERATED = 'AI_GENERATED';
const ASYNC_STATUS_FAILED = 'AI_GENERATION_FAILED';

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

const ASYNC_STATUS_HEADERS = [
  'Submission ID',
  'Created At',
  'Updated At',
  'Status',
  'Intake JSON',
  'Snapshot JSON',
  'Error Message'
];

function getAiSnapshotStatusSheetConfig() {
  return {
    name: getStatusSheetName(),
    headers: ASYNC_STATUS_HEADERS
  };
}

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

    if (typeof processSubmission === 'function') {
      return jsonResponse(processSubmission(data));
    }

    return jsonResponse({
      success: false,
      message: 'Unsupported action.',
      status: ASYNC_STATUS_FAILED
    });
  } catch (error) {
    return jsonResponse({
      success: false,
      message: error.message,
      status: ASYNC_STATUS_FAILED
    });
  }
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function getStatusSheetName() {
  return getConfigValue('snapshotStatusSheet', 'AI Snapshot Status');
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

function setupAsyncSnapshotStatusSheet() {
  getAsyncSnapshotStatusSheet();
}

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
  Logger.log('trigger scheduled: processPendingAiSnapshots');
  Logger.log('handleStartFinished: ' + (Date.now() - startedAt) + 'ms');

  return {
    success: true,
    submissionId: submissionId,
    status: ASYNC_STATUS_PROCESSING
  };
}

function handleStatus(data) {
  const startedAt = Date.now();
  Logger.log('handleStatusStarted: ' + new Date(startedAt).toISOString());

  const submissionId = cleanValue(data.submissionId);
  Logger.log('submissionId: ' + submissionId);

  if (!submissionId) {
    Logger.log('handleStatusFinished: ' + (Date.now() - startedAt) + 'ms');
    return {
      success: false,
      message: 'Missing submissionId.',
      status: ASYNC_STATUS_FAILED
    };
  }

  const row = findAsyncSnapshotStatusRow(submissionId);
  Logger.log('status found: ' + (row ? row.status : 'NOT_FOUND'));

  if (!row) {
    Logger.log('handleStatusFinished: ' + (Date.now() - startedAt) + 'ms');
    return {
      success: false,
      submissionId: submissionId,
      message: 'Submission status was not found.',
      status: ASYNC_STATUS_FAILED
    };
  }

  if (row.status === ASYNC_STATUS_PROCESSING || row.status === ASYNC_STATUS_GENERATING) {
    Logger.log('handleStatusFinished: ' + (Date.now() - startedAt) + 'ms');
    return {
      success: true,
      submissionId: submissionId,
      status: row.status
    };
  }

  if (row.status === ASYNC_STATUS_GENERATED) {
    Logger.log('handleStatusFinished: ' + (Date.now() - startedAt) + 'ms');
    return {
      success: true,
      submissionId: submissionId,
      status: ASYNC_STATUS_GENERATED,
      instantSnapshot: JSON.parse(row.snapshotJson)
    };
  }

  Logger.log('handleStatusFinished: ' + (Date.now() - startedAt) + 'ms');

  return {
    success: false,
    submissionId: submissionId,
    status: ASYNC_STATUS_FAILED,
    message: row.errorMessage || 'AI PM workflow generation failed.'
  };
}

function handleGenerate(data) {
  return generateAsyncSnapshot(cleanValue(data.submissionId));
}

function enqueueAsyncSnapshotGeneration() {
  const triggers = ScriptApp.getProjectTriggers();
  const alreadyQueued = triggers.some(function(trigger) {
    return trigger.getHandlerFunction() === 'processPendingAiSnapshots';
  });

  if (!alreadyQueued) {
    ScriptApp.newTrigger('processPendingAiSnapshots')
      .timeBased()
      .after(1000)
      .create();
  }
}

function processPendingAiSnapshots() {
  Logger.log('generationStarted: processPendingAiSnapshots');
  removeAsyncSnapshotTriggers();

  const sheet = getAsyncSnapshotStatusSheet();
  if (!sheet || sheet.getLastRow() < 2) {
    Logger.log('generationFinished: no pending rows');
    return;
  }

  const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, ASYNC_STATUS_HEADERS.length).getValues();
  for (let i = 0; i < rows.length; i += 1) {
    const row = rows[i];
    const submissionId = cleanValue(row[0]);
    const status = cleanValue(row[3]);

    if (submissionId && status === ASYNC_STATUS_PROCESSING) {
      Logger.log('submissionId: ' + submissionId);
      generateAsyncSnapshot(submissionId);
      Logger.log('generationFinished: ' + submissionId);
      return;
    }
  }

  Logger.log('generationFinished: no PROCESSING rows');
}

function processPendingAsyncSnapshots() {
  processPendingAiSnapshots();
}

function removeAsyncSnapshotTriggers() {
  ScriptApp.getProjectTriggers().forEach(function(trigger) {
    const handler = trigger.getHandlerFunction();
    if (handler === 'processPendingAiSnapshots' || handler === 'processPendingAsyncSnapshots') {
      ScriptApp.deleteTrigger(trigger);
    }
  });
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
    upsertAsyncSnapshotStatus(submissionId, ASYNC_STATUS_GENERATED, statusRow.intakeJson, JSON.stringify(instantSnapshot), '');
    Logger.log('status updated: ' + ASYNC_STATUS_GENERATED + ' for ' + submissionId);

    return {
      success: true,
      submissionId: submissionId,
      status: ASYNC_STATUS_GENERATED,
      instantSnapshot: instantSnapshot
    };
  } catch (error) {
    const existing = findAsyncSnapshotStatusRow(submissionId);
    upsertAsyncSnapshotStatus(
      submissionId,
      ASYNC_STATUS_FAILED,
      existing ? existing.intakeJson : '',
      '',
      error.message
    );
    Logger.log('status updated: ' + ASYNC_STATUS_FAILED + ' for ' + submissionId);
    return {
      success: false,
      submissionId: submissionId,
      status: ASYNC_STATUS_FAILED,
      message: error.message
    };
  }
}

function createInstantSnapshotForAsyncIntake(intake) {
  const diagnostic = createDiagnostic(intake);
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
