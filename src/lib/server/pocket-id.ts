import { env } from '$env/dynamic/private';
import * as oidc from 'openid-client';

export class PocketIDService {
	private static config: oidc.Configuration | null = null;

	static async getConfig() {
		if (this.config) return this.config;

        if (!env.POCKET_ID_URL || !env.OIDC_CLIENT_ID || !env.OIDC_CLIENT_SECRET) {
            throw new Error('Missing Pocket ID OIDC configuration');
        }

		const issuerUrl = new URL(env.POCKET_ID_URL);
		this.config = await oidc.discovery(
			issuerUrl,
			env.OIDC_CLIENT_ID,
			env.OIDC_CLIENT_SECRET
		);

		return this.config;
	}

	static async fetchApps() {
        if (!env.POCKET_ID_URL || !env.POCKET_ID_API_KEY) {
            throw new Error('Missing Pocket ID API configuration');
        }

        const apiKey = env.POCKET_ID_API_KEY;
		const response = await fetch(`${env.POCKET_ID_URL}/api/oidc/clients`, {
			headers: {
				'X-API-Key': apiKey
			}
		});

		if (!response.ok) {
			throw new Error('Failed to fetch apps from Pocket ID');
		}

		return await response.json();
	}
}
