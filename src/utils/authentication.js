const jwt = require('jsonwebtoken');

const { config } = require('../config/index');

exports.authenticate = (req, res, next) => {
    const token = req.headers['authorization'] || req.headers['Authorization'];

    if (!token) {
        return res.status(401).json({ errors: 'Unauthorized' });
    }

    if (token) {
        try {
            const tokenData = jwt.verify(token, config.tokenSecret);

            req.currentUser = {
                id: tokenData.userId,
                role: tokenData.role,
                email: tokenData.email,
                expiresIn: Number(tokenData.exp)
            };
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                return res.status(419).json({ errors: 'Token expired' });
            }

            return res.status(401).json({ errors: 'Unauthorized' });
        }
    }

    return next();
};
