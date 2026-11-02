import fs from "fs/promises";
import path from "path";

export default async function AdminAuditPage() {
  let logs: any[] = [];
  try {
    const raw = await fs.readFile(path.join(process.cwd(), "content/audit-log.json"), "utf-8");
    const json = JSON.parse(raw);
    logs = json.items || json.logs || [];
  } catch {
    logs = [];
  }

  return (
    <div className="admin-page">
      <div className="admin-head">
        <div className="admin-head__copy">
          <span className="admin-eyebrow">Sistem & Aset</span>
          <h1 className="admin-title">Audit Log Perubahan</h1>
          <p className="admin-lead">
            Riwayat aktivitas dan perubahan data yang dilakukan oleh admin di dalam sistem CMS.
          </p>
        </div>
      </div>

      <section className="admin-panel" style={{ display: "grid", gap: "1.25rem" }}>
        <h2 style={{ fontSize: "1.25rem" }}>Riwayat Aktivitas ({logs.length})</h2>
        {logs.length === 0 ? (
          <p className="admin-lead">Belum ada catatan audit log tersimpan.</p>
        ) : (
          <div style={{ display: "grid", gap: "0.75rem" }}>
            {logs.map((log, idx) => (
              <div key={idx} style={{ padding: "0.85rem 1rem", border: "1px solid var(--a-line)", borderRadius: "8px", background: "var(--a-canvas)" }}>
                <p style={{ fontSize: "0.85rem" }}><strong>{log.action || log.message || "Aksi admin"}</strong></p>
                <small style={{ color: "var(--a-soft)" }}>{log.timestamp || log.date || new Date().toISOString()}</small>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
