import { redirect } from '@sveltejs/kit';
import { PocketIDService } from '$lib/server/pocket-id';
import { env } from '$env/dynamic/private';
import * as oidc from 'openid-client';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies }) => {
	const config = await PocketIDService.getConfig();
    
    const code_verifier = oidc.randomPKCECodeVerifier();
    const code_challenge = await oidc.calculatePKCECodeChallenge(code_verifier);
    const state = oidc.randomState();

	cookies.set('oidc_code_verifier', code_verifier, { path: '/', httpOnly: true, secure: true, maxAge: 60 * 5 });
	cookies.set('oidc_state', state, { path: '/', httpOnly: true, secure: true, maxAge: 60 * 5 });

    const redirectUri = `${env.PUBLIC_APP_URL}/callback`;
    console.log(`Starting OIDC login. Using redirect_uri: ${redirectUri}`);

    const parameters: Record<string, string> = {
        redirect_uri: redirectUri,
        scope: 'openid profile email groups',
        state,
        code_challenge,
        code_challenge_method: 'S256',
    };

    const authUrl = oidc.buildAuthorizationUrl(config, parameters);
	throw redirect(302, authUrl.toString());
};
