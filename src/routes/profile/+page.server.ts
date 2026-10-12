import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { requireAuth } from '$lib/server/auth';
import {
	fullNameError,
	hostelError,
	normalizePhone,
	phoneError,
	scholarIdError
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
		const scholarId = String(form.get('scholar_id') ?? '').trim();

		// Same rules as signup, so a profile cannot be edited into a state the
		// signup form would have rejected.
		const validationError =
			fullNameError(fullName) ??
			phoneError(phoneNumber) ??
			hostelError(hostelNumber) ??
			scholarIdError(scholarId);
		if (validationError) {
			return fail(400, {
				error: validationError,
				values: { fullName, phoneNumber, hostelNumber, scholarId }
			});
		}

		const { data: updatedProfile, error } = await auth.supabase
			.from('profiles')
			.update({
				full_name: fullName,
				phone_number: phoneNumber,
				hostel_number: hostelNumber,
				scholar_id: scholarId
			})
			.eq('id', auth.user.id)
			.select('full_name, phone_number, hostel_number, scholar_id')
			.single();
		if (error || !updatedProfile) {
			return fail(400, {
				error:
					error?.code === '23505'
						? 'That Scholar ID is already associated with another profile.'
						: 'Could not update your profile. Check the profile update policy in Supabase.',
				values: { fullName, phoneNumber, hostelNumber, scholarId }
			});
		}
		if (updatedProfile.scholar_id !== scholarId) {
			return fail(400, {
				error: 'Supabase is still preventing Scholar ID edits. Apply the latest profile migration.',
				values: { fullName, phoneNumber, hostelNumber, scholarId }
			});
		}

		return {
			success: true,
			values: {
				fullName: updatedProfile.full_name ?? '',
				phoneNumber: updatedProfile.phone_number ?? '',
				hostelNumber: updatedProfile.hostel_number ?? '',
				scholarId: updatedProfile.scholar_id ?? ''
			}
		};
	}
};
