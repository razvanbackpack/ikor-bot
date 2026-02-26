import { initializeBot } from "./index";
import { ConfigureLogger } from "./util/logger";
import "dotenv/config";


ConfigureLogger({
  LOG_STORE: 'CONSOLE'
});

initializeBot();

