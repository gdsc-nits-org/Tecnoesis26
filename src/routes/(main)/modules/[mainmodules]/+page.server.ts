import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getModulePresentation } from '$lib/data/module-presentation';
import { getSupabaseAdminClient } from '$lib/supabase';

export const load: PageServerLoad = async ({ params }) => {
	const supabase = getSupabaseAdminClient();
	const { data: moduleRows, error: modulesError } = await supabase
		.from('modules')
		.select('module_id, name, description, cover_image')
		.eq('published', true)
		.order('created_at', { ascending: true })
		.order('module_id', { ascending: true });

	if (modulesError) {
		console.error('Could not load published modules:', modulesError.message);
		error(500, 'Could not load modules.');
	}

	const moduleIndex = (moduleRows ?? []).findIndex((item) => item.module_id === params.mainmodules);
	const moduleRow = moduleRows?.[moduleIndex];
	if (!moduleRow || moduleIndex < 0) error(404, 'Module not found');

	const module = getModulePresentation(moduleRow);
	const { data: eventRows, error: eventsError } = await supabase
		.from('events')
		.select('event_id, name, description, poster_image, banner_image')
		.eq('module_id', module.slug)
		.eq('published', true)
		.order('created_at', { ascending: true });

	if (eventsError) {
		console.error(
			`Could not load published events for module ${module.slug}:`,
			eventsError.message
		);
		error(500, 'Could not load module events.');
	}

	const events = (eventRows ?? [])
		.filter((event) => Boolean(event.event_id?.trim()))
		.map((event) => ({
			slug: event.event_id ?? '',
			name: event.name,
			description: event.description ?? '',
			image: event.poster_image ?? event.banner_image
		}));

	return { module: { ...module, events }, moduleIndex };
};
