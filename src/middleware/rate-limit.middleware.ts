import rateLimit from 'express-rate-limit';

export const loginRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500, // 50 requests per windowMs
    message: {
        success: false,
        error: {
            message: 'Too many login attempts, please try again later',
            type: 'RateLimitError'
        }
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export const registerRateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 300, // 3 registrations per hour
    message: {
        success: false,
        error: {
            message: 'Too many registration attempts, please try again later',
            type: 'RateLimitError'
        }
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export const apiRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per windowMs
    message: {
        success: false,
        error: {
            message: 'Too many requests, please try again later',
            type: 'RateLimitError'
        }
    },
    standardHeaders: true,
    legacyHeaders: false,
});