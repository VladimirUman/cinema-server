require('dotenv').config();

exports.configJson = {
    development: {
        database: process.env.DATABASE,
        port: process.env.PORT,
        tokenCount: process.env.TOKEN_REFRESH_COUNT,
        tokenExp: process.env.TOKEN_REFRESH_EXP,
        tokenSecret: process.env.TOKEN_SECRET
    },

    test: {
        database: process.env.DATABASE,
        port: process.env.PORT,
        tokenCount: process.env.TOKEN_REFRESH_COUNT,
        tokenExp: process.env.TOKEN_REFRESH_EXP,
        tokenSecret: process.env.TOKEN_SECRET
    },

    production: {
        database: process.env.DATABASE,
        port: process.env.PORT,
        tokenCount: process.env.TOKEN_REFRESH_COUNT,
        tokenExp: process.env.TOKEN_REFRESH_EXP,
        tokenSecret: process.env.TOKEN_SECRET
    }
};
