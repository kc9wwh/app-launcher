import type { Handle } from '@sveltejs/kit';
import { logger } from '$lib/server/logger';
import { env } from '$env/dynamic/private';
import crypto from 'node:crypto';

// One-time startup check for Uptime Kuma integration
const kumaUrl = env.UPTIME_KUMA_URL;
const kumaSlug = env.UPTIME_KUMA_SLUG;
if (kumaUrl && kumaSlug) {
    logger.info({ 
        event: 'kuma_integration_active', 
        url: kumaUrl, 
        slug: kumaSlug 
    }, 'Uptime Kuma health integration is active');
} else {
    logger.debug({ 
        event: 'kuma_integration_inactive',
        has_url: !!kumaUrl,
        has_slug: !!kumaSlug
    }, 'Uptime Kuma health integration is disabled');
}

export const handle: Handle = async ({ event, resolve }) => {
    const start = performance.now();
    const { request, url, getClientAddress, cookies } = event;
    
    // Extract and verify session
    const sessionCookie = cookies.get('session');
    if (sessionCookie) {
        try {
            const lastDotIndex = sessionCookie.lastIndexOf('.');
            if (lastDotIndex !== -1) {
                const sessionData = sessionCookie.substring(0, lastDotIndex);
                const signature = sessionCookie.substring(lastDotIndex + 1);

                const expectedSignature = crypto
                    .createHmac('sha256', env.AUTH_SECRET || '')
                    .update(sessionData)
                    .digest();

                const signatureBuffer = Buffer.from(signature, 'hex');

                if (env.AUTH_SECRET && signatureBuffer.length === expectedSignature.length && crypto.timingSafeEqual(signatureBuffer, expectedSignature)) {
                    event.locals.user = JSON.parse(sessionData);
                    event.locals.isAuthenticated = true;
                } else {
                    logger.warn({ 
                        event: 'session_verification_failed',
                        has_secret: !!env.AUTH_SECRET 
                    }, 'Invalid session signature or missing AUTH_SECRET');
                    event.locals.user = null;
                    event.locals.isAuthenticated = false;
                }
            } else {
                event.locals.user = null;
                event.locals.isAuthenticated = false;
            }
        } catch (e) {
            logger.error({ event: 'session_parse_error', error: (e as Error).message }, 'Failed to parse session cookie');
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
