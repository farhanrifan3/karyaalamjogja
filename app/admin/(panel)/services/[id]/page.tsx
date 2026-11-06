import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminSubmitButton } from "@/components/admin/AdminSubmitButton";
import { getServicesContent } from "@/lib/cms/services";
import { saveServiceAction } from "@/app/admin/services-actions";
import { listLibraryImages } from "@/lib/cms/products";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const content = await getServicesContent();
  const library = await listLibraryImages();
  const service = content.services.find((s) => s.id === id);

  if (!service) {
    notFound();
  }

  return (
    <div className="admin-page">
      <nav className="admin-crumbs" aria-label="Remah roti">
        <Link href="/admin/services">Layanan & Maintenance</Link>
        <span aria-hidden="true">/</span>
        <span>{service.name}</span>
      </nav>

      <header className="admin-head admin-head--compact">
        <div className="admin-head__copy">
          <p className="admin-eyebrow">Ubah Layanan</p>
          <h1 className="admin-title">{service.name}</h1>
          <p className="admin-lead">Perbarui keterangan cakupan dan foto layanan.</p>
        </div>
      </header>

      <section className="admin-panel">
        <form action={saveServiceAction} className="admin-form-wrap">
          <input type="hidden" name="originalId" value={service.id} />
          <input type="hidden" name="imagePath" value={service.image} />
          <div className="admin-fields">
            <div className="admin-fields__pair">
              <div className="admin-field">
                <label htmlFor="id">ID Layanan (slug)</label>
                <input type="text" id="id" name="id" defaultValue={service.id} required />
              </div>
              <div className="admin-field">
                <label htmlFor="name">Nama Layanan</label>
                <input type="text" id="name" name="name" defaultValue={service.name} required />
              </div>
            </div>
            <div className="admin-field">
              <label htmlFor="description">Deskripsi Layanan</label>
              <textarea id="description" name="description" defaultValue={service.description} required />
            </div>
            <div className="admin-field">
              <label htmlFor="checklist">Cakupan Pekerjaan (satu per baris)</label>
              <textarea id="checklist" name="checklist" defaultValue={service.checklist.join("\n")} required />
            </div>

            <div style={{ margin: "1rem 0", padding: "1rem", background: "var(--a-card)", border: "1px solid var(--a-line)", borderRadius: "10px", display: "flex", alignItems: "center", gap: "1rem" }}>
              <img src={service.image} alt={service.name} style={{ width: "80px", height: "60px", objectFit: "cover", borderRadius: "6px" }} />
              <div>
                <span style={{ fontSize: "0.8rem", color: "var(--a-soft)", display: "block" }}>Foto Saat Ini:</span>
                <code style={{ fontSize: "0.78rem" }}>{service.image}</code>
              </div>
            </div>

            <div className="admin-fields__pair">
              <div className="admin-field">
                <label htmlFor="imageFile">Unggah Foto Baru (Opsional)</label>
                <input type="file" id="imageFile" name="imageFile" accept="image/*" className="admin-field__input" />
              </div>
              <div className="admin-field">
                <label htmlFor="image">Atau Pilih dari Galeri / Path</label>
                <select name="image" id="image" className="admin-field__input" defaultValue={service.image}>
                  <option value={service.image}>{service.image} (Saat Ini)</option>
                  {library.map((img) => (
                    <option key={img.path} value={img.path}>{img.path} ({img.label})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="admin-fields__pair">
              <div className="admin-field">
                <label htmlFor="urutan">Urutan Tampil</label>
                <input type="number" id="urutan" name="urutan" defaultValue={service.urutan} required />
              </div>
            </div>
          </div>
          <div className="admin-form__actions">
            <Link href="/admin/services" className="admin-btn">Batal</Link>
            <AdminSubmitButton pendingLabel="Menyimpan layanan…">Simpan Perubahan Layanan</AdminSubmitButton>
          </div>
        </form>
      </section>
    </div>
  );
}
