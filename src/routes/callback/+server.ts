import { redirect, error } from '@sveltejs/kit';
import { PocketIDService } from '$lib/server/pocket-id';
import { env } from '$env/dynamic/private';
import * as oidc from 'openid-client';
import type { RequestHandler } from './$types';

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
        email: claims.email as string,
        groups: (claims.groups as string[]) || [],
        picture: claims.picture as string
    };

    // Store user info in a cookie
    cookies.set('session', JSON.stringify(user), {
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    // Cleanup OIDC cookies
    cookies.delete('oidc_code_verifier', { path: '/' });
    cookies.delete('oidc_state', { path: '/' });

	throw redirect(302, '/');
};
