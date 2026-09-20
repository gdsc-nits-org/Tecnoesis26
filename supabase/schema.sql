create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique check (username ~ '^[a-z0-9_]{3,24}$'),
  scholar_id text unique,
  institute_email text not null unique,
  full_name text,
  phone_number text,
  hostel_number text,
  image_url text,
  auth_provider text not null default 'google' check (auth_provider = 'google'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Scholar ID is retained for existing accounts, but the new signup flow does not require it.
alter table public.profiles alter column scholar_id drop not null;

-- Accept any email domain ending in .nits.ac.in, without a department whitelist.
alter table public.profiles
drop constraint if exists profiles_institute_email_nits_check;
alter table public.profiles
add constraint profiles_institute_email_nits_check
check (lower(btrim(institute_email)) ~ '^[^@[:space:]]+@[^@[:space:]]+[.]nits[.]ac[.]in$');

-- Email addresses are case-insensitive for identity and uniqueness purposes.
drop index if exists public.profiles_institute_email_idx;
create unique index if not exists profiles_institute_email_lower_uidx
on public.profiles (lower(btrim(institute_email)));

create or replace function public.set_updated_at() returns trigger
language plpgsql security invoker set search_path = public as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();

create or replace function public.prevent_profile_identity_changes() returns trigger
language plpgsql security invoker set search_path = public as $$
begin
  new.id = old.id;
  new.username = old.username;
  new.scholar_id = old.scholar_id;
  new.institute_email = old.institute_email;
  new.auth_provider = old.auth_provider;
  return new;
end;
$$;

drop trigger if exists profiles_protect_identity on public.profiles;
create trigger profiles_protect_identity before update on public.profiles
for each row execute function public.prevent_profile_identity_changes();

alter table public.profiles enable row level security;
drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile" on public.profiles for select using (auth.uid() = id);
drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile" on public.profiles for insert with check (
  auth.uid() = id
  and lower(btrim(institute_email)) = lower(coalesce(auth.jwt() ->> 'email', ''))
);
drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles for update
using (auth.uid() = id)
with check (
  auth.uid() = id
  and lower(btrim(institute_email)) = lower(coalesce(auth.jwt() ->> 'email', ''))
);

grant select, insert, update on public.profiles to authenticated;
revoke all on public.profiles from anon;

-- Supabase Auth "Before User Created" hook.
-- This prevents direct email/password signup and permits new accounts only when
-- they arrive through Google with an email domain ending in .nits.ac.in.
create or replace function public.hook_google_nits_signup_only(event jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  signup_email text;
  signup_provider text;
begin
  signup_email := lower(btrim(coalesce(event -> 'user' ->> 'email', '')));
  signup_provider := lower(coalesce(event -> 'user' -> 'app_metadata' ->> 'provider', ''));

  if signup_provider <> 'google' then
    return jsonb_build_object(
      'error', jsonb_build_object(
        'http_code', 403,
        'message', 'Create your Tecnoesis account using Google sign-up.'
      )
    );
  end if;

  if signup_email !~ '^[^@[:space:]]+@[^@[:space:]]+[.]nits[.]ac[.]in$' then
    return jsonb_build_object(
      'error', jsonb_build_object(
        'http_code', 403,
        'message', 'Use your institute Google email ending in .nits.ac.in to sign up.'
      )
    );
  end if;

  return '{}'::jsonb;
end;
$$;

grant usage on schema public to supabase_auth_admin;
grant execute on function public.hook_google_nits_signup_only(jsonb) to supabase_auth_admin;
revoke execute on function public.hook_google_nits_signup_only(jsonb)
from authenticated, anon, public;
