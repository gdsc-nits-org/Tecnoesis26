import { redirect, type Cookies } from '@sveltejs/kit';
import { getSupabaseServerClient, getSupabaseUser, type SupabaseServerClient } from '$lib/supabase';
import type { Profile } from '../../app';

export const getAllowedEmailDomain = () => {
	const domain = process.env.ALLOWED_INSTITUTE_EMAIL_DOMAIN ?? 'nits.ac.in';
	return domain.replace(/^@/, '').toLowerCase();
};

export function isAllowedInstituteEmail(email: string | null | undefined): boolean {
	if (!email) return false;
	const normalized = email.trim().toLowerCase();
	const domain = getAllowedEmailDomain();
	const parts = normalized.split('@');
	const suffix = `.${domain}`;
	return (
		parts.length === 2 &&
		Boolean(parts[0]) &&
		!/\s/.test(normalized) &&
		parts[1].length > suffix.length &&
		parts[1].endsWith(suffix)
	);
}

export async function getCurrentAuth(cookies: Cookies) {
	const supabase = getSupabaseServerClient(cookies);
	const { data: userData } = await supabase.auth.getUser();
	const user = userData.user;
	if (!user) return { supabase, user: null, session: null, profile: null };
	if (!user.email_confirmed_at || !isAllowedInstituteEmail(user.email)) {
		await supabase.auth.signOut({ scope: 'local' });
		return { supabase, user: null, session: null, profile: null };
	}

	const { data: sessionData } = await supabase.auth.getSession();
	const { data: profile } = await supabase
		.from('profiles')
		.select('*')
		.eq('id', user.id)
		.maybeSingle();
	return { supabase, user, session: sessionData.session, profile: profile as Profile | null };
}

export async function hasActiveSession(cookies: Cookies): Promise<boolean> {
	const user = await getSupabaseUser(cookies);
	return Boolean(user);
}

export async function requireAuth(cookies: Cookies, requireProfile = false) {
	const auth = await getCurrentAuth(cookies);

	if (!auth.user) {
		throw redirect(303, '/login');
	}
	if (requireProfile && !auth.profile) {
		throw redirect(303, '/signup/complete');
	}

	return auth;
}

export function getAuthClient(cookies: Cookies): SupabaseServerClient {
	return getSupabaseServerClient(cookies);
}
