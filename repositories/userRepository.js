const User = require('../models/User');

class UserRepository {
    async create(data) {
        return await User.create(data);
    }
    async findByEmail(email) {
        return await User.findOne({ email }).select('+password');
    }
    async findById(id) {
        return await User.findById(id);
    }
    async findAll() {
        return await User.find();
    }
    async update(id, data) {
        return await User.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    }
    async delete(id) {
        return await User.findByIdAndDelete(id);
    }
}

module.exports = new UserRepository();
