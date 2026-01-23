import { PrismaClient, Role } from "@prisma/client";
import AppError from "../utils/appError.js";

export const verifyUserByPrincipalService = async (
  prisma: PrismaClient,
  userId: string,
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
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
    where: { id: userId },
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
