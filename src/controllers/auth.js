const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

const User = require('../models/user');
const Session = require('../models/session');
const { createJWT } = require('../utils/auth');
const { sendConfirmToken } = require('../utils/mailer');
const { SessionService } = require('../services/session');

class AuthController {
    static async registraition(req, res) {
        let { name, email, password } = req.body;

        try {
            const user = await User.findOne({ email: email });

            if (user) {
                return res.status(422).json({
                    errors: [{ user: 'email already exists' }]
                });
            } else {
                const user = new User({
                    name: name,
                    email: email,
                    password: password
                });

                user.password = await bcrypt.hash(password, 10);

                let emailConfirmToken = createJWT(user.email, user._id, 3600);

                user.emailConfirmToken = emailConfirmToken;

                await user.save();

                sendConfirmToken(email, name, emailConfirmToken);

                return res.status(200).json({
                    success: true,
                    userId: user._id,
                    userName: user.name
                });
            }
        } catch (err) {
            res.status(500).json({ errors: err });
        }
    }

    static async confirmRegistration(req, res) {
        let { emailConfirmToken } = req.body;

        const tokenData = jwt.verify(emailConfirmToken, process.env.TOKEN_SECRET);

        const userId = tokenData.userId;

        try {
            const user = await User.findOne({ _id: userId });

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

                    await user.save();

                    return res.status(200).json({
                        success: true,
                        userId: user.id
                    });
                }
            }
        } catch (err) {
            console.log(err);
            return res.status(500).json({ errors: err });
        }
    }

    static async login(req, res) {
        let { email, password } = req.body;

        try {
            const user = await User.findOne({ email: email });

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

                const isMatch = bcrypt.compare(password, user.password);

                if (!isMatch) {
                    return res.status(400).json({
                        errors: [{ password: 'incorrect' }]
                    });
                }

                const accessToken = createJWT(user.email, user._id, 3600);

                const newRefreshSession = new Session({
                    refreshToken: uuidv4(),
                    userId: user.id,
                    expiresIn: new Date().getTime() + process.env.TOKEN_REFRESH_EXP * 1000
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
}

module.exports = { AuthController };
