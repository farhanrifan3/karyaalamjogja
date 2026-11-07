import { supabase } from "@/lib/supabase";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { site } from "@/lib/site";

export type SiteSettings = {
  brandName: string;
  addressShort: string;
  addressFull: string;
  hours: string;
  phoneDisplay: string;
  phoneE164: string;
  whatsapp: string;
  mapsUrl: string;
  mapsDirectionUrl: string;
  instagram: string;
  facebook: string;
  siteUrl: string;
};

const SETTINGS_ID = "site-settings";

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  brandName: site.name,
  addressShort: site.addressShort,
  addressFull: site.address.full,
  hours: site.hours,
  phoneDisplay: site.phone.display,
  phoneE164: site.phone.e164,
  whatsapp: site.phone.whatsapp,
  mapsUrl: site.mapsUrl,
  mapsDirectionUrl: site.mapsDirectionUrl,
  instagram: site.socials.instagram,
  facebook: site.socials.facebook,
  siteUrl: site.url,
};

function normalizePhoneE164(value: string, fallback: string): string {
  const trimmed = value.trim();
  if (!trimmed) return fallback;

  const digits = trimmed.replace(/\D/g, "");
  if (!digits) return fallback;
  if (digits.startsWith("62")) return `+${digits}`;
  if (digits.startsWith("0")) return `+62${digits.slice(1)}`;
  return `+${digits}`;
}

function normalizeWhatsapp(value: string, fallback: string): string {
  const digits = value.replace(/[^\d]/g, "");
  return digits || fallback;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const { data, error } = await supabase
      .from("hero_promo")
      .select("*")
      .eq("id", SETTINGS_ID)
      .maybeSingle();

    if (error || !data) {
      return DEFAULT_SITE_SETTINGS;
    }

    const whatsapp = normalizeWhatsapp(
      String(data.harga_normal ?? ""),
      DEFAULT_SITE_SETTINGS.whatsapp,
    );

    return {
      brandName: String(data.title ?? "") || DEFAULT_SITE_SETTINGS.brandName,
      addressFull:
        String(data.headline ?? "") || DEFAULT_SITE_SETTINGS.addressFull,
      addressShort:
        String(data.subheadline ?? "") || DEFAULT_SITE_SETTINGS.addressShort,
      hours: String(data.description ?? "") || DEFAULT_SITE_SETTINGS.hours,
      phoneDisplay:
        String(data.label ?? "") || DEFAULT_SITE_SETTINGS.phoneDisplay,
      phoneE164: normalizePhoneE164(
        String(data.label ?? ""),
        DEFAULT_SITE_SETTINGS.phoneE164,
      ),
      whatsapp,
      mapsUrl: String(data.harga_promo ?? "") || DEFAULT_SITE_SETTINGS.mapsUrl,
      mapsDirectionUrl:
        String(data.image ?? "") || DEFAULT_SITE_SETTINGS.mapsDirectionUrl,
      instagram:
        String(data.cta_text ?? "") || DEFAULT_SITE_SETTINGS.instagram,
      facebook: String(data.cta_link ?? "") || DEFAULT_SITE_SETTINGS.facebook,
      siteUrl: String(data.alt ?? "") || DEFAULT_SITE_SETTINGS.siteUrl,
    };
  } catch (error) {
    console.error("[cms] gagal membaca identitas situs:", error);
    return DEFAULT_SITE_SETTINGS;
  }
}

export async function saveSiteSettings(settings: SiteSettings): Promise<void> {
  const { error } = await getSupabaseAdmin().from("hero_promo").upsert(
    {
      id: SETTINGS_ID,
      type: "settings",
      title: settings.brandName,
      headline: settings.addressFull,
      subheadline: settings.addressShort,
      description: settings.hours,
      label: settings.phoneDisplay,
      harga_normal: settings.whatsapp,
      harga_promo: settings.mapsUrl,
      image: settings.mapsDirectionUrl,
      cta_text: settings.instagram,
      cta_link: settings.facebook,
      alt: settings.siteUrl,
      aktif: true,
      urutan: 0,
    },
    { onConflict: "id" },
  );

  if (error) {
    throw new Error(`Gagal menyimpan identitas situs: ${error.message}`);
  }
}
