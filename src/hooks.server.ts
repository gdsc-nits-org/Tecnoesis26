import { redirect, type Handle } from '@sveltejs/kit';
import { getCurrentAuth } from '$lib/server/auth';

export const handle: Handle = async ({ event, resolve }) => {
	const auth = await getCurrentAuth(event.cookies).catch(() => ({
		user: null,
		session: null,
		profile: null
	}));
	event.locals.user = auth.user;
	event.locals.session = auth.session;
	event.locals.profile = auth.profile;

	const pathname = event.url.pathname;
	const publicRoutes = [
		'/login',
		'/signup',
		'/auth',
		'/auth/login',
		'/auth/signup',
		'/auth/callback'
	];
	const isPublic = publicRoutes.some(
		(route) => pathname === route || pathname.startsWith(`${route}/`)
	);
	const isProtected =
		!isPublic &&
		(
			// pathname === '/home' ||
			// pathname.startsWith('/home/') ||
			pathname === '/profile' ||
			pathname.startsWith('/profile/') ||
			pathname.startsWith('/dashboard') ||
			(pathname.includes('/modules/') && pathname.includes('/participate')));

	if (
		auth.user &&
		auth.profile &&
		['/login', '/signup', '/auth', '/auth/login', '/auth/signup'].includes(pathname)
	) {
		throw redirect(303, '/home');
	}
	if (auth.user && !auth.profile && isProtected && pathname !== '/signup/complete') {
		throw redirect(303, '/signup/complete');
	}
	if (!auth.user && isProtected) {
		throw redirect(303, '/login');
	}

	return resolve(event);
};
