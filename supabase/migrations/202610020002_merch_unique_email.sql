begin;

with duplicate_rows as (
	select
		lower(btrim(email)) as normalized_email,
		(array_agg(id order by created_at desc, id desc))[1] as keep_id,
		bool_or(coalesce(tecno, false)) as has_tecno,
		bool_or(coalesce(spark, false)) as has_spark,
		bool_or(coalesce(opted_in, false)) as has_opted_in
	from public.merch
	where email is not null and btrim(email) <> ''
	group by lower(btrim(email))
	having count(*) > 1
)
update public.merch as merch
set
	tecno = duplicate_rows.has_tecno,
	spark = duplicate_rows.has_spark,
	opted_in = duplicate_rows.has_opted_in
from duplicate_rows
where merch.id = duplicate_rows.keep_id;

with ranked_rows as (
	select
		id,
		row_number() over (
			partition by lower(btrim(email))
			order by created_at desc, id desc
		) as row_number
	from public.merch
	where email is not null and btrim(email) <> ''
)
delete from public.merch as merch
using ranked_rows
where merch.id = ranked_rows.id
	and ranked_rows.row_number > 1;

update public.merch
set email = nullif(lower(btrim(email)), '')
where email is not null;

create unique index if not exists merch_email_key on public.merch (email);

commit;