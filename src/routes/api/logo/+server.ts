import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import fs from 'fs/promises';
import path from 'path';
import { logger } from '$lib/server/logger';

export const GET: RequestHandler = async () => {
    const customLogo = env.CUSTOM_LOGO;

    if (!customLogo || customLogo.startsWith('http://') || customLogo.startsWith('https://')) {
        throw error(404, 'Not Found');
    }

    try {
        const ext = path.extname(customLogo).toLowerCase();
        const allowedExtensions = ['.png', '.jpg', '.jpeg', '.svg', '.webp'];

        if (!allowedExtensions.includes(ext)) {
            logger.error({ event: 'custom_logo_invalid_format', path: customLogo, ext }, 'Invalid custom logo format');
            throw error(404, 'Invalid format');
        }

        const buffer = await fs.readFile(customLogo);
        
        const contentTypes: Record<string, string> = {
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.svg': 'image/svg+xml',
            '.webp': 'image/webp'
        };

        return new Response(buffer, {
            headers: {
                'Content-Type': contentTypes[ext] || 'application/octet-stream',
                'Cache-Control': 'public, max-age=3600'
            }
        });
    } catch (e: any) {
        if (e.status !== 404) {
            logger.error({ event: 'custom_logo_read_failed', path: customLogo, error: e.message }, 'Failed to read custom logo file');
        }
        throw error(404, 'File not found');
    }
};
