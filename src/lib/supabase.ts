import type { Profile, Resource, ResourceFile } from './types';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;
const storageKey = 'sb-xisiatrznopkvdzuctfy-auth-token';
const googlePkceVerifierKey = 'ai_pm_lab_google_pkce_verifier';
export const libraryAccessKey = 'ai_pm_lab_library_access';
export const isSupabaseConfigured = Boolean(url && key);
export type Session = { access_token: string; user: { id: string; email?: string; user_metadata?: Record<string, unknown>; app_metadata?: Record<string, unknown> } };

const head = (token?: string) => ({ apikey: key!, Authorization: `Bearer ${token || key!}`, 'Content-Type': 'application/json' });
async function req<T>(path: string, init: RequestInit = {}, token?: string): Promise<T> {
  if (!isSupabaseConfigured) throw new Error('Library authentication is not configured.');
  const response = await fetch(`${url}${path}`, { ...init, headers: { ...head(token), ...init.headers } });
  if (!response.ok) throw new Error((await response.json().catch(() => ({}))).message || 'Unable to complete this request.');
  return response.status === 204 ? undefined as T : response.json();
}
const session = () => { try { return JSON.parse(localStorage.getItem(storageKey) || 'null') as Session | null; } catch { return null; } };
const save = (current: Session) => localStorage.setItem(storageKey, JSON.stringify(current));
const base64Url = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
async function pkceChallenge(verifier: string) { return base64Url(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier)))); }
async function detectCallback(): Promise<Session | null> {
  const callbackUrl = new URL(window.location.href);
  const hash = new URLSearchParams(callbackUrl.hash.slice(1));
  let token = hash.get('access_token');
  if (!token) {
    const code = callbackUrl.searchParams.get('code');
    const verifier = localStorage.getItem(googlePkceVerifierKey);
    if (code && verifier) {
      const exchange = await req<{ access_token: string; user: Session['user'] }>('/auth/v1/token?grant_type=pkce', { method: 'POST', body: JSON.stringify({ auth_code: code, code_verifier: verifier }) });
      token = exchange.access_token;
      localStorage.removeItem(googlePkceVerifierKey);
    }
  }
  if (!token) return session();
  const user = await req<Session['user']>('/auth/v1/user', {}, token);
  const current = { access_token: token, user };
  save(current);
  window.history.replaceState({}, document.title, callbackUrl.pathname);
  return current;
}

export const supabase = {
  hasLibraryAccess: () => localStorage.getItem(libraryAccessKey) === 'true',
  grantLibraryAccess: () => localStorage.setItem(libraryAccessKey, 'true'),
  clearLibraryAccess: () => localStorage.removeItem(libraryAccessKey),
  registerLibraryMember: async (username: string, email: string) => req<boolean>('/rest/v1/rpc/register_library_member', { method: 'POST', body: JSON.stringify({ username, email }) }),
  libraryMemberExists: async (identifier: string) => req<boolean>('/rest/v1/rpc/library_member_exists', { method: 'POST', body: JSON.stringify({ identifier }) }),
  auth: {
    getSession: async () => ({ data: { session: await detectCallback() } }),
    onAuthStateChange: (callback: () => void) => {
      const listener = (event: StorageEvent) => { if (event.key === storageKey) callback(); };
      window.addEventListener('storage', listener);
      return { data: { subscription: { unsubscribe: () => window.removeEventListener('storage', listener) } } };
    },
    signInWithOAuth: async ({ provider, options }: { provider: 'google'; options: { redirectTo: string } }) => {
      if (!url || !key) return { error: new Error('Library authentication is not configured.') };
      try {
        const verifier = `${crypto.randomUUID()}${crypto.randomUUID()}`;
        localStorage.setItem(googlePkceVerifierKey, verifier);
        const challenge = await pkceChallenge(verifier);
        window.location.assign(`${url}/auth/v1/authorize?provider=${provider}&redirect_to=${encodeURIComponent(options.redirectTo)}&code_challenge=${encodeURIComponent(challenge)}&code_challenge_method=s256`);
        return { error: null };
      } catch (error) { return { error: error instanceof Error ? error : new Error('Google sign-in could not start.') }; }
    },
    signOut: async () => {
      const current = session();
      if (current) await req('/auth/v1/logout', { method: 'POST' }, current.access_token).catch(() => undefined);
      localStorage.removeItem(storageKey);
      localStorage.removeItem(libraryAccessKey);
    },
  },
  rpc: async (name: string, args: Record<string, unknown>) => ({ data: await req(`/rest/v1/rpc/${name}`, { method: 'POST', body: JSON.stringify(args) }, session()?.access_token).catch(() => null) }),
  getProfile: async (current: Session) => { const profiles = await req<Profile[]>(`/rest/v1/profiles?id=eq.${current.user.id}&select=*`, {}, current.access_token); return profiles[0] || null; },
  ensureGoogleProfile: async (current: Session) => req<Profile[]>('/rest/v1/profiles?on_conflict=id', { method: 'POST', headers: { Prefer: 'resolution=merge-duplicates,return=representation' }, body: JSON.stringify({ id: current.user.id, username: `google-${current.user.id.slice(0, 8)}`, email: (current.user.email ?? '').trim().toLowerCase(), privacy_accepted_at: new Date().toISOString() }) }, current.access_token),
  saveProfile: async (current: Session, profile: Partial<Profile>) => req<Profile[]>(`/rest/v1/profiles?id=eq.${current.user.id}`, { method: 'PATCH', headers: { Prefer: 'return=representation' }, body: JSON.stringify({ ...profile, last_access_at: new Date().toISOString() }) }, current.access_token),
  catalog: async (current?: Session | null) => {
    const resources = await req<Resource[]>('/rest/v1/resources?select=*&order=sort_order.asc', {}, current?.access_token);
    const files = await req<ResourceFile[]>('/rest/v1/resource_files?select=*&order=sort_order.asc', {}, current?.access_token);
    return resources.map((resource) => ({ ...resource, resource_files: files.filter((file) => file.resource_id === resource.id) }));
  },
  activity: async (current: Session, id: string, event: string, file?: string) => req('/rest/v1/resource_activity', { method: 'POST', body: JSON.stringify({ user_id: current.user.id, resource_id: id, resource_file_id: file, event_type: event }) }, current.access_token),
  bookmarks: async (current: Session) => req<{ resource_id: string }[]>('/rest/v1/resource_bookmarks?select=resource_id', {}, current.access_token),
  toggleBookmark: async (current: Session, id: string, saved: boolean) => saved ? req(`/rest/v1/resource_bookmarks?user_id=eq.${current.user.id}&resource_id=eq.${id}`, { method: 'DELETE' }, current.access_token) : req('/rest/v1/resource_bookmarks', { method: 'POST', body: JSON.stringify({ user_id: current.user.id, resource_id: id }) }, current.access_token),
};
