"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/cms/auth";
import { redirectWithAdminFeedback } from "@/lib/cms/admin-feedback";
import { handleServiceImageUpload } from "@/lib/cms/services";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function saveServiceAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = (formData.get("id") as string) || "";
  const originalId = (formData.get("originalId") as string) || "";
  const feedbackPath = originalId
    ? `/admin/services/${encodeURIComponent(id || originalId)}`
    : "/admin/services";
  const name = (formData.get("name") as string) || "";
  const description = (formData.get("description") as string) || "";
  if (!id || !name || !description) {
    redirectWithAdminFeedback(feedbackPath, "service-save-failed");
  }

  let saveFailed = false;

  try {
    const serviceOriginalId = originalId || id;
    const checklistStr = (formData.get("checklist") as string) || "";
    const checklist = checklistStr
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

    const uploadedImage = await handleServiceImageUpload(formData);
    const imagePath =
      uploadedImage ||
      (formData.get("imagePath") as string) ||
      (formData.get("image") as string) ||
      "/images/taman-minimalis.jpg";

    const admin = getSupabaseAdmin();
    const { data: existing, error: lookupError } = await admin
      .from("services")
      .select("id, aktif")
      .eq("id", serviceOriginalId)
      .maybeSingle();

    if (lookupError) throw lookupError;

    const updatedService = {
      id,
      name,
      description,
      image: imagePath,
      checklist,
      urutan: parseInt((formData.get("urutan") as string) || "1", 10),
      aktif: formData.has("aktif")
        ? formData.get("aktif") === "true" || formData.get("aktif") === "on"
        : existing?.aktif ?? true,
    };

    const result = existing
      ? await admin.from("services").update(updatedService).eq("id", serviceOriginalId)
      : await admin.from("services").insert(updatedService);

    if (result.error) throw result.error;
  } catch (error) {
    console.error("[cms] gagal menyimpan layanan:", error);
    saveFailed = true;
  }

  if (saveFailed) {
    redirectWithAdminFeedback(feedbackPath, "service-save-failed");
  }

  revalidatePath("/");
  revalidatePath("/admin/services");
  if (originalId) revalidatePath(feedbackPath);
  redirectWithAdminFeedback(feedbackPath, "service-saved");
}

export async function deleteServiceAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = (formData.get("id") as string) || "";
  if (!id) {
    redirectWithAdminFeedback("/admin/services", "service-delete-failed");
  }

  const { error } = await getSupabaseAdmin().from("services").delete().eq("id", id);
  if (error) {
    console.error("[cms] gagal menghapus layanan:", error);
    redirectWithAdminFeedback("/admin/services", "service-delete-failed");
  }

  revalidatePath("/");
  revalidatePath("/admin/services");
  redirectWithAdminFeedback("/admin/services", "service-deleted");
}
