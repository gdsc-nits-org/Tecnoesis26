import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getSupabaseServerClient } from '$lib/supabase';
import { isAllowedInstituteEmail, requireAuth } from '$lib/server/auth';
import {
	fullNameError,
	genderError,
	hasVerifiedGoogleIdentity,
	hostelError,
	normalizePhone,
	passwordError,
	phoneError,
	scholarIdError,
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
		const fullName = String(form.get('full_name') ?? '').trim();
		const phoneNumber = normalizePhone(String(form.get('phone_number') ?? ''));
		const hostelNumber = String(form.get('hostel_number') ?? '').trim();
		const gender = String(form.get('gender') ?? '').trim();
		const scholarId = String(form.get('scholar_id') ?? '')
			.trim()
			.toUpperCase();
		const password = String(form.get('password') ?? '');
		const confirmPassword = String(form.get('confirm_password') ?? '');

		// Echo everything the user typed back to the form so a single bad field
		// never clears the other five.
		const entered = { fullName, phoneNumber, hostelNumber, gender, scholarId };

		const validationError =
			fullNameError(fullName) ??
			phoneError(phoneNumber) ??
			hostelError(hostelNumber) ??
			genderError(gender) ??
			scholarIdError(scholarId);
		if (validationError) return fail(400, { error: validationError, ...entered });

		if (password !== confirmPassword)
			return fail(400, { error: 'Passwords do not match.', ...entered });
		const weakPassword = passwordError(password);
		if (weakPassword) return fail(400, { error: weakPassword, ...entered });

		if (!isAllowedInstituteEmail(auth.user.email) || !hasVerifiedGoogleIdentity(auth.user))
			return fail(403, { error: 'Use your verified institute Google account.', ...entered });

		const supabase = getSupabaseServerClient(cookies);
		const { error: passwordUpdateError } = await supabase.auth.updateUser({ password });
		// Retrying after a duplicate scholar ID may reuse the password already set above.
		if (passwordUpdateError && passwordUpdateError.code !== 'same_password')
			return fail(400, { error: 'Could not set your password. Please try again.', ...entered });

		const { error } = await supabase.from('profiles').insert({
			id: auth.user.id,
			full_name: fullName,
			institute_email: auth.user.email!.toLowerCase(),
			phone_number: phoneNumber,
			hostel_number: hostelNumber,
			gender,
			scholar_id: scholarId,
			auth_provider: 'google'
		});
		if (error) {
			const duplicate = error.code === '23505';
			return fail(400, {
				error: duplicate
					? 'That scholar ID is already registered. Check the number, or log in if the account is yours.'
					: 'Could not create your profile. Please try again.',
				...entered
			});
		}
		throw redirect(303, '/home');
	}
};
