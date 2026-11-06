"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/cms/auth";
import { savePriceItem, deletePriceItem } from "@/lib/cms/prices";
import { redirectWithAdminFeedback } from "@/lib/cms/admin-feedback";

export async function savePriceAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = (formData.get("id") as string) || `item-${Date.now()}`;
  const name = formData.get("name") as string;
  const category = formData.get("category") as string;
  const unit = formData.get("unit") as string;
  const buyPrice = parseFloat(formData.get("buyPrice") as string) || 0;
  const sellPrice = parseFloat(formData.get("sellPrice") as string) || 0;
  const notes = formData.get("notes") as string;

  if (!name || !category) {
    redirectWithAdminFeedback("/admin/harga", "price-action-failed");
  }

  let saveFailed = false;
  try {
    await savePriceItem({ id, name, category, unit, buyPrice, sellPrice, notes });
  } catch (error) {
    console.error("[cms] gagal menyimpan harga:", error);
    saveFailed = true;
  }

  if (saveFailed) {
    redirectWithAdminFeedback("/admin/harga", "price-action-failed");
  }

  revalidatePath("/admin/harga");
  redirectWithAdminFeedback("/admin/harga", "price-saved");
}

export async function deletePriceAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = formData.get("id") as string;
  if (id) {
    let deleteFailed = false;
    try {
      await deletePriceItem(id);
    } catch (error) {
      console.error("[cms] gagal menghapus harga:", error);
      deleteFailed = true;
    }

    if (deleteFailed) {
      redirectWithAdminFeedback("/admin/harga", "price-action-failed");
    }

    revalidatePath("/admin/harga");
    redirectWithAdminFeedback("/admin/harga", "price-deleted");
  }

  redirectWithAdminFeedback("/admin/harga", "price-action-failed");
}
