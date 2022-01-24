const Movie = require('../models/movie');

class MovieService {
    static async findById(movieId) {
        return await Movie.findOne({ _id: movieId });
    }

    static async getAll() {
        return await Movie.find({});
    }

    static async create(movie) {
        return await Movie.create(movie);
    }

    static async update(movie) {
        return await Movie.findOneAndUpdate({ _id: movie._id }, movie, {
            new: true
        });
    }

    static async delete(movieId) {
        await Movie.deleteOne({ _id: movieId });
    }
}

module.exports = { MovieService };
