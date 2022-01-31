const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

const User = require('../models/user');
const Session = require('../models/session');
const { createJWT, verifyJWT } = require('../utils/jwt');
const { sendConfirmToken, emailType } = require('../utils/mailer');
const { SessionService } = require('../services/session');
const { UserService } = require('../services/user');
const { config } = require('../config/index');

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

                let emailConfirmToken = createJWT(user.email, user._id, config.accessTokenExp);

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
            const tokenData = verifyJWT(emailConfirmToken);

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

                const accessToken = createJWT(user.email, user._id, config.accessTokenExp);

                const newRefreshSession = new Session({
                    refreshToken: uuidv4(),
                    userId: user.id,
                    expiresIn: new Date().getTime() + config.refreshTokenExp * 1000
                });

                await SessionService.addRefreshSession(newRefreshSession);

                return res.status(200).json({
                    success: true,
                    accessToken: accessToken,
                    refreshToken: newRefreshSession.refreshToken
                });
            }
        } catch (err) {
            res.status(500).json({ errors: err });
        }
    }

    static async logout(req, res) {
        const refreshToken = req.body.refreshToken;

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

    static async logoutAllSessions(req, res) {
        try {
            await SessionService.removeAllSessionsByUser(req.currentUser.id);

            return res.status(200).json({
                success: true,
                message: 'User is logged out from all sessions.'
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

            const resetPasswordToken = createJWT(user.email, user._id, config.accessTokenExp);

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
            const tokenData = verifyJWT(resetPasswordToken);

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

    static async refreshTokens(req, res) {
        const refreshToken = req.body.refreshToken;

        const timeNow = new Date().getTime();

        try {
            const oldRefreshSession = await SessionService.getRefreshSession(refreshToken);

            if (!oldRefreshSession) {
                return res.status(400).json({
                    success: false,
                    message: 'token incorrect'
                });
            }

            await SessionService.removeRefreshSession(refreshToken);

            if (timeNow > oldRefreshSession.expiresIn) {
                return res.status(419).json({
                    success: false,
                    message: 'Session expired'
                });
            }

            const user = await UserService.findById(oldRefreshSession.userId);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'user not found'
                });
            }

            const newRefreshSession = new Session({
                refreshToken: uuidv4(),
                userId: user._id,
                expiresIn: timeNow + config.refreshTokenExp * 1000
            });

            await SessionService.addRefreshSession(newRefreshSession);

            const accessToken = createJWT(user.email, user._id, config.accessTokenExp);

            return res.status(200).json({
                success: true,
                accessToken: accessToken,
                refreshToken: newRefreshSession.refreshToken
            });
        } catch (err) {
            res.status(500).json({ errors: err });
        }
    }
}

module.exports = { AuthController };
