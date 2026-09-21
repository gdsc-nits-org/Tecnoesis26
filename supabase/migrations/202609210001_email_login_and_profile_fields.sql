-- Login moves from username+password to institute-email+password, and profile
-- creation now collects name, phone, hostel, gender and scholar ID.
--
-- Run this in the Supabase SQL Editor on an existing project. It is written to
-- be re-runnable and does not delete any data.

-- 1. Username is no longer collected. The column is kept so existing accounts
--    keep their value, but it must stop being required or new inserts fail.
alter table public.profiles alter column username drop not null;
alter table public.profiles drop constraint if exists profiles_username_check;

-- Once you are satisfied nothing reads profiles.username, drop it for good:
--   alter table public.profiles drop column username;

-- 2. Gender, collected at signup.
alter table public.profiles add column if not exists gender text;
alter table public.profiles drop constraint if exists profiles_gender_check;
alter table public.profiles
add constraint profiles_gender_check
check (gender is null or gender in ('male', 'female', 'other', 'prefer_not_to_say'));

-- 3. Phone numbers are stored as bare 10 digits; the app strips +91 and spacing
--    before inserting. Existing rows may hold other formats, so only constrain
--    values that are present and leave historical rows alone.
alter table public.profiles drop constraint if exists profiles_phone_number_check;
alter table public.profiles
add constraint profiles_phone_number_check
check (phone_number is null or phone_number ~ '^[0-9]{10}$') not valid;

-- 4. Scholar ID is required again for new signups. It stays nullable in the
--    database because accounts created under the previous flow have none;
--    the application enforces it going forward.
alter table public.profiles drop constraint if exists profiles_scholar_id_check;
alter table public.profiles
add constraint profiles_scholar_id_check
check (scholar_id is null or scholar_id ~ '^[A-Za-z0-9/-]{4,20}$') not valid;

-- 5. The identity trigger pinned username, which can no longer be set. Scholar
--    ID and email stay immutable; username is dropped from the guard so that a
--    legacy value cannot be edited either way.
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
