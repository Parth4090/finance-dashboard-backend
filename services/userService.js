const userRepository = require('../repositories/userRepository');
const AppError = require('../utils/AppError');

class UserService {
    async getAllUsers() {
        return await userRepository.findAll();
    }

    async getUser(id) {
        const user = await userRepository.findById(id);
        if (!user) throw new AppError('User not found', 404);
        return user;
    }

    async updateUser(id, data) {
        if (data.password) delete data.password;
        const user = await userRepository.update(id, data);
        if (!user) throw new AppError('User not found', 404);
        return user;
    }

    async deleteUser(id) {
        const user = await userRepository.delete(id);
        if (!user) throw new AppError('User not found', 404);
        return user;
    }
}
module.exports = new UserService();
