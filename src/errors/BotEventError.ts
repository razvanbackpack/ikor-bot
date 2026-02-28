export type BOT_EVENT_ERROR_CODE = | "EMPTY_CONTENT" | "EMPTY_EMBEDS" | "HANDLER_FAILED";

export class BotEventError extends Error {
  public readonly event: string;
  public readonly code: BOT_EVENT_ERROR_CODE;
  public readonly details?: Record<string, unknown>;

  constructor(params: {
    event: string;
    code: BOT_EVENT_ERROR_CODE;
    message: string;
    details?: Record<string, unknown>;
    cause?: unknown;
  }) {
    super(params.message);

    this.name = "BotEventError";
    this.event = params.event;
    this.code = params.code;
    this.details = params.details;
    this.cause = params.cause;
  }
}

export function isBotEventError(err: unknown): err is
  BotEventError {
  return err instanceof BotEventError;
}