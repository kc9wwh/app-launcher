import { redirect, error } from '@sveltejs/kit';
import { PocketIDService } from '$lib/server/pocket-id';
import { env } from '$env/dynamic/private';
import * as oidc from 'openid-client';
import type { RequestHandler } from './$types';
import { logger } from '$lib/server/logger';
import crypto from 'node:crypto';

export const GET: RequestHandler = async ({ url, cookies }) => {
	const config = await PocketIDService.getConfig();
    
    const code_verifier = cookies.get('oidc_code_verifier');
    const expected_state = cookies.get('oidc_state');
    
    if (!code_verifier || !expected_state) {
        throw error(400, 'Missing OIDC state or verifier');
    }

    const currentUrl = new URL(url.href);
    const tokens = await oidc.authorizationCodeGrant(config, currentUrl, {
        pkceCodeVerifier: code_verifier,
        expectedState: expected_state
    });

    const claims = tokens.claims();
    if (!claims) {
        throw error(500, 'No claims found in ID token');
    }

    const user = {
        sub: claims.sub,
        username: (claims.preferred_username as string) || (claims.name as string) || (claims.sub as string),
        firstName: claims.given_name as string,
        email: claims.email as string,
        groups: (claims.groups as string[]) || [],
        picture: claims.picture as string
    };

    // Sign the session cookie to prevent spoofing
    const sessionData = JSON.stringify(user);
    
    if (!env.AUTH_SECRET) {
        logger.error('AUTH_SECRET is not set. Session cookies cannot be signed securely.');
        throw error(500, 'Server configuration error');
    }

    const signature = crypto.createHmac('sha256', env.AUTH_SECRET).update(sessionData).digest('hex');
    const cookieValue = `${sessionData}.${signature}`;

    // Store signed user info in a cookie
    cookies.set('session', cookieValue, {
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    // Cleanup OIDC cookies
    cookies.delete('oidc_code_verifier', { path: '/' });
    cookies.delete('oidc_state', { path: '/' });

    logger.info({ 
        event: 'login_success', 
        user: user.username,
        ip: url.searchParams.get('ip') || 'unknown' // Middleware handles actual IP logging
    }, `User ${user.username} successfully logged in`);

	throw redirect(302, '/');
};
