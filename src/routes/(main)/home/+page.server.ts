import type { PageServerLoad } from './$types';
import { tryGetSupabaseServerClient } from '$lib/supabase';

export type Sponsor = {
	sponsor_name: string;
	sponsor_img: string;
};

export const load: PageServerLoad = async ({ cookies }) => {
	const supabase = tryGetSupabaseServerClient(cookies);
	if (!supabase) return { sponsors: [] satisfies Sponsor[] };

	const { data, error } = await supabase
		.from('sponsors')
		.select('sponsor_name, sponsor_img')
		.order('created_at', { ascending: true });

	if (error) return { sponsors: [] satisfies Sponsor[] };
	const rows = (data ?? []) as Array<Partial<Sponsor>>;

	return {
		sponsors: rows.filter(
			(sponsor): sponsor is Sponsor =>
				typeof sponsor.sponsor_name === 'string' && typeof sponsor.sponsor_img === 'string'
		)
	};
};
