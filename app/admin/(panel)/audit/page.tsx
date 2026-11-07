import { getAuditLogs, type AuditLog } from "@/lib/cms/audit";

const ACTION_LABELS: Record<string, string> = {
  tambah: "Tambah barang",
  ubah: "Ubah barang",
  hapus: "Hapus barang",
  urutkan: "Ubah urutan",
};

function formatTimestamp(value: string): string {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function AdminAuditPage() {
  let logs: AuditLog[] = [];
  let loadError: string | null = null;

  try {
    logs = await getAuditLogs();
  } catch (error) {
    loadError =
      error instanceof Error ? error.message : "Audit log gagal dibaca.";
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
        {loadError ? (
          <p className="admin-alert" role="alert">
            {loadError}
          </p>
        ) : logs.length === 0 ? (
          <p className="admin-lead">Belum ada catatan audit log tersimpan.</p>
        ) : (
          <div style={{ display: "grid", gap: "0.75rem" }}>
            {logs.map((log) => (
              <div
                key={log.id}
                style={{
                  padding: "0.85rem 1rem",
                  border: "1px solid var(--a-line)",
                  borderRadius: "8px",
                  background: "var(--a-canvas)",
                }}
              >
                <p style={{ fontSize: "0.85rem" }}>
                  <strong>{ACTION_LABELS[log.action] ?? log.action}</strong>
                  {log.product ? `: ${log.product}` : ""}
                </p>
                {log.detail ? (
                  <p style={{ fontSize: "0.8rem", color: "var(--a-soft)" }}>
                    {log.detail}
                  </p>
                ) : null}
                <small style={{ color: "var(--a-soft)" }}>
                  {formatTimestamp(log.at)}
                </small>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
