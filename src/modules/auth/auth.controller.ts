import type { FastifyReply, FastifyRequest } from "fastify";
import { loginService, registerUserService } from "./auth.service.js";
import { handleError } from "../../utils/errorHandler.js";
import {
  loginSchema,
  registerSchema,
  type LoginSchemaType,
  type RegisterSchemaType,
} from "./auth.schema.js";

export const register = async (
  req: FastifyRequest<{ Body: RegisterSchemaType }>,
  reply: FastifyReply,
) => {
  try {
    const parsed = registerSchema.safeParse(req.body);

    if (!parsed.success) {
      throw parsed.error;
    } else {
      const user = await registerUserService(req.server.prisma, parsed.data);

      return reply.code(201).send({
        success: true,
        message: "Registration successful. Wait for verification.",
        data: user,
      });
    }
  } catch (error) {
    handleError(reply, error);
  }
};

export const login = async (
  req: FastifyRequest<{ Body: LoginSchemaType }>,
  reply: FastifyReply,
) => {
  try {
    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) {
      throw parsed.error;
    } else {
      const { token, user } = await loginService(req.server, parsed.data);

      return reply.send({
        success: true,
        message: "Login Successfully",
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
        },
      });
    }
  } catch (error) {
    handleError(reply, error);
  }
};
