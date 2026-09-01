import { redirect, type Cookies } from '@sveltejs/kit';
import { getSupabaseUser } from '$lib/supabase';

export async function hasActiveSession(cookies: Cookies): Promise<boolean> {
	const user = await getSupabaseUser(cookies);
	return Boolean(user);
}

export async function requireAuth(cookies: Cookies): Promise<{ user: NonNullable<Awaited<ReturnType<typeof getSupabaseUser>>> }> {
	const user = await getSupabaseUser(cookies);

	if (!user) {
		throw redirect(302, '/auth/login');
	}

	return { user };
}
