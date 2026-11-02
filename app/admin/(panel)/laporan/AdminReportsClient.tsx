"use client";

import { useState } from "react";

type Transaction = {
  id: string;
  date: string;
  type: "masuk" | "keluar";
  category: string;
  description: string;
  amount: number;
  paymentMethod: string;
  customer?: string;
};

export default function AdminReportsClient({
  transactions,
  initialBalance,
}: {
  transactions: Transaction[];
  initialBalance: number;
}) {
  const [period, setPeriod] = useState<"harian" | "bulanan" | "tahunan">("bulanan");
  const [startDate, setStartDate] = useState("2026-11-01");
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);
  const [typeFilter, setTypeFilter] = useState<string>("all");

  // Filter transaksi
  const filtered = transactions.filter((t) => {
    if (!t.date) return false;
    if (startDate && t.date < startDate) return false;
    if (endDate && t.date > endDate) return false;
    if (typeFilter !== "all" && t.type !== typeFilter) return false;
    return true;
  });

  const totalMasuk = filtered
    .filter((t) => t.type === "masuk")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalKeluar = filtered
    .filter((t) => t.type === "keluar")
    .reduce((sum, t) => sum + t.amount, 0);

  const currentBalance = initialBalance + totalMasuk - totalKeluar;
  const totalTrx = filtered.length;
  const avgTrx = totalTrx > 0 ? Math.round((totalMasuk + totalKeluar) / totalTrx) : 0;

  // Grouping data untuk Histogram
  const chartDataMap: Record<string, { masuk: number; keluar: number }> = {};
  filtered.forEach((t) => {
    let key = t.date;
    if (period === "bulanan") {
      key = t.date.substring(0, 7);
    } else if (period === "tahunan") {
      key = t.date.substring(0, 4);
    }

    if (!chartDataMap[key]) chartDataMap[key] = { masuk: 0, keluar: 0 };
    if (t.type === "masuk") {
      chartDataMap[key].masuk += t.amount;
    } else {
      chartDataMap[key].keluar += t.amount;
    }
  });

  const sortedKeys = Object.keys(chartDataMap).sort();
  const maxVal = Math.max(
    ...Object.values(chartDataMap).map((d) => Math.max(d.masuk, d.keluar)),
    1000000
  );

  // Kategori summary
  const categorySummary: Record<string, { masuk: number; keluar: number; count: number }> = {};
  filtered.forEach((t) => {
    if (!categorySummary[t.category]) {
      categorySummary[t.category] = { masuk: 0, keluar: 0, count: 0 };
    }
    categorySummary[t.category].count += 1;
    if (t.type === "masuk") {
      categorySummary[t.category].masuk += t.amount;
    } else {
      categorySummary[t.category].keluar += t.amount;
    }
  });

  // Top items / material
  const frequentItems: Record<string, { count: number; total: number }> = {};
  filtered.forEach((t) => {
    const key = t.description.trim();
    if (!frequentItems[key]) frequentItems[key] = { count: 0, total: 0 };
    frequentItems[key].count += 1;
    frequentItems[key].total += t.amount;
  });

  const sortedFrequent = Object.entries(frequentItems)
    .sort((a, b) => b[1].count - a[1].count || b[1].total - a[1].total)
    .slice(0, 5);

  const bestProduct = sortedFrequent.length > 0 ? sortedFrequent[0][0] : "-";
  const bestProductQty = sortedFrequent.length > 0 ? `${sortedFrequent[0][1].count}x Transaksi` : "0 Transaksi";

  function exportCSV() {
    let csvContent = "data:text/csv;charset=utf-8,Tanggal,Jenis,Kategori,Deskripsi,Metode,Nominal\n";
    filtered.forEach((r) => {
      csvContent += `${r.date},${r.type},${r.category},"${r.description}",${r.paymentMethod},${r.amount}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Laporan_Keuangan_KaryaAlam_${period}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function printReport() {
    window.print();
  }

  return (
    <div className="admin-page">
      <div className="admin-head">
        <div className="admin-head__copy">
          <span className="admin-eyebrow">Analitik & Crosscheck Keuangan</span>
          <h1 className="admin-title">Laporan Keuangan & Tren Barang</h1>
          <p className="admin-lead">
            Histogram bulanan & tahunan, rekap kategori transaksi, serta daftar material yang paling sering keluar.
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            onClick={exportCSV}
            className="admin-btn"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
          >
            📥 Export CSV
          </button>
          <button
            onClick={printReport}
            className="admin-btn admin-btn--solid"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
          >
            🖨️ Cetak Laporan
          </button>
        </div>
      </div>

      {/* Toolbar Filter & Periode */}
      <div className="admin-panel" style={{ display: "grid", gap: "1rem" }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
          
          {/* Periode Switcher */}
          <div style={{ display: "flex", gap: "0.25rem", background: "var(--a-card)", padding: "0.25rem", borderRadius: "10px", border: "1px solid var(--a-line)" }}>
            <button
              onClick={() => setPeriod("harian")}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                border: "0",
                fontSize: "0.85rem",
                fontWeight: period === "harian" ? 600 : 500,
                background: period === "harian" ? "var(--a-accent)" : "transparent",
                color: period === "harian" ? "#fff" : "var(--a-text)",
                cursor: "pointer",
              }}
            >
              Harian
            </button>
            <button
              onClick={() => setPeriod("bulanan")}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                border: "0",
                fontSize: "0.85rem",
                fontWeight: period === "bulanan" ? 600 : 500,
                background: period === "bulanan" ? "var(--a-accent)" : "transparent",
                color: period === "bulanan" ? "#fff" : "var(--a-text)",
                cursor: "pointer",
              }}
            >
              Bulanan
            </button>
            <button
              onClick={() => setPeriod("tahunan")}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                border: "0",
                fontSize: "0.85rem",
                fontWeight: period === "tahunan" ? 600 : 500,
                background: period === "tahunan" ? "var(--a-accent)" : "transparent",
                color: period === "tahunan" ? "#fff" : "var(--a-text)",
                cursor: "pointer",
              }}
            >
              Tahunan
            </button>
          </div>

          {/* Filter Tanggal & Jenis */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.5rem" }}>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="admin-field__input"
              style={{ padding: "0.5rem", borderRadius: "8px", border: "1px solid var(--a-line)", background: "var(--a-card)", color: "var(--a-text)", fontSize: "0.85rem" }}
            >
              <option value="all">Semua Arus Kas</option>
              <option value="masuk">Uang Masuk</option>
              <option value="keluar">Uang Keluar</option>
            </select>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{ padding: "0.5rem", borderRadius: "8px", border: "1px solid var(--a-line)", background: "var(--a-card)", color: "var(--a-text)", fontSize: "0.85rem" }}
            />
            <span style={{ fontSize: "0.85rem", color: "var(--a-soft)" }}>s/d</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{ padding: "0.5rem", borderRadius: "8px", border: "1px solid var(--a-line)", background: "var(--a-card)", color: "var(--a-text)", fontSize: "0.85rem" }}
            />
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
        <div className="admin-card" style={{ padding: "1.25rem" }}>
          <span style={{ fontSize: "0.78rem", color: "var(--a-soft)" }}>Net Kas Periode Ini</span>
          <h3 style={{ fontSize: "1.75rem", fontWeight: 600, marginTop: "0.2rem", color: currentBalance >= 0 ? "var(--a-accent)" : "#dc2626" }}>
            Rp{currentBalance.toLocaleString("id-ID")}
          </h3>
          <small style={{ fontSize: "0.7rem", color: "var(--a-soft)" }}>{totalTrx} transaksi dalam filter</small>
        </div>
        <div className="admin-card" style={{ padding: "1.25rem" }}>
          <span style={{ fontSize: "0.78rem", color: "var(--a-soft)" }}>Total Uang Masuk</span>
          <h3 style={{ fontSize: "1.75rem", fontWeight: 600, marginTop: "0.2rem", color: "#16a34a" }}>
            Rp{totalMasuk.toLocaleString("id-ID")}
          </h3>
        </div>
        <div className="admin-card" style={{ padding: "1.25rem" }}>
          <span style={{ fontSize: "0.78rem", color: "var(--a-soft)" }}>Total Uang Keluar</span>
          <h3 style={{ fontSize: "1.75rem", fontWeight: 600, marginTop: "0.2rem", color: "#dc2626" }}>
            Rp{totalKeluar.toLocaleString("id-ID")}
          </h3>
        </div>
        <div className="admin-card" style={{ padding: "1.25rem" }}>
          <span style={{ fontSize: "0.78rem", color: "var(--a-soft)" }}>Aktivitas Teratas</span>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginTop: "0.4rem", color: "var(--a-text)" }} title={bestProduct}>
            {bestProduct}
          </h3>
          <small style={{ fontSize: "0.7rem", color: "var(--a-soft)" }}>{bestProductQty}</small>
        </div>
      </div>

      {/* Histogram Chart Section */}
      <div className="admin-panel" style={{ display: "grid", gap: "1.25rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 style={{ fontSize: "1.25rem" }}>Histogram Laporan {period.charAt(0).toUpperCase() + period.slice(1)}</h2>
            <p style={{ fontSize: "0.8rem", color: "var(--a-soft)" }}>Perbandingan uang masuk & uang keluar secara visual</p>
          </div>
          <div style={{ display: "flex", gap: "1rem", fontSize: "0.8rem" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}><span style={{ width: "10px", height: "10px", background: "#16a34a", borderRadius: "2px" }} /> Uang Masuk</span>
            <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}><span style={{ width: "10px", height: "10px", background: "#dc2626", borderRadius: "2px" }} /> Uang Keluar</span>
          </div>
        </div>

        {sortedKeys.length === 0 ? (
          <p className="admin-lead">Tidak ada transaksi untuk ditampilkan pada histogram.</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.max(sortedKeys.length, 1)}, minmax(80px, 1fr))`, gap: "1rem", alignItems: "end", height: "220px", padding: "1rem 0", borderBottom: "2px solid var(--a-line)", overflowX: "auto" }}>
            {sortedKeys.map((k) => {
              const item = chartDataMap[k];
              const hMasuk = Math.round((item.masuk / maxVal) * 160);
              const hKeluar = Math.round((item.keluar / maxVal) * 160);
              return (
                <div key={k} style={{ display: "flex", flexDirection: "column", alignItems: "center", height: "100%", justifyContent: "flex-end", gap: "0.5rem" }}>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: "6px", height: "170px" }}>
                    <div
                      title={`Masuk: Rp${item.masuk.toLocaleString("id-ID")}`}
                      style={{ width: "22px", height: `${Math.max(hMasuk, 4)}px`, background: "#16a34a", borderRadius: "4px 4px 0 0" }}
                    />
                    <div
                      title={`Keluar: Rp${item.keluar.toLocaleString("id-ID")}`}
                      style={{ width: "22px", height: `${Math.max(hKeluar, 4)}px`, background: "#dc2626", borderRadius: "4px 4px 0 0" }}
                    />
                  </div>
                  <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--a-text)", whiteSpace: "nowrap" }}>{k}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Rincian Tabel Kategori & Material */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "1.5rem" }}>
        
        <div className="admin-panel" style={{ display: "grid", gap: "1rem" }}>
          <h2 style={{ fontSize: "1.1rem" }}>Rekap Kategori Transaksi</h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--a-line)", textAlign: "left", color: "var(--a-soft)" }}>
                  <th style={{ padding: "0.6rem" }}>Kategori</th>
                  <th style={{ padding: "0.6rem" }}>Uang Masuk</th>
                  <th style={{ padding: "0.6rem" }}>Uang Keluar</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(categorySummary).map(([cat, val]) => (
                  <tr key={cat} style={{ borderBottom: "1px solid var(--a-line)" }}>
                    <td style={{ padding: "0.6rem", fontWeight: 500 }}>{cat}</td>
                    <td style={{ padding: "0.6rem", color: "#16a34a", fontWeight: 600 }}>Rp{val.masuk.toLocaleString("id-ID")}</td>
                    <td style={{ padding: "0.6rem", color: "#dc2626", fontWeight: 600 }}>Rp{val.keluar.toLocaleString("id-ID")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="admin-panel" style={{ display: "grid", gap: "1rem" }}>
          <h2 style={{ fontSize: "1.1rem" }}>Peringkat Material & Barang Sering Keluar</h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--a-line)", textAlign: "left", color: "var(--a-soft)" }}>
                  <th style={{ padding: "0.6rem" }}>Deskripsi</th>
                  <th style={{ padding: "0.6rem" }}>Frekuensi</th>
                  <th style={{ padding: "0.6rem", textAlign: "right" }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {sortedFrequent.map(([desc, stat], idx) => (
                  <tr key={idx} style={{ borderBottom: "1px solid var(--a-line)" }}>
                    <td style={{ padding: "0.6rem", fontWeight: 500 }}>#{idx + 1} {desc}</td>
                    <td style={{ padding: "0.6rem" }}>{stat.count}x</td>
                    <td style={{ padding: "0.6rem", textAlign: "right", fontWeight: 600 }}>Rp{stat.total.toLocaleString("id-ID")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
