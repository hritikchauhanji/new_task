import { ZodError } from "zod";
import AppError from "./appError.js";
import type { FastifyReply } from "fastify";

const handleError = (reply: FastifyReply, error: unknown) => {
  if (error instanceof ZodError) {
    const errors: Record<string, string> = {};

    error.issues.forEach((issue) => {
      const field = issue.path.join(".") || "body";
      errors[field] = issue.message;
    });

    return reply.status(400).send({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  if (error instanceof AppError) {
    return reply.code(error.statusCode).send({
      success: false,
      message: error.message,
    });
  }

  return reply.code(500).send({
    success: false,
    message: "Internal Server Error",
  });
};

export { handleError };
