import { mkdir, writeFile, access } from "node:fs/promises";
import { constants } from "node:fs";
import { join } from "node:path";

const rawName = process.argv[2];

if (!rawName) {
  console.error("Usage: npm run create-command -- <command-name>");
  process.exit(1);
}

const name = rawName.toLowerCase().trim().replace(/\s+/g, "-");
if (!/^[a-z0-9-]+$/.test(name)) {
  console.error("Command name must contain only: a-z, 0-9, -");
  process.exit(1);
}

const commandsDir = join(process.cwd(), "src", "commands");
const filePath = join(commandsDir, `${name}.ts`);

const classLike = name
  .split("-")
  .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
  .join("");

const template = `import { type Command } from "../core/command";
  import { emitMessage, MESSAGE_EVENTS, MESSAGE_TYPES } from "../services/messageService";
  

  const ${classLike}: Command = {
    name: "${name}",
    disabled: false,
    description: "TODO: describe ${name}",
    execute: async (message, args) => {
      emitMessage(MESSAGE_EVENTS.REPLY, MESSAGE_TYPES.MESSAGE, message, "Hello there!");
    },
  };

  export default ${classLike};
  `;

await mkdir(commandsDir, { recursive: true });

try {
  await access(filePath, constants.F_OK);
  console.error(`File already exists: ${filePath}`);
  process.exit(1);
} catch {
  // file doesn't exist -> continue
}

await writeFile(filePath, template, "utf8");
console.log(`Created: ${filePath}`);