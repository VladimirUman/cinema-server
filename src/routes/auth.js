const authRouter = require('express').Router();

const { AuthController } = require('../controllers/auth');

authRouter.route('/login').post(AuthController.login);

module.exports = authRouter;
