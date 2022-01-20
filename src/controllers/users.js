const router = require('express').Router();

const User = require('../models/user');

class UsersController {
    get router() {
        router.post('/user', this.createUser);
        router.put('/user/:id', this.updateUser);
        router.delete('/user/:id', this.deleteUser);
        router.get('/user/:id', this.getUserById);
        router.get('/users', this.getUsers);

        return router;
    }

    createUser(req, res) {
        const body = req.body;

        if (!body) {
            return res.status(400).json({
                success: false,
                error: 'You must provide a user'
            });
        }

        const user = new User(body);

        if (!user) {
            return res.status(400).json({ success: false, error: err });
        }

        user.save()
            .then(() => {
                return res.status(201).json({
                    success: true,
                    id: user._id,
                    message: 'User created!'
                });
            })
            .catch((error) => {
                return res.status(400).json({
                    error,
                    message: 'User not created!'
                });
            });
    }

    async updateUser(req, res) {
        const body = req.body;

        if (!body) {
            return res.status(400).json({
                success: false,
                error: 'You must provide a body to update'
            });
        }

        User.findOne({ _id: req.params.id }, (err, user) => {
            if (err) {
                return res.status(404).json({
                    err,
                    message: 'User not found!'
                });
            }
            user.name = body.name;
            user.lastName = body.lastName;

            user.email = body.email;

            user.save()
                .then(() => {
                    return res.status(200).json({
                        success: true,
                        id: user._id,
                        message: 'User updated!'
                    });
                })
                .catch((error) => {
                    return res.status(404).json({
                        error,
                        message: 'User not updated!'
                    });
                });
        });
    }

    async deleteUser(req, res) {
        await User.findOneAndDelete({ _id: req.params.id }, (err, user) => {
            if (err) {
                return res.status(400).json({ success: false, error: err });
            }

            if (!user) {
                return res
                    .status(404)
                    .json({ success: false, error: `User not found` });
            }

            return res.status(200).json({ success: true, data: user });
        })
            .clone()
            .catch((err) => console.log(err));
    }

    async getUserById(req, res) {
        await User.findOne({ _id: req.params.id }, (err, user) => {
            if (err) {
                return res.status(400).json({ success: false, error: err });
            }

            if (!user) {
                return res
                    .status(404)
                    .json({ success: false, error: `User not found` });
            }
            return res.status(200).json({ success: true, data: user });
        })
            .clone()
            .catch((err) => console.log(err));
    }

    async getUsers(req, res) {
        await User.find({}, (err, users) => {
            if (err) {
                return res.status(400).json({ success: false, error: err });
            }
            if (!users.length) {
                return res
                    .status(404)
                    .json({ success: false, error: `User not found` });
            }
            return res.status(200).json({ success: true, data: users });
        })
            .clone()
            .catch((err) => console.log(err));
    }
}

module.exports = { UsersController };
