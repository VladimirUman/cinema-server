const { checkSchema } = require('express-validator');

const { validationRules } = require('./common');

const loginValidator = checkSchema({
    password: validationRules.password,
    email: validationRules.email
});

const registrationValidator = checkSchema({
    password: validationRules.password,
    email: validationRules.email,
    name: validationRules.name,
    lastName: validationRules.lastName
});

const resetPasswordValidator = checkSchema({
    email: validationRules.email
});

const confirmNewPasswordValidator = checkSchema({
    password: validationRules.password,
    resetPasswordToken: {
        in: ['body'],
        isString: true,
        errorMessage: 'Value must exist'
    }
});

const refreshTokenValidator = checkSchema({
    refreshToken: {
        in: ['body'],
        isString: true,
        errorMessage: 'Value must exist'
    }
});

const emailTokenValidator = checkSchema({
    emailConfirmToken: {
        in: ['body'],
        isString: true,
        errorMessage: 'Value must exist'
    }
});

module.exports = {
    loginValidator,
    registrationValidator,
    resetPasswordValidator,
    confirmNewPasswordValidator,
    refreshTokenValidator,
    emailTokenValidator
};
