import Link from "next/link";
import { getHeroPromoContent } from "@/lib/cms/hero-promo";
import { updateHeroAction, savePromoAction, deletePromoAction } from "@/app/admin/hero-profil-actions";

export default async function AdminHeroPromoPage() {
  const content = await getHeroPromoContent();

  return (
    <div className="admin-page">
      <div className="admin-head">
        <div className="admin-head__copy">
          <span className="admin-eyebrow">Modul Konten Publik</span>
          <h1 className="admin-title">Hero & Promo Marketplace</h1>
          <p className="admin-lead">
            Kelola tampilan banner hero utama dan deretan kartu penawaran promo batu alam serta layanan (gaya ACE / INFORMA) yang tampil di beranda situs publik.
          </p>
        </div>
      </div>

      <section className="admin-panel">
        <h2 style={{ fontSize: "1.35rem", marginBottom: "1.25rem" }}>Ubah Hero Utama</h2>
        <form action={updateHeroAction} className="admin-form-wrap">
          <div className="admin-fields">
            <div className="admin-field">
              <label htmlFor="headline">Headline Utama</label>
              <input type="text" id="headline" name="headline" defaultValue={content.hero.headline} required />
            </div>
            <div className="admin-field">
              <label htmlFor="subheadline">Subheadline / Deskripsi Singkat</label>
              <textarea id="subheadline" name="subheadline" defaultValue={content.hero.subheadline} required />
            </div>
            <div className="admin-fields__pair">
              <div className="admin-field">
                <label htmlFor="image">Path Gambar Hero</label>
                <input type="text" id="image" name="image" defaultValue={content.hero.image} required />
              </div>
              <div className="admin-field">
                <label htmlFor="alt">Teks Alt Gambar</label>
                <input type="text" id="alt" name="alt" defaultValue={content.hero.alt} required />
              </div>
            </div>
            <div className="admin-fields__pair">
              <div className="admin-field">
                <label htmlFor="ctaText">Teks Tombol CTA</label>
                <input type="text" id="ctaText" name="ctaText" defaultValue={content.hero.ctaText} required />
              </div>
              <div className="admin-field">
                <label htmlFor="ctaLink">Tautan Tombol CTA</label>
                <input type="text" id="ctaLink" name="ctaLink" defaultValue={content.hero.ctaLink} required />
              </div>
            </div>
          </div>
          <div className="admin-form__actions">
            <button type="submit" className="admin-btn admin-btn--solid">Simpan Perubahan Hero</button>
          </div>
        </form>
      </section>

      <section className="admin-panel" style={{ display: "grid", gap: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h2 style={{ fontSize: "1.35rem", marginBottom: "0.25rem" }}>Daftar Promo Aktif</h2>
            <p className="admin-lead" style={{ fontSize: "0.86rem" }}>Promo kedaluwarsa otomatis disembunyikan dari situs publik.</p>
          </div>
        </div>

        <div className="admin-grid">
          {content.promos.map((promo) => (
            <div key={promo.id} className="admin-card">
              <div className="admin-card__media">
                <img src={promo.image} alt={promo.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <span className="service__num" style={{ top: "0.5rem", left: "0.5rem" }}>{promo.label}</span>
              </div>
              <div className="admin-card__body">
                <h3 className="admin-card__name">{promo.title}</h3>
                <p className="admin-card__text">{promo.description}</p>
                <div style={{ display: "flex", gap: "0.75rem", fontSize: "0.82rem", marginTop: "0.4rem" }}>
                  <span style={{ textDecoration: "line-through", color: "var(--a-soft)" }}>{promo.hargaNormal}</span>
                  <span style={{ color: "var(--a-accent)", fontWeight: 600 }}>{promo.hargaPromo}</span>
                </div>
              </div>
              <div className="admin-card__actions">
                <Link href={`/admin/hero/${promo.id}`} className="admin-btn admin-btn--small">Ubah</Link>
                <form action={deletePromoAction} className="admin-inline">
                  <input type="hidden" name="id" value={promo.id} />
                  <button type="submit" className="admin-btn admin-btn--small admin-btn--danger">Hapus</button>
                </form>
              </div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: "1px solid var(--a-line)", paddingTop: "1.5rem" }}>
          <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>Tambah / Buat Promo Baru</h3>
          <form action={savePromoAction} className="admin-form-wrap">
            <input type="hidden" name="id" value={`promo-${Date.now()}`} />
            <div className="admin-fields">
              <div className="admin-fields__pair">
                <div className="admin-field">
                  <label htmlFor="title">Judul Promo</label>
                  <input type="text" id="title" name="title" placeholder="Contoh: Paket Fasad Andesit" required />
                </div>
                <div className="admin-field">
                  <label htmlFor="label">Label Kartu</label>
                  <input type="text" id="label" name="label" defaultValue="Promo" required />
                </div>
              </div>
              <div className="admin-field">
                <label htmlFor="description">Deskripsi Singkat</label>
                <textarea id="description" name="description" placeholder="Penjelasan penawaran..." required />
              </div>
              <div className="admin-fields__pair">
                <div className="admin-field">
                  <label htmlFor="hargaNormal">Harga Normal (Dicoret)</label>
                  <input type="text" id="hargaNormal" name="hargaNormal" placeholder="Rp185.000 /m²" required />
                </div>
                <div className="admin-field">
                  <label htmlFor="hargaPromo">Harga Promo</label>
                  <input type="text" id="hargaPromo" name="hargaPromo" placeholder="Rp155.000 /m²" required />
                </div>
              </div>
              <div className="admin-fields__pair">
                <div className="admin-field">
                  <label htmlFor="image">Path Gambar Promo</label>
                  <input type="text" id="image" name="image" defaultValue="/images/andesit-rta.jpg" required />
                </div>
                <div className="admin-field">
                  <label htmlFor="urutan">Urutan Tampil</label>
                  <input type="number" id="urutan" name="urutan" defaultValue="1" required />
                </div>
              </div>
            </div>
            <div className="admin-form__actions">
              <button type="submit" className="admin-btn admin-btn--solid">Simpan Promo Baru</button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
