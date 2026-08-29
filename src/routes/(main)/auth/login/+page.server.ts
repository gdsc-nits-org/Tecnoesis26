import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { hasActiveSession } from '$lib/server/auth';

export const load: PageServerLoad = async ({ cookies }) => {
	if (hasActiveSession(cookies)) {
		throw redirect(302, '/dashboard');
	}

	return {
		message: 'Sign in to continue.'
	};
};
