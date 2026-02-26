import type { Message } from "stoat.js";

export interface Command {
  name: string;
  description: string;
  execute: (message: Message, args: string[]) => Promise<void>;
}

export const commands = new Map<string, Command>();

export function register(command: Command): void {
  commands.set(command.name, command);
}
