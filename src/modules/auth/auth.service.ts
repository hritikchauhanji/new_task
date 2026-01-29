import {
  type LoginSchemaType,
  type RegisterSchemaType,
} from "./auth.schema.js";
import AppError from "../../utils/appError.js";
import bcrypt from "bcrypt";
import { type FastifyInstance } from "fastify";
import { uploadFileLocalPath } from "../../utils/fileUpload.js";
import {
  deleteLocalFile,
  uploadLocalFileToCloudinary,
} from "../../utils/uploadCloudinary.js";

export async function registerUserService(
  server: FastifyInstance,
  data: RegisterSchemaType & {
    fileBuffer: Buffer;
    fileName: string;
  },
) {
  const existUser = await server.prisma.user.findUnique({
    where: { email: data.email },
    select: { id: true },
  });

  if (existUser) {
    throw new AppError("Email already exists", 409);
  }

  const uploadedImage = await uploadFileLocalPath(
    data.fileBuffer,
    data.fileName,
  );

  if (!uploadedImage) {
    throw new AppError("File not save locally", 500);
  }

  const cloudinaryUrl = await uploadLocalFileToCloudinary(
    server,
    uploadedImage.filePath,
    uploadedImage.fileName,
  );

  if (!cloudinaryUrl) {
    await deleteLocalFile(uploadedImage.filePath);
    throw new AppError("Image not upload on cloudinary", 500);
  }

  await deleteLocalFile(uploadedImage.filePath);

  const hash = await bcrypt.hash(data.password, 10);

  const user = await server.prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hash,
      role: data.role,
      imageUrl: cloudinaryUrl,
      isVerified: false,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      imageUrl: true,
      isVerified: true,
      createdAt: true,
    },
  });

  return user;
}

export const loginService = async (
  server: FastifyInstance,
  body: LoginSchemaType,
) => {
  const user = await server.prisma.user.findUnique({
    where: { email: body.email },
    select: {
      id: true,
      isVerified: true,
      password: true,
      role: true,
      email: true,
    },
  });

  if (!user) {
    throw new AppError("User does not exist", 404);
  }

  if (!user.isVerified) {
    throw new AppError("Account not verified. Please contact admin.", 403);
  }

  const isPasswordValid = await bcrypt.compare(body.password, user.password);
  if (!isPasswordValid) {
    throw new AppError("Invalid credentials", 401);
  }

  const payload = {
    id: user.id,
    role: user.role,
  };

  const token = server.jwt.sign(payload);

  const { password: _, ...safeUser } = user;

  return { token, user: safeUser };
};
