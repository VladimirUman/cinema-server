const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

const User = require('../models/user');
const Session = require('../models/session');
const { createJWT } = require('../utils/auth');
const { sendConfirmToken, emailType } = require('../utils/mailer');
const { SessionService } = require('../services/session');
const { UserService } = require('../services/user');
const { config } = require('../config/config');

class AuthController {
    static async registraition(req, res) {
        const { name, lastName, email, password } = req.body;

        try {
            const user = await UserService.findByEmail(email);

            if (user) {
                return res.status(422).json({
                    errors: [{ user: 'email already exists' }]
                });
            } else {
                const user = new User({
                    name: name,
                    lastName: lastName,
                    email: email,
                    password: password
                });

                user.password = await bcrypt.hash(password, 10);

                let emailConfirmToken = createJWT(user.email, user._id, 3600);

                user.emailConfirmToken = emailConfirmToken;

                const newUser = await UserService.createUser(user);

                sendConfirmToken(email, name, emailConfirmToken, emailType.confirmRegistration);

                return res.status(200).json({
                    success: true,
                    userId: newUser._id,
                    userName: newUser.name
                });
            }
        } catch (err) {
            res.status(500).json({ errors: err });
        }
    }

    static async confirmRegistration(req, res) {
        const { emailConfirmToken } = req.body;

        try {
            const tokenData = jwt.verify(emailConfirmToken, config.development.tokenSecret);

            if (!tokenData) {
                return res.status(400).json({
                    errors: 'token incorrect or expired'
                });
            }

            const user = await UserService.findById(tokenData.userId);

            if (!user) {
                return res.status(404).json({
                    errors: [{ user: 'not found' }]
                });
            } else {
                if (user.emailConfirmToken !== emailConfirmToken) {
                    return res.status(400).json({
                        errors: [{ token: 'incorrect' }]
                    });
                } else {
                    user.emailConfirmToken = null;

                    await UserService.updateUser(user);

                    return res.status(200).json({
                        success: true,
                        userId: user.id
                    });
                }
            }
        } catch (err) {
            return res.status(500).json({ errors: err });
        }
    }

    static async login(req, res) {
        const { email, password } = req.body;

        try {
            const user = await UserService.findByEmail(email);

            if (!user) {
                return res.status(404).json({
                    errors: [{ user: 'not found' }]
                });
            } else {
                if (user.emailConfirmToken) {
                    return res.status(403).json({
                        errors: [{ user: 'finish registration' }]
                    });
                }

                const isMatch = await bcrypt.compare(password, user.password);

                if (!isMatch) {
                    return res.status(400).json({
                        errors: [{ password: 'incorrect' }]
                    });
                }

                const accessToken = createJWT(user.email, user._id, 3600);

                const newRefreshSession = new Session({
                    refreshToken: uuidv4(),
                    userId: user.id,
                    expiresIn: new Date().getTime() + config.development.tokenExp * 1000
                });

                await SessionService.addRefreshSession(newRefreshSession);

                return res.status(200).json({
                    success: true,
                    accessToken: accessToken,
                    refreshToken: newRefreshSession.refreshToken,
                    message: user
                });
            }
        } catch (err) {
            res.status(500).json({ errors: err });
        }
    }

    static async logout(req, res) {
        const refreshToken = req.body.refreshToken;

        if (!refreshToken) {
            return res.status(403).json({
                success: false,
                message: 'Refresh token not provided.'
            });
        }

        try {
            await SessionService.removeRefreshSession(refreshToken);

            return res.status(200).json({
                success: true,
                message: 'User is logged out from current session.'
            });
        } catch (err) {
            res.status(500).json({ errors: err });
        }
    }

    static async resetPassword(req, res) {
        const { email } = req.body;

        try {
            const user = await UserService.findByEmail(email);

            if (!user) {
                return res.status(404).json({
                    errors: 'not found user'
                });
            }

            const resetPasswordToken = createJWT(user.email, user._id, 3600);

            user.resetPasswordToken = resetPasswordToken;

            await UserService.updateUser(user);

            sendConfirmToken(email, user.name, resetPasswordToken, emailType.confirmNewPassword);

            return res.status(200).json({
                success: true,
                message: 'sent confirm token'
            });
        } catch (err) {
            res.status(500).json({ errors: err });
        }
    }

    static async confirmNewPassword(req, res) {
        const { password, resetPasswordToken } = req.body;

        try {
            const tokenData = jwt.verify(resetPasswordToken, config.development.tokenSecret);

            if (!tokenData) {
                return res.status(400).json({
                    errors: 'token incorrect or expired'
                });
            }

            const user = await UserService.findById(tokenData.userId);

            if (!user) {
                return res.status(404).json({
                    errors: 'user not found'
                });
            }

            if (user.resetPasswordToken !== resetPasswordToken) {
                return res.status(400).json({
                    errors: 'token incorrect'
                });
            }

            user.password = await bcrypt.hash(password, 10);
            user.resetPasswordToken = null;

            await UserService.updateUser(user);
            await SessionService.removeAllSessionsByUser(user._id);

            return res.status(200).json({
                success: true,
                message: 'password changed'
            });
        } catch (err) {
            res.status(500).json({ errors: err });
        }
    }
}

module.exports = { AuthController };
