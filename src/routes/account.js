const userRouter = require('express').Router();

const { AccountController } = require('../controllers/account');
const { validation } = require('../utils/validation');
const { changePasswordValidator } = require('../validations/account');

userRouter.route('/change-password').put(validation(changePasswordValidator), AccountController.changePassword);
userRouter.route('/').get(AccountController.getAccount);

module.exports = userRouter;
