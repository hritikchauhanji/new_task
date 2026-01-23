import { Role } from "@prisma/client";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { verifyUserByPrincipal } from "../controllers/principal.controller.js";

export async function principalRoutes(app: any) {
  app.post(
    "/principal/verify",
    {
      preHandler: [authenticate, authorize(Role.PRINCIPAL)],
    },
    verifyUserByPrincipal,
  );
}
