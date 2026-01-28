import { fastifyJwt, type FastifyJWTOptions } from "@fastify/jwt";
import { env } from "../config/env.js";
import "@fastify/jwt";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: {
      id: string;
      role: "PRINCIPAL" | "TEACHER" | "STUDENT";
      isVerified: boolean;
    };
  }
}

const jwtOptions: FastifyJWTOptions = {
  secret: env.jwtSecret,
  sign: {
    expiresIn: env.jwtExpiresIn,
    algorithm: "HS256",
  },
};

export default jwtOptions;
