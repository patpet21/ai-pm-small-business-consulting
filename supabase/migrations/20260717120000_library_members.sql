-- Passwordless local Library membership. The table is never publicly readable.
create table if not exists public.library_members (
  id uuid primary key default gen_random_uuid(),
  username text not null unique check (char_length(btrim(username)) between 2 and 40 and username = btrim(username)),
  email text not null unique check (email = btrim(lower(email))),
  created_at timestamptz not null default now()
);

alter table public.library_members enable row level security;
revoke all on table public.library_members from anon, authenticated, public;

create or replace function public.register_library_member(username text, email text)
returns boolean language plpgsql security definer set search_path = public as $$
begin
  insert into public.library_members (username, email)
  values (btrim(username), lower(btrim(email)));
  return true;
exception when unique_violation then
  return false;
end;
$$;

create or replace function public.library_member_exists(identifier text)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.library_members
    where lower(username) = lower(btrim(identifier)) or email = lower(btrim(identifier))
  );
$$;

revoke all on function public.register_library_member(text, text) from public;
revoke all on function public.library_member_exists(text) from public;
grant execute on function public.register_library_member(text, text) to anon, authenticated;
grant execute on function public.library_member_exists(text) to anon, authenticated;

create unique index if not exists library_members_username_lower_key on public.library_members (lower(username));
