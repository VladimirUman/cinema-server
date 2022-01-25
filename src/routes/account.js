const userRouter = require('express').Router();

const { AccountController } = require('../controllers/account');

userRouter.route('/change-password').put(AccountController.changePassword);

module.exports = userRouter;
