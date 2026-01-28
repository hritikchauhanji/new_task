import { PrismaClient, Role } from "@prisma/client";
import AppError from "../../utils/appError.js";
import type { UserIdType } from "./principal.schema.js";

export const verifyUserByPrincipalService = async (
  prisma: PrismaClient,
  param: UserIdType,
) => {
  const user = await prisma.user.findUnique({
    where: { id: param.userId },
    select: {
      id: true,
      role: true,
      isVerified: true,
    },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.role === Role.PRINCIPAL) {
    throw new AppError("Cannot verify principal", 400);
  }

  if (user.isVerified) {
    throw new AppError("User already verified", 400);
  }

  return prisma.user.update({
    where: { id: param.userId },
    data: { isVerified: true },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isVerified: true,
    },
  });
};
