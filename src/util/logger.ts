let LOG_LEVEL = "";
let LOG_FORMAT = "";
let LOG_FILE = "";
let LOG_STORE = "console";

enum LOG_LEVELS {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}
const RESET = '\x1b[0m';
const COLORS: Record<LOG_LEVELS, string> = {
   [LOG_LEVELS.DEBUG]: '\x1b[36m',    // Cyan
   [LOG_LEVELS.INFO]: '\x1b[32m',     // Green
   [LOG_LEVELS.WARN]: '\x1b[33m',     // Yellow
   [LOG_LEVELS.ERROR]: '\x1b[31m',    // Red
};

class Logger {
  private log(level: LOG_LEVELS, category: string, message: string, metadata: Record<string, any[]> = {}) {

    const timestamp = new Date().toISOString();
    const levelName = LOG_LEVELS[level];
    const color = COLORS[level];

    if (LOG_STORE === "CONSOLE") {
      console.log(
        `${color}[${timestamp}] [${levelName}] [${category}]\n${RESET} ${message}`,
        Object.keys(metadata).length > 0 ? metadata : ''
      )
    } else {
      console.error('CANNOT STORE TO DB YET');
    }

  }

  debug(category: string, message: string, metadata?: Record<string, any>): void {
    this.log(LOG_LEVELS.DEBUG, category, message, metadata);
  }

  error(category: string, message: string, metadata?: Record<string, any>): void {
    this.log(LOG_LEVELS.ERROR, category, message, metadata);
  }

  info(category: string, message:string, metadata?: Record<string, any>) {
    this.log(LOG_LEVELS.INFO, category, message, metadata);
  }
}

const logger = new Logger();

export interface LoggerConfig {
  LOG_STORE?: 'CONSOLE' | 'DB',
}

export function ConfigureLogger(options: LoggerConfig): void {
  if (options.LOG_STORE) {
    LOG_STORE = options.LOG_STORE;
  }
}

export default logger;
