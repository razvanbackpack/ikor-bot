import { type Command, commands } from "../core/command";
import { Message } from "stoat.js";
import { emitMessage } from "../services/messageService";

const help: Command = {
  name: "help",
  disabled: false,
  description: "Show available commands",
  execute: async (message, args) => {
    commandList(message, args);
  }
};

const commandList = async (message: Message, args: string[]) => {
  let description = "";

  let first_loop = true;
  for (const [name, cmd] of commands) {
    if(cmd.disabled) continue;
    let newline = `\n`
    if (first_loop) {
      newline = "";
      first_loop = false;
    }
    description += `${newline}**!${name}** - ${cmd.description}`;
  }

  const embed = {
      type: "Text",
      title: "Available Commands",
      description,
      colour: "#00ff00"
  };

  emitMessage("EMBED", "EMBED", message, embed);
}

export default help;
