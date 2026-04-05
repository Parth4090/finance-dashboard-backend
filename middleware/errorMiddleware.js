const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
    
    // Centralized Error Logging with winston
    logger.error({
        action: "ERROR_THROWN",
        message: err.message,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method,
        timestamp: new Date()
    });

    if (err.name === 'CastError') {
        error = new AppError(`Resource not found`, 404);
    }
    if (err.code === 11000) {
        error = new AppError('Duplicate field value entered', 400);
    }
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message);
        error = new AppError(message.join(', '), 400);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Internal Server Error'
    });
};
module.exports = errorHandler;
