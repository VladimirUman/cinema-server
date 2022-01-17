const router = require('express').Router()
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('../models/user-model');
const { createJWT } = require('../utils/auth');

const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

class AuthController {
    get router () {
        router.post('/auth/login', this.login)
        router.post('/auth/registration', this.registraition)

        return router
    }

    registraition(req, res) {
        let { name, email, password, password_confirmation } = req.body;
    
        let validationErrors = [];
    
        if (!name) {
            validationErrors.push({ name: "required" });
        }
        if (!email) {
            validationErrors.push({ email: "required" });
        }
        if (!emailRegexp.test(email)) {
            validationErrors.push({ email: "invalid" });
        }
        if (!password) {
            validationErrors.push({ password: "required" });
        }
        if (!password_confirmation) {
            validationErrors.push({ password_confirmation: "required" });
        }
        if (password != password_confirmation) {
            validationErrors.push({ password: "mismatch" });
        }
        if (validationErrors.length > 0) {
            return res.status(422).json({ errors: validationErrors });
        }
    
        User.findOne({email: email})
            .then(user => {
                if (user) {
                    return res.status(422).json({ errors: [{ user: 'email already exists' }] });
                } else {
                    const user = new User({
                        name: name,
                        email: email,
                        password: password,
                    });
    
                    bcrypt.genSalt(10, function(err, salt) { bcrypt.hash(password, salt, function(err, hash) {
                        if (err) throw err;
    
                        user.password = hash;
                        user.save()
                            .then(response => {
                                res.status(200).json({
                                    success: true,
                                    result: response
                                })
                            })
                            .catch(err => {
                                res.status(500).json({
                                    errors: [{ error: err }]
                                });
                            });
                        });
                    });
                }
            }).catch(err => {
                res.status(500).json({
                    errors: [{ error: 'Something went wrong' }]
                });
            })
    }

    login(req, res) {
        let { email, password } = req.body;

        let validationErrors = [];

        if (!email) {
            validationErrors.push({ email: "required" });
        }
        if (!emailRegexp.test(email)) {
            validationErrors.push({ email: "invalid email" });
        }
        if (!password) {
            validationErrors.push({ passowrd: "required" });
        }
        if (validationErrors.length > 0) {
            return res.status(422).json({ errors: validationErrors });
        }

        User.findOne({ email: email }).then(user => {
            if (!user) {
                return res.status(404).json({
                    errors: [{ user: 'not found' }],
                });
            } else {
                bcrypt.compare(password, user.password).then(isMatch => {
                    if (!isMatch) {
                        return res.status(400).json({ errors: [{ password: 'incorrect' }]});
                    }

                    let access_token = createJWT(
                        user.email,
                        user._id,
                        3600
                    );

                    jwt.verify(access_token, process.env.TOKEN_SECRET, (err, decoded) => {
                        if (err) {
                            res.status(500).json({ erros: err });
                        }

                        if (decoded) {
                            return res.status(200).json({
                                success: true,
                                token: access_token,
                                message: user
                            });
                        }
                    });
                }).catch(err => {
                    res.status(500).json({ erros: err });
                });
            }
        }).catch(err => {
            res.status(500).json({ erros: err });
        });
    }
}

module.exports = { AuthController }
