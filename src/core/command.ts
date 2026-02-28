import type { Message } from "stoat.js";

export interface Command {
  name: string;
  description: string;
  disabled: boolean;
  execute: (message: Message, args: string[]) => Promise<void>;
}

export const commands = new Map<string, Command>();