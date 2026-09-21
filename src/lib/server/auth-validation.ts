import type { User } from '@supabase/supabase-js';

export function passwordError(password: string): string | null {
	if (password.length > 128) return 'Use a password with no more than 128 characters.';
	if (
		password.length < 8 ||
		!/[A-Z]/.test(password) ||
		!/[a-z]/.test(password) ||
		!/[0-9]/.test(password)
	) {
		return 'Use at least 8 characters with uppercase, lowercase, and a number.';
	}
	return null;
}

// Restrict post-login navigation to app destinations, never arbitrary redirect URLs.
export function safeAuthNext(next: string | null): string {
	if (!next || !/^\/(home|profile|dashboard|modules)(\/|\?|$)/.test(next)) return '/home';
	try {
		const decoded = decodeURIComponent(next);
		if (/[\\\s]/.test(decoded) || decoded.includes('//')) return '/home';
		const target = new URL(next, 'https://app.invalid');
		if (target.origin !== 'https://app.invalid' || target.pathname.includes('..')) return '/home';
		if (!/^\/(home|profile|dashboard|modules)(\/|$)/.test(target.pathname)) return '/home';
		return target.pathname + target.search;
	} catch {
		return '/home';
	}
}

export function hasVerifiedGoogleIdentity(user: User): boolean {
	return Boolean(
		user.email_confirmed_at && user.identities?.some((identity) => identity.provider === 'google')
	);
}

export function suggestedFullName(user: User): string {
	const googleName = user.user_metadata?.full_name ?? user.user_metadata?.name;
	if (typeof googleName === 'string' && googleName.trim()) return googleName.trim().slice(0, 100);
	return (user.email?.split('@')[0] ?? '').replace(/[._-]+/g, ' ').slice(0, 100);
}
