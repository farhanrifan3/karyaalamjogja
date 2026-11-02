import Link from "next/link";
import { site } from "@/lib/site";
import { whatsappLink } from "@/lib/whatsapp";

export function TopNav() {
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 100, background: "#235A10", color: "#fff", borderBottom: "1px solid rgba(255,255,255,0.15)", padding: "0.85rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
      <Link href="/" style={{ fontSize: "1.15rem", fontWeight: 700, color: "#fff", letterSpacing: "-0.02em", fontFamily: "var(--sc-font-display)" }}>
        Karya Alam
      </Link>

      <nav aria-label="Navigasi Utama" style={{ display: "flex", gap: "1.5rem", alignItems: "center", fontSize: "0.9rem", flexWrap: "wrap" }}>
        <a href="#pangkalan" style={{ color: "#fff", opacity: 0.9 }}>Pangkalan</a>
        <a href="#layanan" style={{ color: "#fff", opacity: 0.9 }}>Layanan</a>
        <a href="#batu" style={{ color: "#fff", opacity: 0.9 }}>Batu Alam</a>
        <a href="#kolam" style={{ color: "#fff", opacity: 0.9 }}>Kolam & Tebing</a>
        <a href="#proyek" style={{ color: "#fff", opacity: 0.9 }}>Proyek</a>
        <a href="#proses" style={{ color: "#fff", opacity: 0.9 }}>Proses</a>
        <a href="#ulasan" style={{ color: "#fff", opacity: 0.9 }}>Ulasan</a>
      </nav>

      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          style={{ padding: "0.5rem 1rem", borderRadius: "999px", background: "#3fbfae", color: "#06211d", fontSize: "0.85rem", fontWeight: 600 }}
        >
          Konsultasi WhatsApp
        </a>
      </div>
    </header>
  );
}
