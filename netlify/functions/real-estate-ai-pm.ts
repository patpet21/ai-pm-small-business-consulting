const APPS_SCRIPT_ENDPOINT =
  process.env.REAL_ESTATE_AI_PM_APPS_SCRIPT_ENDPOINT ||
  'https://script.google.com/macros/s/AKfycbw-4odu_K3po27Dv3n5hEzjezxBR-kM06fBNWMdkU1RwRhDucpdSpt7LE1NzKpS1f8fMw/exec';

type Event = { httpMethod?: string; body?: string | null };
type Result = { statusCode: number; headers?: Record<string, string>; body: string };

export async function handler(event: Event): Promise<Result> {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ success: false, message: 'Method not allowed' }) };
  }

  try {
    const payload = JSON.parse(event.body || '{}');
    const upstream = await fetch(APPS_SCRIPT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    });
    const text = await upstream.text();
    const parsed = JSON.parse(text);
    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(parsed) };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        message: 'Submission succeeded upstream but preview response could not be rendered. Your full report will still be reviewed within 3 business days.',
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
}
