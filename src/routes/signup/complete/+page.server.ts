import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getSupabaseServerClient } from '$lib/supabase';
import { isAllowedInstituteEmail, requireAuth } from '$lib/server/auth';

const passwordError = (password: string) => {
	if (
		password.length < 8 ||
		!/[A-Z]/.test(password) ||
		!/[a-z]/.test(password) ||
		!/[0-9]/.test(password)
	) {
		return 'Use at least 8 characters with uppercase, lowercase, and a number.';
	}
	return null;
};

export const load: PageServerLoad = async ({ cookies }) => {
	const auth = await requireAuth(cookies);
	if (auth.profile) throw redirect(303, '/home');
	if (!isAllowedInstituteEmail(auth.user.email))
		throw redirect(303, '/signup?error=Institute%20account%20required');
	return { email: auth.user.email };
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const auth = await requireAuth(cookies);
		const form = await request.formData();
		const username = String(form.get('username') ?? '')
			.trim()
			.toLowerCase();
		const scholarId = String(form.get('scholar_id') ?? '').trim();
		const password = String(form.get('password') ?? '');
		const confirmPassword = String(form.get('confirm_password') ?? '');
		if (!/^[a-z0-9_]{3,24}$/.test(username))
			return fail(400, {
				error: 'Username must be 3-24 characters using letters, numbers, or underscores.',
				username,
				scholarId
			});
		if (!scholarId) return fail(400, { error: 'Scholar ID is required.', username, scholarId });
		if (password !== confirmPassword)
			return fail(400, { error: 'Passwords do not match.', username, scholarId });
		const weakPassword = passwordError(password);
		if (weakPassword) return fail(400, { error: weakPassword, username, scholarId });
		if (!isAllowedInstituteEmail(auth.user.email))
			return fail(400, { error: 'Use your institute Google account.', username, scholarId });

		const supabase = getSupabaseServerClient(cookies);
		const { error: passwordUpdateError } = await supabase.auth.updateUser({ password });
		if (passwordUpdateError)
			return fail(400, {
				error: 'Could not set your password. Please try again.',
				username,
				scholarId
			});
		const { error } = await supabase.from('profiles').insert({
			id: auth.user.id,
			username,
			scholar_id: scholarId,
			institute_email: auth.user.email!.toLowerCase(),
			auth_provider: 'google'
		});
		if (error) {
			const duplicate = error.code === '23505';
			return fail(400, {
				error: duplicate
					? 'That username or Scholar ID is already in use.'
					: 'Could not create your profile. Please try again.',
				username,
				scholarId
			});
		}
		throw redirect(303, '/home');
	}
};
