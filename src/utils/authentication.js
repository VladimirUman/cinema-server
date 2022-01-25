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
            return next(error);
        }
    }

    return next();
};
