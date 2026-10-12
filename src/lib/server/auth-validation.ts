import type { User } from '@supabase/supabase-js';
import { GENDER_OPTIONS } from '$lib/auth-options';

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

const GENDER_VALUES = new Set(GENDER_OPTIONS.map((option) => option.value));

export function fullNameError(fullName: string): string | null {
	if (!fullName) return 'Enter your full name.';
	if (fullName.length > 100) return 'Enter your name using 1-100 characters.';
	return null;
}

/**
 * Accepts what people actually type - spaces, dashes, a +91 country code - and
 * reduces it to the bare 10 digits we store. Returns '' when nothing usable is
 * left, so the caller reports a single clear error.
 */
export function normalizePhone(raw: string): string {
	const digits = raw.replace(/\D/g, '');
	if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
	if (digits.length === 11 && digits.startsWith('0')) return digits.slice(1);
	return digits;
}

export function phoneError(phone: string): string | null {
	if (!phone) return 'Enter your 10-digit phone number.';
	if (!/^\d{10}$/.test(phone)) return 'Phone number must be exactly 10 digits.';
	return null;
}

export function scholarIdError(scholarId: string): string | null {
	if (!scholarId) return 'Enter your scholar ID.';
	if (!/^[A-Za-z0-9/-]{4,20}$/.test(scholarId))
		return 'Scholar ID must be 4-20 characters using letters, numbers, hyphens, or slashes.';
	return null;
}

export function hostelError(hostel: string): string | null {
	if (!hostel) return 'Enter your hostel.';
	if (hostel.length > 40) return 'Hostel must be 40 characters or fewer.';
	return null;
}

export function genderError(gender: string): string | null {
	if (!gender) return 'Select your gender.';
	if (!GENDER_VALUES.has(gender)) return 'Select a valid gender option.';
	return null;
}
