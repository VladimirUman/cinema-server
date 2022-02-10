const jwt = require('jsonwebtoken');

const { config } = require('../config/index');
const { Roles } = require('../services/user');

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

exports.authenticateAdmin = (req, res, next) => {
    const currentUser = req.currentUser;

    if (currentUser.role !== Roles.ADMIN) {
        return res.status(403).json({ errors: 'Forbiden' });
    }

    return next();
};
