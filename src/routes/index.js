const appRouter = require('express').Router();

const authRouter = require('./auth');
const userRouter = require('./users');
const movieRouter = require('./movies');
const accountRouter = require('./account');

const { authenticate } = require('../utils/authentication');

appRouter.use('/auth', authRouter);
appRouter.use('/users', authenticate, userRouter);
appRouter.use('/movies', authenticate, movieRouter);
appRouter.use('/account', authenticate, accountRouter);

module.exports = appRouter;
