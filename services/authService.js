const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');
const AppError = require('../utils/AppError');

class AuthService {
    generateToken(id) {
        return jwt.sign({ id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE || '30d'
        });
    }

    async register(userData) {
        const user = await userRepository.create(userData);
        const token = this.generateToken(user._id);
        return { user, token };
    }

    async login(email, password) {
        if (!email || !password) {
            throw new AppError('Please provide an email and password', 400);
        }

        const user = await userRepository.findByEmail(email);
        if (!user || !(await user.matchPassword(password))) {
             throw new AppError('Invalid credentials', 401);
        }

        if (user.status === 'inactive') {
            throw new AppError('User account is inactive', 403);
        }

        const token = this.generateToken(user._id);
        return { user, token };
    }

    async getMe(id) {
        return await userRepository.findById(id);
    }
}
module.exports = new AuthService();
