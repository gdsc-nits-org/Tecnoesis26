// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

type User = {
	id: string;
	email?: string | null;
	phone?: string | null;
	role?: string | null;
	[user: string]: unknown;
};

type Session = {
	access_token: string;
	refresh_token: string;
	user: AppUser | null;
	expires_at?: number | null;
	[sessionKey: string]: unknown;
};

declare global {
	namespace App {
		interface Error {
			message: string;
		}

		interface Locals {
			user?: User | null;
			session?: Session | null;
			[key: string]: unknown;
		}

		interface PageData {
			user?: AppUser | null;
			session?: AppSession | null;
			[key: string]: unknown;
		}

		// interface PageState {}
		// interface Platform {}
	}
}

export {};
