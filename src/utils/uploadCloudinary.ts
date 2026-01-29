import type { FastifyInstance } from "fastify";
import fs from "fs";

export async function uploadLocalFileToCloudinary(
  server: FastifyInstance,
  filePath: string,
  publicId: string,
) {
  const result = await server.cloudinary.uploader.upload(filePath, {
    public_id: publicId,
    overwrite: true,
    resource_type: "image",
  });

  return result.secure_url;
}

export async function deleteLocalFile(filePath: string) {
  if (fs.existsSync(filePath)) {
    await fs.promises.unlink(filePath);
  }
}
