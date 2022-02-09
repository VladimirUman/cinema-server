const userRouter = require('express').Router();

const { AccountController } = require('../controllers/account');
const { validation } = require('../utils/validation');
const { changePasswordValidator, changeEmailValidator, updateAccountValidator } = require('../validations/account');

userRouter.route('/change-password').put(validation(changePasswordValidator), AccountController.changePassword);
userRouter.route('/').get(AccountController.getAccount);
userRouter.route('/').put(validation(updateAccountValidator), AccountController.updateAccount);

userRouter.route('/change-email').put(validation(changeEmailValidator), AccountController.changeEmail);
userRouter.route('/confirm-email').post(AccountController.confirmEmail);
userRouter.route('/cancel-change-email').post(AccountController.cancelEmailChanging);
userRouter.route('/resent-email-new-token').post(AccountController.resendConfirmNewEmailToken);

module.exports = userRouter;
