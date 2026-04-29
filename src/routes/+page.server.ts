import { PocketIDService } from '$lib/server/pocket-id';
import { env } from '$env/dynamic/private';
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
            console.error('Pocket ID API returned unexpected format:', response);
            throw new Error('API returned unexpected data format.');
        }

        const baseUrl = env.POCKET_ID_URL?.endsWith('/') 
            ? env.POCKET_ID_URL.slice(0, -1) 
            : env.POCKET_ID_URL;

        const processedApps = allApps.map((app: any) => {
            // Map Pocket ID fields to our internal format
            return {
                id: app.id,
                name: app.name,
                description: app.description || '',
                url: app.launchURL || app.url || '#',
                // Construct logo URL based on app.id if hasLogo is true
                logo_url: app.hasLogo ? `${baseUrl}/api/oidc/clients/${app.id}/logo` : null
            };
        });

		return {
			apps: processedApps,
			user: locals.user
		};
	} catch (e: any) {
		console.error('Error loading apps:', e);
		return {
			apps: [],
			user: locals.user,
			error: e.message || 'Could not load applications'
		};
	}
};
