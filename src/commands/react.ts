import { type Command } from "../core/command";
import { randomEmoji } from "../util/randomEmoji";
import { emitMessage } from "../services/message";
import { Message } from "stoat.js";

const react: Command = {
  name: "react",
  disabled: true,
  description: "React to the user message",
  execute: async (message: Message, args: string[]) => {
    emitMessage("REACT", "REACT", message, randomEmoji());
  }
}

export default react;