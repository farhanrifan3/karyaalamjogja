import fs from "fs/promises";
import path from "path";
import { commitContent } from "@/lib/cms/git";

const PRICES_PATH = "content/prices.json";

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

export async function getPricesStore(): Promise<StoreFile> {
  try {
    const raw = await fs.readFile(path.join(process.cwd(), PRICES_PATH), "utf-8");
    return JSON.parse(raw);
  } catch {
    return {
      version: 1,
      updatedAt: new Date().toISOString(),
      items: [
        { id: "andesit-bakar-15x30", name: "Andesit Bakar Polos 15x30 cm", category: "Batu Andesit", unit: "m²", buyPrice: 85000, sellPrice: 115000, notes: "Standar ±1.2 cm" },
        { id: "andesit-bakar-20x40", name: "Andesit Bakar Polos 20x40 cm", category: "Batu Andesit", unit: "m²", buyPrice: 95000, sellPrice: 135000, notes: "Standar ±1.2 cm" },
        { id: "andesit-bakar-30x60", name: "Andesit Bakar Polos 30x60 cm", category: "Batu Andesit", unit: "m²", buyPrice: 120000, sellPrice: 165000, notes: "Standar ±1.2 cm" },
        { id: "candi-15x30", name: "Batu Candi Alur / Rata Alam 15x30 cm", category: "Batu Candi", unit: "m²", buyPrice: 75000, sellPrice: 105000, notes: "Hitam pekat" },
        { id: "koral-putih-sak", name: "Koral Putih Karung (±10 kg)", category: "Koral", unit: "sak", buyPrice: 28000, sellPrice: 40000, notes: "Taman & hiasan" },
        { id: "palimanan-20x40", name: "Batu Palimanan Rata Alam 20x40 cm", category: "Batu Palimanan", unit: "m²", buyPrice: 110000, sellPrice: 155000, notes: "Krem berurat" },
        { id: "jasa-kolam-koi", name: "Jasa Pembuatan Kolam Koi (Konstruksi)", category: "Jasa Konstruksi", unit: "m²", buyPrice: 650000, sellPrice: 900000, notes: "Termasuk sistem chamber & kedap air" },
        { id: "jasa-pasang", name: "Jasa Pemasangan Batu Alam", category: "Jasa Pemasangan", unit: "m²", buyPrice: 150000, sellPrice: 250000, notes: "Tenaga pasang profesional" }
      ],
    };
  }
}

export async function savePricesStore(store: StoreFile): Promise<void> {
  store.updatedAt = new Date().toISOString();
  await fs.writeFile(path.join(process.cwd(), PRICES_PATH), JSON.stringify(store, null, 2), "utf-8");
}

export async function getAllPrices(): Promise<PriceItem[]> {
  const store = await getPricesStore();
  return store.items;
}

export async function savePriceItem(item: PriceItem): Promise<void> {
  const store = await getPricesStore();
  const idx = store.items.findIndex((p) => p.id === item.id);
  if (idx >= 0) {
    store.items[idx] = item;
  } else {
    store.items.push(item);
  }
  await savePricesStore(store);
  try {
    await commitContent([PRICES_PATH], `Save price item: ${item.name}`);
  } catch {}
}

export async function deletePriceItem(id: string): Promise<void> {
  const store = await getPricesStore();
  store.items = store.items.filter((p) => p.id !== id);
  await savePricesStore(store);
  try {
    await commitContent([PRICES_PATH], `Delete price item ${id}`);
  } catch {}
}
