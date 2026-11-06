import { supabase } from "@/lib/supabase";
import type { Product } from "@/lib/types";

export async function getProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("urutan", { ascending: true });

    if (error) {
      console.error("[supabase products] error fetching:", error.message);
      return [];
    }

    return (data || []).map((item: any) => ({
      id: item.id,
      name: item.name,
      description: item.description || "",
      use: Array.isArray(item.use) ? item.use.join(", ") : (item.use || ""),
      character: item.character || "",
      image: item.image || "/images/batu-andesit.jpg",
      alt: item.alt || item.name || "",
    }));
  } catch (error) {
    console.error("[supabase products] exception:", error);
    return [];
  }
}

export async function getProduct(id: string): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      description: data.description || "",
      use: Array.isArray(data.use) ? data.use.join(", ") : (data.use || ""),
      character: data.character || "",
      image: data.image || "/images/batu-andesit.jpg",
      alt: data.alt || data.name || "",
    };
  } catch (error) {
    console.error("[supabase products] exception:", error);
    return null;
  }
}

export type { LibraryImage } from "@/lib/cms/products";
export { listLibraryImages } from "@/lib/cms/products";
