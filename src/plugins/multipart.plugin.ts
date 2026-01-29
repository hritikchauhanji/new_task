import type { FastifyMultipartOptions } from "@fastify/multipart";

const multipartOptions: FastifyMultipartOptions = {
  limits: {
    fileSize: 2 * 1024 * 1024,
    files: 1,
  },
};

export default multipartOptions;
