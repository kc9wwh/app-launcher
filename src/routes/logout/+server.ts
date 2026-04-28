import { redirect } from '@sveltejs/kit';
import { PocketIDService } from '$lib/server/pocket-id';
import { env } from '$env/dynamic/public';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies }) => {
	cookies.delete('session', { path: '/' });

    const config = await PocketIDService.getConfig();
    const endSessionEndpoint = config.serverMetadata().end_session_endpoint;
    
    if (endSessionEndpoint) {
        const logoutUrl = new URL(endSessionEndpoint);
        if (env.PUBLIC_APP_URL) {
            logoutUrl.searchParams.set('post_logout_redirect_uri', env.PUBLIC_APP_URL);
        }
        throw redirect(302, logoutUrl.toString());
    }

	throw redirect(302, '/');
};
