import { randomBytes } from "node:crypto";

import type { Product } from "@/lib/types";
import { getStorage, type StorageEntry } from "@/lib/cms/storage";
import {
  IMAGE_PATTERN,
  MAX_UPLOAD_BYTES,
  cleanText,
  validateProductDraft,
  type ProductDraft,
} from "@/lib/cms/product-input";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const AUDIT_PATH = "content/audit-log.json";
const UPLOAD_DIR = "public/uploads";
const IMAGE_DIR = "public/images";
const FALLBACK_IMAGE = "/images/batu-andesit.jpg";
const MAX_AUDIT_ENTRIES = 400;

export type CmsProduct = Product & {
  categoryId: string;
};

export type ProductCategory = {
  id: string;
  name: string;
  urutan: number;
};

type ProductRow = {
  id: string;
  category_id: string | null;
  name: string | null;
  description: string | null;
  use: unknown;
  character: string | null;
  image: string | null;
  alt: string | null;
  status?: string | null;
  label?: string | null;
  urutan?: number | null;
  sizes?: unknown;
  comparison?: unknown;
};

type AuditEntry = {
  at: string;
  action: "tambah" | "ubah" | "hapus" | "urutkan";
  product: string;
  detail?: string;
};

/** Serialize writes within this process to avoid overlapping order changes. */
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

function mapProduct(row: ProductRow): CmsProduct {
  const use = Array.isArray(row.use)
    ? row.use.filter((item): item is string => typeof item === "string").join(", ")
    : cleanText(row.use);

  return {
    id: row.id,
    categoryId: row.category_id ?? "",
    name: row.name ?? "",
    description: row.description ?? "",
    use,
    character: row.character ?? "",
    image: row.image || FALLBACK_IMAGE,
    alt: row.alt || row.name || "",
  };
}

function toDatabaseUse(value: string): string[] {
  return value
    .split(",")
    .map((item) => cleanText(item))
    .filter(Boolean);
}

async function assertCategoryExists(categoryId: string): Promise<void> {
  const { data, error } = await getSupabaseAdmin()
    .from("categories")
    .select("id")
    .eq("id", categoryId)
    .maybeSingle();

  if (error) {
    throw new Error(`Gagal memeriksa kategori: ${error.message}`);
  }
  if (!data) {
    throw new Error("Kategori barang tidak ditemukan. Pilih kategori yang tersedia.");
  }
}

function serialize(value: unknown): string {
  return `${JSON.stringify(value, null, 2)}\n`;
}

async function buildAudit(entry: AuditEntry): Promise<string> {
  let entries: AuditEntry[] = [];

  try {
    const raw = await getStorage().readText(AUDIT_PATH);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
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

async function recordAudit(entry: AuditEntry, message: string): Promise<void> {
  try {
    const audit = await buildAudit(entry);
    await getStorage().commit([{ path: AUDIT_PATH, data: audit }], message);
  } catch (error) {
    console.error("[cms] gagal menyimpan audit log katalog:", error);
  }
}

export async function getProductCategories(): Promise<ProductCategory[]> {
  const { data, error } = await getSupabaseAdmin()
    .from("categories")
    .select("id, name, urutan")
    .order("urutan", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    throw new Error(`Gagal membaca kategori dari Supabase: ${error.message}`);
  }

  return (data ?? []).map((category) => ({
    id: category.id,
    name: category.name ?? category.id,
    urutan: category.urutan ?? 0,
  }));
}

export async function getProducts(): Promise<CmsProduct[]> {
  const { data, error } = await getSupabaseAdmin()
    .from("products")
    .select("*")
    .order("urutan", { ascending: true })
    .order("id", { ascending: true });

  if (error) {
    throw new Error(`Gagal membaca katalog dari Supabase: ${error.message}`);
  }

  return (data ?? []).map((row) => mapProduct(row as ProductRow));
}

export async function getProduct(id: string): Promise<CmsProduct | null> {
  const { data, error } = await getSupabaseAdmin()
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Gagal membaca barang dari Supabase: ${error.message}`);
  }

  return data ? mapProduct(data as ProductRow) : null;
}

export async function createProduct(draft: ProductDraft): Promise<CmsProduct> {
  const errors = validateProductDraft(draft);
  if (Object.keys(errors).length > 0) {
    throw new Error("Data barang belum lengkap.");
  }

  await assertCategoryExists(draft.categoryId);

  return enqueue(async () => {
    const admin = getSupabaseAdmin();
    const base = slugify(draft.name) || "batu";
    let id = `${base}-${randomBytes(2).toString("hex")}`;
    let exists = true;

    while (exists) {
      const { data, error } = await admin
        .from("products")
        .select("id")
        .eq("id", id)
        .maybeSingle();
      if (error) {
        throw new Error(`Gagal memeriksa ID barang: ${error.message}`);
      }
      exists = Boolean(data);
      if (exists) {
        id = `${base}-${randomBytes(2).toString("hex")}`;
      }
    }

    const { data: lastProduct, error: orderError } = await admin
      .from("products")
      .select("urutan")
      .order("urutan", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (orderError) {
      throw new Error(`Gagal menentukan urutan barang: ${orderError.message}`);
    }

    const payload = {
      id,
      category_id: draft.categoryId,
      name: draft.name,
      description: draft.description,
      use: toDatabaseUse(draft.use),
      character: draft.character,
      image: draft.image,
      alt: draft.alt,
      status: "tampil",
      label: "",
      urutan: (lastProduct?.urutan ?? 0) + 1,
      sizes: [],
      comparison: null,
    };

    const { data, error } = await admin
      .from("products")
      .insert(payload)
      .select("*")
      .single();

    if (error) {
      throw new Error(`Gagal menambahkan barang ke Supabase: ${error.message}`);
    }

    const product = mapProduct(data as ProductRow);
    await recordAudit(
      {
        at: new Date().toISOString(),
        action: "tambah",
        product: product.name,
        detail: `Foto: ${product.image}`,
      },
      `cms: audit tambah barang ${product.name}`,
    );

    return product;
  });
}

export async function updateProduct(
  id: string,
  draft: ProductDraft,
): Promise<CmsProduct> {
  const errors = validateProductDraft(draft);
  if (Object.keys(errors).length > 0) {
    throw new Error("Data barang belum lengkap.");
  }

  await assertCategoryExists(draft.categoryId);

  return enqueue(async () => {
    const admin = getSupabaseAdmin();
    const { data: previous, error: lookupError } = await admin
      .from("products")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (lookupError) {
      throw new Error(`Gagal memeriksa barang: ${lookupError.message}`);
    }
    if (!previous) {
      throw new Error("Barang tidak ditemukan. Mungkin sudah dihapus.");
    }

    const { data, error } = await admin
      .from("products")
      .update({
        category_id: draft.categoryId,
        name: draft.name,
        description: draft.description,
        use: toDatabaseUse(draft.use),
        character: draft.character,
        image: draft.image,
        alt: draft.alt,
      })
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      throw new Error(`Gagal memperbarui barang di Supabase: ${error.message}`);
    }

    const product = mapProduct(data as ProductRow);
    const previousProduct = mapProduct(previous as ProductRow);
    await recordAudit(
      {
        at: new Date().toISOString(),
        action: "ubah",
        product: product.name,
        detail:
          previousProduct.image !== product.image
            ? `Foto: ${previousProduct.image} -> ${product.image}`
            : undefined,
      },
      `cms: audit ubah barang ${product.name}`,
    );

    return product;
  });
}

export async function deleteProduct(id: string): Promise<void> {
  await enqueue(async () => {
    const admin = getSupabaseAdmin();
    const { data: productRow, error: lookupError } = await admin
      .from("products")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (lookupError) {
      throw new Error(`Gagal memeriksa barang: ${lookupError.message}`);
    }
    if (!productRow) {
      throw new Error("Barang tidak ditemukan. Mungkin sudah dihapus.");
    }

    const product = mapProduct(productRow as ProductRow);
    const { error } = await admin.from("products").delete().eq("id", id);
    if (error) {
      throw new Error(`Gagal menghapus barang dari Supabase: ${error.message}`);
    }

    await recordAudit(
      {
        at: new Date().toISOString(),
        action: "hapus",
        product: product.name,
        detail: `Foto lama tetap disimpan: ${product.image}`,
      },
      `cms: audit hapus barang ${product.name}`,
    );
  });
}

export async function moveProduct(
  id: string,
  direction: "up" | "down",
): Promise<void> {
  await enqueue(async () => {
    const admin = getSupabaseAdmin();
    const { data, error } = await admin
      .from("products")
      .select("id, name, urutan")
      .order("urutan", { ascending: true })
      .order("id", { ascending: true });

    if (error) {
      throw new Error(`Gagal membaca urutan katalog: ${error.message}`);
    }

    const products = data ?? [];
    const index = products.findIndex((product) => product.id === id);
    if (index === -1) {
      return;
    }

    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= products.length) {
      return;
    }

    const currentProduct = products[index];
    const targetProduct = products[target];
    const [currentUpdate, targetUpdate] = await Promise.all([
      admin
        .from("products")
        .update({ urutan: targetProduct.urutan })
        .eq("id", currentProduct.id),
      admin
        .from("products")
        .update({ urutan: currentProduct.urutan })
        .eq("id", targetProduct.id),
    ]);

    if (currentUpdate.error || targetUpdate.error) {
      throw new Error(
        `Gagal mengubah urutan katalog: ${currentUpdate.error?.message ?? targetUpdate.error?.message}`,
      );
    }

    await recordAudit(
      {
        at: new Date().toISOString(),
        action: "urutkan",
        product: currentProduct.name,
        detail: direction === "up" ? "Naik satu posisi" : "Turun satu posisi",
      },
      "cms: audit ubah urutan katalog",
    );
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
