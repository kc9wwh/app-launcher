import { env } from '$env/dynamic/private';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	return {
		user: locals.user,
        pocketIdUrl: env.POCKET_ID_URL
	};
};
