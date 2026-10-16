
import app from "./app.js";
import { env } from "./config/env.js";

import {
  connectDatabase,
  disconnectDatabase
} from "./config/database.js";

async function bootstrap() {
  try {
    await connectDatabase();

    const server = app.listen(env.PORT, () => {
      console.log("===================================");
      console.log("Task Management API");
      console.log(`Environment: ${env.NODE_ENV}`);
      console.log(`URL: http://localhost:${env.PORT}`);
      console.log("PostgreSQL: Connected");
      console.log("===================================");
    });

    let shuttingDown = false;

    const shutdown = async (signal: string) => {
      if (shuttingDown) return;
      shuttingDown = true;

      console.log(`${signal} received`);

      server.close(async (error) => {
        if (error) {
          console.error(error);
          process.exitCode = 1;
        }

        await disconnectDatabase();
        console.log("Server stopped");
      });
    };

    process.on("SIGINT", () => void shutdown("SIGINT"));
    process.on("SIGTERM", () => void shutdown("SIGTERM"));

  } catch (error) {
    console.error("Application startup failed:", error);
    await disconnectDatabase();
    process.exitCode = 1;
  }
}

void bootstrap();
