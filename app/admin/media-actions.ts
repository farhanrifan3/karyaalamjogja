"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/cms/auth";
import { redirectWithAdminFeedback } from "@/lib/cms/admin-feedback";
import { deleteMedia, isManagedImage } from "@/lib/cms/media";

export async function deleteMediaAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const path = String(formData.get("path") ?? "").trim();

  if (!isManagedImage(path)) {
    redirectWithAdminFeedback("/admin/media", "media-delete-failed");
  }

  let deleteFailed = false;
  try {
    await deleteMedia(path);
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
