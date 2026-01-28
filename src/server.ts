import { app } from "./app.js";
import { env } from "./config/env.js";

const start = async () => {
  try {
    await app.listen({ port: env.port });
    app.log.info(`Server running on PORT: ${env.port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
