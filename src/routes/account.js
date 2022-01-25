const userRouter = require('express').Router();

const { AccountController } = require('../controllers/account');

userRouter.route('/change-password').put(AccountController.changePassword);

userRouter.route('/change-email').put(AccountController.changeEmail);

module.exports = userRouter;
