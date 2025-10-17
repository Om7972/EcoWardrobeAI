import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

export const uploadConfig = {
  uploadDir: uploadsDir,
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  allowedExtensions: [".jpg", ".jpeg", ".png", ".webp", ".gif"],
};

export function generateFileName(originalName: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(7);
  const ext = path.extname(originalName);
  return `${timestamp}-${randomString}${ext}`;
}

export function isValidImage(mimeType: string, filename: string): boolean {
  const ext = path.extname(filename).toLowerCase();
  return (
    uploadConfig.allowedMimeTypes.includes(mimeType) &&
    uploadConfig.allowedExtensions.includes(ext)
  );
}
