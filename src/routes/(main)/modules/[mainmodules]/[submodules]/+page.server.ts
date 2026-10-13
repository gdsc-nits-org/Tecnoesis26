import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getModulePresentation } from '$lib/data/module-presentation';
import { getSupabaseAdminClient } from '$lib/supabase';

export const load: PageServerLoad = async ({ params }) => {
	const supabase = getSupabaseAdminClient();
	const { data: moduleRow, error: moduleError } = await supabase
		.from('modules')
		.select('module_id, name, description, cover_image')
		.eq('module_id', params.mainmodules)
		.eq('published', true)
		.maybeSingle();

	if (moduleError) {
		console.error(`Could not load module ${params.mainmodules}:`, moduleError.message);
		error(500, 'Could not load module.');
	}
	if (!moduleRow) error(404, 'Module not found');

	const { data: eventRow, error: eventError } = await supabase
		.from('events')
		.select(
			'event_id, name, description, venue, min_team_size, max_team_size, registration_end_time, prize_description, stages_description, poster_image, banner_image'
		)
		.eq('module_id', moduleRow.module_id)
		.eq('event_id', params.submodules)
		.eq('published', true)
		.maybeSingle();

	if (eventError) {
		console.error(
			`Could not load event ${params.submodules} in module ${moduleRow.module_id}:`,
			eventError.message
		);
		error(500, 'Could not load event.');
	}
	if (!eventRow) error(404, 'Event not found');

	return {
		module: getModulePresentation(moduleRow),
		event: {
			slug: eventRow.event_id ?? '',
			name: eventRow.name,
			description: eventRow.description ?? '',
			venue: eventRow.venue,
			minTeamSize: eventRow.min_team_size,
			maxTeamSize: eventRow.max_team_size,
			registrationEndTime: eventRow.registration_end_time,
			prizeDescription: eventRow.prize_description,
			stagesDescription: eventRow.stages_description,
			posterImage: eventRow.poster_image,
			bannerImage: eventRow.banner_image
		}
	};
};
