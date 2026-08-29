import type { Cookies } from '@sveltejs/kit';

export const SESSION_COOKIE_NAME = 'tecnoesis_session';

export function hasActiveSession(cookies: Cookies): boolean {
	return Boolean(cookies.get(SESSION_COOKIE_NAME));
}
