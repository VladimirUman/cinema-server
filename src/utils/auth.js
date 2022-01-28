const jwt = require('jsonwebtoken');

const { config } = require('../config/index');

exports.createJWT = (email, userId, duration) => {
    const payload = {
        email,
        userId,
        duration
    };

    return jwt.sign(payload, config.tokenSecret, {
        expiresIn: Number(duration)
    });
};
