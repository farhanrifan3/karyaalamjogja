import Image from "next/image";
import Link from "next/link";

import { moveProductAction } from "@/app/admin/actions";
import { DeleteProductForm } from "@/components/admin/DeleteProductForm";
import { getProducts } from "@/lib/products";

export const metadata = {
  title: "Katalog",
};

const STATUS_MESSAGES: Record<string, string> = {
  ditambah: "Barang baru sudah masuk katalog dan tayang di halaman publik.",
  diperbarui: "Perubahan barang sudah disimpan dan tayang di halaman publik.",
  dihapus: "Barang sudah dihapus dari katalog. Fotonya tetap disimpan.",
};

type CatalogPageProps = {
  searchParams: Promise<{ status?: string; pesan?: string }>;
};

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const { status, pesan } = await searchParams;
  const products = await getProducts();
  const flash =
    status === "gagal"
      ? pesan || "Barang gagal diproses. Coba lagi."
      : status
        ? STATUS_MESSAGES[status]
        : undefined;

  return (
    <div className="admin-page">
      <header className="admin-head">
        <div className="admin-head__copy">
          <p className="admin-eyebrow">
            Katalog · {products.length} barang
          </p>
          <h1 className="admin-title">Barang di pangkalan.</h1>
          <p className="admin-lead">
            Tambah barang baru, ganti fotonya, atau atur urutan tampil di bab
            Batu. Semua perubahan langsung tersimpan ke konten situs.
          </p>
        </div>

        <Link href="/admin/katalog/baru" className="admin-btn admin-btn--solid">
          Tambah barang
        </Link>
      </header>

      {flash ? (
        <p
          className={`admin-flash${status === "gagal" ? " admin-flash--error" : ""}`}
          role="status"
        >
          {flash}
        </p>
      ) : null}

      {products.length === 0 ? (
        <div className="admin-empty">
          <p className="admin-eyebrow">Belum ada isi</p>
          <h2>Katalog masih kosong.</h2>
          <p>
            Tambahkan barang pertama beserta fotonya. Selama kosong, bab Batu
            di halaman publik menampilkan ajakan menghubungi lewat WhatsApp.
          </p>
          <Link
            href="/admin/katalog/baru"
            className="admin-btn admin-btn--solid"
          >
            Tambah barang pertama
          </Link>
        </div>
      ) : (
        <ul className="admin-grid">
          {products.map((product, index) => (
            <li className="admin-card" key={product.id}>
              <div className="admin-card__media">
                <Image
                  src={product.image}
                  alt={product.alt}
                  fill
                  sizes="(max-width: 720px) 92vw, (max-width: 1120px) 45vw, 24rem"
                />
              </div>

              <div className="admin-card__body">
                <p className="admin-card__index">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h2 className="admin-card__name">{product.name}</h2>
                <p className="admin-card__text">{product.description}</p>

                <dl className="admin-card__spec">
                  <div>
                    <dt>Pakai</dt>
                    <dd>{product.use}</dd>
                  </div>
                  <div>
                    <dt>Sifat</dt>
                    <dd>{product.character}</dd>
                  </div>
                </dl>
              </div>

              <div className="admin-card__actions">
                <Link
                  href={`/admin/katalog/${product.id}`}
                  className="admin-btn admin-btn--small"
                >
                  Ubah
                </Link>

                <form action={moveProductAction} className="admin-inline">
                  <input type="hidden" name="id" value={product.id} />
                  <input type="hidden" name="direction" value="up" />
                  <button
                    type="submit"
                    className="admin-btn admin-btn--small admin-btn--icon"
                    disabled={index === 0}
                    aria-label={`Naikkan ${product.name}`}
                    title="Naikkan"
                  >
                    ↑
                  </button>
                </form>

                <form action={moveProductAction} className="admin-inline">
                  <input type="hidden" name="id" value={product.id} />
                  <input type="hidden" name="direction" value="down" />
                  <button
                    type="submit"
                    className="admin-btn admin-btn--small admin-btn--icon"
                    disabled={index === products.length - 1}
                    aria-label={`Turunkan ${product.name}`}
                    title="Turunkan"
                  >
                    ↓
                  </button>
                </form>

                <DeleteProductForm id={product.id} name={product.name} />
              </div>
            </li>
          ))}
        </ul>
      )}

      <aside className="admin-note">
        <p className="admin-eyebrow">Catatan foto</p>
        <p>
          Setiap barang wajib punya satu foto dan teks alternatif. Mengganti
          foto tidak menghapus file lama, jadi foto sebelumnya masih bisa
          dipakai lagi lewat pilihan galeri.
        </p>
      </aside>
    </div>
  );
}
