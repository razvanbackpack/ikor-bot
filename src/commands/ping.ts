import { type Command } from "../core/command";
import { emitMessage } from "../services/message";
import { Message } from "stoat.js";

const ping: Command = {
  name: "ping",
  disabled: false,
  description: "Pong!",
  execute: async (message: Message, args: string[]) => {
    const start = Date.now();
    const reply = await emitMessage("REPLY", "MESSAGE", message, "Pinging...");
    if(reply)
      emitMessage("EDIT", "MESSAGE", reply, `Pong! Took ${Date.now() - start}ms`);
  }
}

export default ping;