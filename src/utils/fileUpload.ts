import fs from "fs";
import path from "path";

export async function uploadFileLocalPath(
  buffer: Buffer,
  originalName: string,
) {
  const uploadDir = path.join(process.cwd(), "uploads");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const fileName = `${Date.now()}-${originalName}`;
  const filePath = path.join(uploadDir, fileName);

  await fs.promises.writeFile(filePath, buffer);

  return {
    fileName,
    filePath,
  };
}
