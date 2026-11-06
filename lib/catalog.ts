import { getStorage } from "@/lib/cms/storage";

export type CatalogSize = {
  label: string;
  satuan?: string;
  aktif?: boolean;
};

export type CatalogComparison = Record<string, string>;

export type CatalogItem = {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  use: string[];
  character: string;
  image: string;
  alt: string;
  status?: string;
  label?: string;
  urutan?: number;
  sizes: CatalogSize[];
  comparison?: CatalogComparison;
};

export type CatalogCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  urutan?: number;
};

export type CatalogData = {
  categories: CatalogCategory[];
  items: CatalogItem[];
};

const CATALOG_PATH = "content/products.json";
const ANDESIT_ID = "andesit";

function normalizeImage(value: string): string {
  if (value.startsWith("public/")) {
    return value.slice("public".length);
  }
  return value;
}

function text(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function parseCatalog(raw: string | null): CatalogData {
  if (!raw) return { categories: [], items: [] };

  try {
    const parsed = JSON.parse(raw) as Partial<CatalogData>;

    const categories = (Array.isArray(parsed.categories) ? parsed.categories : [])
      .filter((category) => category && typeof category.id === "string")
      .map((category) => ({
        id: category.id,
        name: text(category.name, category.id),
        slug: text(category.slug, category.id),
        description: text(category.description),
        image: normalizeImage(text(category.image, "/images/batu-andesit.jpg")),
        urutan: typeof category.urutan === "number" ? category.urutan : 0,
      }))
      .sort((a, b) => a.urutan - b.urutan);

    const items = (Array.isArray(parsed.items) ? parsed.items : [])
      .filter((item) => item && typeof item.id === "string")
      .map((item) => ({
        id: item.id,
        categoryId: text(item.categoryId),
        name: text(item.name),
        description: text(item.description),
        use: Array.isArray(item.use)
          ? item.use.filter((entry): entry is string => typeof entry === "string")
          : [],
        character: text(item.character),
        image: normalizeImage(text(item.image, "/images/batu-andesit.jpg")),
        alt: text(item.alt, text(item.name)),
        status: text(item.status, "tampil"),
        label: text(item.label),
        urutan: typeof item.urutan === "number" ? item.urutan : 0,
        sizes: Array.isArray(item.sizes)
          ? item.sizes
              .filter((size) => size && typeof size.label === "string")
              .map((size) => ({
                label: size.label,
                satuan: text(size.satuan),
                aktif: size.aktif !== false,
              }))
          : [],
        comparison:
          item.comparison && typeof item.comparison === "object"
            ? (item.comparison as CatalogComparison)
            : undefined,
      }))
      .filter((item) => item.status !== "sembunyi" && item.status !== "draft")
      .sort((a, b) => (a.urutan ?? 0) - (b.urutan ?? 0));

    return { categories, items };
  } catch (error) {
    console.error("[katalog] gagal membaca content/products.json:", error);
    return { categories: [], items: [] };
  }
}

export async function getCatalog(): Promise<CatalogData> {
  const raw = await getStorage().readText(CATALOG_PATH);
  return parseCatalog(raw);
}

export function isAndesit(item: CatalogItem): boolean {
  return item.categoryId === ANDESIT_ID;
}

export function andesitPairs(items: CatalogItem[]): CatalogItem[] {
  return items.filter(isAndesit);
}
