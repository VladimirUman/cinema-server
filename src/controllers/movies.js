const Movie = require('../models/movie');
const { MovieService } = require('../services/movie');

class MoviesController {
    static async createMovie(req, res) {
        const movie = new Movie(req.body);

        try {
            await MovieService.create(movie);

            return res.status(201).json({
                success: true,
                id: movie._id,
                message: 'Movie created!'
            });
        } catch (err) {
            return res.status(500).json({ errors: err });
        }
    }

    static async updateMovie(req, res) {
        const body = req.body;

        try {
            const movie = await MovieService.findById(req.params.id);

            if (!movie) {
                return res.status(404).json({
                    err,
                    message: 'Movie not found!'
                });
            }

            movie.name = body.name;
            movie.time = body.time;
            movie.rating = body.rating;

            await MovieService.update(movie);

            return res.status(200).json({
                success: true,
                id: movie._id,
                message: 'Movie updated!'
            });
        } catch (err) {
            return res.status(500).json({ errors: err });
        }
    }

    static async deleteMovie(req, res) {
        try {
            const movie = await MovieService.findById(req.params.id);

            if (!movie) {
                return res
                    .status(404)
                    .json({ success: false, error: `Movie not found` });
            }

            await MovieService.delete(movie._id);

            return res.status(200).json({
                success: true,
                id: movie._id,
                message: 'Movie deleted!'
            });
        } catch (err) {
            return res.status(500).json({ errors: err });
        }
    }

    static async getMovieById(req, res) {
        try {
            const movie = await MovieService.findById(req.params.id);
            if (!movie) {
                return res
                    .status(404)
                    .json({ success: false, error: `Movie not found` });
            }

            return res.status(200).json({ success: true, data: movie });
        } catch (err) {
            return res.status(500).json({ errors: err });
        }
    }

    static async getMovies(req, res) {
        try {
            const movies = await MovieService.getAll();

            if (!movies.length) {
                return res
                    .status(404)
                    .json({ success: false, error: `Movie not found` });
            }

            return res.status(200).json({ success: true, data: movies });
        } catch (err) {
            return res.status(500).json({ errors: err });
        }
    }
}

module.exports = { MoviesController };
