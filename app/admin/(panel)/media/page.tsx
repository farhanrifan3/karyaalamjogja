import Link from "next/link";
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
        <div className="admin-grid">
          {library.map((img, idx) => (
            <div key={idx} className="admin-card">
              <div className="admin-card__media">
                <img src={img.path} alt={img.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div className="admin-card__body">
                <h3 className="admin-card__name" style={{ fontSize: "0.95rem" }}>{img.label}</h3>
                <p className="admin-card__text" style={{ fontFamily: "var(--sc-font-mono)", fontSize: "0.72rem", wordBreak: "break-all" }}>{img.path}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
