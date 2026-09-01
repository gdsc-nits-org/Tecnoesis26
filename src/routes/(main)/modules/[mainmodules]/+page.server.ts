import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	return {
		mainmodule: params.mainmodules,
		data: {
			module: params.mainmodules,
			message: 'SSR data for this module is handled directly in SvelteKit server load.'
		}
	};
};
