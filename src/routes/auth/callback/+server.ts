import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getSupabaseServerClient } from '$lib/supabase';
import { isAllowedInstituteEmail } from '$lib/server/auth';

export const GET: RequestHandler = async ({ url, cookies }) => {
	const next = url.searchParams.get('next') || '/home';
	const code = url.searchParams.get('code');
	if (!code)
		throw redirect(
			303,
			`/login?error=${encodeURIComponent('Google sign-in was cancelled or failed.')}`
		);

	const supabase = getSupabaseServerClient(cookies);
	const { error } = await supabase.auth.exchangeCodeForSession(code);
	if (error)
		throw redirect(
			303,
			`/login?error=${encodeURIComponent('Google sign-in was cancelled or failed.')}`
		);

	const { data: userData } = await supabase.auth.getUser();
	const user = userData.user;
	if (!user || !isAllowedInstituteEmail(user.email)) {
		await supabase.auth.signOut();
		throw redirect(
			303,
			`/signup?error=${encodeURIComponent('Use your institute Google account to continue.')}`
		);
	}

	const { data: profile } = await supabase
		.from('profiles')
		.select('id')
		.eq('id', user.id)
		.maybeSingle();
	if (profile) throw redirect(303, '/home');
	throw redirect(303, '/signup/complete');
};
