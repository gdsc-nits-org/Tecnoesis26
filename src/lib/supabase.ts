import { env } from '$env/dynamic/private';
import { createServerClient } from '@supabase/ssr';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Cookies } from '@sveltejs/kit';

export type SupabaseServerClient = ReturnType<typeof createServerClient>;

const CONFIG_ERROR =
	'Supabase is not configured. Add SUPABASE_URL, SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY to your environment.';

function readSupabaseEnv(name: 'SUPABASE_URL' | 'SUPABASE_ANON_KEY' | 'SUPABASE_SERVICE_ROLE_KEY') {
	const runtimeEnv = typeof process !== 'undefined' ? process.env : {};
	return runtimeEnv[name] ?? (env as Record<string, string | undefined>)[name] ?? undefined;
}

export function getSupabaseEnvironment(options?: {
	requireAnonKey?: boolean;
	requireServiceRoleKey?: boolean;
}): { url: string; anonKey?: string; serviceRoleKey?: string } {
	const { requireAnonKey = true, requireServiceRoleKey = false } = options ?? {};
	const url = readSupabaseEnv('SUPABASE_URL');
	const anonKey = readSupabaseEnv('SUPABASE_ANON_KEY');
	const serviceRoleKey = readSupabaseEnv('SUPABASE_SERVICE_ROLE_KEY');

	if (!url || (requireAnonKey && !anonKey) || (requireServiceRoleKey && !serviceRoleKey)) {
		throw new Error(CONFIG_ERROR);
	}

	return { url, anonKey, serviceRoleKey };
}

export function getSupabaseServerClient(cookies: Cookies): SupabaseServerClient {
	const { url, anonKey } = getSupabaseEnvironment({ requireAnonKey: true, requireServiceRoleKey: false });

	const safeUrl = url;
	const safeAnonKey = anonKey ?? '';

	return createServerClient(safeUrl, safeAnonKey, {
		cookies: {
			getAll: () => cookies.getAll(),
			setAll: (cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }>) => {
				cookiesToSet.forEach(({ name, value, options }) => {
					cookies.set(name, value, { ...(options ?? {}), path: '/', sameSite: 'lax' });
				});
			}
		}
	});
}

export function getSupabaseAdminClient(): SupabaseClient {
	const { url, serviceRoleKey } = getSupabaseEnvironment({
		requireAnonKey: false,
		requireServiceRoleKey: true
	});

	return createClient(url, serviceRoleKey!, {
		auth: {
			persistSession: false,
			autoRefreshToken: false,
			detectSessionInUrl: false
		}
	});
}

export function tryGetSupabaseServerClient(cookies?: Cookies): SupabaseServerClient | null {
	if (!cookies) {
		return null;
	}

	try {
		return getSupabaseServerClient(cookies);
	} catch {
		return null;
	}
}

export async function getSupabaseUser(cookies: Cookies) {
	const supabase = tryGetSupabaseServerClient(cookies);

	if (!supabase) {
		return null;
	}

	const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

	if (sessionError || !sessionData.session) {
		return null;
	}

	const { data, error } = await supabase.auth.getUser();

	if (error || !data.user) {
		return null;
	}

	return data.user;
}
