import { type Command } from "../core/command";
import { db } from '../core/database';
import { getXpToNextLevel } from "../services/xpService";
import IUserLevelData from "../interface/IUserLevelData";
import { MESSAGE_STRINGS } from "../core/config";
import { emitMessage, MESSAGE_EVENTS, MESSAGE_TYPES } from "../services/messageService";
import { Message } from "stoat.js";

const POSITIONS_TO_SHOW = 25;

const leaderboard: Command = {
  name: "leaderboard",
  disabled: false,
  description: "Show the server's level ranking",
  execute: async (message, args: string[]) => {
    await outputLeaderboard(message);
  }
};

const outputLeaderboard = async (message:Message) => {
  const usersLevelAndXp = getUsersLevelAndXp();
  const leaderboardData: string[] = [];

  if(usersLevelAndXp.length === 0) {
    emitMessage(MESSAGE_EVENTS.REPLY, MESSAGE_TYPES.MESSAGE, message, "No leaderboard data yet. Send messages and be the first!");
    return;
  }

  usersLevelAndXp.slice(0, POSITIONS_TO_SHOW).forEach((user, index) => {
    const rank = index+1;
    const xpNeeded = getXpToNextLevel(user.level);

    leaderboardData.push(
      `${rank}. **<@${user.userId}>** — Lv. **${user.level}** (XP: **${user.xp}/${xpNeeded}**) [**${user.xp_total}** total XP]`
    );
    
  });

  const embed = {
    title: MESSAGE_STRINGS.leaderboard_title,
    description: leaderboardData.join("\n"),
    colour: "#00ff00"
  };

  emitMessage(MESSAGE_EVENTS.EMBED, MESSAGE_TYPES.EMBED, message, embed);
}

const getUsersLevelAndXp = () => {
    const GET_USERS_LEVEL_AND_XP_QUERY =
    `SELECT user_id as userId, level, xp, xp_total FROM user_level_data
    ORDER BY level DESC, xp DESC`;

    const usersLevelAndXp = db.prepare(GET_USERS_LEVEL_AND_XP_QUERY);
    const usersLevelAndXpData = usersLevelAndXp.all();

    return usersLevelAndXpData as IUserLevelData[];
}

export default leaderboard;