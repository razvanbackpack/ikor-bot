import { client, PREFIX } from "../client/client";
import { commands } from "../commands/command";
import { Message } from "stoat.js";

import "../commands/ping";
import "../commands/info";
import "../commands/ping";
import "../commands/help";
import "../commands/react";
import "../commands/leaderboard";
import "../commands/roll";

export async function handleCommand(message: Message) {
    if (message.mentionIds?.includes(client.user!.id)) {
        await message.reply("Type !help for commands!");
        return;
    }
    
    if (message.content.startsWith(PREFIX)) {
        const args = message.content.slice(PREFIX.length).trim().split(/\s+/);
        const commandName = args.shift()?.toLowerCase();
        
        const command = commands.get(commandName!);
        if(command) {
            await command.execute(message, args);
        } else {
            // TODO: nothing?
        }
    }
}

