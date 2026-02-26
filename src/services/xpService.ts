import { db } from "../core/database";
import User from "../core/user";
import { Message } from "stoat.js";
import logger from "../util/logger";

import IUserLevelData from "../interface/IUserLevelData";

const COOLDOWN = 10;
const MODIFIER = 1;

const XP_PER_MESSAGE = 10;
const XP_EXPONENT = 0; // 0 - disabled
const XP_BASE = 20;
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
  const xpToAdd = XP_PER_MESSAGE * MODIFIER;
  let increaseResult = {
    xpAdded: 0,
    levelUp: false,
    newLevel: 0
  };


  if(userLevelData == null || !Number.isFinite(lastMessageAt)) {
    logger.error(LOGGER_CATEGORY_XP, "User data is empty", {userId:userId});
  }

  if(now - lastMessageAt >= COOLDOWN)
    increaseResult = increaseUserXp(userId, userLevelData as IUserLevelData, xpToAdd);

  if(increaseResult.levelUp) {
    message.reply(`Congratulations! You leveled up to ${increaseResult.newLevel}!`);
  }
}

export function getXpToNextLevel(currentLevel: number) {
  let xpToNextLevel = 0;
  if(XP_EXPONENT > 0)
    xpToNextLevel = Math.floor(XP_BASE * Math.pow(currentLevel, XP_EXPONENT));
  else
    xpToNextLevel = XP_BASE * currentLevel * currentLevel;

  return xpToNextLevel;
}

function increaseUserXp(userId:string, userLevelData: IUserLevelData, xpToAdd: number) {
  const currentUserXp = userLevelData.xp;
  let newUserXp = currentUserXp + xpToAdd;
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

  const INCREASE_USER_EXP_QUERY =
  `UPDATE user_level_data
  SET xp = ?,
    last_message_at = ?
  WHERE user_id = ?`;

  try {
    const increaseUserExp = db.prepare(INCREASE_USER_EXP_QUERY);
    const increaseUserExpRun = increaseUserExp.run(newUserXp,  Math.floor(Date.now() / 1000), userId);
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


