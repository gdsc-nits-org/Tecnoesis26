import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { requireAuth } from '$lib/server/auth';
import {
	fullNameError,
	hostelError,
	normalizePhone,
	phoneError
} from '$lib/server/auth-validation';

export const load: PageServerLoad = async ({ cookies }) => {
	const auth = await requireAuth(cookies, true);
	return { profile: auth.profile };
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const auth = await requireAuth(cookies, true);
		const form = await request.formData();
		const fullName = String(form.get('full_name') ?? '').trim();
		const phoneNumber = normalizePhone(String(form.get('phone_number') ?? ''));
		const hostelNumber = String(form.get('hostel_number') ?? '').trim();

		// Same rules as signup, so a profile cannot be edited into a state the
		// signup form would have rejected.
		const validationError =
			fullNameError(fullName) ?? phoneError(phoneNumber) ?? hostelError(hostelNumber);
		if (validationError) return fail(400, { error: validationError });

		const { error } = await auth.supabase
			.from('profiles')
			.update({
				full_name: fullName,
				phone_number: phoneNumber,
				hostel_number: hostelNumber
			})
			.eq('id', auth.user.id);
		if (error) return fail(400, { error: 'Could not update your profile.' });
		return { success: true };
	}
};
