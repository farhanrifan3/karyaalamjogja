import { getSupabaseAdmin } from "@/lib/supabase-admin";

export interface HeroData {
  headline: string;
  subheadline: string;
  image: string;
  alt: string;
  ctaText: string;
  ctaLink: string;
}

export interface PromoItem {
  id: string;
  title: string;
  description: string;
  image: string;
  label: string;
  hargaNormal: string;
  hargaPromo: string;
  mulaiTayang: string;
  selesaiTayang: string;
  aktif: boolean;
  urutan: number;
}

export interface HeroPromoContent {
  version: number;
  updatedAt: string;
  hero: HeroData;
  promos: PromoItem[];
}

export interface ProfilStat {
  value: string;
  label: string;
}

export interface ProfilContent {
  version: number;
  updatedAt: string;
  title: string;
  narrative: string;
  images: string[];
  stats: ProfilStat[];
}

const DEFAULT_HERO: HeroData = {
  headline: "Pangkalan Batu Alam, Kolam, & Lanskap Yogyakarta Sejak 1986",
  subheadline: "Menyediakan batu alam pilihan langsung dari tambang.",
  image: "/images/hero-garden.jpg",
  alt: "Taman kolam koi Karya Alam",
  ctaText: "Lihat Katalog",
  ctaLink: "#batu",
};

const DEFAULT_PROFIL: ProfilContent = {
  version: 1,
  updatedAt: "",
  title: "Karya Alam · Berakar di Yogyakarta Sejak 1986",
  narrative: "Karya Alam berdiri di Sardonoharjo, Ngaglik, Sleman.",
  images: ["/images/pangkalan.jpg"],
  stats: [
    { value: "1986", label: "Tahun Berdiri" },
    { value: "1.400+", label: "Proyek Selesai" },
    { value: "Sleman", label: "Wilayah" },
  ],
};

function mapPromo(row: Record<string, unknown>): PromoItem {
  return {
    id: String(row.id ?? ""),
    title: String(row.title ?? ""),
    description: String(row.description ?? ""),
    image: String(row.image ?? ""),
    label: String(row.label ?? ""),
    hargaNormal: String(row.harga_normal ?? ""),
    hargaPromo: String(row.harga_promo ?? ""),
    mulaiTayang: String(row.mulai_tayang ?? ""),
    selesaiTayang: String(row.selesai_tayang ?? ""),
    aktif: row.aktif !== false,
    urutan: Number(row.urutan ?? 0),
  };
}

export async function getHeroPromoContent(): Promise<HeroPromoContent> {
  const { data, error } = await getSupabaseAdmin()
    .from("hero_promo")
    .select("*")
    .order("urutan", { ascending: true });

  if (error) {
    throw new Error(`Gagal membaca hero dan promo dari Supabase: ${error.message}`);
  }

  const rows = data ?? [];
  const hero = rows.find((row) => row.type === "hero");
  const promos = rows.filter((row) => row.type === "promo").map(mapPromo);

  return {
    version: 1,
    updatedAt: new Date().toISOString(),
    hero: hero
      ? {
          headline: hero.headline ?? "",
          subheadline: hero.subheadline ?? "",
          image: hero.image ?? DEFAULT_HERO.image,
          alt: hero.alt ?? "",
          ctaText: hero.cta_text ?? DEFAULT_HERO.ctaText,
          ctaLink: hero.cta_link ?? DEFAULT_HERO.ctaLink,
        }
      : DEFAULT_HERO,
    promos,
  };
}

export async function saveHeroPromoContent(data: HeroPromoContent): Promise<void> {
  const admin = getSupabaseAdmin();
  const { error: heroError } = await admin.from("hero_promo").upsert(
    {
      id: "hero-main",
      type: "hero",
      headline: data.hero.headline,
      subheadline: data.hero.subheadline,
      image: data.hero.image,
      alt: data.hero.alt,
      cta_text: data.hero.ctaText,
      cta_link: data.hero.ctaLink,
    },
    { onConflict: "id" },
  );

  if (heroError) {
    throw new Error(`Gagal menyimpan hero ke Supabase: ${heroError.message}`);
  }

  if (data.promos.length === 0) {
    return;
  }

  const { error: promoError } = await admin.from("hero_promo").upsert(
    data.promos.map((promo) => ({
      id: promo.id,
      type: "promo",
      title: promo.title,
      description: promo.description,
      image: promo.image,
      label: promo.label,
      harga_normal: promo.hargaNormal,
      harga_promo: promo.hargaPromo,
      mulai_tayang: promo.mulaiTayang || null,
      selesai_tayang: promo.selesaiTayang || null,
      aktif: promo.aktif,
      urutan: promo.urutan,
    })),
    { onConflict: "id" },
  );

  if (promoError) {
    throw new Error(`Gagal menyimpan promo ke Supabase: ${promoError.message}`);
  }
}

export async function getProfilContent(): Promise<ProfilContent> {
  const { data, error } = await getSupabaseAdmin()
    .from("profil")
    .select("*")
    .eq("id", "main")
    .maybeSingle();

  if (error) {
    throw new Error(`Gagal membaca profil dari Supabase: ${error.message}`);
  }

  if (!data) {
    return DEFAULT_PROFIL;
  }

  return {
    version: 1,
    updatedAt: data.updated_at ?? "",
    title: data.title ?? "",
    narrative: data.narrative ?? "",
    images: Array.isArray(data.images) ? data.images : [],
    stats: Array.isArray(data.stats) ? data.stats : [],
  };
}

export async function saveProfilContent(data: ProfilContent): Promise<void> {
  const { error } = await getSupabaseAdmin().from("profil").upsert(
    {
      id: "main",
      title: data.title,
      narrative: data.narrative,
      images: data.images,
      stats: data.stats,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );

  if (error) {
    throw new Error(`Gagal menyimpan profil ke Supabase: ${error.message}`);
  }
}
