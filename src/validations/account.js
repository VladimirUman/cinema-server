const { checkSchema } = require('express-validator');

const { validationRules } = require('./common');

const changePasswordValidator = checkSchema({
    newPassword: validationRules.password,
    oldPassword: validationRules.password
});
const changeEmailValidator = checkSchema({
    newEmail: validationRules.email
});

const updateAccountValidator = checkSchema({
    name: validationRules.name,
    lastName: validationRules.lastName
});

module.exports = { changePasswordValidator, changeEmailValidator, updateAccountValidator };
