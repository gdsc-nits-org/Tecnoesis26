import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	return {
		mainmodule: params.mainmodules,
		submodule: params.submodules,
		data: {
			mainmodule: params.mainmodules,
			submodule: params.submodules,
			message: 'SSR data for this submodule is handled directly in SvelteKit server load.'
		}
	};
};
