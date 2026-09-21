// Shared between the signup form (client) and validation (server), so this must
// stay outside $lib/server - SvelteKit refuses to bundle server-only modules
// into client code.
export type GenderOption = { value: string; label: string };

export const GENDER_OPTIONS: GenderOption[] = [
	{ value: 'male', label: 'Male' },
	{ value: 'female', label: 'Female' },
	{ value: 'other', label: 'Other' },
	{ value: 'prefer_not_to_say', label: 'Prefer not to say' }
];
