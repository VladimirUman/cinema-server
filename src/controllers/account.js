const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const bcrypt = require('bcrypt');

const { createJWT } = require('../utils/auth');
const { sendConfirmToken, emailType } = require('../utils/mailer');
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
            sendConfirmToken(newEmail, user.name, emailConfirmToken, emailType.confirmNewEmail);

            return res.status(200).json({
                success: true
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({ errors: err });
        }
    }

    static async confirmEmail(req, res) {
        const { emailConfirmToken } = req.body;
        const tokenData = jwt.verify(emailConfirmToken, process.env.TOKEN_SECRET);

        try {
            const userId = tokenData?.userId;

            if (!userId) {
                return res.status(404).json({
                    errors: [{ userId: 'not existing' }]
                });
            }
            const user = await UserService.findById(userId);
            const newEmail = user.newEmail;

            if (!user) {
                return res.status(404).json({
                    errors: [{ user: 'not found' }]
                });
            }
            if (user.emailConfirmToken !== emailConfirmToken) {
                return res.status(400).json({
                    errors: [{ token: 'WRONG EMAIL CONFIRM TOKEN' }]
                });
            }
            user.email = newEmail;
            user.emailConfirmToken = null;
            await UserService.updateUser(user);

            return res.status(200).json({
                success: true,
                userId: user.id,
                message: 'Email confirm'
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
