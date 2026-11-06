import { supabase } from "@/lib/supabase";
import type { GalleryItem } from "@/lib/types";

export async function getGalleryFromSupabase(): Promise<GalleryItem[]> {
  const { data, error } = await supabase
    .from("gallery")
    .select("*")
    .eq("aktif", true)
    .order("urutan", { ascending: true });

  if (error || !data) {
    return [];
  }

  return data.map((item: any) => ({
    image: item.image,
    alt: item.alt || item.caption || "Proyek Karya Alam",
    caption: item.caption || "",
  }));
}

