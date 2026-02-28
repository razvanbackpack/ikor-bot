import { db } from './database';
import IUserLevelData from '../interface/IUserLevelData';
class User {
    userId: string;

    constructor(userId: string) {
        this.userId = userId;
    }

    /**
     * Gets the level data of a user.
     * @returns IUserLevelData | null
     */
    getLevelData(): IUserLevelData | null {
        const QUERY =
        `SELECT level.user_id as userId,
            level.xp,
            level.xp_total,
            level.level,
            level.last_message_at as lastMessageAt,
            level.last_level_at as lastLevelAt
        FROM user
        LEFT JOIN user_level_data level
            ON user.id = level.user_id
        WHERE user.id = ?`;

        const userData = db.prepare(QUERY);
        let data = userData.get(this.userId);
        
        return (data as IUserLevelData) ?? null;
    }

    static async create(userId: string): Promise<User> {

        const user = new User(userId);

        const doesUserExist = db.prepare("SELECT id FROM user WHERE id = ?").get(userId);

        if(!doesUserExist) {
            const now = Math.floor(Date.now() / 1000);
            const createUserTx = db.transaction(() => {
                db.prepare("INSERT INTO user(id) VALUES(?)").run(userId);
                db.prepare(`
                    INSERT INTO user_level_data(user_id, xp, level, last_message_at, last_level_at)
                    VALUES(?, ?, ?, ?, ?)
                `).run(userId, 0, 1, now, now);

            });
            createUserTx();
       }

        return user;
    }

}

export default User;
