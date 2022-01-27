const Session = require('../models/session');

class SessionService {
    static async addRefreshSession(refreshSession) {
        const userId = refreshSession.userId;

        const sessions = await Session.find({ userId: userId });

        if (sessions.length > process.env.TOKEN_REFRESH_COUNT) {
            await Session.deleteMany({ userId: userId });
        }

        await refreshSession.save();
    }

    static async removeAllSessionsByUser(userId) {
        Session.deleteMany({ userId: userId });
    }

    static async removeRefreshSession(refreshToken) {
        Session.deleteOne({ refreshToken: refreshToken });
    }
}

module.exports = { SessionService };
