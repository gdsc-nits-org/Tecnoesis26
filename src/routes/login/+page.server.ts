import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getSupabaseServerClient } from '$lib/supabase';
import { getAllowedEmailDomain, isAllowedInstituteEmail } from '$lib/server/auth';
import { safeAuthNext } from '$lib/server/auth-validation';

export const load: PageServerLoad = ({ locals }) => {
	if (locals.user && locals.profile) throw redirect(303, '/home');
	return {};
};

export const actions: Actions = {
	default: async ({ request, cookies, url }) => {
		const form = await request.formData();
		const email = String(form.get('email') ?? '')
			.trim()
			.toLowerCase();
		const password = String(form.get('password') ?? '');
		if (!email || !password)
			return fail(400, { error: 'Enter your institute email and password.', email });
		// Reject non-institute addresses before spending a Supabase auth attempt on them.
		if (!isAllowedInstituteEmail(email) || email.length > 254)
			return fail(400, {
				error: `Use your institute email ending in .${getAllowedEmailDomain()}.`,
				email
			});

		try {
			const supabase = getSupabaseServerClient(cookies);
			const { data, error } = await supabase.auth.signInWithPassword({ email, password });
			// One generic message for unknown accounts and wrong passwords alike, so the
			// form never reveals which institute addresses have registered.
			if (error) return fail(400, { error: 'Invalid email or password.', email });
			if (!data.user?.email_confirmed_at || !isAllowedInstituteEmail(data.user.email)) {
				await supabase.auth.signOut({ scope: 'local' });
				return fail(400, { error: 'Invalid email or password.', email });
			}
		} catch {
			return fail(503, { error: 'Authentication is temporarily unavailable.', email });
		}

		throw redirect(303, safeAuthNext(url.searchParams.get('next')));
	}
};
