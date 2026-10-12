import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { RequestEvent } from '@sveltejs/kit';
import type { User } from '@supabase/supabase-js';
import { passwordError, safeAuthNext, suggestedFullName } from './auth-validation';

const mocks = vi.hoisted(() => {
	const query = { select: vi.fn(), eq: vi.fn(), maybeSingle: vi.fn(), insert: vi.fn() };
	const auth = {
		getUser: vi.fn(),
		getSession: vi.fn(),
		exchangeCodeForSession: vi.fn(),
		updateUser: vi.fn(),
		signOut: vi.fn(),
		signInWithPassword: vi.fn(),
		resetPasswordForEmail: vi.fn(),
		signInWithOAuth: vi.fn()
	};
	return { query, auth, client: { auth, from: vi.fn(() => query) } };
});
vi.mock('$lib/supabase', () => ({
	getSupabaseServerClient: () => mocks.client,
	getSupabaseAdminClient: () => mocks.client,
	getSupabaseUser: vi.fn()
}));

import { isAllowedInstituteEmail } from './auth';
import { actions as forgotActions } from '../../routes/forgot-password/+page.server';
import {
	actions as resetActions,
	load as resetLoad
} from '../../routes/reset-password/+page.server';
import { actions as loginActions } from '../../routes/login/+page.server';
import {
	actions as signupActions,
	load as signupLoad
} from '../../routes/signup/complete/+page.server';
import { GET as callback } from '../../routes/auth/callback/+server';
import { handle } from '../../hooks.server';

const user: User = {
	id: 'student-id',
	app_metadata: { provider: 'google', providers: ['google'] },
	aud: 'authenticated',
	created_at: '2026-01-01',
	email: 'dhruba_ug_24@civil.nits.ac.in',
	email_confirmed_at: '2026-01-01',
	identities: [
		{ id: 'google-id', identity_id: 'identity-id', user_id: 'student-id', provider: 'google' }
	],
	user_metadata: { full_name: 'Student Name' }
};

type AuthRoute =
	'/forgot-password' | '/reset-password' | '/login' | '/signup/complete' | '/auth/callback';
function event<T extends AuthRoute | `${AuthRoute}?${string}`>(
	path: T,
	values: Record<string, string> = {}
) {
	const url = new URL(path, 'http://localhost:5173');
	return {
		url,
		cookies: {},
		locals: {},
		request: new Request(url, { method: 'POST', body: new URLSearchParams(values) })
	} as unknown as RequestEvent<
		Record<string, never>,
		T extends `${infer Route extends AuthRoute}?${string}` ? Route : Extract<T, AuthRoute>
	>;
}

beforeEach(() => {
	vi.clearAllMocks();
	vi.stubEnv('ALLOWED_INSTITUTE_EMAIL_DOMAIN', 'nits.ac.in');
	mocks.query.select.mockReturnValue(mocks.query);
	mocks.query.eq.mockReturnValue(mocks.query);
	mocks.query.maybeSingle.mockResolvedValue({
		data: { id: user.id, institute_email: user.email },
		error: null
	});
	mocks.query.insert.mockResolvedValue({ error: null });
	mocks.auth.getUser.mockResolvedValue({ data: { user }, error: null });
	mocks.auth.getSession.mockResolvedValue({ data: { session: { user } }, error: null });
	mocks.auth.exchangeCodeForSession.mockResolvedValue({ data: { user }, error: null });
	mocks.auth.signInWithPassword.mockResolvedValue({ data: { user }, error: null });
	mocks.auth.updateUser.mockResolvedValue({ data: { user }, error: null });
	mocks.auth.signOut.mockResolvedValue({ error: null });
	mocks.auth.resetPasswordForEmail.mockResolvedValue({ data: {}, error: null });
});

describe('auth validation', () => {
	it.each([
		'student@gmail.com',
		'student@nits.ac.in',
		'student@fakenits.ac.in',
		'student@.nits.ac.in',
		'student@nits.ac.in.evil.com',
		'student@civil.nits.ac.in.evil.com',
		'a@b@civil.nits.ac.in',
		'@civil.nits.ac.in',
		'a b@civil.nits.ac.in',
		'no-at.civil.nits.ac.in'
	])('rejects %s', (email) => {
		expect(isAllowedInstituteEmail(email)).toBe(false);
	});
	it.each([
		'dhruba_ug_24@civil.nits.ac.in',
		'student@cse.nits.ac.in',
		'any_name+tag@any-department.nits.ac.in',
		'student@research.civil.nits.ac.in',
		' Student@CIVIL.NITS.AC.IN '
	])('accepts any institute subdomain: %s', (email) => {
		expect(isAllowedInstituteEmail(email)).toBe(true);
	});
	it.each([
		'https://evil.com',
		'//evil.com',
		'/home/../../auth/callback',
		'/home\\evil',
		'/home/%2f%2fevil',
		'/home/%',
		'/home/%0aevil',
		'/reset-password'
	])('blocks unsafe next %s', (next) => {
		expect(safeAuthNext(next)).toBe('/home');
	});
	it('preserves a safe app destination', () => {
		expect(safeAuthNext('/profile?tab=details')).toBe('/profile?tab=details');
	});
	it('requires password strength and bounds', () => {
		expect(passwordError('Student123')).toBeNull();
		for (const password of [
			'short',
			'alllowercase123',
			'ALLUPPER123',
			'NoNumbersHere',
			'a'.repeat(129)
		]) {
			expect(passwordError(password)).not.toBeNull();
		}
	});
	it('uses Google name with an email fallback', () => {
		expect(suggestedFullName(user)).toBe('Student Name');
		expect(
			suggestedFullName({ ...user, email: 'first.last@civil.nits.ac.in', user_metadata: {} })
		).toBe('first last');
	});
});

describe('password recovery', () => {
	it('requests a reset through Supabase with the callback destination', async () => {
		expect(
			await forgotActions.default(
				event('/forgot-password', { email: ' Student@CIVIL.NITS.AC.IN ' })
			)
		).toEqual({ success: true });
		expect(mocks.auth.resetPasswordForEmail).toHaveBeenCalledWith('student@civil.nits.ac.in', {
			redirectTo: 'http://localhost:5173/auth/callback?next=/reset-password'
		});
	});
	it('rejects non-institute recovery requests before sending mail', async () => {
		expect(
			await forgotActions.default(event('/forgot-password', { email: 'student@gmail.com' }))
		).toMatchObject({ status: 400 });
		expect(mocks.auth.resetPasswordForEmail).not.toHaveBeenCalled();
	});
	it('does not reveal account-specific delivery errors', async () => {
		const warning = vi.spyOn(console, 'warn').mockImplementation(() => {});
		mocks.auth.resetPasswordForEmail.mockResolvedValue({
			error: { code: 'email_address_not_authorized' }
		});
		expect(await forgotActions.default(event('/forgot-password', { email: user.email! }))).toEqual({
			success: true
		});
		warning.mockRestore();
	});
	it('denies anonymous password updates', async () => {
		mocks.auth.getUser.mockResolvedValue({ data: { user: null }, error: null });
		expect(
			await resetActions.default(
				event('/reset-password', { password: 'Student123', confirm_password: 'Student123' })
			)
		).toMatchObject({ status: 401 });
		expect(mocks.auth.updateUser).not.toHaveBeenCalled();
	});
	it('rejects a non-institute session', async () => {
		mocks.auth.getUser.mockResolvedValue({
			data: { user: { ...user, email: 'student@gmail.com' } },
			error: null
		});
		expect(
			await resetActions.default(
				event('/reset-password', { password: 'Student123', confirm_password: 'Student123' })
			)
		).toMatchObject({ status: 401 });
		expect(mocks.auth.updateUser).not.toHaveBeenCalled();
	});
	it('rejects mismatched passwords without updating', async () => {
		expect(
			await resetActions.default(
				event('/reset-password', { password: 'Student123', confirm_password: 'Student456' })
			)
		).toMatchObject({ status: 400 });
		expect(mocks.auth.updateUser).not.toHaveBeenCalled();
	});
	it('updates the password and signs out before returning to login', async () => {
		await expect(
			resetActions.default(
				event('/reset-password', { password: 'Student123', confirm_password: 'Student123' })
			)
		).rejects.toMatchObject({ status: 303, location: '/login?reset=success' });
		expect(mocks.auth.updateUser).toHaveBeenCalledWith({ password: 'Student123' });
		expect(mocks.auth.signOut).toHaveBeenCalledOnce();
	});
	it('does not claim success when Supabase rejects the new password', async () => {
		mocks.auth.updateUser.mockResolvedValue({ error: { code: 'same_password' } });
		expect(
			await resetActions.default(
				event('/reset-password', { password: 'Student123', confirm_password: 'Student123' })
			)
		).toMatchObject({ status: 400 });
		expect(mocks.auth.signOut).not.toHaveBeenCalled();
	});
	it('hides the form for an invalid callback even if previously logged in', async () => {
		expect(
			await resetLoad(event('/reset-password?error=invalid') as Parameters<typeof resetLoad>[0])
		).toMatchObject({ canReset: false });
	});
});

describe('auth callbacks and login', () => {
	it('sends a completed profile to password recovery', async () => {
		await expect(
			callback(event('/auth/callback?code=valid&next=/reset-password'))
		).rejects.toMatchObject({ location: '/reset-password' });
	});
	it('handles an expired recovery code without falling back to an old session', async () => {
		mocks.auth.exchangeCodeForSession.mockResolvedValue({ error: { code: 'bad_code' } });
		await expect(
			callback(event('/auth/callback?code=expired&next=/reset-password'))
		).rejects.toMatchObject({ location: '/reset-password?error=invalid' });
		expect(mocks.auth.getUser).not.toHaveBeenCalled();
	});
	it('blocks external callback destinations', async () => {
		await expect(
			callback(event('/auth/callback?code=valid&next=https://evil.com'))
		).rejects.toMatchObject({ location: '/home' });
	});
	it('sends first-time Google users to profile completion', async () => {
		mocks.query.maybeSingle.mockResolvedValue({ data: null, error: null });
		await expect(callback(event('/auth/callback?code=valid'))).rejects.toMatchObject({
			location: '/signup/complete'
		});
	});
	it('does not let hooks intercept a recovery callback for an existing user', async () => {
		const resolve = vi.fn(async () => new Response('callback'));
		await handle({ event: event('/auth/callback?code=valid&next=/reset-password'), resolve });
		expect(resolve).toHaveBeenCalledOnce();
	});
	it('normalizes the email and authenticates through Supabase', async () => {
		await expect(
			loginActions.default(
				event('/login?next=https://evil.com', {
					email: `  ${user.email!.toUpperCase()} `,
					password: 'Student123'
				})
			)
		).rejects.toMatchObject({ location: '/home' });
		expect(mocks.auth.signInWithPassword).toHaveBeenCalledWith({
			email: user.email,
			password: 'Student123'
		});
	});
	it('rejects non-institute emails before calling Supabase', async () => {
		mocks.auth.signInWithPassword.mockClear();
		const outside = await loginActions.default(
			event('/login', { email: 'someone@gmail.com', password: 'Student123' })
		);
		expect(outside).toMatchObject({ status: 400 });
		expect(mocks.auth.signInWithPassword).not.toHaveBeenCalled();
	});
	it('returns the same error for unknown accounts and wrong passwords', async () => {
		mocks.auth.signInWithPassword.mockResolvedValue({ error: { code: 'invalid_credentials' } });
		const wrong = await loginActions.default(
			event('/login', { email: user.email!, password: 'Wrong123' })
		);
		expect(wrong).toMatchObject({ status: 400, data: { error: 'Invalid email or password.' } });
	});
	it('never asks for a username', async () => {
		const missing = await loginActions.default(
			event('/login', { username: 'student', password: 'Student123' })
		);
		expect(missing).toMatchObject({ status: 400 });
	});
});

describe('Google profile completion', () => {
	beforeEach(() => mocks.query.maybeSingle.mockResolvedValue({ data: null, error: null }));
	const details = {
		full_name: 'Edited Name',
		phone_number: '9876543210',
		hostel_number: 'Kapili',
		gender: 'male',
		scholar_id: '2112050',
		password: 'Student123',
		confirm_password: 'Student123'
	};
	it('autofills the name from the verified account', async () => {
		expect(
			await signupLoad(event('/signup/complete') as Parameters<typeof signupLoad>[0])
		).toMatchObject({ email: user.email, fullName: 'Student Name' });
	});
	it('saves the editable name and server-verified email without storing passwords in profiles', async () => {
		await expect(
			signupActions.default(
				event('/signup/complete', { ...details, institute_email: 'attacker@gmail.com' })
			)
		).rejects.toMatchObject({ location: '/home' });
		expect(mocks.query.insert).toHaveBeenCalledWith({
			id: user.id,
			full_name: 'Edited Name',
			institute_email: user.email,
			phone_number: '9876543210',
			hostel_number: 'Kapili',
			gender: 'male',
			scholar_id: '2112050',
			auth_provider: 'google'
		});
		expect(mocks.auth.updateUser).toHaveBeenCalledWith({ password: 'Student123' });
	});
	it('returns a recoverable duplicate scholar ID error without returning passwords', async () => {
		mocks.query.insert.mockResolvedValue({ error: { code: '23505' } });
		const result = await signupActions.default(event('/signup/complete', details));
		expect(result).toMatchObject({
			status: 400,
			data: { scholarId: '2112050', fullName: 'Edited Name' }
		});
		expect(JSON.stringify(result)).not.toContain('Student123');
	});
	it('requires a verified Google identity for onboarding', async () => {
		mocks.auth.getUser.mockResolvedValue({
			data: { user: { ...user, identities: [{ provider: 'email' }] } },
			error: null
		});
		expect(await signupActions.default(event('/signup/complete', details))).toMatchObject({
			status: 403
		});
		expect(mocks.auth.updateUser).not.toHaveBeenCalled();
	});
	it('allows retrying profile creation with the already-set password', async () => {
		mocks.auth.updateUser.mockResolvedValue({ error: { code: 'same_password' } });
		await expect(signupActions.default(event('/signup/complete', details))).rejects.toMatchObject({
			location: '/home'
		});
		expect(mocks.query.insert).toHaveBeenCalledOnce();
	});
});
