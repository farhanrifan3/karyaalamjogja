"use server";

import { revalidatePath } from "next/cache";
import { getHeroPromoContent, saveHeroPromoContent, getProfilContent, saveProfilContent } from "@/lib/cms/hero-profil";
import { commitContent } from "@/lib/cms/git";

export async function updateHeroAction(formData: FormData) {
  const data = await getHeroPromoContent();
  data.hero = {
    headline: formData.get("headline") as string,
    subheadline: formData.get("subheadline") as string,
    image: formData.get("image") as string,
    alt: formData.get("alt") as string,
    ctaText: formData.get("ctaText") as string,
    ctaLink: formData.get("ctaLink") as string,
  };

  await saveHeroPromoContent(data);
  await commitContent(["content/hero-promo.json"], "Update hero utama");
  revalidatePath("/");
  revalidatePath("/admin/hero");
}

export async function savePromoAction(formData: FormData) {
  const data = await getHeroPromoContent();
  const id = (formData.get("id") as string) || `promo-${Date.now()}`;
  
  const newPromo = {
    id,
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    image: formData.get("image") as string,
    label: formData.get("label") as string,
    hargaNormal: formData.get("hargaNormal") as string,
    hargaPromo: formData.get("hargaPromo") as string,
    mulaiTayang: formData.get("mulaiTayang") as string,
    selesaiTayang: formData.get("selesaiTayang") as string,
    aktif: formData.get("aktif") === "on",
    urutan: parseInt((formData.get("urutan") as string) || "0", 10),
  };

  const idx = data.promos.findIndex((p) => p.id === id);
  if (idx >= 0) {
    data.promos[idx] = newPromo;
  } else {
    data.promos.push(newPromo);
  }

  await saveHeroPromoContent(data);
  await commitContent(["content/hero-promo.json"], `Save promo: ${newPromo.title}`);
  revalidatePath("/");
  revalidatePath("/admin/hero");
}

export async function deletePromoAction(formData: FormData) {
  const id = formData.get("id") as string;
  const data = await getHeroPromoContent();
  data.promos = data.promos.filter((p) => p.id !== id);
  await saveHeroPromoContent(data);
  await commitContent(["content/hero-promo.json"], `Delete promo: ${id}`);
  revalidatePath("/");
  revalidatePath("/admin/hero");
}

export async function updateProfilAction(formData: FormData) {
  const data = await getProfilContent();
  data.title = formData.get("title") as string;
  data.narrative = formData.get("narrative") as string;
  
  const statsStr = formData.get("stats") as string;
  try {
    data.stats = JSON.parse(statsStr);
  } catch {
    // keep old if parse fails
  }

  await saveProfilContent(data);
  await commitContent(["content/profil.json"], "Update profil karya alam");
  revalidatePath("/");
  revalidatePath("/admin/profil");
}
