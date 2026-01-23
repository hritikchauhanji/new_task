import { PrismaClient, Role } from "@prisma/client";
import AppError from "../utils/appError.js";

export const verifyStudentByTeacherService = async (
  prisma: PrismaClient,
  teacherId: string,
  studentId: string,
) => {
  const student = await prisma.user.findUnique({
    where: { id: studentId },
    select: { id: true, role: true, isVerified: true },
  });

  if (!student) {
    throw new AppError("Student not found", 404);
  }

  if (student.role !== Role.STUDENT) {
    throw new AppError("Only students can be verified", 400);
  }

  if (student.isVerified) {
    throw new AppError("Student already verified", 400);
  }

  return prisma.user.update({
    where: { id: studentId },
    data: {
      isVerified: true,
      teacherId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      isVerified: true,
    },
  });
};

export const assignMonitorService = async (
  prisma: PrismaClient,
  teacherId: string,
  studentId: string,
) => {
  const student = await prisma.user.findUnique({
    where: { id: studentId },
    select: {
      id: true,
      role: true,
      isVerified: true,
      isMonitor: true,
      teacherId: true,
    },
  });

  if (!student) {
    throw new AppError("Student not found", 404);
  }

  if (student.isMonitor) {
    throw new AppError("Student is already a monitor", 400);
  }

  if (student.role !== Role.STUDENT) {
    throw new AppError("Only students can be monitors", 400);
  }

  if (!student.isVerified) {
    throw new AppError("Student must be verified first", 400);
  }

  const monitorCount = await prisma.user.count({
    where: {
      teacherId,
      isMonitor: true,
    },
  });

  if (monitorCount >= 2) {
    throw new AppError("Only 2 monitors allowed", 400);
  }

  return prisma.user.update({
    where: { id: studentId },
    data: {
      isMonitor: true,
      teacherId,
    },
    select: {
      id: true,
      name: true,
      isMonitor: true,
    },
  });
};
