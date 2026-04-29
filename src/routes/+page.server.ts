import { PocketIDService } from '$lib/server/pocket-id';
import { env } from '$env/dynamic/private';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.isAuthenticated || !locals.user) {
		return { apps: [] };
	}

	try {
		const allApps = await PocketIDService.fetchApps();
        const userGroups = locals.user.groups || [];

        // Note: We are just showing all active apps for now to confirm the API works
        // If the user wants strict group filtering, we can add it back once we see the data structure
        const processedApps = allApps.map((app: any) => {
            // Ensure logo_url is absolute
            if (app.logo_url && !app.logo_url.startsWith('http')) {
                const baseUrl = env.POCKET_ID_URL?.endsWith('/') 
                    ? env.POCKET_ID_URL.slice(0, -1) 
                    : env.POCKET_ID_URL;
                app.logo_url = `${baseUrl}${app.logo_url.startsWith('/') ? '' : '/'}${app.logo_url}`;
            }
            return app;
        }).filter((app: any) => app.is_active !== false);

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
