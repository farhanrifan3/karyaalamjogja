"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/cms/auth";
import { redirectWithAdminFeedback } from "@/lib/cms/admin-feedback";
import {
  DEFAULT_SITE_SETTINGS,
  saveSiteSettings,
  type SiteSettings,
} from "@/lib/cms/site-settings";

function field(formData: FormData, name: string, fallback = ""): string {
  const value = String(formData.get(name) ?? "").trim();
  return value || fallback;
}

export async function updateSiteSettingsAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const settings: SiteSettings = {
    brandName: field(formData, "brandName", DEFAULT_SITE_SETTINGS.brandName),
    addressShort: field(
      formData,
      "addressShort",
      DEFAULT_SITE_SETTINGS.addressShort,
    ),
    addressFull: field(formData, "addressFull", DEFAULT_SITE_SETTINGS.addressFull),
    hours: field(formData, "hours", DEFAULT_SITE_SETTINGS.hours),
    phoneDisplay: field(
      formData,
      "phoneDisplay",
      DEFAULT_SITE_SETTINGS.phoneDisplay,
    ),
    phoneE164: DEFAULT_SITE_SETTINGS.phoneE164,
    whatsapp: field(formData, "whatsapp", DEFAULT_SITE_SETTINGS.whatsapp).replace(
      /[^\d]/g,
      "",
    ),
    mapsUrl: field(formData, "mapsUrl", DEFAULT_SITE_SETTINGS.mapsUrl),
    mapsDirectionUrl: field(
      formData,
      "mapsDirectionUrl",
      DEFAULT_SITE_SETTINGS.mapsDirectionUrl,
    ),
    instagram: field(formData, "instagram", DEFAULT_SITE_SETTINGS.instagram),
    facebook: field(formData, "facebook", DEFAULT_SITE_SETTINGS.facebook),
    siteUrl: field(formData, "siteUrl", DEFAULT_SITE_SETTINGS.siteUrl).replace(
      /\/+$/,
      "",
    ),
  };

  let saveFailed = false;
  try {
    await saveSiteSettings(settings);
  } catch (error) {
    console.error("[cms] gagal menyimpan identitas situs:", error);
    saveFailed = true;
  }

  if (saveFailed) {
    redirectWithAdminFeedback("/admin/settings", "settings-save-failed");
  }

  revalidatePath("/");
  revalidatePath("/katalog");
  revalidatePath("/admin/settings");
  redirectWithAdminFeedback("/admin/settings", "settings-saved");
}
