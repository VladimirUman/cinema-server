const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        emailConfirmToken: {
            type: String
        },
        resetPasswordToken: {
            type: String
        }
    },
    {
        timestamps: true,
        collection: 'users'
    }
);

module.exports = mongoose.model('User', User);
