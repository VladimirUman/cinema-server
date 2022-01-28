const Session = require('../models/session');
const { config } = require('../config/index');

class SessionService {
    static async addRefreshSession(refreshSession) {
        const userId = refreshSession.userId;

        const sessions = await Session.find({ userId: userId });

        if (sessions.length >= config.refreshTokenCount) {
            await Session.deleteMany({ userId: userId });
        }

        await refreshSession.save();
    }

    static async removeAllSessionsByUser(userId) {
        await Session.deleteMany({ userId: userId });
    }

    static async removeRefreshSession(refreshToken) {
        await Session.deleteOne({ refreshToken: refreshToken });
    }

    static getRefreshSession(refreshToken) {
        return Session.findOne({ refreshToken: refreshToken });
    }
}

module.exports = { SessionService };
