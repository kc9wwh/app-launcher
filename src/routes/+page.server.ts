import { PocketIDService } from '$lib/server/pocket-id';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.isAuthenticated || !locals.user) {
		return { apps: [] };
	}

	try {
		const allApps = await PocketIDService.fetchApps();
        const userGroups = locals.user.groups || [];

        // Simple filtering: if an app has "authorized_groups" defined, check if user is in one.
        // Note: Pocket ID's exact JSON structure might vary, but we'll adapt.
        // Based on pocket-id-portal, clients have a property like 'authorized_groups'.
        
        const filteredApps = allApps.map((app: any) => {
            // Ensure logo_url is absolute
            if (app.logo_url && !app.logo_url.startsWith('http')) {
                app.logo_url = `${env.POCKET_ID_URL}${app.logo_url.startsWith('/') ? '' : '/'}${app.logo_url}`;
            }
            return app;
        }).filter((app: any) => {
            // If app is not active, skip
            if (app.is_active === false) return false;
            
            // If no authorized groups defined, assume public to all authenticated users
            if (!app.authorized_groups || app.authorized_groups.length === 0) return true;
            
            // Check if user is in any of the authorized groups
            return app.authorized_groups.some((group: any) => userGroups.includes(group.name || group));
        });

		return {
			apps: filteredApps,
			user: locals.user
		};
	} catch (e) {
		console.error('Error loading apps:', e);
		return {
			apps: [],
			user: locals.user,
			error: 'Could not load applications'
		};
	}
};
