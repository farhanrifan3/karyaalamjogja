"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";

export type ActionResponse = {
  success: boolean;
  message: string;
};

export async function saveProductAction(formData: FormData): Promise<ActionResponse> {
  try {
    const id = (formData.get("id") as string) || `prod-${Date.now()}`;
    const originalId = (formData.get("originalId") as string) || id;
    
    const productData = {
      id,
      category_id: formData.get("categoryId") as string,
      name: formData.get("name") as string,
      description: (formData.get("description") as string) || "",
      use: typeof formData.get("use") === "string" ? (formData.get("use") as string).split(",").map(s => s.trim()) : [],
      character: (formData.get("character") as string) || "",
      image: (formData.get("image") as string) || "/images/batu-andesit.jpg",
      alt: (formData.get("alt") as string) || "",
      status: (formData.get("status") as string) || "tampil",
      urutan: parseInt((formData.get("urutan") as string) || "0", 10),
      sizes: [],
    };

    const { data: existing } = await supabase.from("products").select("id").eq("id", originalId).single();

    let error;
    if (existing) {
      const result = await supabase.from("products").update(productData).eq("id", originalId);
      error = result.error;
    } else {
      const result = await supabase.from("products").insert(productData);
      error = result.error;
    }

    if (error) {
      return { success: false, message: `Gagal menyimpan produk: ${error.message}` };
    }

    revalidatePath("/");
    revalidatePath("/katalog");
    revalidatePath("/admin/katalog");
    
    return { success: true, message: `Produk "${productData.name}" berhasil disimpan!` };
  } catch (error) {
    return { success: false, message: `Terjadi kesalahan: ${error instanceof Error ? error.message : "Unknown error"}` };
  }
}

export async function deleteProductAction(formData: FormData): Promise<ActionResponse> {
  try {
    const id = formData.get("id") as string;
    if (!id) return { success: false, message: "ID produk tidak ditemukan." };

    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return { success: false, message: `Gagal menghapus produk: ${error.message}` };

    revalidatePath("/");
    revalidatePath("/katalog");
    revalidatePath("/admin/katalog");
    
    return { success: true, message: "Produk berhasil dihapus!" };
  } catch (error) {
    return { success: false, message: `Terjadi kesalahan: ${error instanceof Error ? error.message : "Unknown error"}` };
  }
}
