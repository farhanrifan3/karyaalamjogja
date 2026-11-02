import { site } from "@/lib/site";

export default function AdminSettingsPage() {
  return (
    <div className="admin-page">
      <div className="admin-head">
        <div className="admin-head__copy">
          <span className="admin-eyebrow">Sistem & Aset</span>
          <h1 className="admin-title">Pengaturan & Brand</h1>
          <p className="admin-lead">
            Konfigurasi identitas brand, kontak WhatsApp, tautan Google Maps, serta status integrasi server.
          </p>
        </div>
      </div>

      <section className="admin-panel" style={{ display: "grid", gap: "1.25rem" }}>
        <h2 style={{ fontSize: "1.25rem" }}>Identitas & Kontak Saat Ini</h2>
        <div className="admin-note">
          <p><strong>Nama Brand:</strong> {site.name}</p>
          <p><strong>Alamat:</strong> {site.address.full}</p>
          <p><strong>WhatsApp:</strong> {site.phone.display}</p>
          <p><strong>Domain URL:</strong> {site.url}</p>
        </div>
      </section>
    </div>
  );
}
