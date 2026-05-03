import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import fs from 'fs/promises';
import path from 'path';
import { logger } from '$lib/server/logger';

const ALLOWED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.svg', '.webp'];
const CONTENT_TYPES: Record<string, string> = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp'
};

export const GET: RequestHandler = async () => {
    const customLogo = env.CUSTOM_LOGO;

    if (!customLogo || customLogo.startsWith('http://') || customLogo.startsWith('https://')) {
        throw error(404, 'Not Found');
    }

    try {
        const ext = path.extname(customLogo).toLowerCase();

        if (!ALLOWED_EXTENSIONS.includes(ext)) {
            logger.error({ event: 'custom_logo_invalid_format', path: customLogo, ext }, 'Invalid custom logo format');
            throw error(404, 'Invalid format');
        }

        const buffer = await fs.readFile(customLogo);
        
        return new Response(buffer, {
            headers: {
                'Content-Type': CONTENT_TYPES[ext] || 'application/octet-stream',
                'Cache-Control': 'public, max-age=3600',
                'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; img-src 'self';",
                'X-Content-Type-Options': 'nosniff'
            }
        });
    } catch (e: any) {
        if (e.status !== 404) {
            logger.error({ event: 'custom_logo_read_failed', path: customLogo, error: e.message }, 'Failed to read custom logo file');
        }
        throw error(404, 'File not found');
    }
};
