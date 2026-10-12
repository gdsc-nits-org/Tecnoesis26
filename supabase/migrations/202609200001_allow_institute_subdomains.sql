-- Run in Supabase SQL Editor for projects that already applied schema.sql.
-- This updates both the profile constraint and the existing enabled signup hook.
begin;

alter table public.profiles
drop constraint if exists profiles_institute_email_nits_check;

-- NOT VALID preserves any existing rows from the previous @nits.ac.in policy.
-- The new rule is still enforced for all new inserts and updates. Existing
-- root-domain accounts no longer pass the application's sign-in domain check.
alter table public.profiles
add constraint profiles_institute_email_nits_check
check (lower(btrim(institute_email)) ~ '^[^@[:space:]]+@[^@[:space:]]+[.]nits[.]ac[.]in$') not valid;

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

commit;
