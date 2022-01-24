const { checkSchema } = require('express-validator');

const createUpdateValidator = checkSchema({
    name: {
        in: ['body'],
        isString: true,
        isLength: {
            options: { min: 3, max: 50 },
            errorMessage: 'Length of the value should be within 3 and 50 symbols'
        }
    },
    time: {
        in: ['body'],
        errorMessage: 'Should be up to 10 values',
        isArray: {
            options: { max: 10 }
        }
    },
    'time.*': {
        in: ['body'],
        isString: true,
        custom: {
            options: (value) => {
                if (!value.match(/^([0-9]{1,2}):([0-9]{2})$/)) {
                    throw new Error('value should be in HH:MM format');
                }

                return true;
            }
        }
    },
    rating: {
        in: ['body'],
        isInt: {
            options: { min: 0, max: 10 },
            errorMessage: 'Should be number from 0 to 10'
        },
        toInt: true
    }
});

module.exports = { createUpdateValidator };
