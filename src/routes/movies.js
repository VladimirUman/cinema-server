const movieRouter = require('express').Router();

const { MoviesController } = require('../controllers/movies');
const { validation } = require('../utils/validation');
const { createUpdateValidator } = require('../validations/movies');

movieRouter.route('/').post(validation(createUpdateValidator), MoviesController.createMovie);
movieRouter.route('/:id').put(validation(createUpdateValidator), MoviesController.updateMovie);
movieRouter.route('/:id').delete(MoviesController.deleteMovie);
movieRouter.route('/:id').get(MoviesController.getMovieById);
movieRouter.route('/').get(MoviesController.getMovies);

module.exports = movieRouter;
