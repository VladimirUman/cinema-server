const Movie = require('../models/movie');

class MovieService {
    static async findById(movieId) {
        return await Movie.findOne({ _id: movieId });
    }

    static getAll() {
        return Movie.find({});
    }

    static create(movie) {
        return Movie.create(movie);
    }

    static update(movie) {
        return Movie.findOneAndUpdate({ _id: movie._id }, movie, {
            new: true
        });
    }

    static delete(movieId) {
        Movie.deleteOne({ _id: movieId });
    }
}

module.exports = { MovieService };
