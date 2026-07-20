-- Existing members can register again after an auth-user reset.
-- The email remains unique and a username owned by another email remains unavailable.
create or replace function public.register_library_member(username text, email text)
returns boolean language plpgsql security definer set search_path = public as $$
begin
  insert into public.library_members (username, email)
  values (btrim(username), lower(btrim(email)))
  on conflict (email) do update set username = excluded.username;
  return true;
exception when unique_violation then
  return false;
end;
$$;

revoke all on function public.register_library_member(text, text) from public;
grant execute on function public.register_library_member(text, text) to anon, authenticated;
