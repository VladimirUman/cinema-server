const authRouter = require('express').Router();

const { AuthController } = require('../controllers/auth');
const {
    loginValidator,
    registrationValidator
} = require('../validations/auth');

authRouter.route('/login').post(loginValidator, AuthController.login);

authRouter
    .route('/registration')
    .post(registrationValidator, AuthController.registraition);

authRouter
    .route('/confirm-registration')
    .post(AuthController.confirmRegistration);

module.exports = authRouter;
