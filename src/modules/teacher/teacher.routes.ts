import { Role } from "@prisma/client";
import { verifyStudent, assignMonitor } from "./teacher.controller.js";
import type { FastifyInstance } from "fastify";
import { authorize } from "../../hooks/authoriz.js";

const teacherRoutes = async (fastify: FastifyInstance) => {
  fastify.addHook("preHandler", authorize([Role.TEACHER]));
  fastify.post("/verify-student/:studentId", verifyStudent);
  fastify.post("/assign-monitor/:studentId", assignMonitor);
};

export default teacherRoutes;
