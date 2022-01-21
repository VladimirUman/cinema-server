const Movie = require('../models/movie');

class MovieService {
    static async findById(movieId) {
        return await Movie.findOne({ _id: movieId });
    }

    static async getAll() {
        return await Movie.find({});
    }

    static async create(movie) {
        await movie.save();
    }

    static async update(movie) {
        await movie.save();
    }

    static async delete(movieId) {
        await Movie.deleteOne({ _id: movieId });
    }
}

module.exports = { MovieService };
