exports.validationRules = {
    password: {
        in: ['body'],
        isLength: {
            errorMessage: 'Password should be at least 8 chars long',
            options: { min: 8 }
        }
    },
    email: {
        in: ['body'],
        isEmail: {
            errorMessage: 'Value should be an email'
        }
    }
};
