# Real Estate AI PM Apps Script install guide (copy the full script)

You do **not** need to send or attach your long `Code.gs` file.

Use the full replacement script in this repository:

- `apps-script/real-estate-ai-pm-full-code.gs`

This file is meant for non-developers: copy the whole file and replace your current Apps Script `Code.gs` with it.

## Replace `Code.gs`

1. Open the Google Apps Script project that powers the Real Estate AI PM form.
2. Open `Code.gs`.
3. Make a backup first:
   - Click inside `Code.gs`.
   - Press `Ctrl+A` / `Cmd+A`.
   - Copy it into a temporary Google Doc or text file.
4. Open this repository file: `apps-script/real-estate-ai-pm-full-code.gs`.
5. Copy the **entire** file.
6. Go back to Apps Script `Code.gs`.
7. Press `Ctrl+A` / `Cmd+A` to select all old code.
8. Paste the full script so it replaces everything.
9. Save the Apps Script project.

Do **not** paste this full script under the old code. Replace the old code so there is only one `doPost(e)`.

## Optional but recommended: add Gemini API key

The full script can run without a Gemini key by returning a structured rules-based preliminary snapshot. For model-generated wording, add your Gemini key:

1. In Apps Script, open **Project Settings**.
2. Under **Script Properties**, add:
   - Property: `GEMINI_API_KEY`
   - Value: your Gemini API key
3. Optional property:
   - Property: `GEMINI_MODEL`
   - Value: `gemini-1.5-flash` or the model you want to use

## Quick smoke test before deploying

1. In Apps Script, use the function dropdown and select `testFullCodeInstall`.
2. Click **Run**.
3. If Google asks for authorization, approve it.
4. Open **Executions** or **Logs**.
5. A good result contains:

```json
{"success":true,"diagnosticFallbackOk":true,"snapshotFallbackOk":true,"statusRouteOk":true}
```

The fake `__INSTALL_TEST__` submission is expected to be "not found" internally; `statusRouteOk:true` means that status route responded quickly without calling Gemini. This smoke test does **not** call Gemini. It verifies the full script helpers, sheet setup, status route, and fallback snapshot structure exist.

## Deploy the Web App again

Saving is not enough. You must deploy a new Web App version:

1. Click **Deploy** → **Manage deployments**.
2. Select the existing Web App deployment.
3. Click the pencil/edit icon.
4. Choose **New version**.
5. Click **Deploy**.
6. Keep the same Web App URL unless Google gives you a new one.

## How to know the live site is still on old Apps Script code

If the browser keeps showing one of these patterns, the live Web App is probably still running the old `Code.gs` deployment:

- Status requests return `504`.
- The response says the deployment may still be running the legacy synchronous `processSubmission()` flow.
- The form stays on `PROCESSING` forever and the Apps Script executions do not show `processPendingAiSnapshots`.
- The final failure says a helper like `createDiagnostic` is not defined.

In that case, repeat the replace-and-deploy steps above and make sure you selected **New version**.
