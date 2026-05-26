export const REAL_ESTATE_AI_PM_PROXY_ENDPOINT =
  import.meta.env.VITE_REAL_ESTATE_AI_PM_PROXY_ENDPOINT || '/api/real-estate-ai-pm';

// Reserved fallback target for server-side proxy forwarding only.
export const REAL_ESTATE_AI_PM_APPS_SCRIPT_ENDPOINT =
  import.meta.env.VITE_REAL_ESTATE_AI_PM_ENDPOINT ||
  'https://script.google.com/macros/s/AKfycbw-4odu_K3po27Dv3n5hEzjezxBR-kM06fBNWMdkU1RwRhDucpdSpt7LE1NzKpS1f8fMw/exec';
