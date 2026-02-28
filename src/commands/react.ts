import { register, type Command } from "./command";
import { randomEmoji } from "../util/randomEmoji";
import { emitMessage } from "../services/message";
import { Message } from "stoat.js";

const react: Command = {
  name: "react",
  description: "React to the user message",
  execute: async (message: Message, args: string[]) => {
    emitMessage("REACT", "REACT", message, randomEmoji());
  }
}

register(react);
