import type { FastifyReply, FastifyRequest } from "fastify";
import {
  verifyStudentByTeacherService,
  assignMonitorService,
} from "../services/teacher.service.js";
import { handleError } from "../utils/errorHandler.js";

export const verifyStudent = async (
  req: FastifyRequest<{ Body: { studentId: string } }>,
  reply: FastifyReply,
) => {
  try {
    const student = await verifyStudentByTeacherService(
      req.server.prisma,
      req.user.id,
      req.body.studentId,
    );

    return reply.send({
      success: true,
      message: "Student verified successfully",
      data: student,
    });
  } catch (error) {
    handleError(reply, error);
  }
};

export const assignMonitor = async (
  req: FastifyRequest<{ Body: { studentId: string } }>,
  reply: FastifyReply,
) => {
  try {
    const monitor = await assignMonitorService(
      req.server.prisma,
      req.user.id,
      req.body.studentId,
    );

    return reply.send({
      success: true,
      message: "Monitor assigned successfully",
      data: monitor,
    });
  } catch (error) {
    handleError(reply, error);
  }
};
