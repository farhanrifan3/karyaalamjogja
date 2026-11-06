import { supabase } from "@/lib/supabase";
import type { CatalogCategory, CatalogData, CatalogItem, CatalogComparison, CatalogSize } from "@/lib/catalog";

const ANDESIT_ID = "andesit";

export async function getCatalogFromSupabase(): Promise<CatalogData> {
  try {
    const [{ data: categoriesData, error: catError }, { data: itemsData, error: itemError }] = await Promise.all([
      supabase.from("categories").select("*").order("urutan", { ascending: true }),
      supabase.from("products").select("*").order("urutan", { ascending: true })
    ]);

    if (catError || itemError) {
      console.error("[supabase catalog] error fetching:", catError || itemError);
      return { categories: [], items: [] };
    }

    const categories: CatalogCategory[] = (categoriesData || []).map((cat: any) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
      image: cat.image || "/images/batu-andesit.jpg",
      urutan: cat.urutan || 0,
    }));

    const items: CatalogItem[] = (itemsData || [])
      .filter((item: any) => item.status !== "sembunyi" && item.status !== "draft")
      .map((item: any) => ({
        id: item.id,
        categoryId: item.category_id,
        name: item.name,
        description: item.description || "",
        use: Array.isArray(item.use) ? item.use : [],
        character: item.character || "",
        image: item.image || "/images/batu-andesit.jpg",
        alt: item.alt || item.name,
        status: item.status || "tampil",
        label: item.label || "",
        urutan: item.urutan || 0,
        sizes: Array.isArray(item.sizes) ? item.sizes : [],
        comparison: item.comparison && typeof item.comparison === "object" ? item.comparison : undefined,
      }));

    return { categories, items };
  } catch (error) {
    console.error("[supabase catalog] exception:", error);
    return { categories: [], items: [] };
  }
}
