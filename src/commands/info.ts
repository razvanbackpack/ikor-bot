import { type Command } from "../core/command";
import { BOT_INFO } from "../core/config";
import { emitMessage, MESSAGE_EVENTS, MESSAGE_TYPES } from "../services/messageService";
import { Message } from "stoat.js";

const info: Command = {
  name: "info",
  disabled: false,
  description: "Bot info",
  execute: async (message: Message, args: string[]) => {

    const embed = {
      type: "Text",
      title: BOT_INFO.name + " v" + BOT_INFO.version + "- NYON Bot",
      description:
        "Features: \n \
          - XP System: " + (BOT_INFO.features.xp_system ? 'enabled' : 'disabled') + "\n \
          - Commands:"  + (BOT_INFO.features.commands ? 'enabled' : 'disabled') + " \
          \n\n*Version " + BOT_INFO.name + " v" + BOT_INFO.version + "*",
      colour: "#5865F2"
    };

    emitMessage(MESSAGE_EVENTS.EMBED, MESSAGE_TYPES.EMBED, message, embed);

  }
};

export default info;
