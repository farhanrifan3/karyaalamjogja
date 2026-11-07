import { randomBytes } from "node:crypto";

import { getStorage } from "@/lib/cms/storage";
import { IMAGE_PATTERN, MAX_UPLOAD_BYTES } from "@/lib/cms/product-input";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

/**
 * Foto CMS disimpan di Supabase Storage supaya persisten di Vercel.
 * Bucket bersifat publik untuk dibaca, sedangkan unggah/hapus memakai
 * service role di server.
 */
export const MEDIA_BUCKET = "karya-alam-media";
const UPLOAD_DIR = "public/uploads";
const IMAGE_DIR = "public/images";

const CONTENT_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  avif: "image/avif",
};

const REMOTE_MEDIA_PATTERN =
  /^https:\/\/[A-Za-z0-9-]+\.supabase\.co\/storage\/v1\/object\/public\/karya-alam-media\/([A-Za-z0-9._-]+\.(?:jpe?g|png|webp|avif))$/;

export type LibraryImage = {
  path: string;
  label: string;
};

function slugifyFilename(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

function detectImageExtension(buffer: Buffer): string | null {
  if (buffer.length < 12) {
    return null;
  }

  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "jpg";
  }

  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return "png";
  }

  if (
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return "webp";
  }

  if (buffer.toString("ascii", 4, 8) === "ftyp") {
    const brand = buffer.toString("ascii", 8, 12);
    if (brand === "avif" || brand === "avis") {
      return "avif";
    }
  }

  return null;
}

export function isRemoteMedia(path: string): boolean {
  return REMOTE_MEDIA_PATTERN.test(path);
}

export function isManagedImage(path: string): boolean {
  return IMAGE_PATTERN.test(path);
}

export async function uploadImage(file: File): Promise<string> {
  if (file.size === 0) {
    throw new Error("Berkas foto kosong.");
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error(
      `Ukuran foto maksimal ${Math.round(MAX_UPLOAD_BYTES / (1024 * 1024))} MB.`,
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const extension = detectImageExtension(buffer);
  if (!extension) {
    throw new Error("Format foto harus JPG, PNG, WebP, atau AVIF.");
  }

  const originalName = file.name.replace(/\.[^.]+$/, "");
  const base = slugifyFilename(originalName) || "foto";
  const filename = `${base}-${Date.now().toString(36)}-${randomBytes(3).toString("hex")}.${extension}`;

  const admin = getSupabaseAdmin();
  const { error } = await admin.storage
    .from(MEDIA_BUCKET)
    .upload(filename, buffer, {
      contentType: CONTENT_TYPES[extension] ?? "application/octet-stream",
      cacheControl: "31536000",
      upsert: false,
    });

  if (error) {
    throw new Error(`Foto gagal diunggah ke Supabase Storage: ${error.message}`);
  }

  return admin.storage.from(MEDIA_BUCKET).getPublicUrl(filename).data.publicUrl;
}

/** Nama lama yang masih dipakai server action katalog, hero, dan profil. */
export const saveUpload = uploadImage;

export async function assertImageExists(publicPath: string): Promise<void> {
  if (!isManagedImage(publicPath)) {
    throw new Error("Path foto tidak dikenal.");
  }

  if (isRemoteMedia(publicPath)) {
    const response = await fetch(publicPath, {
      method: "HEAD",
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Foto tidak ditemukan.");
    }
    return;
  }

  const exists = await getStorage().exists(`public${publicPath}`);
  if (!exists) {
    throw new Error("Foto tidak ditemukan.");
  }
}

export async function deleteMedia(publicPath: string): Promise<void> {
  if (!isManagedImage(publicPath)) {
    throw new Error("Path media tidak dikenal.");
  }

  const remote = publicPath.match(REMOTE_MEDIA_PATTERN);
  if (remote) {
    const { error } = await getSupabaseAdmin()
      .storage.from(MEDIA_BUCKET)
      .remove([decodeURIComponent(remote[1])]);

    if (error) {
      throw new Error(
        `Gagal menghapus media dari Supabase Storage: ${error.message}`,
      );
    }
    return;
  }

  await getStorage().remove(`public${publicPath}`);
}

export async function listLibraryImages(): Promise<LibraryImage[]> {
  const images: LibraryImage[] = [];
  const seen = new Set<string>();

  const push = (path: string, label: string) => {
    if (!path || seen.has(path)) {
      return;
    }
    seen.add(path);
    images.push({ path, label });
  };

  // Foto baru di Supabase Storage (terbaru lebih dulu).
  try {
    const admin = getSupabaseAdmin();
    const { data, error } = await admin.storage.from(MEDIA_BUCKET).list("", {
      limit: 200,
      sortBy: { column: "created_at", order: "desc" },
    });

    if (error) {
      console.error("[cms] gagal membaca media Supabase:", error.message);
    } else {
      for (const item of data ?? []) {
        if (!/\.(?:jpe?g|png|webp|avif)$/i.test(item.name)) {
          continue;
        }
        push(
          admin.storage.from(MEDIA_BUCKET).getPublicUrl(item.name).data
            .publicUrl,
          item.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "),
        );
      }
    }
  } catch (error) {
    console.error("[cms] gagal membaca media Supabase:", error);
  }

  // Foto lama yang masih tersimpan di repository.
  const collect = (entries: { name: string; type: "file" | "dir" }[], prefix: string) => {
    for (const entry of entries) {
      if (
        entry.type !== "file" ||
        !/\.(?:jpe?g|png|webp|avif)$/i.test(entry.name)
      ) {
        continue;
      }
      push(
        `${prefix}/${entry.name}`,
        entry.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "),
      );
    }
  };

  try {
    const storage = getStorage();
    const [uploads, legacy] = await Promise.all([
      storage.listDir(UPLOAD_DIR),
      storage.listDir(IMAGE_DIR),
    ]);
    collect(uploads, "/uploads");
    collect(legacy, "/images");
  } catch (error) {
    console.error("[cms] gagal membaca media lokal:", error);
  }

  return images;
}
