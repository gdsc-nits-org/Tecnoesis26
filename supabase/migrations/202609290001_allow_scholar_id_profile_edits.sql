-- Scholar IDs can be corrected from the profile page. Keep account identity
-- fields protected while allowing the owner's profile update to change scholar_id.
create or replace function public.prevent_profile_identity_changes() returns trigger
language plpgsql security invoker set search_path = public as $$
begin
  new.id = old.id;
  new.username = old.username;
  new.institute_email = old.institute_email;
  new.auth_provider = old.auth_provider;
  return new;
end;
$$;
