const userService = require('../services/userService');
const { successResponse } = require('../utils/response');

exports.getUsers = async (req, res, next) => {
    try {
        const users = await userService.getAllUsers();
        successResponse(res, 'Users fetched successfully', users, { count: users.length });
    } catch (err) {
        next(err);
    }
};

exports.getUser = async (req, res, next) => {
    try {
        const user = await userService.getUser(req.params.id);
        successResponse(res, 'User fetched successfully', user);
    } catch (err) {
        next(err);
    }
};

exports.updateUser = async (req, res, next) => {
    try {
        const user = await userService.updateUser(req.params.id, req.body);
        successResponse(res, 'User updated successfully', user);
    } catch (err) {
        next(err);
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        await userService.deleteUser(req.params.id);
        successResponse(res, 'User deleted successfully', {});
    } catch (err) {
        next(err);
    }
};
