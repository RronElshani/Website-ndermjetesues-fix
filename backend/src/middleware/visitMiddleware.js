const SiteVisit = require('../models/SiteVisit');

/**
 * Middleware to track page visits
 * Logs visitor information for analytics
 */
const visitMiddleware = async (req, res, next) => {
    // Don't track admin routes or health checks
    if (req.path.startsWith('/api/admin') || req.path === '/health') {
        return next();
    }

    try {
        // Get visitor IP (handle proxies)
        const ip = req.headers['x-forwarded-for']?.split(',')[0] ||
            req.socket.remoteAddress ||
            'unknown';

        // Log the visit asynchronously (don't block the request)
        SiteVisit.logVisit({
            ip: ip,
            path: req.path,
            userAgent: req.headers['user-agent'] || 'unknown',
            userId: req.user?.id || null
        }).catch(err => console.error('Failed to log visit:', err));

    } catch (error) {
        // Don't fail the request if tracking fails
        console.error('Visit tracking error:', error);
    }

    next();
};

module.exports = visitMiddleware;
