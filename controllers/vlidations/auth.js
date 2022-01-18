const { checkSchema } = require('express-validator');

exports.loginValidator = checkSchema({
  password: {
    in: ['body'],
    isLength: {
      errorMessage: 'Password should be at least 7 chars long',
      options: { min: 7 }
    }
  },
  email: {
    in: ['body'],
    isEmail: {
      bail: true
    }
  }
});
