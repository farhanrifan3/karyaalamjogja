import { getProfilContent } from "@/lib/cms/hero-profil";
import { updateProfilAction } from "@/app/admin/hero-profil-actions";

export default async function AdminProfilPage() {
  const profil = await getProfilContent();

  return (
    <div className="admin-page">
      <div className="admin-head">
        <div className="admin-head__copy">
          <span className="admin-eyebrow">Modul Konten Publik</span>
          <h1 className="admin-title">Profil Karya Alam</h1>
          <p className="admin-lead">
            Kelola narasi sejarah pangkalan sejak 1986, prinsip kerja profesional, serta statistik bisnis yang tampil di situs publik.
          </p>
        </div>
      </div>

      <section className="admin-panel">
        <form action={updateProfilAction} className="admin-form-wrap">
          <div className="admin-fields">
            <div className="admin-field">
              <label htmlFor="title">Judul Profil</label>
              <input type="text" id="title" name="title" defaultValue={profil.title} required />
            </div>
            <div className="admin-field">
              <label htmlFor="narrative">Narasi / Isi Sejarah & Prinsip Usaha</label>
              <textarea id="narrative" name="narrative" rows={8} defaultValue={profil.narrative} required />
              <small className="admin-field__hint">Gunakan paragraf baru untuk memisahkan sejarah dan komitmen pelayanan.</small>
            </div>
            <div className="admin-field">
              <label htmlFor="stats">Statistik (Format JSON)</label>
              <input type="text" id="stats" name="stats" defaultValue={JSON.stringify(profil.stats)} required />
              <small className="admin-field__hint">Contoh: [{`"value": "1986", "label": "Tahun Berdiri"`}, ...]</small>
            </div>
          </div>
          <div className="admin-form__actions">
            <button type="submit" className="admin-btn admin-btn--solid">Simpan Perubahan Profil</button>
          </div>
        </form>
      </section>
    </div>
  );
}
