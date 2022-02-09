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
            errorMessage: 'Email should be correct'
        }
    },
    name: {
        in: ['body'],
        isString: true,
        isLength: {
            options: { min: 3, max: 50 },
            errorMessage: 'Length of the name should be within 3 and 50 symbols'
        }
    },
    lastName: {
        in: ['body'],
        isString: true,
        isLength: {
            options: { min: 3, max: 50 },
            errorMessage: 'Length of the lastName should be within 3 and 50 symbols'
        }
    }
};
