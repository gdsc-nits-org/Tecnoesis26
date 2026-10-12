import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getSupabaseServerClient } from '$lib/supabase';
import { isAllowedInstituteEmail } from '$lib/server/auth';
import { passwordError } from '$lib/server/auth-validation';

const expiredMessage =
	'This reset link is invalid or expired. Request a new link and open it in the same browser.';
type ResetFailure = { error: string; passwordChanged?: boolean };

export const load: PageServerLoad = async ({ cookies, url }) => {
	if (url.searchParams.has('error')) return { canReset: false, error: expiredMessage };
	try {
		const supabase = getSupabaseServerClient(cookies);
		const { data, error } = await supabase.auth.getUser();
		if (error || !data.user?.email_confirmed_at || !isAllowedInstituteEmail(data.user.email)) {
			return { canReset: false, error: expiredMessage };
		}
		return { canReset: true, error: null };
	} catch {
		return {
			canReset: false,
			error: 'Recovery is temporarily unavailable. Please try again later.'
		};
	}
};

export const actions: Actions = {
	default: async ({ request, cookies, url }) => {
		if (url.searchParams.has('error')) return fail<ResetFailure>(401, { error: expiredMessage });
		const form = await request.formData();
		const password = String(form.get('password') ?? '');
		const confirmPassword = String(form.get('confirm_password') ?? '');
		if (password !== confirmPassword)
			return fail<ResetFailure>(400, { error: 'Passwords do not match.' });
		const weakPassword = passwordError(password);
		if (weakPassword) return fail<ResetFailure>(400, { error: weakPassword });
		try {
			const supabase = getSupabaseServerClient(cookies);
			// Verify with Supabase; never authorize a password change from cookie session data alone.
			const { data, error: userError } = await supabase.auth.getUser();
			if (
				userError ||
				!data.user?.email_confirmed_at ||
				!isAllowedInstituteEmail(data.user.email)
			) {
				return fail<ResetFailure>(401, { error: expiredMessage });
			}
			const { error } = await supabase.auth.updateUser({ password });
			if (error) {
				const message =
					error.code === 'same_password'
						? 'Choose a different password from your current password.'
						: 'Could not update your password. Check the password requirements or request a new reset link.';
				return fail<ResetFailure>(400, { error: message });
			}
			// Supabase revokes refresh tokens across sessions; existing access tokens expire normally.
			const { error: signOutError } = await supabase.auth.signOut();
			if (signOutError)
				return fail<ResetFailure>(503, {
					passwordChanged: true,
					error:
						'Your password was updated, but automatic sign-out failed. Please sign out before logging in with your new password.'
				});
		} catch {
			return fail<ResetFailure>(503, {
				error: 'Recovery is temporarily unavailable. Please try again later.'
			});
		}
		throw redirect(303, '/login?reset=success');
	}
};
