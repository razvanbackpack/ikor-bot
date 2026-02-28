import { BOT_INFO } from './core/config';
import logger from './util/logger';
import { handleXPforCurrentMessage } from "./services/xpService";
import { handleCommand } from './services/commandService';
import { client } from "./client/client";
import { Message } from 'stoat.js';

let running = true;
let shuttingDown = false;
let reconnectTimeout: NodeJS.Timeout | null = null;

const CLIENT_ERROR_CATEGORY_NAME = "CLIENT_ERROR";

export function initializeBot(): void {

  client.on("ready", async () => {
    logger.info("BOOT", `${BOT_INFO.name} (v${BOT_INFO.version}) booting up.`)
    setTimeout(async () => {

      // This DOES get set; Stoat UI is buggy and doesn't update.
      // refersh app and Ikor will be online

      await client.user?.edit({
        status: {
          presence: "Online",
          text: `v${BOT_INFO.version} - !help`
        }
      });

      logger.info("INFO", `Logged in: ${BOT_INFO.name} (v ${BOT_INFO.version}) (${client.user?.username}#${client.user?.discriminator})`);
    }, 3000);
  });

  client.on("messageCreate", async (message) => {
    handleMessage(message);
  });

  client.on("error", (error) => {
    handleError(error);
  });

  login();
}

function login() {
  if (!running) return;
  client.loginBot(process.env.BOT_TOKEN!);
}

async function handleError(error: any) {
  if(!running) return;

  logger.error(CLIENT_ERROR_CATEGORY_NAME, "Event occurred:", error);

  const structuredError = client.events.lastError;
  if (structuredError) {
    logger.error(CLIENT_ERROR_CATEGORY_NAME, "Structured error:", structuredError);

    if (structuredError.type === "socket") {
      logger.error(CLIENT_ERROR_CATEGORY_NAME, "Socket error:", structuredError.data);
    } else if (structuredError.type === "revolt") {
      logger.error(CLIENT_ERROR_CATEGORY_NAME, "Stoat API error:", structuredError.data);
    }
  }

  if (reconnectTimeout) return;

  reconnectTimeout = setTimeout(() => {
    reconnectTimeout = null;

    if (shuttingDown) return;
    logger.error("GATEWAY", "Reconnecting bot...");
    client?.removeAllListeners();
    initializeBot();
  }, 3000);
}

async function handleMessage(message: Message) {
  console.log('got message');
  if(shuttingDown) return;
  if (message.author?.bot) return;
  console.log(message.content);

  if(BOT_INFO.features.xp_system)
    handleXPforCurrentMessage(message); // this should ALWAYS be first

  if(BOT_INFO.features.commands)
    handleCommand(message);
}


process.on("SIGINT", () => shutdown("SIGINT"));   // CTRL+C
process.on("SIGTERM", () => shutdown("SIGTERM")); // kill

function shutdown(signal: string) {
  if(!running) return;
  running = false;
  client.emit("logout");
  logger.info("SHUTDOWN", `Received ${signal}, shutting down...`);
  try {
    client?.removeAllListeners();
  } catch (err) {
    logger.error("SHUTDOWN", "Error during client shutdown", {
      error: err instanceof Error ? err.message : err
    });
  }

  setTimeout(() => {
    process.exit(0);
  }, 500);
}
