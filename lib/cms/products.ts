import { randomBytes } from "node:crypto";

import { catalogSeed } from "@/lib/catalog-seed";
import type { Product } from "@/lib/types";
import {
  getStorage,
  type StorageEntry,
  type StorageFile,
} from "@/lib/cms/storage";
import {
  IMAGE_PATTERN,
  MAX_UPLOAD_BYTES,
  cleanText,
  validateProductDraft,
  type ProductDraft,
} from "@/lib/cms/product-input";

const PRODUCTS_PATH = "content/products.json";
const AUDIT_PATH = "content/audit-log.json";
const UPLOAD_DIR = "public/uploads";
const IMAGE_DIR = "public/images";

const FALLBACK_IMAGE = "/images/batu-andesit.jpg";
const MAX_AUDIT_ENTRIES = 400;

type StoreFile = {
  version: number;
  updatedAt: string;
  items: Product[];
};

type AuditEntry = {
  at: string;
  action: "tambah" | "ubah" | "hapus" | "urutkan";
  product: string;
  detail?: string;
};

/**
 * Semua penulisan diserialkan supaya dua tab admin tidak saling menimpa.
 */
let queue: Promise<unknown> = Promise.resolve();

function enqueue<T>(task: () => Promise<T>): Promise<T> {
  const next = queue.then(task, task);
  queue = next.then(
    () => undefined,
    () => undefined,
  );
  return next;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

function normalizeProduct(raw: unknown, index: number): Product | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const item = raw as Partial<Product>;
  const name = cleanText(item.name);
  if (!name) {
    return null;
  }

  const image =
    typeof item.image === "string" && IMAGE_PATTERN.test(item.image)
      ? item.image
      : FALLBACK_IMAGE;

  return {
    id:
      typeof item.id === "string" && /^[a-z0-9-]{2,64}$/.test(item.id)
        ? item.id
        : `${slugify(name) || "batu"}-${index + 1}`,
    name,
    description: cleanText(item.description),
    use: cleanText(item.use),
    character: cleanText(item.character),
    image,
    alt: cleanText(item.alt) || name,
  };
}

function seedStore(): StoreFile {
  return {
    version: 1,
    updatedAt: new Date().toISOString(),
    items: catalogSeed.map((item) => ({ ...item })),
  };
}

function parseStore(raw: string): StoreFile {
  const parsed = JSON.parse(raw) as StoreFile | Product[];
  const items = Array.isArray(parsed) ? parsed : parsed.items;

  if (!Array.isArray(items)) {
    throw new Error("Berkas konten tidak berisi daftar barang.");
  }

  const seen = new Set<string>();
  const normalized: Product[] = [];

  items.forEach((rawItem, index) => {
    const product = normalizeProduct(rawItem, index);
    if (!product) {
      return;
    }

    let id = product.id;
    let counter = 2;
    while (seen.has(id)) {
      id = `${product.id}-${counter}`;
      counter += 1;
    }
    seen.add(id);
    normalized.push({ ...product, id });
  });

  return {
    version: 1,
    updatedAt:
      !Array.isArray(parsed) && typeof parsed.updatedAt === "string"
        ? parsed.updatedAt
        : new Date().toISOString(),
    items: normalized,
  };
}

async function readStore(strict = false): Promise<StoreFile> {
  let raw: string | null = null;

  try {
    raw = await getStorage().readText(PRODUCTS_PATH);
  } catch (error) {
    console.error("[cms] gagal membaca content/products.json:", error);
    if (strict) {
      throw new Error(
        "Berkas konten katalog tidak bisa dibaca. Periksa penyimpanan konten sebelum menyimpan.",
      );
    }
    return seedStore();
  }

  if (raw === null) {
    if (strict) {
      throw new Error(
        "Berkas content/products.json tidak ditemukan. Pulihkan berkas itu sebelum menyimpan.",
      );
    }
    return seedStore();
  }

  try {
    return parseStore(raw);
  } catch (error) {
    console.error("[cms] isi content/products.json tidak valid:", error);
    if (strict) {
      throw new Error(
        "Berkas konten katalog tidak valid. Perbaiki content/products.json sebelum menyimpan.",
      );
    }
    return seedStore();
  }
}

function buildStore(items: Product[]): StoreFile {
  return {
    version: 1,
    updatedAt: new Date().toISOString(),
    items,
  };
}

function serialize(value: unknown): string {
  return `${JSON.stringify(value, null, 2)}\n`;
}

/**
 * Audit log tidak boleh menggagalkan penyimpanan konten, jadi kegagalan
 * membaca log lama cukup dimulai dari daftar kosong.
 */
async function buildAudit(entry: AuditEntry): Promise<string> {
  let entries: AuditEntry[] = [];

  try {
    const raw = await getStorage().readText(AUDIT_PATH);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        entries = parsed as AuditEntry[];
      }
    }
  } catch (error) {
    console.error("[cms] gagal membaca audit log:", error);
  }

  entries.unshift(entry);

  return serialize(entries.slice(0, MAX_AUDIT_ENTRIES));
}

async function commitStore(
  store: StoreFile,
  audit: string,
  message: string,
): Promise<void> {
  const files: StorageFile[] = [
    { path: PRODUCTS_PATH, data: serialize(store) },
    { path: AUDIT_PATH, data: audit },
  ];

  await getStorage().commit(files, message);
}

export async function getProducts(): Promise<Product[]> {
  return (await readStore()).items;
}

export async function getProduct(id: string): Promise<Product | null> {
  const items = await getProducts();
  return items.find((item) => item.id === id) ?? null;
}

export async function createProduct(draft: ProductDraft): Promise<Product> {
  const errors = validateProductDraft(draft);
  if (Object.keys(errors).length > 0) {
    throw new Error("Data barang belum lengkap.");
  }

  return enqueue(async () => {
    const store = await readStore(true);
    const base = slugify(draft.name) || "batu";
    let id = `${base}-${randomBytes(2).toString("hex")}`;
    const taken = new Set(store.items.map((item) => item.id));
    while (taken.has(id)) {
      id = `${base}-${randomBytes(2).toString("hex")}`;
    }

    const product: Product = {
      id,
      name: draft.name,
      description: draft.description,
      use: draft.use,
      character: draft.character,
      image: draft.image,
      alt: draft.alt,
    };

    const nextStore = buildStore([...store.items, product]);
    const audit = await buildAudit({
      at: new Date().toISOString(),
      action: "tambah",
      product: product.name,
      detail: `Foto: ${product.image}`,
    });

    await commitStore(
      nextStore,
      audit,
      `content: tambah barang "${product.name}"`,
    );

    return product;
  });
}

export async function updateProduct(
  id: string,
  draft: ProductDraft,
): Promise<Product> {
  const errors = validateProductDraft(draft);
  if (Object.keys(errors).length > 0) {
    throw new Error("Data barang belum lengkap.");
  }

  return enqueue(async () => {
    const store = await readStore(true);
    const index = store.items.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error("Barang tidak ditemukan. Mungkin sudah dihapus.");
    }

    const previous = store.items[index];
    const product: Product = {
      ...previous,
      name: draft.name,
      description: draft.description,
      use: draft.use,
      character: draft.character,
      image: draft.image,
      alt: draft.alt,
    };

    const items = [...store.items];
    items[index] = product;

    const nextStore = buildStore(items);
    const audit = await buildAudit({
      at: new Date().toISOString(),
      action: "ubah",
      product: product.name,
      detail:
        previous.image !== product.image
          ? `Foto: ${previous.image} -> ${product.image}`
          : undefined,
    });

    await commitStore(
      nextStore,
      audit,
      `content: perbarui barang "${product.name}"`,
    );

    return product;
  });
}

export async function deleteProduct(id: string): Promise<void> {
  await enqueue(async () => {
    const store = await readStore(true);
    const product = store.items.find((item) => item.id === id);
    if (!product) {
      throw new Error("Barang tidak ditemukan. Mungkin sudah dihapus.");
    }

    const nextStore = buildStore(
      store.items.filter((item) => item.id !== id),
    );
    const audit = await buildAudit({
      at: new Date().toISOString(),
      action: "hapus",
      product: product.name,
      detail: `Foto lama tetap disimpan: ${product.image}`,
    });

    await commitStore(
      nextStore,
      audit,
      `content: hapus barang "${product.name}"`,
    );
  });
}

export async function moveProduct(
  id: string,
  direction: "up" | "down",
): Promise<void> {
  await enqueue(async () => {
    const store = await readStore(true);
    const index = store.items.findIndex((item) => item.id === id);
    if (index === -1) {
      return;
    }

    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= store.items.length) {
      return;
    }

    const items = [...store.items];
    [items[index], items[target]] = [items[target], items[index]];

    const nextStore = buildStore(items);
    const audit = await buildAudit({
      at: new Date().toISOString(),
      action: "urutkan",
      product: items[target].name,
      detail: direction === "up" ? "Naik satu posisi" : "Turun satu posisi",
    });

    await commitStore(nextStore, audit, "content: ubah urutan katalog");
  });
}

function detectImageExtension(buffer: Buffer): string | null {
  if (buffer.length < 12) {
    return null;
  }

  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "jpg";
  }

  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return "png";
  }

  if (
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return "webp";
  }

  if (buffer.toString("ascii", 4, 8) === "ftyp") {
    const brand = buffer.toString("ascii", 8, 12);
    if (brand === "avif" || brand === "avis") {
      return "avif";
    }
  }

  return null;
}

export async function saveUpload(file: File): Promise<string> {
  if (file.size === 0) {
    throw new Error("Berkas foto kosong.");
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error(
      `Ukuran foto maksimal ${Math.round(MAX_UPLOAD_BYTES / (1024 * 1024))} MB.`,
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const extension = detectImageExtension(buffer);

  if (!extension) {
    throw new Error("Format foto harus JPG, PNG, WebP, atau AVIF.");
  }

  const originalName = file.name.replace(/\.[^.]+$/, "");
  const base = slugify(originalName) || "foto";
  const filename = `${base}-${Date.now().toString(36)}-${randomBytes(2).toString("hex")}.${extension}`;

  await getStorage().commit(
    [{ path: `${UPLOAD_DIR}/${filename}`, data: buffer }],
    `content: unggah foto katalog ${filename}`,
  );

  return `/uploads/${filename}`;
}

export async function assertImageExists(publicPath: string): Promise<void> {
  if (!IMAGE_PATTERN.test(publicPath)) {
    throw new Error("Path foto tidak dikenal.");
  }

  const exists = await getStorage().exists(`public${publicPath}`);
  if (!exists) {
    throw new Error("Foto tidak ditemukan.");
  }
}

export type LibraryImage = {
  path: string;
  label: string;
};

export async function listLibraryImages(): Promise<LibraryImage[]> {
  const storage = getStorage();
  const [uploads, images] = await Promise.all([
    storage.listDir(UPLOAD_DIR),
    storage.listDir(IMAGE_DIR),
  ]);

  const collect = (
    entries: StorageEntry[],
    prefix: string,
  ): LibraryImage[] =>
    entries
      .filter(
        (entry) =>
          entry.type === "file" &&
          /\.(?:jpe?g|png|webp|avif)$/i.test(entry.name),
      )
      .map((entry) => ({
        path: `${prefix}/${entry.name}`,
        label: entry.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "),
      }));

  return [
    ...collect(uploads, "/uploads"),
    ...collect(images, "/images"),
  ];
}
