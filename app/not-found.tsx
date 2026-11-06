import Link from "next/link";

export default function NotFound() {
  return (
    <main className="section">
      <div className="wrap">
        <div className="card" style={{ maxWidth: "620px" }}>
          <p className="eyebrow">404 · Di luar peta</p>
          <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", margin: "0.5rem 0" }}>
            Halaman ini belum dibangun.
          </h1>
          <p style={{ color: "var(--muted)", marginBottom: "1.25rem" }}>
            Alamat yang Anda buka tidak ada di pangkalan kami. Kembali ke
            beranda untuk melihat pekerjaan, batu, dan cara kami bekerja.
          </p>
          <Link className="btn btn--dark" href="/">
            Kembali ke beranda
          </Link>
        </div>
      </div>
    </main>
  );
}
