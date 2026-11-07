/**
 * Aturan field katalog. Dipakai bersama oleh panel admin (klien) dan
 * server action, supaya pesan kesalahan selalu sama.
 */

export type ProductSize = {
  label: string;
  satuan: string;
  aktif: boolean;
};

export type ProductStatus = "tampil" | "sembunyi" | "draft";

export type ProductDraft = {
  categoryId: string;
  name: string;
  description: string;
  use: string;
  character: string;
  label: string;
  status: string;
  sizes: string;
  image: string;
  alt: string;
};

export type ProductFieldErrors = Partial<Record<keyof ProductDraft, string>>;

export const PRODUCT_LIMITS = {
  name: 60,
  description: 240,
  use: 60,
  character: 60,
  label: 40,
  sizes: 800,
  alt: 140,
} as const;

export const PRODUCT_STATUSES: Array<{ value: ProductStatus; label: string }> = [
  { value: "tampil", label: "Tampil di katalog" },
  { value: "sembunyi", label: "Sembunyikan dari katalog" },
  { value: "draft", label: "Draft (belum tampil)" },
];

// Foto lama tersimpan di /images atau /uploads. Foto baru berada di bucket
// publik Supabase Storage `karya-alam-media`.
export const IMAGE_PATTERN =
  /^(?:\/(?:images|uploads)\/[A-Za-z0-9._-]+\.(?:jpe?g|png|webp|avif)|https:\/\/[A-Za-z0-9-]+\.supabase\.co\/storage\/v1\/object\/public\/karya-alam-media\/[A-Za-z0-9._-]+\.(?:jpe?g|png|webp|avif))$/;

// Vercel membatasi body request serverless sekitar 4,5 MB, jadi foto dibatasi
// 4 MB agar unggahan tetap berhasil di produksi.
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

export function cleanText(value: unknown): string {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
}

/** Satu baris = satu ukuran, format `label | satuan` (satuan opsional). */
export function parseSizes(value: string): ProductSize[] {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [labelPart, ...rest] = line.split("|");
      return {
        label: cleanText(labelPart),
        satuan: cleanText(rest.join("|")),
        aktif: true,
      };
    })
    .filter((size) => size.label.length > 0)
    .slice(0, 60);
}

export function formatSizes(sizes: ProductSize[]): string {
  return sizes
    .map((size) => (size.satuan ? `${size.label} | ${size.satuan}` : size.label))
    .join("\n");
}

export function validateProductDraft(draft: ProductDraft): ProductFieldErrors {
  const errors: ProductFieldErrors = {};

  if (!draft.categoryId) {
    errors.categoryId = "Pilih kategori barang.";
  }

  if (draft.name.length < 2) {
    errors.name = "Nama barang minimal 2 karakter.";
  } else if (draft.name.length > PRODUCT_LIMITS.name) {
    errors.name = `Nama barang maksimal ${PRODUCT_LIMITS.name} karakter.`;
  }

  if (draft.description.length < 10) {
    errors.description = "Deskripsi minimal 10 karakter.";
  } else if (draft.description.length > PRODUCT_LIMITS.description) {
    errors.description = `Deskripsi maksimal ${PRODUCT_LIMITS.description} karakter.`;
  }

  if (draft.use.length < 2) {
    errors.use = "Isi keterangan pemakaian.";
  } else if (draft.use.length > PRODUCT_LIMITS.use) {
    errors.use = `Keterangan pemakaian maksimal ${PRODUCT_LIMITS.use} karakter.`;
  }

  if (draft.character.length < 2) {
    errors.character = "Isi sifat atau karakter batu.";
  } else if (draft.character.length > PRODUCT_LIMITS.character) {
    errors.character = `Sifat batu maksimal ${PRODUCT_LIMITS.character} karakter.`;
  }

  if (draft.label.length > PRODUCT_LIMITS.label) {
    errors.label = `Label maksimal ${PRODUCT_LIMITS.label} karakter.`;
  }

  if (!PRODUCT_STATUSES.some((status) => status.value === draft.status)) {
    errors.status = "Pilih status tampil yang valid.";
  }

  if (draft.sizes.length > PRODUCT_LIMITS.sizes) {
    errors.sizes = `Daftar ukuran maksimal ${PRODUCT_LIMITS.sizes} karakter.`;
  } else if (draft.sizes.trim() && parseSizes(draft.sizes).length === 0) {
    errors.sizes = "Tulis minimal satu ukuran, satu ukuran per baris.";
  }

  if (draft.alt.length < 5) {
    errors.alt = "Teks alternatif foto wajib diisi, minimal 5 karakter.";
  } else if (draft.alt.length > PRODUCT_LIMITS.alt) {
    errors.alt = `Teks alternatif foto maksimal ${PRODUCT_LIMITS.alt} karakter.`;
  }

  if (!draft.image) {
    errors.image = "Pilih atau unggah satu foto barang.";
  } else if (!IMAGE_PATTERN.test(draft.image)) {
    errors.image = "Path foto tidak dikenal. Unggah foto baru atau pilih dari galeri.";
  }

  return errors;
}
