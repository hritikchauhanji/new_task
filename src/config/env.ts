import "dotenv/config";
import type { SignOptions } from "jsonwebtoken";

const requiredEnvs = [
  "PORT",
  "DATABASE_URL",
  "JWT_SECRET",
  "JWT_EXPIRES_IN",
] as const;

requiredEnvs.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required env variable: ${key}`);
  }
});

const env = {
  port: Number(process.env.PORT),
  nodeEnv: process.env.NODE_ENV ?? "development",
  databaseUrl: process.env.DATABASE_URL!,
  jwtSecret: process.env.JWT_SECRET!,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
};

export { env };
