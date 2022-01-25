const { checkSchema } = require('express-validator');

const { validationRules } = require('./common');

const changePasswordValidator = checkSchema({
    newPassword: validationRules.password,
    oldPassword: validationRules.password
});

module.exports = { changePasswordValidator };
