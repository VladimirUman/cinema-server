const User = require('../models/user');
class UserService {
    static async getUserById(userId) {
        return await User.findOne({ _id: userId });
    }
    static async getUsers() {
        return await User.find({});
    }
    static async createUser(user) {
        await user.save();
    }
    static async updateUser(user) {
        await user.save();
    }
    static async deleteUser(userId) {
        await User.deleteOne({ _id: userId });
    }
}
module.exports = { UserService };
