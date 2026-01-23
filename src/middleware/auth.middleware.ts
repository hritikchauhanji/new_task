import type { FastifyReply, FastifyRequest } from "fastify";
import AppError from "../utils/appError.js";
import { verifyToken } from "../utils/jwt.js";
import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";

export const authenticate = async (
  req: FastifyRequest,
  _reply: FastifyReply,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError("Unauthorized: token missing", 401);
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    throw new AppError("Unauthorized: invalid token format", 401);
  }

  try {
    req.user = verifyToken(token);
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AppError("Session expired. Please login again.", 401);
    }

    if (error instanceof jwt.JsonWebTokenError) {
      throw new AppError("Invalid token. Please login again.", 401);
    }

    throw error;
  }
};

export const authorize =
  (...allowedRoles: Role[]) =>
  async (req: FastifyRequest) => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new AppError("Forbidden", 403);
    }
  };
