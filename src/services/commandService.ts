import { client, PREFIX } from "../client/client";
import { commands } from "../core/command";
import { Message } from "stoat.js";
import { Command } from "../core/command";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, extname, join } from "node:path";
import { readdir } from "node:fs/promises";
import logger from "../util/logger";

let commandsLoaded = false;

export async function loadCommands(): Promise<void> {
    if (commandsLoaded) return;

    const currentDirectory = dirname(fileURLToPath(import.meta.url));
    const commandsDirectory = join(currentDirectory, "../commands");
    const files = await readdir(commandsDirectory);

    const commandFiles = files.filter((file) => {
        if (file === "command.ts" || file === "command.js") return false;
        if (file.endsWith(".d.ts")) return false;
        const ext = extname(file);
        return ext === ".ts";
    });

    const loaded: string[] = [];

    await Promise.all(
        commandFiles.map(async (file) => {
            const moduleUrl = pathToFileURL(join(commandsDirectory, file)).href;
            const mod = await import(moduleUrl);
            const command = mod.default as Command | undefined;

            if (!command || typeof command.name !== "string" || typeof command.execute !== "function") {
                logger.error("COMMAND_LOAD", `Invalid command module: ${file}`);
                return;
            }

            if (command.disabled) {
                logger.info("COMMAND_LOAD", `Skipped disabled command: ${command.name}`);
                return;
            }

            commands.set(command.name, command);
            loaded.push(command.name);
        })
    );

    logger.info("COMMAND_LOAD", `Loaded commands: ${loaded.join(", ")}`);
    commandsLoaded = true;
}

export async function handleCommand(message: Message) {
    if (!commandsLoaded) return;

    if (message.mentionIds?.includes(client.user!.id)) {
        await message.reply("Type !help for commands!");
        return;
    }

    if (!message.content.startsWith(PREFIX)) return;

    const args =
        message.content.slice(PREFIX.length).trim().split(/\s+/);
    const commandName = args.shift()?.toLowerCase();
    const command = commandName ? commands.get(commandName) : undefined;

    if (command && !command.disabled) await command.execute(message, args);
}
