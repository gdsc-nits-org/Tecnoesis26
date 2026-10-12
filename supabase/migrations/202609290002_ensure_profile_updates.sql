-- Keep profile updates scoped to the signed-in owner and verified email.
-- Recreate the policy so existing databases receive the same rule as schema.sql.
drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles for update
using (auth.uid() = id)
with check (
  auth.uid() = id
  and lower(btrim(institute_email)) = lower(coalesce(auth.jwt() ->> 'email', ''))
);

grant select, update on public.profiles to authenticated;
