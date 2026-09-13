import "server-only";
import { put } from "@vercel/blob";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { randomBytes } from "node:crypto";

/**
 * Stores an owner-uploaded image. Vercel Blob when BLOB_READ_WRITE_TOKEN is set
 * (production); otherwise a local file under public/uploads for development.
 */
export async function storeImage(file: File, folder = "gallery"): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Only image files are accepted");
  if (file.size > 8 * 1024 * 1024) throw new Error("Image must be under 8 MB");
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const name = `${folder}/${Date.now()}-${randomBytes(4).toString("hex")}.${ext}`;
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(name, file, { access: "public", addRandomSuffix: false });
    return blob.url;
  }
  if (process.env.NODE_ENV === "production") throw new Error("Uploads need BLOB_READ_WRITE_TOKEN in production");
  const dir = path.join(process.cwd(), "public", "uploads", folder);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(process.cwd(), "public", "uploads", name), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${name}`;
}
