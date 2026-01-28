import "dotenv/config";
import { defineConfig } from "prisma/config";
import { env } from "./src/config/env.js";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: env.databaseUrl,
  },
});
