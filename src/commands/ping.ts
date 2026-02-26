import { register, type Command } from "./command";

const ping: Command = {
  name: "ping",
  description: "Pong!",
  execute: async (message, args) => {
    const start = Date.now();
    const reply = await message.reply("Pinging...");
    await reply?.edit({ content: `Pong! Took ${Date.now() - start}ms` });
  }
}

register(ping);
