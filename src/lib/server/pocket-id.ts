import { env } from '$env/dynamic/private';
import * as oidc from 'openid-client';
import { logger } from '$lib/server/logger';

export class PocketIDService {
	private static config: oidc.Configuration | null = null;

	static async getConfig() {
		if (this.config) return this.config;

        if (!env.POCKET_ID_URL || !env.OIDC_CLIENT_ID || !env.OIDC_CLIENT_SECRET) {
            logger.error({ 
                config_check: {
                    url: !!env.POCKET_ID_URL,
                    client_id: !!env.OIDC_CLIENT_ID,
                    client_secret: !!env.OIDC_CLIENT_SECRET
                }
            }, 'Missing Pocket ID OIDC configuration');
            throw new Error('Missing Pocket ID OIDC configuration');
        }

		const issuerUrl = new URL(env.POCKET_ID_URL);
        
        try {
            this.config = await oidc.discovery(
                issuerUrl,
                env.OIDC_CLIENT_ID,
                env.OIDC_CLIENT_SECRET
            );
            logger.info({ event: 'oidc_discovery_success', issuer: env.POCKET_ID_URL }, 'Successfully discovered OIDC configuration');
            return this.config;
        } catch (e: any) {
            logger.error({ event: 'oidc_discovery_failed', error: e.message, issuer: env.POCKET_ID_URL }, 'Failed to discover OIDC configuration');
            throw e;
        }
	}

	static async fetchApps() {
        if (!env.POCKET_ID_URL || !env.POCKET_ID_API_KEY) {
            throw new Error('Missing Pocket ID API configuration');
        }

        const apiKey = env.POCKET_ID_API_KEY;
        const baseUrl = `${env.POCKET_ID_URL}/api/oidc/clients`;
        const limit = 100;
        let page = 1;
        let allClients: any[] = [];

        try {
            while (true) {
                const url = `${baseUrl}?pagination[page]=${page}&pagination[limit]=${limit}`;
                logger.debug({ event: 'api_fetch_page', page, limit, url }, `Fetching page ${page} from Pocket ID`);

                const response = await fetch(url, {
                    headers: {
                        'X-API-Key': apiKey
                    }
                });

                if (!response.ok) {
                    const text = await response.text();
                    logger.warn({ 
                        event: 'api_fetch_error', 
                        status: response.status, 
                        url 
                    }, `Pocket ID API error: ${text || response.statusText}`);
                    throw new Error(`Pocket ID API error (${response.status}): ${text || response.statusText}`);
                }

                const data = await response.json();
                const clients = Array.isArray(data) ? data : (data?.data || []);
                const pagination = data?.pagination;

                logger.debug({
                    event: 'api_fetch_page_result',
                    page,
                    clients_on_page: clients.length,
                    client_names: clients.map((c: any) => c.name),
                    pagination
                }, `Page ${page}: received ${clients.length} clients`);

                allClients = allClients.concat(clients);

                // Stop if we got fewer items than the limit (last page) or no pagination info
                if (!pagination || clients.length < limit || page >= (pagination.totalPages || page)) {
                    break;
                }
                page++;
            }

            logger.info({
                event: 'api_fetch_success',
                total_app_count: allClients.length,
                all_app_names: allClients.map((c: any) => c.name)
            }, `Successfully fetched all ${allClients.length} applications`);

            return { data: allClients };
        } catch (e: any) {
            logger.error({ event: 'api_fetch_failed', error: e.message, page }, 'Failed to fetch applications from Pocket ID');
            throw e;
        }
	}
}
