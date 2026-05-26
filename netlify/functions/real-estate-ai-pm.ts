const APPS_SCRIPT_ENDPOINT =
  process.env.REAL_ESTATE_AI_PM_APPS_SCRIPT_ENDPOINT ||
  'https://script.google.com/macros/s/AKfycbw-4odu_K3po27Dv3n5hEzjezxBR-kM06fBNWMdkU1RwRhDucpdSpt7LE1NzKpS1f8fMw/exec';

type Event = {
  httpMethod?: string;
  body?: string | null;
};

type Result = {
  statusCode: number;
  headers?: Record<string, string>;
  body: string;
};

type AppsScriptResponse = {
  success?: boolean;
  message?: string;
  submissionId?: string;
  instantSnapshot?: {
    workflowDetected?: string;
    mainBottleneck?: string;
    recommendedFirstStep?: string;
    suggestedSimpleSystem?: string;
    aiOpportunities?: string[];
    nextStep?: string;
    disclaimer?: string;
  };
};

export async function handler(event: Event): Promise<Result> {
  console.log('[real-estate-ai-pm] function called');
  console.log('[real-estate-ai-pm] endpoint exists:', Boolean(APPS_SCRIPT_ENDPOINT));

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, message: 'Method not allowed' }),
    };
  }

  try {
    const payload = JSON.parse(event.body || '{}');

    const upstream = await fetch(APPS_SCRIPT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    });

    console.log('[real-estate-ai-pm] Apps Script HTTP status:', upstream.status);

    const text = await upstream.text();

    let parsed: AppsScriptResponse;
    try {
      parsed = JSON.parse(text) as AppsScriptResponse;
    } catch {
      console.log('[real-estate-ai-pm] parsed success:', false);
      return {
        statusCode: 502,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          message: 'Apps Script returned a non-JSON response.',
        }),
      };
    }

    const hasSubmissionId = Boolean(parsed.submissionId);
    const hasInstantSnapshot = Boolean(parsed.instantSnapshot);

    console.log('[real-estate-ai-pm] parsed success:', true);
    console.log('[real-estate-ai-pm] has instantSnapshot:', hasInstantSnapshot);

    if (!hasInstantSnapshot) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          message: 'Apps Script response did not include instantSnapshot.',
          debug: {
            hasSubmissionId,
            hasInstantSnapshot,
          },
        }),
      };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        message: parsed.message || 'Submission received successfully.',
        submissionId: parsed.submissionId || '',
        instantSnapshot: parsed.instantSnapshot,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        message: 'Failed to forward intake to Apps Script.',
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
}
