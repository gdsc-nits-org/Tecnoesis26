import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getSupabaseServerClient } from '$lib/supabase';
import { isAllowedInstituteEmail, requireAuth } from '$lib/server/auth';
import {
	hasVerifiedGoogleIdentity,
	passwordError,
	suggestedFullName
} from '$lib/server/auth-validation';

export const load: PageServerLoad = async ({ cookies }) => {
	const auth = await requireAuth(cookies);
	if (auth.profile) throw redirect(303, '/home');
	if (!isAllowedInstituteEmail(auth.user.email) || !hasVerifiedGoogleIdentity(auth.user)) {
		await auth.supabase.auth.signOut({ scope: 'local' });
		throw redirect(303, '/signup?error=Institute%20account%20required');
	}
	return { email: auth.user.email, fullName: suggestedFullName(auth.user) };
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const auth = await requireAuth(cookies);
		if (auth.profile) throw redirect(303, '/home');
		const form = await request.formData();
		const username = String(form.get('username') ?? '')
			.trim()
			.toLowerCase();
		const fullName = String(form.get('full_name') ?? '').trim();
		const password = String(form.get('password') ?? '');
		const confirmPassword = String(form.get('confirm_password') ?? '');
		if (!/^[a-z0-9_]{3,24}$/.test(username))
			return fail(400, {
				error: 'Username must be 3-24 characters using letters, numbers, or underscores.',
				username,
				fullName
			});
		if (!fullName || fullName.length > 100)
			return fail(400, { error: 'Enter your name using 1-100 characters.', username, fullName });
		if (password !== confirmPassword)
			return fail(400, { error: 'Passwords do not match.', username, fullName });
		const weakPassword = passwordError(password);
		if (weakPassword) return fail(400, { error: weakPassword, username, fullName });
		if (!isAllowedInstituteEmail(auth.user.email) || !hasVerifiedGoogleIdentity(auth.user))
			return fail(403, {
				error: 'Use your verified institute Google account.',
				username,
				fullName
			});

		const supabase = getSupabaseServerClient(cookies);
		const { error: passwordUpdateError } = await supabase.auth.updateUser({ password });
		// Retrying after a duplicate username may reuse the password already set above.
		if (passwordUpdateError && passwordUpdateError.code !== 'same_password')
			return fail(400, {
				error: 'Could not set your password. Please try again.',
				username,
				fullName
			});
		const { error } = await supabase.from('profiles').insert({
			id: auth.user.id,
			username,
			full_name: fullName,
			institute_email: auth.user.email!.toLowerCase(),
			auth_provider: 'google'
		});
		if (error) {
			const duplicate = error.code === '23505';
			return fail(400, {
				error: duplicate
					? 'That username or account is already in use. Choose another username or log in.'
					: 'Could not create your profile. Please try again.',
				username,
				fullName
			});
		}
		throw redirect(303, '/home');
	}
};
