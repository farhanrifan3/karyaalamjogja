/**
 * Lapisan data katalog untuk halaman publik.
 *
 * Sumber kebenaran ada di `content/products.json` dan dikelola lewat panel
 * `/admin/katalog`. Berkas ini sengaja hanya mengekspor pembacaan: penulisan
 * hanya boleh terjadi dari server action di panel admin.
 */
export { getProduct, getProducts } from "@/lib/cms/products";
export type { LibraryImage } from "@/lib/cms/products";
