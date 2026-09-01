import { beforeEach, describe, expect, it } from 'vitest';
import type { Cookies } from '@sveltejs/kit';
import { getSupabaseAdminClient, getSupabaseServerClient } from '$lib/supabase';

describe('supabase server client factory', () => {
	beforeEach(() => {
		process.env.SUPABASE_URL = '';
		process.env.SUPABASE_ANON_KEY = '';
		process.env.SUPABASE_SERVICE_ROLE_KEY = '';
	});

	it('throws a helpful error when the public server env is missing', () => {
		const cookies = {
			getAll: () => [],
			set: () => undefined
		} as unknown as Cookies;

		expect(() => getSupabaseServerClient(cookies)).toThrow(/SUPABASE_URL|SUPABASE_ANON_KEY/i);
	});

	it('creates an admin client when the service-role key is provided', () => {
		process.env.SUPABASE_URL = 'https://example.supabase.co';
		process.env.SUPABASE_ANON_KEY = 'anon-key';
		process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-role-key';

		const client = getSupabaseAdminClient();

		expect(client).toBeTruthy();
	});
});
