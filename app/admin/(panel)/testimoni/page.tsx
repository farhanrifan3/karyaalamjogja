import Link from "next/link";
import { getAllReviews } from "@/lib/cms/reviews";
import { setReviewStatusAction, deleteReviewAction } from "@/app/admin/reviews-actions";
import { site } from "@/lib/site";

export default async function AdminTestimoniPage() {
  const reviews = await getAllReviews();
  const approvedCount = reviews.filter((r) => r.status === "approved").length;
  const pendingCount = reviews.filter((r) => r.status === "pending").length;

  return (
    <div className="admin-page">
      <div className="admin-head">
        <div className="admin-head__copy">
          <span className="admin-eyebrow">Modul Konten Publik</span>
          <h1 className="admin-title">Testimoni & Moderasi Ulasan</h1>
          <p className="admin-lead">
            Kelola ulasan pengunjung yang masuk dari website maupun Google Maps. Ulasan website hanya akan tampil di situs publik setelah disetujui.
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
        <div className="admin-card" style={{ padding: "1.25rem" }}>
          <span style={{ fontSize: "0.78rem", color: "var(--a-soft)" }}>Total Ulasan</span>
          <h3 style={{ fontSize: "1.75rem", fontWeight: 600, marginTop: "0.2rem" }}>{reviews.length}</h3>
        </div>
        <div className="admin-card" style={{ padding: "1.25rem" }}>
          <span style={{ fontSize: "0.78rem", color: "var(--a-soft)" }}>Disetujui Publik</span>
          <h3 style={{ fontSize: "1.75rem", fontWeight: 600, marginTop: "0.2rem", color: "var(--a-accent)" }}>{approvedCount}</h3>
        </div>
        <div className="admin-card" style={{ padding: "1.25rem" }}>
          <span style={{ fontSize: "0.78rem", color: "var(--a-soft)" }}>Menunggu Moderasi</span>
          <h3 style={{ fontSize: "1.75rem", fontWeight: 600, marginTop: "0.2rem", color: pendingCount > 0 ? "#d97706" : "inherit" }}>{pendingCount}</h3>
        </div>
      </div>

      <div className="admin-panel" style={{ display: "grid", gap: "1.25rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <h2 style={{ fontSize: "1.25rem" }}>Daftar Seluruh Ulasan ({reviews.length})</h2>
          <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="admin-btn admin-btn--small">
            Buka Halaman Google Maps ↗
          </a>
        </div>

        <div className="admin-grid">
          {reviews.map((r) => (
            <div key={r.id} className="admin-card" style={{ padding: "1.25rem", display: "grid", gap: "0.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.72rem", padding: "0.2rem 0.5rem", borderRadius: "12px", background: r.source === "google" ? "rgba(66, 133, 244, 0.1)" : "rgba(47, 91, 56, 0.1)", color: r.source === "google" ? "#1a73e8" : "var(--a-accent)", fontWeight: 600, textTransform: "uppercase" }}>
                  {r.source === "google" ? "Google Maps" : "Website Form"}
                </span>
                <span style={{ fontSize: "0.72rem", padding: "0.2rem 0.5rem", borderRadius: "12px", background: r.status === "approved" ? "rgba(34, 197, 94, 0.1)" : r.status === "pending" ? "rgba(234, 179, 8, 0.1)" : "rgba(239, 68, 68, 0.1)", color: r.status === "approved" ? "#16a34a" : r.status === "pending" ? "#ca8a04" : "#dc2626", fontWeight: 600 }}>
                  {r.status === "approved" ? "Disetujui" : r.status === "pending" ? "Menunggu" : "Ditolak"}
                </span>
              </div>

              <div>
                <h3 className="admin-card__name" style={{ fontSize: "1rem" }}>{r.name}</h3>
                <small style={{ color: "var(--a-soft)" }}>{r.date} • {r.rating}★</small>
              </div>

              <p className="admin-card__text" style={{ fontSize: "0.9rem" }}>&quot;{r.text}&quot;</p>

              <div style={{ display: "flex", gap: "0.5rem", marginTop: "auto", paddingTop: "0.75rem", borderTop: "1px solid var(--a-line)", flexWrap: "wrap" }}>
                {r.status !== "approved" && (
                  <form action={setReviewStatusAction} className="admin-inline">
                    <input type="hidden" name="id" value={r.id} />
                    <input type="hidden" name="status" value="approved" />
                    <button type="submit" className="admin-btn admin-btn--small" style={{ background: "var(--a-accent)", color: "#fff" }}>Setujui</button>
                  </form>
                )}
                {r.status !== "rejected" && (
                  <form action={setReviewStatusAction} className="admin-inline">
                    <input type="hidden" name="id" value={r.id} />
                    <input type="hidden" name="status" value="rejected" />
                    <button type="submit" className="admin-btn admin-btn--small">Tolak</button>
                  </form>
                )}
                <form action={deleteReviewAction} className="admin-inline">
                  <input type="hidden" name="id" value={r.id} />
                  <button type="submit" className="admin-btn admin-btn--small admin-btn--danger">Hapus</button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
