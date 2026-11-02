import { getFinanceStore, type TransactionItem } from "@/lib/cms/finance";
import { addTransactionAction, deleteTransactionAction } from "@/app/admin/finance-actions";

export default async function AdminFinancePage() {
  const store = await getFinanceStore();

  const totalMasuk = store.transactions
    .filter((t) => t.type === "masuk")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalKeluar = store.transactions
    .filter((t) => t.type === "keluar")
    .reduce((sum, t) => sum + t.amount, 0);

  const currentBalance = store.initialBalance + totalMasuk - totalKeluar;

  // Hitung statistik per kategori untuk grafik sederhana berbasis CSS
  const categoryStats: Record<string, { masuk: number; keluar: number }> = {};
  store.transactions.forEach((t) => {
    if (!categoryStats[t.category]) {
      categoryStats[t.category] = { masuk: 0, keluar: 0 };
    }
    if (t.type === "masuk") {
      categoryStats[t.category].masuk += t.amount;
    } else {
      categoryStats[t.category].keluar += t.amount;
    }
  });

  const maxCategoryAmount = Math.max(
    ...Object.values(categoryStats).map((c) => Math.max(c.masuk, c.keluar)),
    1000000
  );

  return (
    <div className="admin-page">
      <div className="admin-head">
        <div className="admin-head__copy">
          <span className="admin-eyebrow">Modul Internal Kasir & Keuangan</span>
          <h1 className="admin-title">Kasir & Keuangan</h1>
          <p className="admin-lead">
            Pencatatan kas masuk dan keluar operasional pangkalan Karya Alam. Saldo awal per 1 Nov 2026: Rp9.835.000.
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
        <div className="admin-card" style={{ padding: "1.25rem" }}>
          <span style={{ fontSize: "0.78rem", color: "var(--a-soft)" }}>Saldo Berjalan Kas</span>
          <h3 style={{ fontSize: "1.75rem", fontWeight: 600, marginTop: "0.2rem", color: "var(--a-accent)" }}>
            Rp{currentBalance.toLocaleString("id-ID")}
          </h3>
          <small style={{ fontSize: "0.7rem", color: "var(--a-soft)" }}>Termasuk saldo awal Rp9.835.000</small>
        </div>
        <div className="admin-card" style={{ padding: "1.25rem" }}>
          <span style={{ fontSize: "0.78rem", color: "var(--a-soft)" }}>Total Masuk Periode Ini</span>
          <h3 style={{ fontSize: "1.75rem", fontWeight: 600, marginTop: "0.2rem", color: "#16a34a" }}>
            Rp{totalMasuk.toLocaleString("id-ID")}
          </h3>
        </div>
        <div className="admin-card" style={{ padding: "1.25rem" }}>
          <span style={{ fontSize: "0.78rem", color: "var(--a-soft)" }}>Total Keluar Periode Ini</span>
          <h3 style={{ fontSize: "1.75rem", fontWeight: 600, marginTop: "0.2rem", color: "#dc2626" }}>
            Rp{totalKeluar.toLocaleString("id-ID")}
          </h3>
        </div>
      </div>

      {/* Grafik Otomatis Per Kategori */}
      <div className="admin-panel" style={{ display: "grid", gap: "1.25rem" }}>
        <h2 style={{ fontSize: "1.25rem" }}>Grafik & Tren Kategori Keuangan</h2>
        {Object.keys(categoryStats).length === 0 ? (
          <p className="admin-lead">Belum ada data transaksi untuk ditampilkan dalam grafik.</p>
        ) : (
          <div style={{ display: "grid", gap: "1rem" }}>
            {Object.entries(categoryStats).map(([cat, val]) => {
              const masukPct = (val.masuk / maxCategoryAmount) * 100;
              const keluarPct = (val.keluar / maxCategoryAmount) * 100;
              return (
                <div key={cat} style={{ display: "grid", gap: "0.3rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", fontWeight: 500 }}>
                    <span>{cat}</span>
                    <span>
                      {val.masuk > 0 && <strong style={{ color: "#16a34a", marginRight: "1rem" }}>Masuk: Rp{val.masuk.toLocaleString("id-ID")}</strong>}
                      {val.keluar > 0 && <strong style={{ color: "#dc2626" }}>Keluar: Rp{val.keluar.toLocaleString("id-ID")}</strong>}
                    </span>
                  </div>
                  <div style={{ display: "grid", gap: "4px" }}>
                    {val.masuk > 0 && (
                      <div style={{ height: "10px", width: `${Math.max(masukPct, 2)}%`, background: "#16a34a", borderRadius: "4px", transition: "width 0.3s ease" }} />
                    )}
                    {val.keluar > 0 && (
                      <div style={{ height: "10px", width: `${Math.max(keluarPct, 2)}%`, background: "#dc2626", borderRadius: "4px", transition: "width 0.3s ease" }} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="admin-panel" style={{ display: "grid", gap: "1.5rem" }}>
        <h2 style={{ fontSize: "1.35rem" }}>Catat Transaksi Baru (Masuk / Keluar)</h2>
        <form action={addTransactionAction} className="admin-form-wrap">
          <div className="admin-fields">
            <div className="admin-fields__pair">
              <div className="admin-field">
                <label htmlFor="date">Tanggal Transaksi</label>
                <input type="date" id="date" name="date" defaultValue={new Date().toISOString().split("T")[0]} required />
              </div>
              <div className="admin-field">
                <label htmlFor="type">Jenis Transaksi</label>
                <select id="type" name="type" defaultValue="masuk" className="admin-field__input" style={{ width: "100%", padding: "0.85rem", borderRadius: "8px", border: "1px solid var(--a-line)", background: "var(--a-card)", color: "var(--a-text)" }}>
                  <option value="masuk">Kas Masuk (Pemasukan / DP)</option>
                  <option value="keluar">Kas Keluar (Pengeluaran / Material)</option>
                </select>
              </div>
            </div>

            <div className="admin-fields__pair">
              <div className="admin-field">
                <label htmlFor="category">Kategori Transaksi</label>
                <select id="category" name="category" defaultValue="Penjualan Batu Alam" className="admin-field__input" style={{ width: "100%", padding: "0.85rem", borderRadius: "8px", border: "1px solid var(--a-line)", background: "var(--a-card)", color: "var(--a-text)" }}>
                  <optgroup label="Pemasukan (Masuk)">
                    <option value="Penjualan Batu Alam">Penjualan Batu Alam</option>
                    <option value="DP Proyek">DP Proyek</option>
                    <option value="Pelunasan Proyek">Pelunasan Proyek</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Lainnya">Lainnya (Masuk)</option>
                  </optgroup>
                  <optgroup label="Pengeluaran (Keluar)">
                    <option value="Pembelian Material">Pembelian Material</option>
                    <option value="Upah Tukang">Upah Tukang</option>
                    <option value="Operasional">Operasional</option>
                    <option value="Transportasi">Transportasi</option>
                    <option value="Peralatan">Peralatan</option>
                    <option value="Lainnya Keluar">Lainnya (Keluar)</option>
                  </optgroup>
                </select>
              </div>
              <div className="admin-field">
                <label htmlFor="amount">Nominal (Rp)</label>
                <input type="number" id="amount" name="amount" placeholder="Contoh: 1500000" required />
              </div>
            </div>

            <div className="admin-field">
              <label htmlFor="description">Deskripsi / Keterangan</label>
              <input type="text" id="description" name="description" placeholder="Contoh: Pelunasan Kolam Koi Pak Budi" required />
            </div>

            <div className="admin-fields__pair">
              <div className="admin-field">
                <label htmlFor="paymentMethod">Metode Pembayaran</label>
                <select id="paymentMethod" name="paymentMethod" defaultValue="Transfer" className="admin-field__input" style={{ width: "100%", padding: "0.85rem", borderRadius: "8px", border: "1px solid var(--a-line)", background: "var(--a-card)", color: "var(--a-text)" }}>
                  <option value="Tunai">Tunai</option>
                  <option value="Transfer">Transfer Bank</option>
                  <option value="QRIS">QRIS</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
              <div className="admin-field">
                <label htmlFor="customer">Nama Pelanggan (Opsional)</label>
                <input type="text" id="customer" name="customer" placeholder="Contoh: Pak Budi" />
              </div>
            </div>
          </div>

          <div className="admin-form__actions">
            <button type="submit" className="admin-btn admin-btn--solid">Simpan Transaksi Kasir</button>
          </div>
        </form>
      </div>

      <div className="admin-panel" style={{ display: "grid", gap: "1.25rem" }}>
        <h2 style={{ fontSize: "1.25rem" }}>Riwayat Transaksi Keuangan ({store.transactions.length})</h2>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--a-line)", textAlign: "left", color: "var(--a-soft)" }}>
                <th style={{ padding: "0.75rem" }}>Tanggal</th>
                <th style={{ padding: "0.75rem" }}>Jenis</th>
                <th style={{ padding: "0.75rem" }}>Kategori</th>
                <th style={{ padding: "0.75rem" }}>Deskripsi</th>
                <th style={{ padding: "0.75rem" }}>Metode</th>
                <th style={{ padding: "0.75rem" }}>Nominal</th>
                <th style={{ padding: "0.75rem" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {store.transactions.map((t) => (
                <tr key={t.id} style={{ borderBottom: "1px solid var(--a-line)" }}>
                  <td style={{ padding: "0.75rem", whiteSpace: "nowrap" }}>{t.date}</td>
                  <td style={{ padding: "0.75rem" }}>
                    <span style={{ padding: "0.2rem 0.5rem", borderRadius: "12px", background: t.type === "masuk" ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)", color: t.type === "masuk" ? "#16a34a" : "#dc2626", fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>
                      {t.type}
                    </span>
                  </td>
                  <td style={{ padding: "0.75rem" }}>{t.category}</td>
                  <td style={{ padding: "0.75rem", fontWeight: 500 }}>
                    {t.description}
                    {t.customer && <div style={{ fontSize: "0.75rem", color: "var(--a-soft)" }}>Klien: {t.customer}</div>}
                  </td>
                  <td style={{ padding: "0.75rem" }}>{t.paymentMethod}</td>
                  <td style={{ padding: "0.75rem", fontWeight: 600, color: t.type === "masuk" ? "#16a34a" : "#dc2626" }}>
                    {t.type === "masuk" ? "+" : "-"}Rp{t.amount.toLocaleString("id-ID")}
                  </td>
                  <td style={{ padding: "0.75rem" }}>
                    <form action={deleteTransactionAction}>
                      <input type="hidden" name="id" value={t.id} />
                      <button type="submit" className="admin-btn admin-btn--small admin-btn--danger">Hapus</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
