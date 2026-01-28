import type { FastifyRequest, FastifyReply } from "fastify";
import { Role } from "@prisma/client";

export const authorize =
  (allowedRoles: Role[]) =>
  async (req: FastifyRequest, reply: FastifyReply) => {
    if (!allowedRoles.includes(req.user.role as Role)) {
      return reply.code(403).send({
        success: false,
        message: "Forbidden",
      });
    }
  };
