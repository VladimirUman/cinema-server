const User = require('../models/user');
class UserService {
    static findById(userId) {
        return User.findOne({ _id: userId });
    }
    static getUsers() {
        return User.find({});
    }
    static createUser(user) {
        return user.save();
    }
    static updateUser(user) {
        return user.save();
    }
    static deleteUser(userId) {
        return User.deleteOne({ _id: userId });
    }
}
module.exports = { UserService };
