import type { PageServerLoad } from './$types';
import { fetchBackend } from '$lib/server/backend';

export const load: PageServerLoad = async ({ params, fetch }) => {
	const data = await fetchBackend(fetch, `/modules/${encodeURIComponent(params.mainmodules)}`);

	return {
		mainmodule: params.mainmodules,
		data
	};
};
