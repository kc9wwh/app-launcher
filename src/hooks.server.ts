import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const session = event.cookies.get('session');

	if (session) {
		try {
			event.locals.user = JSON.parse(session);
			event.locals.isAuthenticated = true;
		} catch (e) {
			event.locals.user = null;
			event.locals.isAuthenticated = false;
		}
	} else {
		event.locals.user = null;
		event.locals.isAuthenticated = false;
	}

    // Protect all routes except login, callback, and public assets
    const isPublicRoute = ['/login', '/callback', '/favicon.ico'].includes(event.url.pathname);
    
    if (!event.locals.isAuthenticated && !isPublicRoute) {
        // If it's a direct navigation to home, redirect to login
        if (event.url.pathname === '/') {
            return new Response(null, {
                status: 302,
                headers: { location: '/login' }
            });
        }
    }

	return resolve(event);
};
