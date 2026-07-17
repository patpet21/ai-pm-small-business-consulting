import React from 'react';
import type { Profile } from '../lib/types';
import type { Session } from '../lib/supabase';
import { supabase } from '../lib/supabase';

type Auth = { loading:boolean; profileLoading:boolean; session:Session|null; profile:Profile|null; refresh:()=>Promise<void>; signOut:()=>Promise<void> };
const Context = React.createContext<Auth|null>(null);
const sleep = (milliseconds:number) => new Promise((resolve) => setTimeout(resolve, milliseconds));
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = React.useState(true); const [profileLoading, setProfileLoading] = React.useState(false); const [session, setSession] = React.useState<Session|null>(null); const [profile, setProfile] = React.useState<Profile|null>(null);
  const loadProfile = React.useCallback(async (currentSession:Session) => { setProfileLoading(true); let currentProfile:Profile|null=null; for(let attempt=0;attempt<4&&!currentProfile;attempt+=1){ currentProfile=await supabase.getProfile(currentSession).catch(()=>null); if(!currentProfile&&attempt===0&&currentSession.user.app_metadata?.provider==='google'){ await supabase.ensureGoogleProfile(currentSession).catch(()=>undefined); } if(!currentProfile&&attempt<3) await sleep(320); } setProfile(currentProfile); setProfileLoading(false); }, []);
  const refresh = React.useCallback(async () => { setLoading(true); const currentSession=(await supabase.auth.getSession()).data.session; setSession(currentSession); if(currentSession) await loadProfile(currentSession); else setProfile(null); setLoading(false); }, [loadProfile]);
  React.useEffect(() => { void refresh(); const { data:{subscription} }=supabase.auth.onAuthStateChange(()=>void refresh()); return()=>subscription.unsubscribe(); }, [refresh]);
  return <Context.Provider value={{ loading, profileLoading, session, profile, refresh, signOut:async()=>{await supabase.auth.signOut();await refresh();} }}>{children}</Context.Provider>;
}
export const useAuth=()=>{const value=React.useContext(Context);if(!value)throw new Error('AuthProvider missing');return value};
