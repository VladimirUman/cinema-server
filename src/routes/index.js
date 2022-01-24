const appRouter = require('express').Router();

const authRouter = require('./auth');
const userRouter = require('./users');
const movieRouter = require('./movies');

appRouter.use('/auth', authRouter);
appRouter.use('/users', userRouter);
appRouter.use('/movies', movieRouter);

module.exports = appRouter;
