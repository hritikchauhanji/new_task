import type { FastifyReply, FastifyRequest } from "fastify";
import { verifyUserByPrincipalService } from "../services/principal.service.js";
import { handleError } from "../utils/errorHandler.js";

export const verifyUserByPrincipal = async (
  req: FastifyRequest<{ Body: { userId: string } }>,
  reply: FastifyReply,
) => {
  try {
    const user = await verifyUserByPrincipalService(
      req.server.prisma,
      req.body.userId,
    );

    return reply.send({
      success: true,
      message: "User verified successfully",
      data: user,
    });
  } catch (error) {
    handleError(reply, error);
  }
};
