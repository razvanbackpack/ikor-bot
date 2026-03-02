import { db } from "../core/database";
import User from "../core/user";
import { Message } from "stoat.js";
import logger from "../util/logger";
import { BotEvents } from "../core/botEvents";
import IUserLevelData from "../interface/IUserLevelData";
import IChatReply from "../interface/IChatReply";
import { MESSAGE_STRINGS } from "../core/config";
import { BOT_INFO } from "../core/config";

const LOGGER_CATEGORY_XP = "XP_GAIN";
const LOGGER_CATEGORY_LEVEL = "LEVEL_UP";

export async function handleXPforCurrentMessage(message: Message) {
  const userId = message.author?.id || "0";
  if(userId === "0") {
    logger.error(LOGGER_CATEGORY_XP, "Invalid user ID", {userId:userId})
    return;
  }
  const user = await User.create(userId);
  let userLevelData = user.getLevelData();
  const lastMessageAt = Number(userLevelData?.lastMessageAt);
  const now = Math.floor(Date.now() / 1000);
  const xpToAdd = BOT_INFO.xp_system.xp_per_message * BOT_INFO.xp_system.modifier;
  let increaseResult = {
    xpAdded: 0,
    levelUp: false,
    newLevel: 0
  };


  if(userLevelData == null || !Number.isFinite(lastMessageAt)) {
    logger.error(LOGGER_CATEGORY_XP, "User data is empty", {userId:userId});
  }

  if(now - lastMessageAt >= BOT_INFO.xp_system.cooldown)
    increaseResult = increaseUserXp(userId, userLevelData as IUserLevelData, xpToAdd);

  if(increaseResult.levelUp) {
    const levelUpMessage = MESSAGE_STRINGS.levelup_message.replace("#NEW_LEVEL#", increaseResult.newLevel.toString());
    const chatData: IChatReply = {
      content: levelUpMessage
    };
    
    BotEvents.emit("chat:reply", {message, chatData});
  }
}

export function getXpToNextLevel(currentLevel: number) {
  let xpToNextLevel = 0;
  if(BOT_INFO.xp_system.exponent > 0)
    xpToNextLevel = Math.floor(BOT_INFO.xp_system.base * Math.pow(currentLevel, BOT_INFO.xp_system.exponent));
  else
    xpToNextLevel = BOT_INFO.xp_system.base * currentLevel * currentLevel;

  return xpToNextLevel;
}

function increaseUserXp(userId:string, userLevelData: IUserLevelData, xpToAdd: number) {
  const currentUserXp = userLevelData.xp;
  let newUserXp = currentUserXp + xpToAdd;
  let totalUserXp = userLevelData.xpTotal;
  let requiredXpToNextLevel = getXpToNextLevel(userLevelData.level);
  let increaseResults = {
    xpAdded: newUserXp,
    levelUp: false,
    newLevel: 0
  };

  if(newUserXp >= requiredXpToNextLevel)
  {
    newUserXp -= requiredXpToNextLevel;
    let newUserLevel = increaseUserLevel(userId, userLevelData)
    if(newUserLevel != null) {
      increaseResults.levelUp = true;
      increaseResults.newLevel = newUserLevel;
    }
  }

  let newTotalUserXp = totalUserXp + xpToAdd;

  const INCREASE_USER_EXP_QUERY =
  `UPDATE user_level_data
  SET xp = ?,
    xp_total = ?,
    last_message_at = ?
  WHERE user_id = ?`;

  try {
    const increaseUserExp = db.prepare(INCREASE_USER_EXP_QUERY);
    const increaseUserExpRun = increaseUserExp.run(newUserXp, newTotalUserXp,  Math.floor(Date.now() / 1000), userId);
    if(increaseUserExpRun.changes === 1) {
      logger.info(LOGGER_CATEGORY_XP, `>> XP: ${xpToAdd} to ${userId}`)
      increaseResults.xpAdded = xpToAdd;
    }
  } catch (error) {
    logger.error(LOGGER_CATEGORY_XP, "Failed to increase user XP", { error });
  }

  return increaseResults;
}

function increaseUserLevel(userId: string, userLevelData: IUserLevelData): number|null {
  const newUserLevel = userLevelData.level+1;

  const INCREASE_USER_LEVEL_QUERY =
  `UPDATE user_level_data
  SET level = ?,
    last_level_at = ?
  WHERE user_id = ?`;

  try {
    const increaseUserLevel = db.prepare(INCREASE_USER_LEVEL_QUERY);
    const increaseLevelRun = increaseUserLevel.run(newUserLevel,  Math.floor(Date.now() / 1000), userId);

    if(increaseLevelRun.changes === 1) {
      logger.info(LOGGER_CATEGORY_LEVEL, `>> LEVEL: ${newUserLevel} for ${userId}`)
      return newUserLevel;
    }
  } catch (error) {
    logger.error("LEVEL_UP", "Failed to increase user level", { error });
  }

  return null;
}
