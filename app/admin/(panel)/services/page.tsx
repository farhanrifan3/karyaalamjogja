import Link from "next/link";
import { getServicesContent } from "@/lib/cms/services";
import { saveServiceAction, deleteServiceAction } from "@/app/admin/services-actions";

export default async function AdminServicesPage() {
  const content = await getServicesContent();

  return (
    <div className="admin-page">
      <div className="admin-head">
        <div className="admin-head__copy">
          <span className="admin-eyebrow">Modul Konten Publik</span>
          <h1 className="admin-title">8 Layanan & Paket Maintenance</h1>
          <p className="admin-lead">
            Kelola daftar layanan utama Karya Alam serta paket perawatan kolam mingguan dan bulanan.
          </p>
        </div>
      </div>

      <section className="admin-panel" style={{ display: "grid", gap: "1.5rem" }}>
        <h2 style={{ fontSize: "1.35rem" }}>Daftar Layanan Saat Ini ({content.services.length})</h2>

        <div className="admin-grid">
          {content.services.map((service) => (
            <div key={service.id} className="admin-card">
              <div className="admin-card__media">
                <img src={service.image} alt={service.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <span className="service__num" style={{ top: "0.5rem", left: "0.5rem" }}>#{service.urutan}</span>
              </div>
              <div className="admin-card__body">
                <h3 className="admin-card__name">{service.name}</h3>
                <p className="admin-card__text">{service.description}</p>
                <ul style={{ margin: "0.5rem 0 0 1rem", padding: 0, color: "var(--a-soft)", fontSize: "0.78rem" }}>
                  {service.checklist.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="admin-card__actions">
                <Link href={`/admin/services/${service.id}`} className="admin-btn admin-btn--small">Ubah</Link>
                <form action={deleteServiceAction} className="admin-inline">
                  <input type="hidden" name="id" value={service.id} />
                  <button type="submit" className="admin-btn admin-btn--small admin-btn--danger">Hapus</button>
                </form>
              </div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: "1px solid var(--a-line)", paddingTop: "1.5rem" }}>
          <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>Tambah / Buat Layanan Baru</h3>
          <form action={saveServiceAction} className="admin-form-wrap">
            <div className="admin-fields">
              <div className="admin-fields__pair">
                <div className="admin-field">
                  <label htmlFor="id">ID Layanan (slug unik)</label>
                  <input type="text" id="id" name="id" placeholder="Contoh: kolam-koi" required />
                </div>
                <div className="admin-field">
                  <label htmlFor="name">Nama Layanan</label>
                  <input type="text" id="name" name="name" placeholder="Contoh: Jasa Pembuatan Kolam KOI" required />
                </div>
              </div>
              <div className="admin-field">
                <label htmlFor="description">Deskripsi Layanan</label>
                <textarea id="description" name="description" placeholder="Penjelasan lengkap layanan..." required />
              </div>
              <div className="admin-field">
                <label htmlFor="checklist">Cakupan Pekerjaan (satu per baris)</label>
                <textarea id="checklist" name="checklist" placeholder="Desain & tata letak&#10;Konstruksi kedap air" required />
              </div>
              <div className="admin-fields__pair">
                <div className="admin-field">
                  <label htmlFor="image">Path Gambar</label>
                  <input type="text" id="image" name="image" defaultValue="/images/kolam-koi-minimalis.jpg" required />
                </div>
                <div className="admin-field">
                  <label htmlFor="urutan">Urutan Tampil</label>
                  <input type="number" id="urutan" name="urutan" defaultValue="1" required />
                </div>
              </div>
            </div>
            <div className="admin-form__actions">
              <button type="submit" className="admin-btn admin-btn--solid">Simpan Layanan Baru</button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
