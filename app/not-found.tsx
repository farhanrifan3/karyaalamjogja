import { Cta } from "@/components/ui/Cta";

export default function NotFound() {
  return (
    <main className="not-found ground--dark">
      <p className="sc-label">404 · Di luar peta</p>
      <h1 className="sc-display">Halaman ini belum dibangun.</h1>
      <p>
        Alamat yang Anda buka tidak ada di pangkalan kami. Kembali ke beranda
        untuk melihat pekerjaan, batu, dan cara kami bekerja.
      </p>
      <Cta href="/">Kembali ke beranda</Cta>
    </main>
  );
}
