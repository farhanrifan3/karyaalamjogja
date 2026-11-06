"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/cms/auth";
import {
  createProduct,
  deleteProduct,
  getProduct,
  updateProduct,
} from "@/lib/cms/products";
import { cleanText, type ProductDraft } from "@/lib/cms/product-input";

export type ActionResponse = {
  success: boolean;
  message: string;
};

export async function saveProductAction(formData: FormData): Promise<ActionResponse> {
  await requireAdmin();

  const id = cleanText(formData.get("id"));
  const originalId = cleanText(formData.get("originalId")) || id;
  const draft: ProductDraft = {
    categoryId: cleanText(formData.get("categoryId")),
    name: cleanText(formData.get("name")),
    description: cleanText(formData.get("description")),
    use: cleanText(formData.get("use")),
    character: cleanText(formData.get("character")),
    image: cleanText(formData.get("imagePath") || formData.get("image")),
    alt: cleanText(formData.get("alt")),
  };

  try {
    if (originalId && (await getProduct(originalId))) {
      await updateProduct(originalId, draft);
    } else {
      await createProduct(draft);
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal menyimpan barang.",
    };
  }

  revalidatePath("/");
  revalidatePath("/katalog");
  revalidatePath("/admin/katalog");
  return { success: true, message: "Barang berhasil disimpan." };
}

export async function deleteProductAction(formData: FormData): Promise<ActionResponse> {
  await requireAdmin();

  const id = cleanText(formData.get("id"));
  if (!id) {
    return { success: false, message: "ID barang tidak ditemukan." };
  }

  try {
    await deleteProduct(id);
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal menghapus barang.",
    };
  }

  revalidatePath("/");
  revalidatePath("/katalog");
  revalidatePath("/admin/katalog");
  return { success: true, message: "Barang berhasil dihapus." };
}
