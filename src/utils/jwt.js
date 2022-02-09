const jwt = require('jsonwebtoken');

const { config } = require('../config/index');

exports.createJWT = (user, duration) => {
    const payload = {
        email: user.email,
        userId: user._id,
        role: user.role,
        duration
    };

    return jwt.sign(payload, config.tokenSecret, {
        expiresIn: Number(duration)
    });
};

exports.verifyJWT = (token) => {
    try {
        return jwt.verify(token, config.tokenSecret);
    } catch (_) {
        return;
    }
};
