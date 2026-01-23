import type { FastifyReply, FastifyRequest } from "fastify";
import { loginService, registerUserService } from "../services/auth.service.js";
import { handleError } from "../utils/errorHandler.js";

export const register = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const user = await registerUserService(req.server.prisma, req.body);

    return reply.code(201).send({
      success: true,
      message: "Registration successful. Wait for verification.",
      data: user,
    });
  } catch (error) {
    handleError(reply, error);
  }
};

export const login = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { token, user } = await loginService(req.server.prisma, req.body);

    return reply.send({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    handleError(reply, error);
  }
};
