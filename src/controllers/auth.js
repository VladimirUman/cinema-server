const router = require('express').Router();
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

const User = require('../models/user');
const Session = require('../models/session');
const { loginValidator, registrationValidator } = require('./vlidations/auth');
const { createJWT } = require('../utils/auth');
const { sendConfirmToken } = require('../utils/mailer');

class AuthController {
    get router() {
        router.post('/auth/login', loginValidator, this.login);
        router.post(
            '/auth/registration',
            registrationValidator,
            this.registraition
        );
        router.post('/auth/confirm-email', this.confirmRegistration);

        return router;
    }

    registraition(req, res) {
        let { name, lastName, email, password } = req.body;

        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            return res.status(400).json({ errors: validationErrors.array() });
        }

        User.findOne({ email: email })
            .then((user) => {
                if (user) {
                    return res
                        .status(422)
                        .json({ errors: [{ user: 'email already exists' }] });
                } else {
                    const user = new User({
                        name: name,
                        lastName: lastName,
                        email: email,
                        password: password
                    });

                    bcrypt.genSalt(10, function (err, salt) {
                        bcrypt.hash(password, salt, function (err, hash) {
                            if (err) throw err;

                            user.password = hash;

                            let emailConfirmToken = createJWT(
                                user.email,
                                user._id,
                                3600
                            );

                            user.emailConfirmToken = emailConfirmToken;

                            user.save()
                                .then((response) => {
                                    sendConfirmToken(
                                        email,
                                        name,
                                        emailConfirmToken
                                    );

                                    res.status(200).json({
                                        success: true,
                                        result: response
                                    });
                                })
                                .catch((err) => {
                                    res.status(500).json({
                                        errors: [{ error: err }]
                                    });
                                });
                        });
                    });
                }
            })
            .catch((err) => {
                res.status(500).json({
                    errors: [{ error: 'Something went wrong' }]
                });
            });
    }

    confirmRegistration(req, res) {
        let { emailConfirmToken } = req.body;

        const tokenData = jwt.verify(
            emailConfirmToken,
            process.env.TOKEN_SECRET
        );
        const { userId } = tokenData;

        User.findOne({ _id: userId })
            .then((user) => {
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

                        user.save()
                            .then((response) => {
                                res.status(200).json({
                                    success: true,
                                    result: response
                                });
                            })
                            .catch((err) => {
                                res.status(500).json({
                                    errors: [{ error: err }]
                                });
                            });
                    }
                }
            })
            .catch((err) => {
                res.status(500).json({ erros: err });
            });
    }

    login(req, res) {
        let { email, password } = req.body;

        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            return res.status(400).json({ errors: validationErrors.array() });
        }

        User.findOne({ email: email })
            .then((user) => {
                if (!user) {
                    return res.status(404).json({
                        errors: [{ user: 'not found' }]
                    });
                } else {
                    bcrypt.compare(password, user.password).then((isMatch) => {
                        if (!isMatch) {
                            return res.status(400).json({
                                errors: [{ password: 'incorrect' }]
                            });
                        }

                        const accessToken = createJWT(
                            user.email,
                            user._id,
                            3600
                        );

                        const newRefreshSession = new Session({
                            refreshToken: uuidv4(),
                            userId: user.id,
                            expiresIn:
                                new Date().getTime() +
                                process.env.TOKEN_REFRESH_EXP * 1000
                        });

                        newRefreshSession
                            .save()
                            .then(() => {
                                return res.status(200).json({
                                    success: true,
                                    accessToken: accessToken,
                                    refreshToken:
                                        newRefreshSession.refreshToken,
                                    message: user
                                });
                            })
                            .catch((err) => {
                                res.status(500).json({ errors: err });
                            });
                    });
                }
            })
            .catch((err) => {
                res.status(500).json({ errors: err });
            });
    }
}

module.exports = { AuthController };
