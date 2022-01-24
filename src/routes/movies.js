const movieRouter = require('express').Router();

const { MoviesController } = require('../controllers/movies');

movieRouter.route('/').post(MoviesController.createMovie);
movieRouter.route('/:id').put(MoviesController.updateMovie);
movieRouter.route('/:id').delete(MoviesController.deleteMovie);
movieRouter.route('/:id').get(MoviesController.getMovieById);
movieRouter.route('/').get(MoviesController.getMovies);

module.exports = movieRouter;
