import { type Command } from "../core/command";
import { emitMessage, MESSAGE_EVENTS, MESSAGE_TYPES } from "../services/messageService";
import { Message } from "stoat.js";

const ping: Command = {
  name: "ping",
  disabled: false,
  description: "Pong!",
  execute: async (message: Message, args: string[]) => {
    const start = Date.now();
    const reply = await emitMessage(MESSAGE_EVENTS.REACT, MESSAGE_TYPES.MESSAGE, message, "Pinging...");
    if(reply)
      emitMessage(MESSAGE_EVENTS.EDIT, MESSAGE_TYPES.MESSAGE, reply, `Pong! Took ${Date.now() - start}ms`);
  }
}

export default ping;