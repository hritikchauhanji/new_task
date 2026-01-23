import type { PrismaClient } from "@prisma/client";
import { loginSchema, registerSchema } from "../validator/auth.validator.js";
import AppError from "../utils/appError.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt.js";

export async function registerUserService(prisma: PrismaClient, data: unknown) {
  const { name, email, password, role } = registerSchema.parse(data);

  const existUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existUser) {
    throw new AppError("Email already exists", 409);
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hash,
      role,
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

export const loginService = async (prisma: PrismaClient, body: unknown) => {
  const { email, password } = loginSchema.parse(body);

  const user = await prisma.user.findUnique({
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

  const token = generateToken({
    id: user.id,
    role: user.role,
  });

  // AI
  const { password: _, ...safeUser } = user;

  return { token, user: safeUser };
};
