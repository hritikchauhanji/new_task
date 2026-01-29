import type { FastifyReply, FastifyRequest } from "fastify";
import { verifyUserByPrincipalService } from "./principal.service.js";
import { handleError } from "../../utils/errorHandler.js";
import { userIdSchema, type UserIdType } from "./principal.schema.js";

export const verifyUserByPrincipal = async (
  req: FastifyRequest<{ Params: UserIdType }>,
  reply: FastifyReply,
) => {
  try {
    const parsed = userIdSchema.safeParse(req.params);

    if (!parsed.success) {
      throw parsed.error;
    }
    const user = await verifyUserByPrincipalService(
      req.server.prisma,
      parsed.data,
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
