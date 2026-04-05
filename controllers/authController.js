const authService = require('../services/authService');
const { successResponse } = require('../utils/response');
const logger = require('../utils/logger');

exports.register = async (req, res, next) => {
    try {
        const { user, token } = await authService.register(req.body);
        logger.info({ action: "REGISTER_USER", email: user.email, timestamp: new Date() });
        successResponse(res, 'User registered successfully', { user }, { token }, 201);
    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const { user, token } = await authService.login(email, password);
        logger.info({ action: "LOGIN_USER", userId: user._id, timestamp: new Date() });
        successResponse(res, 'Login successful', { user }, { token }, 200);
    } catch (err) {
        next(err);
    }
};

exports.getMe = async (req, res, next) => {
    try {
        const user = await authService.getMe(req.user.id);
        successResponse(res, 'User profile fetched successfully', user);
    } catch (err) {
        next(err);
    }
};
