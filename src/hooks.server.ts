import { redirect, type Handle } from '@sveltejs/kit';
import { hasActiveSession } from '$lib/server/auth';

export const handle: Handle = async ({ event, resolve }) => {
	const { cookies, url } = event;
	const pathname = url.pathname;

	const isAuthRoute = pathname === '/auth' || pathname.startsWith('/auth/');
	const isDashboardRoute = pathname === '/dashboard' || pathname.startsWith('/dashboard/');
	const isModuleParticipateRoute = pathname.includes('/modules/') && pathname.includes('/participate');

	if (isAuthRoute || isDashboardRoute || isModuleParticipateRoute) {
		const hasSession = await hasActiveSession(cookies);

		if (isAuthRoute && hasSession) {
			throw redirect(302, '/dashboard');
		}

		if (isDashboardRoute && !hasSession) {
			throw redirect(302, '/auth/login');
		}

		if (isModuleParticipateRoute && !hasSession) {
			throw redirect(302, '/auth/login');
		}
	}

	return resolve(event);
};
