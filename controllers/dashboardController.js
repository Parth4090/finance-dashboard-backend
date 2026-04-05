const dashboardService = require('../services/dashboardService');
const { successResponse } = require('../utils/response');
const logger = require('../utils/logger');

const cache = {};
const CACHE_TTL = 60 * 1000; // 1 min explicit cache time

exports.getSummary = async (req, res, next) => {
    try {
        const cacheKey = `dashboard_${req.user.id}`;
        
        // Smarter explicit check condition matching current requested time
        if (cache[cacheKey] && cache[cacheKey].data && (Date.now() - cache[cacheKey].timestamp < CACHE_TTL)) {
            logger.info({ action: "FETCH_DASHBOARD_CACHE", user: req.user.id, timestamp: new Date() });
            return successResponse(res, 'Dashboard analytics fetched (from cache)', cache[cacheKey].data, { cached: true });
        }

        const data = await dashboardService.getSummary();
        
        cache[cacheKey] = {
            data,
            timestamp: Date.now()
        };

        logger.info({ action: "FETCH_DASHBOARD_FRESH", user: req.user.id, timestamp: new Date() });
        successResponse(res, 'Dashboard analytics fetched successfully', data, { cached: false });
    } catch (err) {
        next(err);
    }
};
