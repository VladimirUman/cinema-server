const Session = require('../models/session');

class SessionService {
    static async addRefreshSession(refreshSession) {
        const userId = refreshSession.userId;

        const sessions = await Session.find({ userId: userId });

        if (sessions.length > process.env.TOKEN_REFRESH_COUNT) {
            await Session.remove({ userId: userId });
        }

        await refreshSession.save();
    }

    static async removeRefreshSession(refreshToken) {
        Session.remove({ refreshToken: refreshToken });
    }
}

module.exports = { SessionService };
