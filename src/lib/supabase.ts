import type { Profile, Resource, ResourceFile } from './types';

const projectUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;
const sessionKey = 'ai-pm-library-session';

export const isSupabaseConfigured = Boolean(projectUrl && publishableKey);

export type Session = { access_token: string; refresh_token?: string; expires_at?: number; user: { id: string } };

type ApiErrorBody = { message?: string; error?: string; code?: string };
export class SupabaseRequestError extends Error {
  constructor(public readonly status: number, message: string, public readonly code?: string) { super(message); }
}

function getHeaders(token?: string): HeadersInit {
  return { apikey: publishableKey!, Authorization: `Bearer ${token ?? publishableKey!}`, 'Content-Type': 'application/json' };
}

async function request<T>(path: string, init: RequestInit = {}, token?: string): Promise<T> {
  if (!isSupabaseConfigured) throw new SupabaseRequestError(0, 'Supabase is not configured for this deployment.');
  let response: Response;
  try { response = await fetch(`${projectUrl}${path}`, { ...init, headers: { ...getHeaders(token), ...init.headers } }); }
  catch { throw new SupabaseRequestError(0, 'The Library service could not be reached.'); }
  if (!response.ok) {
    const payload = await response.json().catch(() => ({})) as ApiErrorBody;
    throw new SupabaseRequestError(response.status, payload.message ?? payload.error ?? 'The Library service rejected this request.', payload.code);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

function readSession(): Session | null {
  try { return JSON.parse(localStorage.getItem(sessionKey) ?? 'null') as Session | null; }
  catch { localStorage.removeItem(sessionKey); return null; }
}

function saveSession(session: Session): void { localStorage.setItem(sessionKey, JSON.stringify(session)); }

export function registrationErrorMessage(error: unknown): string {
  if (!(error instanceof SupabaseRequestError)) return 'We could not create your Library access. Please try again.';
  if (!isSupabaseConfigured) return 'Library access is not configured on this site yet. Please contact AI PM LAB and try again after it is configured.';
  if (error.status === 400 || error.status === 403) return 'Anonymous Library access is not enabled or this site’s public Supabase settings are invalid. Please contact AI PM LAB.';
  if (error.status === 404) return 'The Resource Library database is not available yet. Please contact AI PM LAB.';
  if (error.status === 401) return 'Your Library session could not be verified. Please try again.';
  return 'The Library service is temporarily unavailable. Please try again shortly.';
}

export const supabase = {
  auth: {
    getSession: async () => ({ data: { session: readSession() } }),
    signInAnonymously: async () => {
      // GoTrue requires the `data` object for an anonymous signup; no email or password is sent.
      const session = await request<Session>('/auth/v1/signup', { method: 'POST', body: JSON.stringify({ data: {} }) });
      saveSession(session);
      return { data: { user: session.user, session }, error: null };
    },
    signOut: async () => {
      const session = readSession();
      if (session) await request('/auth/v1/logout', { method: 'POST' }, session.access_token).catch(() => undefined);
      localStorage.removeItem(sessionKey);
    },
    onAuthStateChange: (callback: () => void) => {
      const listener = (event: StorageEvent) => { if (event.key === sessionKey) callback(); };
      window.addEventListener('storage', listener);
      return { data: { subscription: { unsubscribe: () => window.removeEventListener('storage', listener) } } };
    },
  },
  getProfile: async (session: Session) => {
    const rows = await request<Profile[]>(`/rest/v1/profiles?id=eq.${session.user.id}&select=*`, {}, session.access_token);
    return rows[0] ?? null;
  },
  saveProfile: async (session: Session, profile: Omit<Profile, 'id' | 'membership_tier' | 'last_access_at'>) =>
    request('/rest/v1/profiles?on_conflict=id', { method: 'POST', headers: { Prefer: 'resolution=merge-duplicates,return=representation' }, body: JSON.stringify({ id: session.user.id, ...profile, membership_tier: 'free', last_access_at: new Date().toISOString() }) }, session.access_token),
  catalog: async (session?: Session | null) => {
    const resources = await request<Resource[]>('/rest/v1/resources?select=*&order=sort_order.asc', {}, session?.access_token);
    const files = await request<ResourceFile[]>('/rest/v1/resource_files?select=*&order=sort_order.asc', {}, session?.access_token);
    return resources.map((resource) => ({ ...resource, resource_files: files.filter((file) => file.resource_id === resource.id) }));
  },
  activity: async (session: Session, resourceId: string, eventType: 'view' | 'open' | 'download' | 'save' | 'unsave', resourceFileId?: string) =>
    request('/rest/v1/resource_activity', { method: 'POST', body: JSON.stringify({ user_id: session.user.id, resource_id: resourceId, resource_file_id: resourceFileId, event_type: eventType }) }, session.access_token),
  bookmarks: async (session: Session) => request<{ resource_id: string }[]>('/rest/v1/resource_bookmarks?select=resource_id', {}, session.access_token),
  toggleBookmark: async (session: Session, resourceId: string, saved: boolean) => saved
    ? request(`/rest/v1/resource_bookmarks?user_id=eq.${session.user.id}&resource_id=eq.${resourceId}`, { method: 'DELETE' }, session.access_token)
    : request('/rest/v1/resource_bookmarks', { method: 'POST', body: JSON.stringify({ user_id: session.user.id, resource_id: resourceId }) }, session.access_token),
};
