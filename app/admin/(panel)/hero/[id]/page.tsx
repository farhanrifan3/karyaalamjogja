import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminSubmitButton } from "@/components/admin/AdminSubmitButton";
import { getHeroPromoContent } from "@/lib/cms/hero-promo";
import { savePromoAction } from "@/app/admin/hero-profil-actions";

export default async function EditPromoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const content = await getHeroPromoContent();
  const promo = content.promos.find((p) => p.id === id);

  if (!promo) {
    notFound();
  }

  return (
    <div className="admin-page">
      <nav className="admin-crumbs" aria-label="Remah roti">
        <Link href="/admin/hero">Hero & Promo</Link>
        <span aria-hidden="true">/</span>
        <span>{promo.title}</span>
      </nav>

      <header className="admin-head admin-head--compact">
        <div className="admin-head__copy">
          <p className="admin-eyebrow">Ubah Promo</p>
          <h1 className="admin-title">{promo.title}</h1>
          <p className="admin-lead">Perbarui informasi penawaran dan harga promo.</p>
        </div>
      </header>

      <section className="admin-panel">
        <form action={savePromoAction} className="admin-form-wrap">
          <input type="hidden" name="id" value={promo.id} />
          <input type="hidden" name="originalId" value={promo.id} />
          <div className="admin-fields">
            <div className="admin-fields__pair">
              <div className="admin-field">
                <label htmlFor="title">Judul Promo</label>
                <input type="text" id="title" name="title" defaultValue={promo.title} required />
              </div>
              <div className="admin-field">
                <label htmlFor="label">Label Kartu</label>
                <input type="text" id="label" name="label" defaultValue={promo.label} required />
              </div>
            </div>
            <div className="admin-field">
              <label htmlFor="description">Deskripsi Singkat</label>
              <textarea id="description" name="description" defaultValue={promo.description} required />
            </div>
            <div className="admin-fields__pair">
              <div className="admin-field">
                <label htmlFor="hargaNormal">Harga Normal (Dicoret)</label>
                <input type="text" id="hargaNormal" name="hargaNormal" defaultValue={promo.hargaNormal} required />
              </div>
              <div className="admin-field">
                <label htmlFor="hargaPromo">Harga Promo</label>
                <input type="text" id="hargaPromo" name="hargaPromo" defaultValue={promo.hargaPromo} required />
              </div>
            </div>
            <div className="admin-fields__pair">
              <div className="admin-field">
                <label htmlFor="imageFile">Gambar Promo (JPG / PNG)</label>
                <input
                  type="file"
                  id="imageFile"
                  name="imageFile"
                  accept="image/jpeg,image/png"
                />
                <small className="admin-field__hint">
                  Kosongkan jika tidak ingin mengganti gambar. Maksimal 4 MB.
                </small>
                <img
                  src={promo.image}
                  alt={promo.title}
                  style={{ marginTop: "0.75rem", width: "100%", maxWidth: "260px", borderRadius: "10px" }}
                />
                <input type="hidden" name="image" value={promo.image} />
              </div>
              <div className="admin-field">
                <label htmlFor="urutan">Urutan Tampil</label>
                <input type="number" id="urutan" name="urutan" defaultValue={promo.urutan} required />
              </div>
            </div>
          </div>
          <div className="admin-form__actions">
            <Link href="/admin/hero" className="admin-btn">Batal</Link>
            <AdminSubmitButton pendingLabel="Menyimpan promo…">Simpan Perubahan Promo</AdminSubmitButton>
          </div>
        </form>
      </section>
    </div>
  );
}
