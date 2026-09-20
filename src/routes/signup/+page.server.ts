import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getSupabaseServerClient } from '$lib/supabase';

export const load: PageServerLoad = ({ locals }) => {
	if (locals.user && locals.profile) throw redirect(303, '/home');
	if (locals.user && !locals.profile) throw redirect(303, '/signup/complete');
	return {};
};

export const actions: Actions = {
	google: async ({ cookies, url }) => {
		try {
			const supabase = getSupabaseServerClient(cookies);
			const { data, error } = await supabase.auth.signInWithOAuth({
				provider: 'google',
				options: { redirectTo: `${url.origin}/auth/callback?next=/signup/complete` }
			});
			if (error || !data.url) return fail(400, { error: 'Unable to start Google sign-up.' });
			throw redirect(303, data.url);
		} catch (error) {
			if (error && typeof error === 'object' && 'status' in error) throw error;
			return fail(503, { error: 'Authentication is temporarily unavailable.' });
		}
	}
};
