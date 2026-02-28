import IChatReply from "../interface/IChatReply";
import { Message } from "stoat.js";
import { isBotEventError, BotEventError } from "../errors/BotEventError";
import logger from "../util/logger";

type EventMap = {
  "chat:reply": { message: Message; chatData: IChatReply };
  "chat:edit": { message: Message; chatData: IChatReply };
  "chat:embed": { message: Message; chatData: IChatReply };
  "chat:react": { message: Message; chatData: IChatReply };
};

type EventResultMap = {
  "chat:reply": Message;
  "chat:embed": Message;
  "chat:edit": void;
  "chat:react": void;
};

type Handler<K extends keyof EventMap> =
  (payload: EventMap[K]) => Promise<EventResultMap[K]> |
    EventResultMap[K];

class EventBus {
  private handlers = new Map<keyof EventMap, Handler<any>[]>();

  on<K extends keyof EventMap>(event: K, handler: Handler<K>) {
    const list = this.handlers.get(event) ?? [];
    list.push(handler);
    this.handlers.set(event, list);
  }

  async emit<K extends keyof EventMap>(
    event: K,
    payload: EventMap[K]
  ): Promise<EventResultMap[K] | undefined> {
    const list = this.handlers.get(event);
    if (!list || list.length === 0) {
      logger.error("EVENT_BUS", "No handlers registered", {event, payload});
      return undefined;
    };
    try {
      return await list[0](payload);
    }
    catch (err) {
      if (isBotEventError(err)) {
        logger.error("EVENT_BUS", err.message, {
          event: err.event,
          code: err.code,
          details: err.details,
        });
        throw err;
      }

      if (err instanceof Error) {
        logger.error("EVENT_BUS", err.message, {
          stack: err.stack,
          event: String(event)
        });
      }

      logger.error("EVENT_BUS", "Non-Error thrown", {
        err, event:
          String(event)
      });
    }
    
  }
}

export const BotEvents = new EventBus();