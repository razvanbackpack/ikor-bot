import { register, type Command } from "./command";
import BOT_INFO from "../core/config";

const info: Command = {
  name: "info",
  description: "Bot info",
  execute: async(message, args) => {
    await message.reply({
      embeds: [{
        title: BOT_INFO.name +" v"+BOT_INFO.version + "- NYON Bot",
        description:
        "Features: \n \
        - XP System: " + (BOT_INFO.features.xp_system ? 'enabled' : 'disabled') + "\n \
        - Commands:"  + (BOT_INFO.features.commands ? 'enabled' : 'disabled') + " \
        \n\n*Version " + BOT_INFO.name +" v"+BOT_INFO.version+"*",
        colour: "#5865F2"
      }]
    });
  }
};

register(info);
