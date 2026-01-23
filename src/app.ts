import Fastify from "fastify";
import prismaPlugin from "./config/prisma.js";

import authRoutes from "./routes/auth.routes.js";
import { principalRoutes } from "./routes/principal.routes.js";
import { teacherRoutes } from "./routes/teacher.routes.js";

const app = Fastify({
  logger: true,
});

app.register(prismaPlugin);
app.register(authRoutes);
app.register(principalRoutes);
app.register(teacherRoutes);

// app.setErrorHandler(errorHandler);

app.get("/health", async () => {
  return {
    status: "ok",
    message: "Server is running.",
  };
});

export { app };
