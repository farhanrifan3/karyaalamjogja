import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductForm } from "@/components/admin/ProductForm";
import { getProduct, listLibraryImages } from "@/lib/cms/products";

export const metadata = {
  title: "Ubah barang",
};

type EditProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const [product, library] = await Promise.all([
    getProduct(id),
    listLibraryImages(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="admin-page">
      <nav className="admin-crumbs" aria-label="Remah roti">
        <Link href="/admin/katalog">Katalog</Link>
        <span aria-hidden="true">/</span>
        <span>{product.name}</span>
      </nav>

      <header className="admin-head admin-head--compact">
        <div className="admin-head__copy">
          <p className="admin-eyebrow">Ubah barang</p>
          <h1 className="admin-title">{product.name}</h1>
          <p className="admin-lead">
            Perbarui keterangan atau ganti fotonya. Foto lama tetap tersimpan
            di galeri.
          </p>
        </div>
      </header>

      <ProductForm product={product} library={library} />
    </div>
  );
}
