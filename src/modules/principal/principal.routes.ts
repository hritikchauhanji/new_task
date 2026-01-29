import { Role } from "@prisma/client";
import type { FastifyInstance } from "fastify";
import { verifyUserByPrincipal } from "./principal.controller.js";
import { authorize } from "../../hooks/authoriz.js";
import type { UserIdType } from "./principal.schema.js";

const principalRoutes = async (fastify: FastifyInstance) => {
  // fastify.addHook("preHandler", authorize([Role.PRINCIPAL]));
  fastify.post<{ Params: UserIdType }>(
    "/verify/:userId",
    {
      preHandler: authorize([Role.PRINCIPAL]),
    },
    verifyUserByPrincipal,
  );
};

export default principalRoutes;
