import Link from "next/link";
import { notFound } from "next/navigation";
import { getServicesContent } from "@/lib/cms/services";
import { saveServiceAction } from "@/app/admin/services-actions";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const content = await getServicesContent();
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
            <div className="admin-fields__pair">
              <div className="admin-field">
                <label htmlFor="image">Path Gambar</label>
                <input type="text" id="image" name="image" defaultValue={service.image} required />
              </div>
              <div className="admin-field">
                <label htmlFor="urutan">Urutan Tampil</label>
                <input type="number" id="urutan" name="urutan" defaultValue={service.urutan} required />
              </div>
            </div>
          </div>
          <div className="admin-form__actions">
            <Link href="/admin/services" className="admin-btn">Batal</Link>
            <button type="submit" className="admin-btn admin-btn--solid">Simpan Perubahan Layanan</button>
          </div>
        </form>
      </section>
    </div>
  );
}
