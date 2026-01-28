import Fastify from "fastify";
import authRoutes from "./modules/auth/auth.routes.js";
import principalRoutes from "./modules/principal/principal.routes.js";
import teacherRoutes from "./modules/teacher/teacher.routes.js";
import jwtOptions from "./plugins/jwt.plugin.js";
import jwt from "@fastify/jwt";
import prismaPlugin from "./plugins/prisma.plugin.js";
import authPlugin from "./plugins/auth.plugin.js";

const envToLogger = {
  development: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
  production: true,
  test: false,
};

const app = Fastify({
  logger: envToLogger.development ?? true,
});

app.register(prismaPlugin);
app.register(authPlugin);
app.register(jwt, jwtOptions);
app.register(authRoutes, { prefix: "/api/auth" });
app.register(principalRoutes, { prefix: "/api/principal" });
app.register(teacherRoutes, { prefix: "/api/teacher" });

app.get("/health", async () => {
  return {
    status: "ok",
    message: "Server is running.",
  };
});

export { app };
