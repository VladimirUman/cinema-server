const User = require('../models/user');
const { UserService } = require('../services/user');

class UsersController {
    static async createUser(req, res) {
        const user = new User(req.body);
        try {
            await UserService.createUser(user);
            return res.status(201).json({
                success: true,
                id: user._id,
                message: 'User created'
            });
        } catch (err) {
            return res.status(500).json({ errors: err });
        }
    }

    static async updateUser(req, res) {
        const body = req.body;

        try {
            const user = await UserService.findById(req.params.id);

            if (!user) {
                return res.status(404).json({
                    message: 'User not found!'
                });
            }

            user.name = body.name;
            user.lastName = body.lastName;
            user.email = body.email;

            const updatedUser = await UserService.updateUser(user);

            const result = {
                success: true,
                user: updatedUser,
                message: 'User updated!'
            };

            return res.status(200).json(result);
        } catch (err) {
            return res.status(500).json({ errors: err });
        }
    }

    static async deleteUser(req, res) {
        const userId = req.params.id;
        if (!userId) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        try {
            const user = await UserService.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ success: false, error: 'User not found' });
            }
            await UserService.deleteUser(user._id);
            return res.status(200).json({
                success: true,
                id: user._id,
                message: 'User deleted!'
            });
        } catch (err) {
            return res.status(500).json({ errors: err });
        }
    }

    static async getUserById(req, res) {
        const userId = req.params.id;
        if (!userId) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        try {
            const user = await UserService.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ success: false, error: `User not found` });
            }

            return res.status(200).json({ success: true, data: user });
        } catch (err) {
            return res.status(500).json({ errors: err });
        }
    }

    static async getUsers(req, res) {
        try {
            const users = await UserService.getUsers();

            if (!users.length) {
                return res.status(404).json({ success: false, error: `User not found` });
            }

            return res.status(200).json({ success: true, data: users });
        } catch (err) {
            return res.status(500).json({ errors: err });
        }
    }
}

module.exports = { UsersController };
