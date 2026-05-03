import { env } from '$env/dynamic/private';
import type { LayoutServerLoad } from './$types';
import { logger } from '$lib/server/logger';

export const load: LayoutServerLoad = async ({ locals }) => {
    const kumaUrl = env.UPTIME_KUMA_URL;
    const kumaSlug = env.UPTIME_KUMA_SLUG;

    if (kumaUrl && kumaSlug) {
        logger.info({ 
            event: 'kuma_integration_active', 
            url: kumaUrl, 
            slug: kumaSlug 
        }, 'Uptime Kuma health integration is active');
    } else {
        logger.warn({ 
            event: 'kuma_integration_inactive',
            has_url: !!kumaUrl,
            has_slug: !!kumaSlug
        }, 'Uptime Kuma health integration is disabled (missing URL or Slug)');
    }

    const getLogoUrl = (logoPath: string | undefined, type: string) => {
        if (!logoPath) return null;
        if (logoPath.startsWith('http://') || logoPath.startsWith('https://')) {
            try {
                new URL(logoPath);
                return logoPath;
            } catch (e) {
                return null;
            }
        }
        return `/api/logo?type=${type}`;
    };

    const customLogoDark = getLogoUrl(env.CUSTOM_LOGO_DARK || env.CUSTOM_LOGO, 'dark');
    const customLogoLight = getLogoUrl(env.CUSTOM_LOGO_LIGHT || env.CUSTOM_LOGO, 'light');

	return {
		user: locals.user,
        pocketIdUrl: env.POCKET_ID_URL,
        customLogoDark,
        customLogoLight,
        kumaConfig: {
            url: env.UPTIME_KUMA_URL,
            slug: env.UPTIME_KUMA_SLUG
        }
	};
};
