import { supabase } from "@/lib/supabase";

// ========== SERVICES ==========

export type ServiceItem = {
  id: string;
  name: string;
  description: string;
  image: string;
  checklist: string[];
  urutan: number;
  aktif: boolean;
};

export async function getServicesFromSupabase(): Promise<ServiceItem[]> {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("urutan", { ascending: true });

  if (error) {
    console.error("[supabase services] error:", error.message);
    return [];
  }

  return (data || []).map((s: any) => ({
    id: s.id,
    name: s.name,
    description: s.description || "",
    image: s.image || "/images/kolam-koi-minimalis.jpg",
    checklist: Array.isArray(s.checklist) ? s.checklist : [],
    urutan: s.urutan || 0,
    aktif: s.aktif !== false,
  }));
}

export async function getServiceById(id: string): Promise<ServiceItem | null> {
  const { data, error } = await supabase.from("services").select("*").eq("id", id).single();

  if (error || !data) return null;

  return {
    id: data.id,
    name: data.name,
    description: data.description || "",
    image: data.image || "/images/kolam-koi-minimalis.jpg",
    checklist: Array.isArray(data.checklist) ? data.checklist : [],
    urutan: data.urutan || 0,
    aktif: data.aktif !== false,
  };
}

// ========== HERO & PROMO ==========

export type HeroData = {
  headline: string;
  subheadline: string;
  image: string;
  alt: string;
  ctaText: string;
  ctaLink: string;
};

export type PromoItem = {
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
};

export async function getHeroFromSupabase(): Promise<HeroData> {
  const { data, error } = await supabase
    .from("hero_promo")
    .select("*")
    .eq("type", "hero")
    .single();

  if (error || !data) {
    return {
      headline: "Pangkalan Batu Alam, Kolam, & Lanskap Yogyakarta Sejak 1986",
      subheadline: "Menyediakan batu alam pilihan langsung dari tambang, keahlian pembuatan kolam koi bergaransi kedap air 100%, taman tropis, dan tebing dekoratif.",
      image: "/images/hero-garden.jpg",
      alt: "Taman kolam koi Karya Alam Yogyakarta",
      ctaText: "Lihat Katalog Batu",
      ctaLink: "/katalog",
    };
  }

  return {
    headline: data.headline || "",
    subheadline: data.subheadline || "",
    image: data.image || "/images/hero-garden.jpg",
    alt: data.alt || "",
    ctaText: data.cta_text || "Lihat Katalog",
    ctaLink: data.cta_link || "/katalog",
  };
}

export async function getPromosFromSupabase(): Promise<PromoItem[]> {
  const { data, error } = await supabase
    .from("hero_promo")
    .select("*")
    .eq("type", "promo")
    .eq("aktif", true)
    .order("urutan", { ascending: true });

  if (error || !data) return [];

  return data.map((p: any) => ({
    id: p.id,
    title: p.title || "",
    description: p.description || "",
    image: p.image || "",
    label: p.label || "",
    hargaNormal: p.harga_normal || "",
    hargaPromo: p.harga_promo || "",
    mulaiTayang: p.mulai_tayang || "",
    selesaiTayang: p.selesai_tayang || "",
    aktif: p.aktif !== false,
    urutan: p.urutan || 0,
  }));
}

// ========== PROFIL ==========

export type ProfilStat = {
  value: string;
  label: string;
};

export type ProfilContent = {
  version: number;
  updatedAt: string;
  title: string;
  narrative: string;
  images: string[];
  stats: ProfilStat[];
};

export async function getProfilFromSupabase(): Promise<ProfilContent> {
  const { data, error } = await supabase.from("profil").select("*").eq("id", "main").single();

  if (error || !data) {
    return {
      version: 1,
      updatedAt: new Date().toISOString(),
      title: "Karya Alam · Berakar di Yogyakarta Sejak 1986",
      narrative: "Karya Alam berdiri di Dayakan, Sardonoharjo, Ngaglik, Sleman, Yogyakarta sejak tahun 1986.",
      images: ["/images/pangkalan.jpg"],
      stats: [
        { value: "1986", label: "Tahun Berdiri" },
        { value: "1.400+", label: "Proyek Selesai" },
        { value: "Sleman", label: "Wilayah Yogyakarta" },
      ],
    };
  }

  return {
    version: 1,
    updatedAt: new Date().toISOString(),
    title: data.title || "",
    narrative: data.narrative || "",
    images: Array.isArray(data.images) ? data.images : [],
    stats: Array.isArray(data.stats) ? data.stats : [],
  };
}

// ========== REVIEWS ==========

export type ReviewItem = {
  id: string;
  name: string;
  text: string;
  date: string;
  source: "website" | "google";
  status: "pending" | "approved" | "rejected";
  rating: number;
};

export async function getApprovedReviewsFromSupabase(): Promise<ReviewItem[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((r: any) => ({
    id: r.id,
    name: r.name,
    text: r.text,
    date: r.date || "",
    source: r.source || "website",
    status: r.status || "approved",
    rating: r.rating || 5,
  }));
}

export async function getAllReviewsFromSupabase(): Promise<ReviewItem[]> {
  const { data, error } = await supabase.from("reviews").select("*").order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((r: any) => ({
    id: r.id,
    name: r.name,
    text: r.text,
    date: r.date || "",
    source: r.source || "website",
    status: r.status || "pending",
    rating: r.rating || 5,
  }));
}
