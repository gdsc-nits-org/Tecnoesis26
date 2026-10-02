import { describe, expect, it, vi, beforeEach } from 'vitest';
import type { Cookies } from '@sveltejs/kit';
import * as supabaseModule from '$lib/supabase';
import { load } from './+page.server';

describe('/home +page.server.ts load', () => {
	const mockCookies = {} as Cookies;

	beforeEach(() => {
		vi.restoreAllMocks();
	});

	it('returns sponsors from supabase admin client', async () => {
		const mockSponsors = [
			{
				sponsor_name: 'COGG',
				sponsor_img: 'https://example.com/cogg.png'
			}
		];

		const mockQuery = {
			select: vi.fn().mockReturnThis(),
			order: vi.fn().mockResolvedValue({ data: mockSponsors, error: null })
		};

		const mockClient = {
			from: vi.fn().mockReturnValue(mockQuery)
		};

		vi.spyOn(supabaseModule, 'getSupabaseAdminClient').mockReturnValue(mockClient as any);

		const result = (await load({
			cookies: mockCookies
		} as any)) as { sponsors: any[] };

		expect(result.sponsors).toEqual(mockSponsors);
		expect(mockClient.from).toHaveBeenCalledWith('sponsors');
		expect(mockQuery.select).toHaveBeenCalledWith('sponsor_name, sponsor_img');
	});

	it('filters out invalid rows missing name or img', async () => {
		const rawRows = [
			{ sponsor_name: 'Valid Sponsor', sponsor_img: 'https://example.com/logo.png' },
			{ sponsor_name: null, sponsor_img: 'https://example.com/logo.png' },
			{ sponsor_name: 'No Img', sponsor_img: undefined }
		];

		const mockQuery = {
			select: vi.fn().mockReturnThis(),
			order: vi.fn().mockResolvedValue({ data: rawRows, error: null })
		};

		const mockClient = {
			from: vi.fn().mockReturnValue(mockQuery)
		};

		vi.spyOn(supabaseModule, 'getSupabaseAdminClient').mockReturnValue(mockClient as any);

		const result = (await load({
			cookies: mockCookies
		} as any)) as { sponsors: any[] };

		expect(result.sponsors).toEqual([
			{ sponsor_name: 'Valid Sponsor', sponsor_img: 'https://example.com/logo.png' }
		]);
	});

	it('falls back to server client when admin client throws', async () => {
		vi.spyOn(supabaseModule, 'getSupabaseAdminClient').mockImplementation(() => {
			throw new Error('Service key missing');
		});

		const mockSponsors = [
			{ sponsor_name: 'Fallback Sponsor', sponsor_img: 'https://example.com/fallback.png' }
		];

		const mockQuery = {
			select: vi.fn().mockReturnThis(),
			order: vi.fn().mockResolvedValue({ data: mockSponsors, error: null })
		};

		const mockClient = {
			from: vi.fn().mockReturnValue(mockQuery)
		};

		vi.spyOn(supabaseModule, 'tryGetSupabaseServerClient').mockReturnValue(mockClient as any);

		const result = (await load({
			cookies: mockCookies
		} as any)) as { sponsors: any[] };

		expect(result.sponsors).toEqual(mockSponsors);
	});

	it('returns empty sponsors array on supabase query error', async () => {
		const mockQuery = {
			select: vi.fn().mockReturnThis(),
			order: vi.fn().mockResolvedValue({ data: null, error: { message: 'Table not found' } })
		};

		const mockClient = {
			from: vi.fn().mockReturnValue(mockQuery)
		};

		vi.spyOn(supabaseModule, 'getSupabaseAdminClient').mockReturnValue(mockClient as any);

		const result = (await load({
			cookies: mockCookies
		} as any)) as { sponsors: any[] };

		expect(result.sponsors).toEqual([]);
	});

	it('returns empty sponsors array when no supabase client is available', async () => {
		vi.spyOn(supabaseModule, 'getSupabaseAdminClient').mockImplementation(() => {
			throw new Error('No admin');
		});
		vi.spyOn(supabaseModule, 'tryGetSupabaseServerClient').mockReturnValue(null);

		const result = (await load({
			cookies: mockCookies
		} as any)) as { sponsors: any[] };

		expect(result.sponsors).toEqual([]);
	});
});
