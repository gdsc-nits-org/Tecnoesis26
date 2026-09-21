import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { getSupabaseServerClient } from '$lib/supabase';
import { getAllowedEmailDomain, isAllowedInstituteEmail } from '$lib/server/auth';

export const actions: Actions = {
	default: async ({ request, cookies, url }) => {
		const form = await request.formData();
		const email = String(form.get('email') ?? '')
			.trim()
			.toLowerCase();
		if (!isAllowedInstituteEmail(email) || email.length > 254) {
			return fail(400, {
				error: `Enter your institute email ending in .${getAllowedEmailDomain()}.`,
				email
			});
		}
		try {
			const supabase = getSupabaseServerClient(cookies);
			const { error } = await supabase.auth.resetPasswordForEmail(email, {
				redirectTo: `${url.origin}/auth/callback?next=/reset-password`
			});
			// Keep delivery errors and unknown accounts indistinguishable to the requester.
			// Log only the provider's error code, never an email address or recovery token.
			if (error) console.warn('Supabase recovery request failed:', error.code ?? 'delivery_error');
			return { success: true };
		} catch {
			return fail(503, {
				error: 'Recovery is temporarily unavailable. Please try again later.',
				email
			});
		}
	}
};
