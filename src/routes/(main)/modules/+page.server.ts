import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getModulePresentation } from '$lib/data/module-presentation';
import { getSupabaseAdminClient } from '$lib/supabase';

export const load: PageServerLoad = async () => {
	const { data, error: databaseError } = await getSupabaseAdminClient()
		.from('modules')
		.select('module_id, name, description, cover_image')
		.eq('published', true)
		.order('created_at', { ascending: true })
		.order('module_id', { ascending: true });

	if (databaseError) {
		console.error('Could not load published modules:', databaseError.message);
		error(500, 'Could not load modules.');
	}

	return {
		modules: (data ?? []).map(getModulePresentation)
	};
};
