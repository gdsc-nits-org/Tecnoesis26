import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { requireAuth } from '$lib/server/auth';
import { getSupabaseAdminClient } from '$lib/supabase';

const allowedSizes = new Set(['S', 'M', 'L', 'XL', 'XXL']);

export const load: PageServerLoad = async ({ cookies }) => {
	const { profile } = await requireAuth(cookies, true);
	const email = profile!.institute_email.trim().toLowerCase();
	const { data: merchRecord, error } = await getSupabaseAdminClient()
		.from('merch')
		.select('tecno, spark, size, opted_in')
		.eq('email', email)
		.maybeSingle();

	if (error) {
		console.error('Could not load merch opt-in:', error.message);
		return { merchRecord: null };
	}

	return {
		merchRecord: merchRecord
			? {
					choice:
						merchRecord.tecno && merchRecord.spark ? 'Both' : merchRecord.spark ? 'Spark' : 'Tecno',
					size: merchRecord.size,
					optedIn: merchRecord.opted_in ?? false
				}
			: null
	};
};

export const actions: Actions = {
	optIn: async ({ request, locals }) => {
		const profile = locals.profile;
		if (!locals.user || !profile) return fail(401, { error: 'Sign in to opt in for merch.' });

		const formData = await request.formData();
		const choice = String(formData.get('shirt_choice') ?? '');
		const size = String(formData.get('size') ?? '');

		if (!['Tecno', 'Spark', 'Both'].includes(choice)) {
			return fail(400, { error: 'Choose Tecno, Spark, or Both.' });
		}
		if (!allowedSizes.has(size)) return fail(400, { error: 'Choose a valid shirt size.' });

		const fullName = profile.full_name?.trim() || null;
		const email = profile.institute_email.trim().toLowerCase();
		const phone = profile.phone_number?.trim() || null;
		const hostel = profile.hostel_number?.trim() || null;
		const gender = profile.gender;

		if (phone && !/^\d{10}$/.test(phone)) {
			return fail(400, {
				error: 'Your profile phone number must contain 10 digits. Update it in your profile.'
			});
		}

		const { error } = await getSupabaseAdminClient()
			.from('merch')
			.upsert(
				{
					name: fullName,
					email,
					phone: phone ? Number(phone) : null,
					hostel,
					gender,
					size,
					tecno: choice === 'Tecno' || choice === 'Both',
					spark: choice === 'Spark' || choice === 'Both',
					opted_in: true
				},
				{ onConflict: 'email' }
			);

		if (error) {
			console.error('Merch opt-in insert failed:', error.message);
			return fail(500, { error: 'Could not save your merch opt-in. Please try again.' });
		}

		return {
			success: true,
			message: 'Your merch details have been saved.',
			choice,
			size
		};
	}
};
