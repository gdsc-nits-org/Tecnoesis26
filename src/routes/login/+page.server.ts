import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getSupabaseAdminClient, getSupabaseServerClient } from '$lib/supabase';

export const load: PageServerLoad = ({ locals }) => {
	if (locals.user && locals.profile) throw redirect(303, '/home');
	return {};
};

export const actions: Actions = {
	default: async ({ request, cookies, url }) => {
		const form = await request.formData();
		const username = String(form.get('username') ?? '')
			.trim().toLowerCase();
		const password = String(form.get('password') ?? '');
		if (!username || !password)
			return fail(400, { error: 'Enter your username and password.', username });

		try {
			const admin = getSupabaseAdminClient();
			const { data: profile, error: profileError } = await admin
				.from('profiles')
				.select('institute_email')
				.eq('username', username)
				.maybeSingle();
			if (profileError || !profile)
				return fail(400, { error: 'Invalid username or password.', username });

			const supabase = getSupabaseServerClient(cookies);
			const { error } = await supabase.auth.signInWithPassword({
				email: profile.institute_email,
				password
			});
			if (error) return fail(400, { error: 'Invalid username or password.', username });
		} catch {
			return fail(503, { error: 'Authentication is temporarily unavailable.', username });
		}

		throw redirect(303, url.searchParams.get('next') || '/home');
	},
	google: async ({ cookies, url }) => {
		try {
			const supabase = getSupabaseServerClient(cookies);
			const { data, error } = await supabase.auth.signInWithOAuth({
				provider: 'google',
				options: {
					redirectTo: `${url.origin}/auth/callback?next=${encodeURIComponent(url.searchParams.get('next') || '/home')}`
				}
			});
			if (error || !data.url) return fail(400, { error: 'Unable to start Google sign-in.' });
			throw redirect(303, data.url);
		} catch (error) {
			if (error && typeof error === 'object' && 'status' in error) throw error;
			return fail(503, { error: 'Authentication is temporarily unavailable.' });
		}
	}
};
