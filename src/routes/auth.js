const authRouter = require('express').Router();

const { AuthController } = require('../controllers/auth');
const { validation } = require('../utils/validation');
const { loginValidator, registrationValidator, resetPasswordValidator } = require('../validations/auth');

authRouter.route('/login').post(validation(loginValidator), AuthController.login);

authRouter.route('/logout').post(AuthController.logout);

authRouter.route('/registration').post(validation(registrationValidator), AuthController.registraition);

authRouter.route('/confirm-registration').post(AuthController.confirmRegistration);

authRouter.route('/reset-password').post(validation(resetPasswordValidator), AuthController.resetPassword);

module.exports = authRouter;
