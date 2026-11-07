import { getSupabaseAdmin } from "@/lib/supabase-admin";

/**
 * Harga master disimpan sebagai baris `hero_promo` dengan `type = "price"`.
 * Tabel `prices` belum tersedia di project Supabase, sedangkan tabel
 * `hero_promo` sudah menjadi wadah konten generik (hero, promo, pengaturan).
 * Query publik selalu memfilter `type`, jadi baris harga tidak ikut tampil.
 */
const PRICE_TYPE = "price";
const PRICE_COLUMNS =
  "id, title, label, alt, harga_normal, harga_promo, description, urutan";

export type PriceItem = {
  id: string;
  name: string;
  category: string;
  unit: string; // m2, sak, pcs, paket
  buyPrice: number;
  sellPrice: number;
  notes?: string;
};

type StoreFile = {
  version: number;
  updatedAt: string;
  items: PriceItem[];
};

type PriceRow = {
  id: string;
  title: string | null;
  label: string | null;
  alt: string | null;
  harga_normal: string | null;
  harga_promo: string | null;
  description: string | null;
  urutan: number | null;
};

function mapPrice(row: PriceRow): PriceItem {
  return {
    id: row.id,
    name: row.title ?? "",
    category: row.label ?? "",
    unit: row.alt ?? "",
    buyPrice: Number(row.harga_normal ?? 0),
    sellPrice: Number(row.harga_promo ?? 0),
    notes: row.description ?? "",
  };
}

function toRow(item: PriceItem, urutan: number) {
  return {
    id: item.id,
    type: PRICE_TYPE,
    title: item.name,
    label: item.category,
    alt: item.unit,
    harga_normal: String(item.buyPrice),
    harga_promo: String(item.sellPrice),
    description: item.notes ?? "",
    urutan,
    aktif: true,
  };
}

export async function getPricesStore(): Promise<StoreFile> {
  const { data, error } = await getSupabaseAdmin()
    .from("hero_promo")
    .select(PRICE_COLUMNS)
    .eq("type", PRICE_TYPE)
    .order("urutan", { ascending: true })
    .order("id", { ascending: true });

  if (error) {
    throw new Error(`Gagal membaca harga dari Supabase: ${error.message}`);
  }

  return {
    version: 1,
    updatedAt: new Date().toISOString(),
    items: ((data ?? []) as PriceRow[]).map(mapPrice),
  };
}

export async function getAllPrices(): Promise<PriceItem[]> {
  const store = await getPricesStore();
  return store.items;
}

export async function savePriceItem(item: PriceItem): Promise<void> {
  const admin = getSupabaseAdmin();

  const { data: existing, error: lookupError } = await admin
    .from("hero_promo")
    .select("id, urutan")
    .eq("id", item.id)
    .eq("type", PRICE_TYPE)
    .maybeSingle();

  if (lookupError) {
    throw new Error(
      `Gagal memeriksa item harga di Supabase: ${lookupError.message}`,
    );
  }

  let urutan = existing?.urutan;
  if (typeof urutan !== "number") {
    const { data: last, error: orderError } = await admin
      .from("hero_promo")
      .select("urutan")
      .eq("type", PRICE_TYPE)
      .order("urutan", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (orderError) {
      throw new Error(
        `Gagal menentukan urutan harga di Supabase: ${orderError.message}`,
      );
    }

    urutan = (last?.urutan ?? 0) + 1;
  }

  const { error } = await admin
    .from("hero_promo")
    .upsert(toRow(item, urutan), { onConflict: "id" });

  if (error) {
    throw new Error(`Gagal menyimpan harga ke Supabase: ${error.message}`);
  }
}

export async function deletePriceItem(id: string): Promise<void> {
  const { error } = await getSupabaseAdmin()
    .from("hero_promo")
    .delete()
    .eq("id", id)
    .eq("type", PRICE_TYPE);

  if (error) {
    throw new Error(`Gagal menghapus harga dari Supabase: ${error.message}`);
  }
}
