create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique check (username ~ '^[a-z0-9_]{3,24}$'),
  scholar_id text not null unique,
  institute_email text not null unique,
  full_name text,
  phone_number text,
  hostel_number text,
  image_url text,
  auth_provider text not null default 'google' check (auth_provider = 'google'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_institute_email_idx on public.profiles (lower(institute_email));

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
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);
drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

grant select, insert, update on public.profiles to authenticated;
revoke all on public.profiles from anon;
