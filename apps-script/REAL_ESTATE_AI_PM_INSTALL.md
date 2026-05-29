# Real Estate AI PM Apps Script install guide (non-developer steps)

You do **not** need to send or attach your long `Code.gs` file.

The website can only use the async fixes in this repository after the Google Apps Script Web App is updated. The file to copy from this repo is:

- `apps-script/real-estate-ai-pm-async.gs`

## What to do in Google Apps Script

1. Open the Google Apps Script project that powers the Real Estate AI PM form.
2. Open `Code.gs`.
3. Make a backup first:
   - Click inside `Code.gs`.
   - Press `Ctrl+A` / `Cmd+A`.
   - Copy it into a temporary Google Doc or text file.
4. If you already pasted an older async patch before:
   - Search in `Code.gs` for `PROPERTYDEX / REAL ESTATE AI PM PILOT — ASYNC CODE.GS PATCH`.
   - Delete from that comment down through the final async `doPost(e)` function at the bottom.
   - This avoids duplicate `const ASYNC_...` declarations.
5. Open this repository file: `apps-script/real-estate-ai-pm-async.gs`.
6. Copy the **entire** file.
7. Go back to Apps Script `Code.gs`.
8. Scroll to the very bottom.
9. Paste the entire async file at the very bottom.
10. Save the Apps Script project.

## Quick smoke test before deploying

1. In Apps Script, use the function dropdown and select `testAsyncDispatcherInstall`.
2. Click **Run**.
3. If Google asks for authorization, approve it.
4. Open **Executions** or **Logs**.
5. A good result is a fast JSON response containing:

```json
{"success":false,"submissionId":"__INSTALL_TEST__","status":"AI_GENERATION_FAILED","message":"Submission status was not found."}
```

That message is expected for the fake test ID. It means the async status handler is installed and it did **not** call Gemini.

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

In that case, repeat the deploy steps above and make sure you selected **New version**.
