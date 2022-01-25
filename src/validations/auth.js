const { checkSchema } = require('express-validator');

const { validationRules } = require('./common');

const loginValidator = checkSchema({
    password: validationRules.password,
    email: {
        in: ['body'],
        isEmail: {
            errorMessage: 'Value should be an email'
        }
    }
});

const registrationValidator = checkSchema({
    password: validationRules.password,
    email: {
        in: ['body'],
        isEmail: {
            errorMessage: 'Value should be an email'
        }
    },
    name: {
        in: ['body'],
        isString: true,
        isLength: {
            options: { min: 3, max: 50 },
            errorMessage: 'Length of the value should be within 3 and 50 symbols'
        }
    },
    lastName: {
        in: ['body'],
        isString: true,
        isLength: {
            options: { min: 3, max: 50 },
            errorMessage: 'Length of the value should be within 3 and 50 symbols'
        }
    }
});

module.exports = { loginValidator, registrationValidator };
