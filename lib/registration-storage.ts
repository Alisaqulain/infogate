import fs from "fs";
import path from "path";

export const REG_FILE_KEYS = ["profile", "commercialReg", "riyada"] as const;
export type RegFileKey = (typeof REG_FILE_KEYS)[number];

const ROOT = path.join(process.cwd(), "uploads", "registrations");

export function getRegistrationDir(submissionId: string): string {
  return path.join(ROOT, submissionId);
}

export async function saveRegistrationFile(
  submissionId: string,
  fileKey: RegFileKey,
  buffer: Buffer,
  ext: string
): Promise<string> {
  const dir = getRegistrationDir(submissionId);
  await fs.promises.mkdir(dir, { recursive: true });
  const filename = `${fileKey}.${ext}`;
  await fs.promises.writeFile(path.join(dir, filename), buffer);
  return filename;
}

export function resolveRegistrationFilePath(
  submissionId: string,
  fileKey: RegFileKey
): string | null {
  const dir = getRegistrationDir(submissionId);
  if (!fs.existsSync(dir)) return null;
  const match = fs
    .readdirSync(dir)
    .find((name) => name === fileKey || name.startsWith(`${fileKey}.`));
  if (!match) return null;
  return path.join(dir, match);
}

export function deleteRegistrationFiles(submissionId: string): void {
  const dir = getRegistrationDir(submissionId);
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

export function isRegFileKey(v: string): v is RegFileKey {
  return (REG_FILE_KEYS as readonly string[]).includes(v);
}
