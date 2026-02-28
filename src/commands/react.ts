import { type Command } from "../core/command";
import { randomEmoji } from "../util/randomEmoji";
import { emitMessage, MESSAGE_EVENTS, MESSAGE_TYPES } from "../services/messageService";
import { Message } from "stoat.js";

const react: Command = {
  name: "react",
  disabled: true,
  description: "React to the user message",
  execute: async (message: Message, args: string[]) => {
    emitMessage(MESSAGE_EVENTS.REACT, MESSAGE_TYPES.REACT, message, randomEmoji());
  }
}

export default react;