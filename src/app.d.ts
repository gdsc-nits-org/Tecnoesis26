// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

import type { Session, User } from '@supabase/supabase-js';

export type Profile = {
	id: string;
	/** Legacy: kept for accounts created before email login. No longer collected. */
	username: string | null;
	scholar_id: string | null;
	institute_email: string;
	full_name: string | null;
	phone_number: string | null;
	hostel_number: string | null;
	gender: string | null;
	image_url: string | null;
	auth_provider: string;
	created_at: string;
	updated_at: string;
};

declare global {
	namespace App {
		interface Error {
			message: string;
		}

		interface Locals {
			user: User | null;
			session: Session | null;
			profile: Profile | null;
		}

		interface PageData {
			user?: User | null;
			session?: Session | null;
			profile?: Profile | null;
		}

		// interface PageState {}
		// interface Platform {}
	}
}

export {};
