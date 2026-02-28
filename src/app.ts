import { initializeBot } from "./index";
import { ConfigureLogger } from "./util/logger";
import "dotenv/config";
import { registerMessageHandlers } from "./services/message";
import { loadCommands } from "./services/commandService";

ConfigureLogger({
  LOG_STORE: 'CONSOLE'
});

loadCommands();
registerMessageHandlers();
initializeBot();
