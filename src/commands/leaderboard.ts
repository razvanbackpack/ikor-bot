import { register, type Command } from "./command";
import { db } from '../core/database';
import type { Message } from "stoat.js";
import { getXpToNextLevel } from "../services/xpService";
import IUserLevelData from "../interface/IUserLevelData";

const POSITIONS_TO_SHOW = 25;

const leaderboard: Command = {
  name: "leaderboard",
  description: "Show the server's level ranking",
  execute: async (message, args) => {
    await getLeaderboard(message);
  }
};

const getLeaderboard = async (message:Message) => {

  const usersLevelAndXp = getUsersLevelAndXp();
  const leaderboardData: string[] = [];

  if(usersLevelAndXp.length === 0) {
    await message.reply("No leaderboard data yet. Send messages and be the first!");
    return;
  }

  usersLevelAndXp.slice(0, POSITIONS_TO_SHOW).forEach((user, index) => {
    const rank = index+1;
    const xpNeeded = getXpToNextLevel(user.level);

    leaderboardData.push(
      `${rank}. **<@${user.userId}>** — Lv. **${user.level}** (XP: **${user.xp}/${xpNeeded}**)`
    );
    
  })

  await message.reply({
    embeds: [{
      title: "Server Leaderboard",
      description: leaderboardData.join("\n"),
      colour: "#00ff00"
    }]
  });
}

const getUsersLevelAndXp = () => {
    const GET_USERS_LEVEL_AND_XP_QUERY =
    `SELECT user_id as userId, level, xp FROM user_level_data
    ORDER BY level DESC, xp DESC`;

    const usersLevelAndXp = db.prepare(GET_USERS_LEVEL_AND_XP_QUERY);
    const usersLevelAndXpData = usersLevelAndXp.all();

    return usersLevelAndXpData as IUserLevelData[];
}

register(leaderboard);

