"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";

export async function updateHeroAction(formData: FormData): Promise<void> {
  const heroData = {
    headline: (formData.get("headline") as string) || "",
    subheadline: (formData.get("subheadline") as string) || "",
    image: (formData.get("image") as string) || "/images/hero-garden.jpg",
    alt: (formData.get("alt") as string) || "",
    cta_text: (formData.get("ctaText") as string) || "Lihat Katalog",
    cta_link: (formData.get("ctaLink") as string) || "/katalog",
  };

  await supabase
    .from("hero_promo")
    .update({
      headline: heroData.headline,
      subheadline: heroData.subheadline,
      image: heroData.image,
      alt: heroData.alt,
      cta_text: heroData.cta_text,
      cta_link: heroData.cta_link,
    })
    .eq("id", "hero-main");

  revalidatePath("/");
  revalidatePath("/admin/hero");
}

export async function savePromoAction(formData: FormData): Promise<void> {
  const id = (formData.get("id") as string) || `promo-${Date.now()}`;
  const originalId = (formData.get("originalId") as string) || id;

  const promoData = {
    id,
    type: "promo",
    title: (formData.get("title") as string) || "",
    description: (formData.get("description") as string) || "",
    image: (formData.get("image") as string) || "/images/andesit-rta.jpg",
    label: (formData.get("label") as string) || "",
    harga_normal: (formData.get("hargaNormal") as string) || "",
    harga_promo: (formData.get("hargaPromo") as string) || "",
    mulai_tayang: (formData.get("mulaiTayang") as string) || null,
    selesai_tayang: (formData.get("selesaiTayang") as string) || null,
    aktif: formData.get("aktif") === "on" || formData.get("aktif") === "true",
    urutan: parseInt((formData.get("urutan") as string) || "1", 10),
  };

  const { data: existing } = await supabase.from("hero_promo").select("id").eq("id", originalId).single();

  if (existing) {
    await supabase.from("hero_promo").update(promoData).eq("id", originalId);
  } else {
    await supabase.from("hero_promo").insert(promoData);
  }

  revalidatePath("/");
  revalidatePath("/admin/hero");
}

export async function deletePromoAction(formData: FormData): Promise<void> {
  const id = formData.get("id") as string;
  if (!id) return;

  await supabase.from("hero_promo").delete().eq("id", id);

  revalidatePath("/");
  revalidatePath("/admin/hero");
}

export async function updateProfilAction(formData: FormData): Promise<void> {
  const profilData = {
    title: (formData.get("title") as string) || "",
    narrative: (formData.get("narrative") as string) || "",
  };

  await supabase.from("profil").update(profilData).eq("id", "main");

  revalidatePath("/");
  revalidatePath("/admin/profil");
}
