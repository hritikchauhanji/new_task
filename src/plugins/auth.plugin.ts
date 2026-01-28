import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";

const publicRoutes = ["/api/auth/login", "/api/auth/register"];

const authPlugin = fp(async (fastify) => {
  fastify.addHook(
    "preHandler",
    async (req: FastifyRequest, reply: FastifyReply) => {
      if (publicRoutes.includes(req.url ?? "")) return;

      try {
        await req.jwtVerify();
      } catch {
        return reply
          .code(401)
          .send({ success: false, message: "Unauthorized" });
      }
    },
  );
});
export default authPlugin;
