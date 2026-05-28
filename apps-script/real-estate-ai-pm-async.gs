/************************************************************
 * PROPERTYDEX / REAL ESTATE AI PM PILOT — ASYNC STATUS LAYER
 *
 * Paste these changes into the existing Google Apps Script backend.
 * Keep the existing private CONFIG object, Gemini helpers, sheet helpers,
 * prompt/schema logic, and final instantSnapshot generator in the script.
 ************************************************************/

const ASYNC_STATUS_PROCESSING = 'PROCESSING';
const ASYNC_STATUS_GENERATED = 'AI_GENERATED';
const ASYNC_STATUS_FAILED = 'AI_GENERATION_FAILED';

function getStatusSheetName() {
  return getConfigValue('snapshotStatusSheet', 'AI Snapshot Status');
}

function setupAsyncSnapshotStatusSheet() {
  const ss = getSpreadsheet();
  ensureSheetWithHeaders(ss, getStatusSheetName(), [
    'Submission ID',
    'Created At',
    'Updated At',
    'Status',
    'Snapshot JSON',
    'Error Message'
  ]);
}

function doPost(e) {
  const data = parseRequestData(e);
  const action = cleanValue(data.action || 'start').toLowerCase();

  try {
    if (action === 'start') {
      return jsonOutput(startAsyncSnapshotJob(data));
    }

    if (action === 'status') {
      return jsonOutput(getAsyncSnapshotStatus(cleanValue(data.submissionId)));
    }

    if (action === 'generate') {
      return jsonOutput(generateAsyncSnapshot(cleanValue(data.submissionId)));
    }

    return jsonOutput({
      success: false,
      message: 'Unsupported action.',
      status: ASYNC_STATUS_FAILED
    });
  } catch (error) {
    return jsonOutput({
      success: false,
      message: error.message,
      status: ASYNC_STATUS_FAILED
    });
  }
}

function jsonOutput(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function startAsyncSnapshotJob(data) {
  setupSheets();
  setupAsyncSnapshotStatusSheet();

  const submissionId = createSubmissionId();
  const timestamp = new Date();
  const intake = normalizeAsyncIntake(data, submissionId);

  appendRow(getConfigValue('intakeSheet', 'Intake Responses'), [
    timestamp,
    submissionId,
    intake.name,
    intake.email,
    intake.role,
    intake.marketLocation,
    intake.teamSize,
    intake.workflowType,
    intake.currentProcess,
    intake.informationStartsFrom,
    intake.currentTools,
    intake.mainPainPoints,
    intake.timeLostPerWeek,
    intake.aiUsageToday,
    intake.desiredOutput,
    intake.openToCall,
    intake.additionalNotes,
    ASYNC_STATUS_PROCESSING
  ]);

  upsertAsyncSnapshotStatus(submissionId, ASYNC_STATUS_PROCESSING, '', '');
  enqueueAsyncSnapshotGeneration();

  return {
    success: true,
    submissionId,
    status: ASYNC_STATUS_PROCESSING
  };
}

function getAsyncSnapshotStatus(submissionId) {
  if (!submissionId) {
    return {
      success: false,
      message: 'Missing submissionId.',
      status: ASYNC_STATUS_FAILED
    };
  }

  const row = findAsyncSnapshotStatusRow(submissionId);
  if (!row) {
    return {
      success: false,
      submissionId,
      message: 'Submission status was not found.',
      status: ASYNC_STATUS_FAILED
    };
  }

  if (row.status === ASYNC_STATUS_GENERATED) {
    return {
      success: true,
      submissionId,
      status: ASYNC_STATUS_GENERATED,
      instantSnapshot: JSON.parse(row.snapshotJson)
    };
  }

  if (row.status === ASYNC_STATUS_FAILED) {
    return {
      success: false,
      submissionId,
      status: ASYNC_STATUS_FAILED,
      message: row.errorMessage || 'AI PM workflow generation failed.'
    };
  }

  return {
    success: true,
    submissionId,
    status: ASYNC_STATUS_PROCESSING
  };
}

function enqueueAsyncSnapshotGeneration() {
  const triggers = ScriptApp.getProjectTriggers();
  const alreadyQueued = triggers.some(function(trigger) {
    return trigger.getHandlerFunction() === 'processPendingAsyncSnapshots';
  });

  if (!alreadyQueued) {
    ScriptApp.newTrigger('processPendingAsyncSnapshots')
      .timeBased()
      .after(1000)
      .create();
  }
}

function processPendingAsyncSnapshots() {
  removeAsyncSnapshotTriggers();

  const sheet = getSpreadsheet().getSheetByName(getStatusSheetName());
  if (!sheet || sheet.getLastRow() < 2) return;

  const values = sheet.getRange(2, 1, sheet.getLastRow() - 1, 6).getValues();
  values.forEach(function(row) {
    const submissionId = cleanValue(row[0]);
    const status = cleanValue(row[3]);

    if (submissionId && status === ASYNC_STATUS_PROCESSING) {
      generateAsyncSnapshot(submissionId);
    }
  });
}

function removeAsyncSnapshotTriggers() {
  ScriptApp.getProjectTriggers().forEach(function(trigger) {
    if (trigger.getHandlerFunction() === 'processPendingAsyncSnapshots') {
      ScriptApp.deleteTrigger(trigger);
    }
  });
}

function generateAsyncSnapshot(submissionId) {
  if (!submissionId) {
    throw new Error('Missing submissionId for generation.');
  }

  try {
    const intake = getAsyncIntakeBySubmissionId(submissionId);
    if (!intake) {
      throw new Error('Could not find intake row for submissionId: ' + submissionId);
    }

    const instantSnapshot = createInstantSnapshotForAsyncIntake(intake);
    upsertAsyncSnapshotStatus(submissionId, ASYNC_STATUS_GENERATED, JSON.stringify(instantSnapshot), '');

    return {
      success: true,
      submissionId,
      status: ASYNC_STATUS_GENERATED,
      instantSnapshot
    };
  } catch (error) {
    upsertAsyncSnapshotStatus(submissionId, ASYNC_STATUS_FAILED, '', error.message);
    return {
      success: false,
      submissionId,
      status: ASYNC_STATUS_FAILED,
      message: error.message
    };
  }
}

function createInstantSnapshotForAsyncIntake(intake) {
  const diagnostic = createDiagnostic(intake);
  const instantSnapshot = createInstantSnapshotWithGemini({
    submissionId: intake.submissionId,
    name: '',
    email: '',
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
    diagnostic
  });

  instantSnapshot.aiStatus = ASYNC_STATUS_GENERATED;
  return instantSnapshot;
}

function normalizeAsyncIntake(data, submissionId) {
  return {
    submissionId,
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

function getAsyncIntakeBySubmissionId(submissionId) {
  const sheet = getSpreadsheet().getSheetByName(getConfigValue('intakeSheet', 'Intake Responses'));
  if (!sheet || sheet.getLastRow() < 2) return null;

  const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 18).getValues();
  for (let i = 0; i < rows.length; i += 1) {
    const row = rows[i];
    if (cleanValue(row[1]) === submissionId) {
      return {
        submissionId,
        name: cleanValue(row[2]),
        email: cleanValue(row[3]),
        role: cleanValue(row[4]),
        marketLocation: cleanValue(row[5]),
        teamSize: cleanValue(row[6]),
        workflowType: cleanValue(row[7]),
        currentProcess: cleanValue(row[8]),
        informationStartsFrom: cleanValue(row[9]),
        currentTools: cleanValue(row[10]),
        mainPainPoints: cleanValue(row[11]),
        timeLostPerWeek: cleanValue(row[12]),
        aiUsageToday: cleanValue(row[13]),
        desiredOutput: cleanValue(row[14]),
        openToCall: cleanValue(row[15]),
        additionalNotes: cleanValue(row[16])
      };
    }
  }

  return null;
}

function findAsyncSnapshotStatusRow(submissionId) {
  const sheet = getSpreadsheet().getSheetByName(getStatusSheetName());
  if (!sheet || sheet.getLastRow() < 2) return null;

  const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 6).getValues();
  for (let i = 0; i < rows.length; i += 1) {
    const row = rows[i];
    if (cleanValue(row[0]) === submissionId) {
      return {
        rowNumber: i + 2,
        submissionId: cleanValue(row[0]),
        createdAt: row[1],
        updatedAt: row[2],
        status: cleanValue(row[3]),
        snapshotJson: cleanValue(row[4]),
        errorMessage: cleanValue(row[5])
      };
    }
  }

  return null;
}

function upsertAsyncSnapshotStatus(submissionId, status, snapshotJson, errorMessage) {
  setupAsyncSnapshotStatusSheet();

  const sheet = getSpreadsheet().getSheetByName(getStatusSheetName());
  const now = new Date();
  const existing = findAsyncSnapshotStatusRow(submissionId);

  if (existing) {
    sheet.getRange(existing.rowNumber, 3, 1, 4).setValues([[
      now,
      status,
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
    snapshotJson,
    errorMessage
  ]);
}
