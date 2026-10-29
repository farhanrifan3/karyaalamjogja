import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found">
      <span className="eyebrow">404</span>
      <h1 className="h2">Halaman tidak ditemukan.</h1>
      <p className="lead">
        Tautan yang Anda buka mungkin sudah dipindahkan atau tidak tersedia.
      </p>
      <Link className="btn btn-main" href="/">
        Kembali ke beranda
      </Link>
    </main>
  );
}
