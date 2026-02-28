import { BotEvents } from "../core/botEvents";
import IChatReply from "../interface/IChatReply";
import { BotEventError } from "../errors/BotEventError";
import { Message } from "stoat.js";

const enum BOT_EVENTS_ERROR {
  REPLY = "CONTENT_UNDEFINED_CHAT:REPLY",
  EMBED = "EMBEDS_UNDEFINED_CHAT:EMBED",
};

export enum MESSAGE_EVENTS {
  "REPLY" = "REPLY",
  "EDIT" = "EDIT",
  "EMBED" = "EMBED",
  "REACT" = "REACT"
}

export enum MESSAGE_TYPES {
  "MESSAGE" = "MESSAGE",
  "EMBED" = "EMBED",
  "REACT" = "REACT"
}

export function registerMessageHandlers() {
  BotEvents.on("chat:reply", async (payload) => {
    const { message, chatData } = payload;
    const content = chatData.content;

    if (typeof content !== "string" || content.trim().length === 0) {
      throw new BotEventError({
        event: BOT_EVENTS_ERROR.REPLY,
        code: "EMPTY_CONTENT",
        message: "chatData.content was empty",
        details: { message: message.content, chatData }
      });
    }

    const reply = await message.reply(content);
    if (!reply) {
      throw new BotEventError({
        event: BOT_EVENTS_ERROR.REPLY,
        code: "EMPTY_CONTENT",
        message: "reply was empty",
        details: { message: message.content, chatData }
      });
    }

    return reply;
  });

  BotEvents.on("chat:edit", async (payload) => {
    const { message, chatData } = payload;
    const content = chatData.content;

    if (typeof content !== "string" || content.trim().length === 0) {
      throw new BotEventError({
        event: BOT_EVENTS_ERROR.REPLY,
        code: "EMPTY_CONTENT",
        message: "chatData.content was empty",
        details: { message: message.content, chatData }
      });
    }

    await message.edit({ content });
  });

  BotEvents.on("chat:embed", async (payload) => {
    const { message, chatData } = payload;
    const embeds = chatData.embeds;

    if (!Array.isArray(embeds) || embeds.length === 0) {
      throw new BotEventError({
        event: BOT_EVENTS_ERROR.EMBED,
        code: "EMPTY_EMBEDS",
        message: "chatData.embeds was empty",
        details: { message: message.content, chatData }
      });
    }

    const reply = await message.reply({ embeds })
    if (!reply) {
      throw new BotEventError({
        event: BOT_EVENTS_ERROR.REPLY,
        code: "EMPTY_CONTENT",
        message: "reply was empty",
        details: { message: message.content, chatData }
      });
    }

    return reply;
  });

  BotEvents.on("chat:react", async (payload) => {
    const { message, chatData } = payload;
    const react = chatData.react;

    if (typeof react !== "string" || react.trim().length === 0) {
      throw new BotEventError({
        event: BOT_EVENTS_ERROR.REPLY,
        code: "EMPTY_CONTENT",
        message: "chatData.react was empty",
        details: { message: message.content, chatData }
      });
    }

    await message.react(react);
  })
}


export async function emitMessage(
  event: "REPLY" | "EDIT" | "EMBED" | "REACT",
  type: "MESSAGE" | "EMBED" | "REACT",
  message: Message,
  data: any
): Promise<Message | undefined> {

  const chatData = makeChatReply(type, data);

  switch (event) {
    case "REPLY":
      return BotEvents.emit("chat:reply", { message, chatData });
    case "EDIT":
      BotEvents.emit("chat:edit", { message, chatData });
      break;
    case "EMBED":
      return BotEvents.emit("chat:embed", { message, chatData });
    case "REACT":
      BotEvents.emit("chat:react", { message, chatData });
      break;
  }

  return undefined;
}

function makeChatReply(type: "MESSAGE" | "EMBED" | "REACT", data: any): IChatReply {
  switch (type) {
    case "MESSAGE":
      return { content: data };
    case "EMBED":
      return { embeds: [{ type: "Text", ...data }] };
    case "REACT":
      return { react: data };
  }
};