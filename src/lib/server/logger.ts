import pino from 'pino';
import { env } from '$env/dynamic/private';

/**
 * Robust, Unraid-optimized logger singleton using Pino.
 * 
 * - Output: Structured JSON only (no colors).
 * - Performance: Minimal memory footprint.
 * - Streams: Info/Warn to stdout, Error/Fatal to stderr.
 * - Security: Strict redaction of secrets.
 */

// Define streams for stream separation
const streams: any[] = [
    {
        level: 'info',
        stream: process.stdout
    },
    {
        level: 'error',
        stream: process.stderr
    }
];

// Add persistent file logging if LOG_PATH is provided
if (env.LOG_PATH) {
    streams.push({
        level: env.LOG_LEVEL || 'info',
        stream: pino.destination({
            dest: env.LOG_PATH,
            minLength: 4096, // Buffer writes for performance
            sync: false     // Use asynchronous logging for performance
        })
    });
}

export const logger = pino(
    {
        level: env.LOG_LEVEL || 'info',
        // Security: Redact sensitive fields to prevent accidental leaks
        redact: {
            paths: [
                'OIDC_CLIENT_SECRET',
                'POCKET_ID_API_KEY',
                'req.headers.authorization',
                'req.headers.cookie',
                'res.headers["set-cookie"]',
                'user.email',
                'user.sub'
            ],
            remove: true
        },
        // Unraid compatibility: JSON only, no colors
        transport: undefined, 
        formatters: {
            level: (label) => {
                return { level: label.toUpperCase() };
            }
        },
        timestamp: pino.stdTimeFunctions.isoTime
    },
    pino.multistream(streams)
);

// Initial lifecycle event
logger.info({ 
    event: 'startup',
    node_env: process.env.NODE_ENV,
    log_level: env.LOG_LEVEL || 'info'
}, 'Pocket ID App Launcher starting up...');
