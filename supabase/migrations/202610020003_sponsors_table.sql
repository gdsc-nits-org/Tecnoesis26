begin;

create table if not exists public.sponsors (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  sponsor_name text not null,
  sponsor_img text not null,
  constraint sponsors_pkey primary key (id),
  constraint sponsors_sponsor_name_key unique (sponsor_name)
);

alter table public.sponsors enable row level security;

drop policy if exists "Allow public read access to sponsors" on public.sponsors;
create policy "Allow public read access to sponsors"
  on public.sponsors
  for select
  using (true);

grant select on public.sponsors to anon, authenticated;

commit;
