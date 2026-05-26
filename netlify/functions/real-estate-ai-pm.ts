const APPS_SCRIPT_URL =
  process.env.REAL_ESTATE_AI_PM_ENDPOINT ||
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

export async function handler(event: Event): Promise<Result> {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, message: 'Method not allowed' }),
    };
  }

  try {
    const rawBody = event.body || '{}';
    const payload = JSON.parse(rawBody);

    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    });

    const text = await response.text();

    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      return {
        statusCode: 502,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          message: 'Apps Script returned a non-JSON response',
          raw: text,
        }),
      };
    }

    return {
      statusCode: response.ok ? 200 : 502,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        message: 'Failed to forward intake to Apps Script',
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
}
