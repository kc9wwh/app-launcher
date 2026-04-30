import type { Handle } from '@sveltejs/kit';
import { logger } from '$lib/server/logger';

export const handle: Handle = async ({ event, resolve }) => {
    const start = performance.now();
    const { request, url, getClientAddress, cookies } = event;
    
    // Extract session for logging (safe version)
    const session = cookies.get('session');
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

    // Resolve the request
    const response = await resolve(event);
    
    const end = performance.now();
    const duration = Math.round(end - start);

    // Metadata extraction
    const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || getClientAddress();
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Structured Access Log
    logger.info({
        req: {
            method: request.method,
            url: url.pathname,
            ip: clientIp,
            ua: userAgent
        },
        res: {
            status: response.status
        },
        user: event.locals.user ? { username: event.locals.user.username } : null,
        duration_ms: duration
    }, `${request.method} ${url.pathname} - ${response.status} (${duration}ms)`);

    // Guard login/callback routes failure logging
    if (!event.locals.isAuthenticated && !['/login', '/callback', '/favicon.ico'].includes(url.pathname)) {
        if (url.pathname === '/') {
            return new Response(null, {
                status: 302,
                headers: { location: '/login' }
            });
        }
    }

    return response;
};
