const { AuthController } = require('./auth');
const { MoviesController } = require('./movies');
const { UsersController } = require('./users');

module.exports = [AuthController, MoviesController, UsersController];
