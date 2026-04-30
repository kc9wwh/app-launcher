import { PocketIDService } from '$lib/server/pocket-id';
import { env } from '$env/dynamic/private';
import { logger } from '$lib/server/logger';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.isAuthenticated || !locals.user) {
		return { apps: [] };
	}

	try {
		const response = await PocketIDService.fetchApps();
        
        // Handle the {"data": [...]} wrapper
        const allApps = Array.isArray(response) ? response : (response.data || []);
        
        if (!Array.isArray(allApps)) {
            logger.error({ 
                event: 'api_data_format_error', 
                response 
            }, 'Pocket ID API returned unexpected format');
            throw new Error('API returned unexpected data format.');
        }

        const baseUrl = env.POCKET_ID_URL?.endsWith('/') 
            ? env.POCKET_ID_URL.slice(0, -1) 
            : env.POCKET_ID_URL;

        const currentClientId = env.OIDC_CLIENT_ID;

        const processedApps = allApps
            .filter((app: any) => app.id !== currentClientId)
            .map((app: any) => {
                return {
                    id: app.id,
                    name: app.name,
                    description: app.description || '',
                    url: app.launchURL || app.url || '#',
                    logo_url: app.hasLogo ? `${baseUrl}/api/oidc/clients/${app.id}/logo` : null
                };
            });

        logger.info({ 
            user: locals.user.username,
            processed_app_count: processedApps.length 
        }, 'Dashboard loaded for user');

		return {
			apps: processedApps,
			user: locals.user
		};
	} catch (e: any) {
		logger.error({ 
            event: 'dashboard_load_failed', 
            user: locals.user.username,
            error: e.message 
        }, 'Failed to load dashboard apps');
        
		return {
			apps: [],
			user: locals.user,
			error: e.message || 'Could not load applications'
		};
	}
};
