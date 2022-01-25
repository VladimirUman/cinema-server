const jwt = require('jsonwebtoken');

exports.authenticate = (req, res, next) => {
    const token = req.headers['authorization'] || req.headers['Authorization'];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    if (token) {
        try {
            const tokenData = jwt.verify(token, process.env.TOKEN_SECRET);

            req.currentUser = {
                id: tokenData.userId,
                role: 'user',
                email: tokenData.email,
                expiresIn: Number(tokenData.exp)
            };
        } catch (error) {
            if (error.code === 'TOKEN_EXPIRED_ERROR') {
                return res.status(419).json({ message: 'Token expired' });
            }

            return res.status(401).json({ message: 'Unauthorized' });
        }
    }

    return next();
};
