import Link from "next/link";
import { getAllPrices } from "@/lib/cms/prices";
import { savePriceAction, deletePriceAction } from "@/app/admin/prices-actions";

export default async function AdminPricesPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const prices = await getAllPrices();
  const params = await searchParams;
  const editId = params.edit;
  const editingItem = editId ? prices.find((p) => p.id === editId) : null;

  return (
    <div className="admin-page">
      <div className="admin-head">
        <div className="admin-head__copy">
          <span className="admin-eyebrow">Modul Admin & Sistem</span>
          <h1 className="admin-title">Harga & Master RAB</h1>
          <p className="admin-lead">
            Kelola master harga jual batu alam dan jasa konstruksi. Data ini digunakan oleh Chatbot AI untuk menghitung estimasi RAB secara akurat.
          </p>
        </div>
      </div>

      <div className="admin-panel" style={{ display: "grid", gap: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <h2 style={{ fontSize: "1.35rem" }}>Daftar Harga Master ({prices.length} Item)</h2>
          {editingItem && (
            <Link href="/admin/harga" className="admin-btn admin-btn--small">Batal Ubah</Link>
          )}
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--a-line)", textAlign: "left", color: "var(--a-soft)" }}>
                <th style={{ padding: "0.75rem" }}>Nama Item / Varian</th>
                <th style={{ padding: "0.75rem" }}>Kategori</th>
                <th style={{ padding: "0.75rem" }}>Satuan</th>
                <th style={{ padding: "0.75rem" }}>Harga Jual</th>
                <th style={{ padding: "0.75rem" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {prices.map((p) => (
                <tr key={p.id} style={{ borderBottom: "1px solid var(--a-line)" }}>
                  <td style={{ padding: "0.75rem", fontWeight: 500 }}>
                    {p.name}
                    {p.notes && <div style={{ fontSize: "0.75rem", color: "var(--a-soft)" }}>{p.notes}</div>}
                  </td>
                  <td style={{ padding: "0.75rem" }}>{p.category}</td>
                  <td style={{ padding: "0.75rem" }}>{p.unit}</td>
                  <td style={{ padding: "0.75rem", fontWeight: 600, color: "var(--a-accent)" }}>
                    Rp{p.sellPrice.toLocaleString("id-ID")}
                  </td>
                  <td style={{ padding: "0.75rem", display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <Link href={`/admin/harga?edit=${p.id}`} className="admin-btn admin-btn--small">Ubah</Link>
                    <form action={deletePriceAction} className="admin-inline">
                      <input type="hidden" name="id" value={p.id} />
                      <button type="submit" className="admin-btn admin-btn--small admin-btn--danger">Hapus</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ borderTop: "1px solid var(--a-line)", paddingTop: "1.5rem" }}>
          <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
            {editingItem ? `Ubah Item: ${editingItem.name}` : "Tambah Item Harga Master Baru"}
          </h3>
          <form action={savePriceAction} className="admin-form-wrap">
            <input type="hidden" name="id" value={editingItem ? editingItem.id : `price-${Date.now()}`} />
            <div className="admin-fields">
              <div className="admin-fields__pair">
                <div className="admin-field">
                  <label htmlFor="name">Nama Item / Ukuran</label>
                  <input type="text" id="name" name="name" defaultValue={editingItem?.name || ""} placeholder="Contoh: Andesit Bakar 30x60 cm" required />
                </div>
                <div className="admin-field">
                  <label htmlFor="category">Kategori</label>
                  <input type="text" id="category" name="category" defaultValue={editingItem?.category || "Batu Andesit"} placeholder="Contoh: Batu Andesit / Jasa Konstruksi" required />
                </div>
              </div>
              <div className="admin-fields__pair">
                <div className="admin-field">
                  <label htmlFor="sellPrice">Harga Jual (Rp)</label>
                  <input type="number" id="sellPrice" name="sellPrice" defaultValue={editingItem?.sellPrice ?? ""} placeholder="135000" required />
                </div>
                <div className="admin-field">
                  <label htmlFor="buyPrice">Harga Beli / Modal (Rp)</label>
                  <input type="number" id="buyPrice" name="buyPrice" defaultValue={editingItem?.buyPrice ?? ""} placeholder="95000" required />
                </div>
              </div>
              <div className="admin-fields__pair">
                <div className="admin-field">
                  <label htmlFor="unit">Satuan</label>
                  <input type="text" id="unit" name="unit" defaultValue={editingItem?.unit || "m²"} placeholder="m² / sak / pcs / paket" required />
                </div>
                <div className="admin-field">
                  <label htmlFor="notes">Catatan Tambahan</label>
                  <input type="text" id="notes" name="notes" defaultValue={editingItem?.notes || ""} placeholder="Standar ±1.2 cm" />
                </div>
              </div>
            </div>
            <div className="admin-form__actions">
              <button type="submit" className="admin-btn admin-btn--solid">
                {editingItem ? "Simpan Perubahan Harga" : "Simpan Item Master Baru"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
