import type { FastifyReply, FastifyRequest } from "fastify";
import {
  verifyStudentByTeacherService,
  assignMonitorService,
} from "./teacher.service.js";
import { handleError } from "../../utils/errorHandler.js";
import { studentIdSchema, type StudentIdType } from "./teacher.schema.js";

export const verifyStudent = async (
  req: FastifyRequest<{ Params: StudentIdType }>,
  reply: FastifyReply,
) => {
  try {
    const parsed = studentIdSchema.safeParse(req.params);

    if (!parsed.success) {
      throw parsed.error;
    } else {
      const student = await verifyStudentByTeacherService(
        req.server.prisma,
        req.user.id,
        parsed.data,
      );

      return reply.send({
        success: true,
        message: "Student verified successfully",
        data: student,
      });
    }
  } catch (error) {
    handleError(reply, error);
  }
};

export const assignMonitor = async (
  req: FastifyRequest<{ Params: StudentIdType }>,
  reply: FastifyReply,
) => {
  try {
    const parsed = studentIdSchema.safeParse(req.params);

    if (!parsed.success) {
      parsed.error;
    } else {
      const monitor = await assignMonitorService(
        req.server.prisma,
        req.user.id,
        parsed.data,
      );

      return reply.send({
        success: true,
        message: "Monitor assigned successfully",
        data: monitor,
      });
    }
  } catch (error) {
    handleError(reply, error);
  }
};
