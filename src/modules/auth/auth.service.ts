import type { PrismaClient } from "@prisma/client";
import { loginSchema, type RegisterSchemaType } from "./auth.schema.js";
import AppError from "../../utils/appError.js";
import bcrypt from "bcrypt";
import type { FastifyInstance } from "fastify";

export async function registerUserService(
  prisma: PrismaClient,
  data: RegisterSchemaType,
) {
  const existUser = await prisma.user.findUnique({
    where: { email: data.email },
    select: { id: true },
  });

  if (existUser) {
    throw new AppError("Email already exists", 409);
  }

  const hash = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hash,
      role: data.role,
      isVerified: false,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isVerified: true,
      createdAt: true,
    },
  });

  return user;
}

export const loginService = async (server: FastifyInstance, body: unknown) => {
  const { email, password } = loginSchema.parse(body);

  const user = await server.prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      isVerified: true,
      password: true,
      role: true,
      email: true,
    },
  });

  if (!user) {
    throw new AppError("User does not exist", 404);
  }

  if (!user.isVerified) {
    throw new AppError("Account not verified. Please contact admin.", 403);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AppError("Invalid credentials", 401);
  }

  const payload = {
    id: user.id,
    role: user.role,
  };

  const token = server.jwt.sign(payload);

  const { password: _, ...safeUser } = user;

  return { token, user: safeUser };
};
