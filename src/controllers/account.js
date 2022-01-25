const bcrypt = require('bcrypt');

const { UserService } = require('../services/user');
const { SessionService } = require('../services/session');

class AccountController {
    static async changePassword(req, res) {
        const { oldPassword, newPassword } = req.body;

        try {
            const user = await UserService.findById(req.currentUser.id);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: 'User not found'
                });
            }

            const isMatch = await bcrypt.compare(oldPassword, user.password);

            if (!isMatch) {
                return res.status(403).json({
                    success: false,
                    message: 'Wrong old password'
                });
            }

            user.password = await bcrypt.hash(newPassword, 10);

            await SessionService.removeAllSessionsByUser(user._id);
            await UserService.updateUser(user);

            return res.status(200).json({
                success: true,
                message: 'Password changed'
            });
        } catch (err) {
            return res.status(500).json({ errors: err });
        }
    }

    static async getAccount(req, res) {
        try {
            const user = await UserService.findById(req.currentUser.id);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: 'User not found'
                });
            }

            return res.status(200).json({
                success: true,
                user
            });
        } catch (err) {
            return res.status(500).json({ errors: err });
        }
    }
}

module.exports = { AccountController };
