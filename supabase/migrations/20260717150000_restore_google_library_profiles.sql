-- Restore Google Library onboarding for new and existing Google Auth users.
alter table public.profiles add column if not exists auth_provider text not null default 'google';
alter table public.profiles add column if not exists onboarding_completed boolean not null default false;
alter table public.profiles add column if not exists display_name text;

create or replace function public.is_username_available(candidate text)
returns boolean language sql stable security definer set search_path = public as $$
  select not exists (
    select 1 from public.profiles where lower(username) = lower(btrim(candidate))
  );
$$;
revoke all on function public.is_username_available(text) from public;
grant execute on function public.is_username_available(text) to authenticated;

create or replace function public.handle_google_library_profile()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if coalesce(new.raw_app_meta_data ->> 'provider', '') = 'google' then
    insert into public.profiles (id, username, email, privacy_accepted_at, auth_provider, onboarding_completed, display_name)
    values (
      new.id,
      'google-' || substring(new.id::text from 1 for 8),
      lower(new.email),
      now(),
      'google',
      false,
      coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name')
    )
    on conflict (id) do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists on_google_library_user_created on auth.users;
create trigger on_google_library_user_created
  after insert on auth.users
  for each row execute function public.handle_google_library_profile();
