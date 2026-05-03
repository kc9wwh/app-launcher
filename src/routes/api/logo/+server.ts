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

const MAX_LOGO_SIZE = 5 * 1024 * 1024; // 5MB limit

export const GET: RequestHandler = async ({ url }) => {
    const type = url.searchParams.get('type');
    let customLogo = env.CUSTOM_LOGO;

    if (type === 'dark') {
        customLogo = env.CUSTOM_LOGO_DARK || env.CUSTOM_LOGO;
    } else if (type === 'light') {
        customLogo = env.CUSTOM_LOGO_LIGHT || env.CUSTOM_LOGO;
    }

    if (!customLogo || customLogo.startsWith('http://') || customLogo.startsWith('https://')) {
        throw error(404, 'Not Found');
    }

    try {
        const ext = path.extname(customLogo).toLowerCase();

        if (!ALLOWED_EXTENSIONS.includes(ext)) {
            logger.error({ event: 'custom_logo_invalid_format', path: customLogo, ext }, 'Invalid custom logo format');
            throw error(404, 'Invalid format');
        }

        const stats = await fs.stat(customLogo);
        if (stats.size > MAX_LOGO_SIZE) {
            logger.error({ event: 'custom_logo_too_large', path: customLogo, size: stats.size }, 'Custom logo exceeds size limit');
            throw error(404, 'File too large');
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
        const isExpectedError = e.status === 404 || e.code === 'ENOENT';
        if (!isExpectedError) {
            logger.error({ event: 'custom_logo_read_failed', path: customLogo, error: e.message, code: e.code }, 'Failed to read custom logo file');
        }
        throw error(404, 'File not found');
    }
};
