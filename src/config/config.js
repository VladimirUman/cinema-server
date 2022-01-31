require('dotenv').config();

exports.configJson = {
    development: {
        database: process.env.DATABASE,
        port: process.env.PORT,
        refreshTokenCount: process.env.TOKEN_REFRESH_COUNT,
        refreshTokenExp: process.env.TOKEN_REFRESH_EXP,
        accessTokenExp: process.env.TOKEN_ACCESS_EXP,
        tokenSecret: process.env.TOKEN_SECRET,
        clientUrl: process.env.CLIENT_URL
    },

    test: {
        database: process.env.DATABASE,
        port: process.env.PORT,
        refreshTokenCount: process.env.TOKEN_REFRESH_COUNT,
        refreshTokenExp: process.env.TOKEN_REFRESH_EXP,
        accessTokenExp: process.env.TOKEN_ACCESS_EXP,
        tokenSecret: process.env.TOKEN_SECRET,
        clientUrl: process.env.CLIENT_URL
    },

    production: {
        database: process.env.DATABASE,
        port: process.env.PORT,
        refreshTokenCount: process.env.TOKEN_REFRESH_COUNT,
        refreshTokenExp: process.env.TOKEN_REFRESH_EXP,
        accessTokenExp: process.env.TOKEN_ACCESS_EXP,
        tokenSecret: process.env.TOKEN_SECRET,
        clientUrl: process.env.CLIENT_URL
    }
};
