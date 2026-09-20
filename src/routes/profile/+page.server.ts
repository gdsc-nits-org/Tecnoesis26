import { createHash } from 'node:crypto';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { requireAuth } from '$lib/server/auth';

const maxImageSize = 5 * 1024 * 1024;
const allowedImageTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);

export const load: PageServerLoad = async ({ cookies }) => {
	const auth = await requireAuth(cookies, true);
	return { profile: auth.profile };
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const auth = await requireAuth(cookies, true);
		const form = await request.formData();
		const fullName = String(form.get('full_name') ?? '').trim();
		const phoneNumber = String(form.get('phone_number') ?? '').trim();
		const hostelNumber = String(form.get('hostel_number') ?? '').trim();
		const image = form.get('image');
		let imageUrl = auth.profile!.image_url;

		if (image instanceof File && image.size > 0) {
			if (!allowedImageTypes.has(image.type) || image.size > maxImageSize) {
				return fail(400, { error: 'Profile images must be JPG, PNG, or WebP files under 5 MB.' });
			}
			const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
			const apiKey = process.env.CLOUDINARY_API_KEY;
			const apiSecret = process.env.CLOUDINARY_API_SECRET;
			if (!cloudName || !apiKey || !apiSecret)
				return fail(503, { error: 'Image uploads are not configured.' });
			const timestamp = Math.floor(Date.now() / 1000).toString();
			const folder = 'tecnoesis/profiles';
			const signature = createHash('sha1')
				.update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`)
				.digest('hex');
			const upload = new FormData();
			upload.append('file', image);
			upload.append('api_key', apiKey);
			upload.append('timestamp', timestamp);
			upload.append('folder', folder);
			upload.append('signature', signature);
			const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
				method: 'POST',
				body: upload
			});
			if (!response.ok) return fail(502, { error: 'Image upload failed. Please try again.' });
			const result = (await response.json()) as { secure_url?: string };
			imageUrl = result.secure_url ?? imageUrl;
		}

		const { error } = await auth.supabase
			.from('profiles')
			.update({
				full_name: fullName || null,
				phone_number: phoneNumber || null,
				hostel_number: hostelNumber || null,
				image_url: imageUrl
			})
			.eq('id', auth.user.id);
		if (error) return fail(400, { error: 'Could not update your profile.' });
		return { success: true };
	}
};
