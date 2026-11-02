"use server";

import { revalidatePath } from "next/cache";
import { savePriceItem, deletePriceItem, getAllPrices } from "@/lib/cms/prices";

export async function savePriceAction(formData: FormData) {
  const id = (formData.get("id") as string) || `item-${Date.now()}`;
  const name = formData.get("name") as string;
  const category = formData.get("category") as string;
  const unit = formData.get("unit") as string;
  const buyPrice = parseFloat(formData.get("buyPrice") as string) || 0;
  const sellPrice = parseFloat(formData.get("sellPrice") as string) || 0;
  const notes = formData.get("notes") as string;

  if (!name || !category) return;

  await savePriceItem({ id, name, category, unit, buyPrice, sellPrice, notes });
  revalidatePath("/admin/harga");
}

export async function deletePriceAction(formData: FormData) {
  const id = formData.get("id") as string;
  if (id) {
    await deletePriceItem(id);
    revalidatePath("/admin/harga");
  }
}
