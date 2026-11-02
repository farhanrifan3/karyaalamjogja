import fs from "fs/promises";
import path from "path";

const HERO_PROMO_PATH = path.join(process.cwd(), "content/hero-promo.json");
const PROFIL_PATH = path.join(process.cwd(), "content/profil.json");

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

export async function getHeroPromoContent(): Promise<HeroPromoContent> {
  try {
    const raw = await fs.readFile(HERO_PROMO_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return {
      version: 1,
      updatedAt: new Date().toISOString(),
      hero: {
        headline: "Pangkalan Batu Alam, Kolam, & Lanskap Yogyakarta Sejak 1986",
        subheadline: "Menyediakan batu alam pilihan langsung dari tambang.",
        image: "/images/hero-garden.jpg",
        alt: "Taman kolam koi Karya Alam",
        ctaText: "Lihat Katalog",
        ctaLink: "#batu",
      },
      promos: [],
    };
  }
}

export async function saveHeroPromoContent(data: HeroPromoContent): Promise<void> {
  data.updatedAt = new Date().toISOString();
  await fs.writeFile(HERO_PROMO_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export async function getProfilContent(): Promise<ProfilContent> {
  try {
    const raw = await fs.readFile(PROFIL_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return {
      version: 1,
      updatedAt: new Date().toISOString(),
      title: "Karya Alam · Berakar di Yogyakarta Sejak 1986",
      narrative: "Karya Alam berdiri di Sardonoharjo, Ngaglik, Sleman.",
      images: ["/images/pangkalan.jpg"],
      stats: [
        { value: "1986", label: "Tahun Berdiri" },
        { value: "1.400+", label: "Proyek Selesai" },
        { value: "Sleman", label: "Wilayah" },
      ],
    };
  }
}

export async function saveProfilContent(data: ProfilContent): Promise<void> {
  data.updatedAt = new Date().toISOString();
  await fs.writeFile(PROFIL_PATH, JSON.stringify(data, null, 2), "utf-8");
}
