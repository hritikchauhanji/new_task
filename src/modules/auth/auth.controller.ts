import type { FastifyReply, FastifyRequest } from "fastify";
import { loginService, registerUserService } from "./auth.service.js";
import { handleError } from "../../utils/errorHandler.js";
import {
  loginSchema,
  registerSchema,
  type LoginSchemaType,
} from "./auth.schema.js";
import AppError from "../../utils/appError.js";

export const register = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    if (!req.isMultipart()) {
      throw new AppError("multipart/form/data required", 400);
    }

    const parts = req.parts();
    const fields: any = {};
    let fileBuffer: Buffer | null = null;
    let fileMime: string | null = null;
    let fileName: string = "";

    for await (const part of parts) {
      if (part.type === "field") fields[part.fieldname] = part.value;
      if (part.type === "file") {
        fileBuffer = await part.toBuffer();
        fileMime = part.mimetype;
        fileName = part.filename;
      }
    }

    if (!fileBuffer) {
      throw new AppError("Image is required", 400);
    }

    if (!fileMime?.startsWith("image/")) {
      throw new AppError("Only image files allowed", 400);
    }

    const parsed = registerSchema.safeParse(fields);

    if (!parsed.success) {
      throw parsed.error;
    }
    const user = await registerUserService(req.server, {
      ...parsed.data,
      fileBuffer,
      fileName,
    });

    return reply.code(201).send({
      success: true,
      message: "Registration successful. Wait for verification.",
      data: user,
    });
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
    }
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
  } catch (error) {
    handleError(reply, error);
  }
};
