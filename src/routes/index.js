const appRouter = require('express').Router();

const authRouter = require('./auth');

appRouter.use('/auth', authRouter);

module.exports = appRouter;
