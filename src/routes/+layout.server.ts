import { env } from '$env/dynamic/private';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
    let customLogoUrl = null;
    if (env.CUSTOM_LOGO) {
        if (env.CUSTOM_LOGO.startsWith('http://') || env.CUSTOM_LOGO.startsWith('https://')) {
            try {
                new URL(env.CUSTOM_LOGO);
                customLogoUrl = env.CUSTOM_LOGO;
            } catch (e) {
                // Invalid URL, fallback to default
            }
        } else {
            customLogoUrl = '/api/logo';
        }
    }

	return {
		user: locals.user,
        pocketIdUrl: env.POCKET_ID_URL,
        customLogoUrl
	};
};
