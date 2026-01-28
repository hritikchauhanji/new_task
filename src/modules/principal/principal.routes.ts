import { Role } from "@prisma/client";
import type { FastifyInstance } from "fastify";
import { verifyUserByPrincipal } from "./principal.controller.js";
import { authorize } from "../../hooks/authoriz.js";

const principalRoutes = async (fastify: FastifyInstance) => {
  fastify.addHook("preHandler", authorize([Role.PRINCIPAL]));
  fastify.post("/verify/:userId", verifyUserByPrincipal);
};

export default principalRoutes;
