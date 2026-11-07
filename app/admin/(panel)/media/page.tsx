import Link from "next/link";

import { deleteMediaAction } from "@/app/admin/media-actions";
import { AdminSubmitButton } from "@/components/admin/AdminSubmitButton";
import { listLibraryImages } from "@/lib/cms/products";

export default async function AdminMediaPage() {
  const library = await listLibraryImages();

  return (
    <div className="admin-page">
      <div className="admin-head">
        <div className="admin-head__copy">
          <span className="admin-eyebrow">Sistem & Aset</span>
          <h1 className="admin-title">Media Library</h1>
          <p className="admin-lead">
            Pusat penyimpanan foto dan media yang diunggah ke server. Dapat digunakan ulang di berbagai produk, layanan, dan promo.
          </p>
        </div>
      </div>

      <section className="admin-panel" style={{ display: "grid", gap: "1.25rem" }}>
        <h2 style={{ fontSize: "1.25rem" }}>Daftar Berkas Media ({library.length})</h2>

        {library.length === 0 ? (
          <p className="admin-note">
            Belum ada berkas media. Unggah foto lewat katalog, layanan, promo,
            atau profil untuk menambahkannya ke sini.
          </p>
        ) : (
          <div className="admin-grid">
            {library.map((img) => (
              <div key={img.path} className="admin-card">
                <div className="admin-card__media">
                  <img src={img.path} alt={img.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div className="admin-card__body">
                  <h3 className="admin-card__name" style={{ fontSize: "0.95rem" }}>{img.label}</h3>
                  <p className="admin-card__text" style={{ fontFamily: "var(--font-mono, ui-monospace, monospace)", fontSize: "0.72rem", wordBreak: "break-all" }}>{img.path}</p>
                </div>
                <div className="admin-card__actions">
                  <form
                    action={deleteMediaAction}
                    className="admin-inline"
                    data-confirm-title="Hapus media permanen?"
                    data-confirm-message={`Berkas “${img.label}” akan dihapus dari penyimpanan. Tindakan ini tidak bisa dibatalkan.`}
                    data-confirm-label="Hapus permanen"
                    data-confirm-tone="danger"
                  >
                    <input type="hidden" name="path" value={img.path} />
                    <AdminSubmitButton
                      className="admin-btn admin-btn--small admin-btn--danger"
                      pendingLabel="Menghapus…"
                    >
                      Hapus permanen
                    </AdminSubmitButton>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="admin-note">
          Hapus permanen membuang berkas dari server. Pastikan foto tidak lagi
          dipakai oleh katalog, layanan, promo, hero, atau profil.{" "}
          <Link href="/admin/katalog">Periksa katalog</Link>.
        </p>
      </section>
    </div>
  );
}
