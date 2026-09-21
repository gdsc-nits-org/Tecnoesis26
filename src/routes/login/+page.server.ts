import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getSupabaseAdminClient, getSupabaseServerClient } from '$lib/supabase';
import { isAllowedInstituteEmail } from '$lib/server/auth';
import { safeAuthNext } from '$lib/server/auth-validation';

export const load: PageServerLoad = ({ locals }) => {
	if (locals.user && locals.profile) throw redirect(303, '/home');
	return {};
};

export const actions: Actions = {
	default: async ({ request, cookies, url }) => {
		const form = await request.formData();
		const username = String(form.get('username') ?? '')
			.trim()
			.toLowerCase();
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
			if (profileError || !profile || !isAllowedInstituteEmail(profile.institute_email))
				return fail(400, { error: 'Invalid username or password.', username });

			const supabase = getSupabaseServerClient(cookies);
			const { data, error } = await supabase.auth.signInWithPassword({
				email: profile.institute_email,
				password
			});
			if (error) return fail(400, { error: 'Invalid username or password.', username });
			if (!data.user?.email_confirmed_at || !isAllowedInstituteEmail(data.user.email)) {
				await supabase.auth.signOut({ scope: 'local' });
				return fail(400, { error: 'Invalid username or password.', username });
			}
		} catch {
			return fail(503, { error: 'Authentication is temporarily unavailable.', username });
		}

		throw redirect(303, safeAuthNext(url.searchParams.get('next')));
	}
};
