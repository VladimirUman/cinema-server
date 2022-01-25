const bcrypt = require('bcrypt');

const { createJWT } = require('../utils/auth');
const { sendConfirmToken } = require('../utils/mailer');
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

    static async changeEmail(req, res) {
        const { newEmail } = req.body;
        const currentUserId = req.currentUser.id;
        try {
            const existUser = await UserService.findByEmail(newEmail);

            if (existUser) {
                return res.status(422).json({
                    errors: [{ user: 'email already exist' }]
                });
            }
            const user = await UserService.findById(req.currentUser.id);
            const emailConfirmToken = createJWT(newEmail, currentUserId, 3600);
            user.emailConfirmToken = emailConfirmToken;
            user.email = newEmail;
            await UserService.updateUser(user);
            sendConfirmToken(newEmail, user.name, emailConfirmToken);

            return res.status(200).json({
                success: true
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({ errors: err });
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
