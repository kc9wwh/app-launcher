import { PocketIDService } from '$lib/server/pocket-id';
import { env as privateEnv } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';
import * as oidc from 'openid-client';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies }) => {
	const config = await PocketIDService.getConfig();
    
    const code_verifier = oidc.randomPKCECodeVerifier();
    const code_challenge = await oidc.calculatePKCECodeChallenge(code_verifier);
    const state = oidc.randomState();

	cookies.set('oidc_code_verifier', code_verifier, { path: '/', httpOnly: true, secure: true, maxAge: 60 * 5 });
	cookies.set('oidc_state', state, { path: '/', httpOnly: true, secure: true, maxAge: 60 * 5 });

    const baseUrl = publicEnv.PUBLIC_APP_URL || privateEnv.PUBLIC_APP_URL || 'NOT_FOUND';
    const redirectUri = `${baseUrl}/callback`;
    
    const parameters: Record<string, string> = {
        redirect_uri: redirectUri,
        scope: 'openid profile email groups',
        state,
        code_challenge,
        code_challenge_method: 'S256',
    };

    const authUrl = oidc.buildAuthorizationUrl(config, parameters);
    
    // TEMPORARY DEBUG: Return the URL as plain text to see what is being generated
    return new Response(`
        DEBUG INFO:
        - PUBLIC_APP_URL (Public): ${publicEnv.PUBLIC_APP_URL}
        - PUBLIC_APP_URL (Private): ${privateEnv.PUBLIC_APP_URL}
        - Computed Base URL: ${baseUrl}
        - Final Redirect URI: ${redirectUri}
        - Auth URL sent to Pocket ID: ${authUrl.toString()}
    `, {
        headers: { 'content-type': 'text/plain' }
    });
};
