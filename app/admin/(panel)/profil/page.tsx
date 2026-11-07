import { getProfilContent } from "@/lib/cms/hero-profil";
import { updateProfilAction } from "@/app/admin/hero-profil-actions";
import { AdminSubmitButton } from "@/components/admin/AdminSubmitButton";

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
        <form key={profil.title} action={updateProfilAction} className="admin-form-wrap">
          <div className="admin-fields">
            <div className="admin-field">
              <label htmlFor="title">Judul Profil</label>
              <input type="text" id="title" name="title" defaultValue={profil.title} required />
            </div>
            <div className="admin-field">
              <label htmlFor="imageFile">Foto Profil (JPG / PNG, rasio 9:16)</label>
              <input
                type="file"
                id="imageFile"
                name="imageFile"
                accept="image/jpeg,image/png"
              />
              <small className="admin-field__hint">
                Unggah foto potret dengan rasio 9:16. Kosongkan jika tidak ingin
                mengganti. Maksimal 4 MB.
              </small>
              {profil.images[0] ? (
                <img
                  src={profil.images[0]}
                  alt="Foto profil saat ini"
                  style={{
                    marginTop: "0.75rem",
                    width: "100%",
                    maxWidth: "180px",
                    aspectRatio: "9 / 16",
                    objectFit: "cover",
                    borderRadius: "10px",
                  }}
                />
              ) : null}
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
            <AdminSubmitButton pendingLabel="Menyimpan profil…">Simpan Perubahan Profil</AdminSubmitButton>
          </div>
        </form>
      </section>
    </div>
  );
}
