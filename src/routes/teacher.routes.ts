import { Role } from "@prisma/client";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import {
  verifyStudent,
  assignMonitor,
} from "../controllers/teacher.controller.js";

export async function teacherRoutes(app: any) {
  app.post(
    "/teacher/verify-student",
    {
      preHandler: [authenticate, authorize(Role.TEACHER)],
    },
    verifyStudent,
  );

  app.post(
    "/teacher/assign-monitor",
    {
      preHandler: [authenticate, authorize(Role.TEACHER)],
    },
    assignMonitor,
  );
}
