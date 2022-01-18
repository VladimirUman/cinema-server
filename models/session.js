const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Session = new Schema(
    {
        userId: {
            type: String,
            required: true
        },
        refreshToken: {
            type: String,
            required: true
        },
        expiresIn: {
            type: Number,
            required: true
        },
        fingerprint: {
            type: String,
            required: true
        },
        ua: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true,
        collection: 'sessions'
    }
);

module.exports = mongoose.model('Session', Session);
