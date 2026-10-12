import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getSupabaseServerClient } from '$lib/supabase';

// POST only. A GET route would be followed by SvelteKit's hover preloading and
// by link prefetchers, signing people out just for pointing at the button.
export const POST: RequestHandler = async ({ cookies }) => {
	try {
		const supabase = getSupabaseServerClient(cookies);
		await supabase.auth.signOut();
	} catch {
		// Clearing the session locally is what matters; a provider outage must not
		// leave someone stuck looking signed in.
	}
	throw redirect(303, '/');
};
