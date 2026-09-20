import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getSupabaseServerClient } from '$lib/supabase';
import { isAllowedInstituteEmail } from '$lib/server/auth';
import { safeAuthNext } from '$lib/server/auth-validation';

export const GET: RequestHandler = async ({ url, cookies }) => {
	const recovering = url.searchParams.get('next') === '/reset-password';
	const failurePath = recovering
		? '/reset-password?error=invalid'
		: `/login?error=${encodeURIComponent('Sign-in failed. Please try again.')}`;
	const next = safeAuthNext(url.searchParams.get('next'));
	const code = url.searchParams.get('code');
	if (!code || url.searchParams.has('error')) throw redirect(303, failurePath);

	const supabase = getSupabaseServerClient(cookies);
	const { error } = await supabase.auth.exchangeCodeForSession(code);
	if (error) throw redirect(303, failurePath);

	const { data: userData } = await supabase.auth.getUser();
	const user = userData.user;
	if (!user?.email_confirmed_at || !isAllowedInstituteEmail(user.email)) {
		await supabase.auth.signOut();
		throw redirect(
			303,
			`/signup?error=${encodeURIComponent('Use your institute Google account to continue.')}`
		);
	}
	// Recovery must reach the password form even when the user already has a profile.
	if (recovering) throw redirect(303, '/reset-password');

	const { data: profile } = await supabase
		.from('profiles')
		.select('id')
		.eq('id', user.id)
		.maybeSingle();
	if (profile) throw redirect(303, next);
	throw redirect(303, '/signup/complete');
};
