import { initializeBot } from "./index";
import { ConfigureLogger } from "./util/logger";
import "dotenv/config";
import { registerMessageHandlers } from "./services/message";

ConfigureLogger({
  LOG_STORE: 'CONSOLE'
});

registerMessageHandlers();
initializeBot();
