import { register, type Command } from "./command";
import { emitMessage } from "../services/message";
import { Message } from "stoat.js";

const ping: Command = {
  name: "ping",
  description: "Pong!",
  execute: async (message: Message, args: string[]) => {
    const start = Date.now();
    const reply = await emitMessage("REPLY", "MESSAGE", message, "Pinging...");
    if(reply)
      emitMessage("EDIT", "MESSAGE", reply, `Pong! Took ${Date.now() - start}ms`);
  }
}

register(ping);
