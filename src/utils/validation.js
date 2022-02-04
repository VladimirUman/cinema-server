const { validationResult } = require('express-validator');

exports.validation = (schema) => {
    return async (req, res, next) => {
        await Promise.all(schema.map((validation) => validation.run(req)));

        const validationErrors = validationResult(req);

        if (!validationErrors.isEmpty()) {
            return res.status(400).json({ validationErrors: validationErrors.array() });
        }

        return next();
    };
};
