import { AdminSubmitButton } from "@/components/admin/AdminSubmitButton";
import { updateSiteSettingsAction } from "@/app/admin/settings-actions";
import { getSiteSettings } from "@/lib/cms/site-settings";

export const metadata = {
  title: "Pengaturan & Brand",
};

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="admin-page">
      <div className="admin-head">
        <div className="admin-head__copy">
          <span className="admin-eyebrow">Sistem & Aset</span>
          <h1 className="admin-title">Pengaturan & Brand</h1>
          <p className="admin-lead">
            Konfigurasi identitas brand, kontak WhatsApp, tautan Google Maps,
            serta status integrasi server.
          </p>
        </div>
      </div>

      <section className="admin-panel">
        <h2 style={{ fontSize: "1.25rem", marginBottom: "1.25rem" }}>
          Identitas & Kontak Saat Ini
        </h2>

        <form action={updateSiteSettingsAction} className="admin-form-wrap">
          <div className="admin-fields">
            <div className="admin-field">
              <label htmlFor="brandName">Nama Brand</label>
              <input
                type="text"
                id="brandName"
                name="brandName"
                defaultValue={settings.brandName}
                required
              />
            </div>

            <div className="admin-fields__pair">
              <div className="admin-field">
                <label htmlFor="phoneDisplay">Nomor Telepon (Tampilan)</label>
                <input
                  type="text"
                  id="phoneDisplay"
                  name="phoneDisplay"
                  defaultValue={settings.phoneDisplay}
                  required
                />
              </div>
              <div className="admin-field">
                <label htmlFor="whatsapp">Nomor WhatsApp</label>
                <input
                  type="text"
                  id="whatsapp"
                  name="whatsapp"
                  defaultValue={settings.whatsapp}
                  inputMode="numeric"
                  required
                />
                <small className="admin-field__hint">
                  Format internasional tanpa tanda +, contoh: 6281328696300.
                </small>
              </div>
            </div>

            <div className="admin-field">
              <label htmlFor="addressShort">Alamat Singkat</label>
              <input
                type="text"
                id="addressShort"
                name="addressShort"
                defaultValue={settings.addressShort}
                required
              />
              <small className="admin-field__hint">
                Tampil di bar atas situs dan bagian footer.
              </small>
            </div>

            <div className="admin-field">
              <label htmlFor="addressFull">Alamat Lengkap</label>
              <textarea
                id="addressFull"
                name="addressFull"
                rows={3}
                defaultValue={settings.addressFull}
                required
              />
            </div>

            <div className="admin-field">
              <label htmlFor="hours">Jam Operasional</label>
              <input
                type="text"
                id="hours"
                name="hours"
                defaultValue={settings.hours}
                required
              />
            </div>

            <div className="admin-fields__pair">
              <div className="admin-field">
                <label htmlFor="mapsUrl">Tautan Google Maps</label>
                <input
                  type="url"
                  id="mapsUrl"
                  name="mapsUrl"
                  defaultValue={settings.mapsUrl}
                />
              </div>
              <div className="admin-field">
                <label htmlFor="mapsDirectionUrl">Tautan Petunjuk Arah</label>
                <input
                  type="url"
                  id="mapsDirectionUrl"
                  name="mapsDirectionUrl"
                  defaultValue={settings.mapsDirectionUrl}
                />
              </div>
            </div>

            <div className="admin-fields__pair">
              <div className="admin-field">
                <label htmlFor="instagram">Instagram</label>
                <input
                  type="url"
                  id="instagram"
                  name="instagram"
                  defaultValue={settings.instagram}
                />
              </div>
              <div className="admin-field">
                <label htmlFor="facebook">Facebook</label>
                <input
                  type="url"
                  id="facebook"
                  name="facebook"
                  defaultValue={settings.facebook}
                />
              </div>
            </div>

            <div className="admin-field">
              <label htmlFor="siteUrl">Domain URL</label>
              <input
                type="url"
                id="siteUrl"
                name="siteUrl"
                defaultValue={settings.siteUrl}
                required
              />
              <small className="admin-field__hint">
                Dipakai untuk metadata dan tautan kanonik situs.
              </small>
            </div>
          </div>

          <div className="admin-form__actions">
            <AdminSubmitButton pendingLabel="Menyimpan identitas…">
              Simpan Identitas & Kontak
            </AdminSubmitButton>
          </div>
        </form>
      </section>
    </div>
  );
}
