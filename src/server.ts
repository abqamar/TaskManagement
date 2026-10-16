
import app from "./app.js";
import { env } from "./config/env.js";

const server = app.listen(env.PORT, () => {
  console.log("===================================");
  console.log("Task Management API");
  console.log(`Environment: ${env.NODE_ENV}`);
  console.log(`URL: http://localhost:${env.PORT}`);
  console.log("===================================");
});

const shutdown = (signal: string) => {
  console.log(`${signal} received. Shutting down...`);

  server.close((error) => {
    if (error) {
      console.error(error);
      process.exitCode = 1;
    }
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
