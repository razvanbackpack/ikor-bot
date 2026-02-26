import { register, type Command } from "./command";
import { randomEmoji } from "../util/randomEmoji";

const react: Command = {
  name: "react",
  description: "React to the user message",
  execute: async (message, args) => {
    await message.react(randomEmoji());
  }
}

register(react);
