import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { hasActiveSession } from '$lib/server/auth';

export const load: PageServerLoad = async ({ cookies }) => {
	if (!hasActiveSession(cookies)) {
		throw redirect(302, '/auth/login');
	}

	return {
		user: 'Authenticated user'
	};
};
