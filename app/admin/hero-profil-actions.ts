"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/cms/auth";
import { redirectWithAdminFeedback } from "@/lib/cms/admin-feedback";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function updateHeroAction(formData: FormData): Promise<void> {
  await requireAdmin();

  let saveFailed = false;
  try {
    const heroData = {
      headline: (formData.get("headline") as string) || "",
      subheadline: (formData.get("subheadline") as string) || "",
      image: (formData.get("image") as string) || "/images/hero-garden.jpg",
      alt: (formData.get("alt") as string) || "",
      cta_text: (formData.get("ctaText") as string) || "Lihat Katalog",
      cta_link: (formData.get("ctaLink") as string) || "/katalog",
    };

    const { error } = await getSupabaseAdmin().from("hero_promo").upsert(
      {
        id: "hero-main",
        type: "hero",
        ...heroData,
      },
      { onConflict: "id" },
    );

    if (error) throw error;
  } catch (error) {
    console.error("[cms] gagal menyimpan hero:", error);
    saveFailed = true;
  }

  if (saveFailed) {
    redirectWithAdminFeedback("/admin/hero", "hero-save-failed");
  }

  revalidatePath("/");
  revalidatePath("/admin/hero");
  redirectWithAdminFeedback("/admin/hero", "hero-saved");
}

export async function savePromoAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = (formData.get("id") as string) || `promo-${Date.now()}`;
  const originalId = (formData.get("originalId") as string) || id;
  const feedbackPath = formData.has("originalId")
    ? `/admin/hero/${encodeURIComponent(id)}`
    : "/admin/hero";
  let saveFailed = false;

  try {
    const admin = getSupabaseAdmin();
    const { data: existing, error: lookupError } = await admin
      .from("hero_promo")
      .select("mulai_tayang, selesai_tayang, aktif")
      .eq("id", originalId)
      .maybeSingle();

    if (lookupError) throw lookupError;

    const promoData = {
      id,
      type: "promo",
      title: (formData.get("title") as string) || "",
      description: (formData.get("description") as string) || "",
      image: (formData.get("image") as string) || "/images/andesit-rta.jpg",
      label: (formData.get("label") as string) || "",
      harga_normal: (formData.get("hargaNormal") as string) || "",
      harga_promo: (formData.get("hargaPromo") as string) || "",
      mulai_tayang: formData.has("mulaiTayang")
        ? (formData.get("mulaiTayang") as string) || null
        : existing?.mulai_tayang ?? null,
      selesai_tayang: formData.has("selesaiTayang")
        ? (formData.get("selesaiTayang") as string) || null
        : existing?.selesai_tayang ?? null,
      aktif: formData.has("aktif")
        ? formData.get("aktif") === "on" || formData.get("aktif") === "true"
        : existing?.aktif ?? true,
      urutan: parseInt((formData.get("urutan") as string) || "1", 10),
    };

    const result = existing
      ? await admin.from("hero_promo").update(promoData).eq("id", originalId)
      : await admin.from("hero_promo").insert(promoData);

    if (result.error) throw result.error;
  } catch (error) {
    console.error("[cms] gagal menyimpan promo:", error);
    saveFailed = true;
  }

  if (saveFailed) {
    redirectWithAdminFeedback(feedbackPath, "promo-save-failed");
  }

  revalidatePath("/");
  revalidatePath("/admin/hero");
  if (formData.has("originalId")) revalidatePath(feedbackPath);
  redirectWithAdminFeedback(feedbackPath, "promo-saved");
}

export async function deletePromoAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = (formData.get("id") as string) || "";
  if (!id) {
    redirectWithAdminFeedback("/admin/hero", "promo-delete-failed");
  }

  const { error } = await getSupabaseAdmin().from("hero_promo").delete().eq("id", id);
  if (error) {
    console.error("[cms] gagal menghapus promo:", error);
    redirectWithAdminFeedback("/admin/hero", "promo-delete-failed");
  }

  revalidatePath("/");
  revalidatePath("/admin/hero");
  redirectWithAdminFeedback("/admin/hero", "promo-deleted");
}

export async function updateProfilAction(formData: FormData): Promise<void> {
  await requireAdmin();

  let saveFailed = false;
  try {
    const profilData = {
      title: (formData.get("title") as string) || "",
      narrative: (formData.get("narrative") as string) || "",
    };

    const rawStats = (formData.get("stats") as string) || "[]";
    const parsed: unknown = JSON.parse(rawStats);
    if (
      !Array.isArray(parsed) ||
      parsed.some(
        (item) =>
          !item || typeof item.value !== "string" || typeof item.label !== "string",
      )
    ) {
      throw new Error("Format statistik harus berupa daftar value dan label.");
    }

    const admin = getSupabaseAdmin();
    const { data: existing, error: lookupError } = await admin
      .from("profil")
      .select("images")
      .eq("id", "main")
      .maybeSingle();

    if (lookupError) throw lookupError;

    const { error } = await admin.from("profil").upsert(
      {
        id: "main",
        ...profilData,
        stats: parsed,
        images: existing?.images ?? [],
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    );

    if (error) throw error;
  } catch (error) {
    console.error("[cms] gagal menyimpan profil:", error);
    saveFailed = true;
  }

  if (saveFailed) {
    redirectWithAdminFeedback("/admin/profil", "profile-save-failed");
  }

  revalidatePath("/");
  revalidatePath("/admin/profil");
  redirectWithAdminFeedback("/admin/profil", "profile-saved");
}
