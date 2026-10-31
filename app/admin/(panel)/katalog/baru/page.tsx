import Link from "next/link";

import { ProductForm } from "@/components/admin/ProductForm";
import { listLibraryImages } from "@/lib/cms/products";

export const metadata = {
  title: "Tambah barang",
};

export default async function NewProductPage() {
  const library = await listLibraryImages();

  return (
    <div className="admin-page">
      <nav className="admin-crumbs" aria-label="Remah roti">
        <Link href="/admin/katalog">Katalog</Link>
        <span aria-hidden="true">/</span>
        <span>Tambah barang</span>
      </nav>

      <header className="admin-head admin-head--compact">
        <div className="admin-head__copy">
          <p className="admin-eyebrow">Barang baru</p>
          <h1 className="admin-title">Tambah barang ke katalog.</h1>
          <p className="admin-lead">
            Isi nama, keterangan singkat, dan satu foto. Setelah disimpan,
            barang langsung muncul di bab Batu pada halaman publik.
          </p>
        </div>
      </header>

      <ProductForm product={null} library={library} />
    </div>
  );
}
