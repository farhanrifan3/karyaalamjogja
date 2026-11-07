"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/cms/auth";
import { redirectWithAdminFeedback } from "@/lib/cms/admin-feedback";
import { getStorage } from "@/lib/cms/storage";

const MEDIA_PATTERN =
  /^\/(?:images|uploads)\/[A-Za-z0-9._-]+\.(?:jpe?g|png|webp|avif)$/i;

export async function deleteMediaAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const path = String(formData.get("path") ?? "").trim();

  if (!MEDIA_PATTERN.test(path)) {
    redirectWithAdminFeedback("/admin/media", "media-delete-failed");
  }

  let deleteFailed = false;
  try {
    await getStorage().remove(`public${path}`);
  } catch (error) {
    console.error("[cms] gagal menghapus media:", error);
    deleteFailed = true;
  }

  if (deleteFailed) {
    redirectWithAdminFeedback("/admin/media", "media-delete-failed");
  }

  revalidatePath("/admin/media");
  revalidatePath("/admin/katalog");
  redirectWithAdminFeedback("/admin/media", "media-deleted");
}
