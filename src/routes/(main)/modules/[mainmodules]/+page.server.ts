import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { modules } from '$lib/data/modules';

export const load: PageServerLoad = async ({ params }) => {
	const module = modules.find((item) => item.slug === params.mainmodules);
	if (!module) error(404, 'Module not found');

	return {
		module,
		moduleIndex: modules.indexOf(module)
	};
};
