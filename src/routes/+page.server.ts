import { PocketIDService } from '$lib/server/pocket-id';
import { env } from '$env/dynamic/private';
import { logger } from '$lib/server/logger';
import { fail } from '@sveltejs/kit';
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

export const actions = {
	reportIssue: async ({ request, locals }: { request: Request; locals: App.Locals }) => {
		const data = await request.formData();
		const selectedApps = data.getAll('apps');
		const description = data.get('description');
		const userName = locals.user?.name || locals.user?.username || 'A User';

		// Validate input
		if (!description || selectedApps.length === 0) {
			return fail(400, { error: 'Please select an app and provide a description.' });
		}

		// Build Discord payload
		let content = `🚨 **New Support Ticket from ${userName}** 🚨\n\n`;
		if (env.DISCORD_USER_ID) {
			content += `<@${env.DISCORD_USER_ID}>\n\n`;
		}
		content += `**Affected Apps:** ${selectedApps.join(', ')}\n`;
		content += `**Description:**\n> ${description.toString().replace(/\n/g, '\n> ')}\n`;

		// Send to Discord
		if (env.DISCORD_WEBHOOK_URL) {
			try {
				await fetch(env.DISCORD_WEBHOOK_URL, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ content })
				});
			} catch (error) {
				console.error('Failed to send Discord webhook:', error);
				return fail(500, { error: 'Failed to submit ticket. Please try again later.' });
			}
		} else {
			console.warn('Ticket submitted, but no Discord webhook URL is configured.');
		}

		return { success: true };
	}
};

