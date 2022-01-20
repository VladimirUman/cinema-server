const appRouter = require('express').Router();

const authRouter = require('./auth');
const userRouter = require('./users');

appRouter.use('/auth', authRouter);
appRouter.use('/users', userRouter);

module.exports = appRouter;
