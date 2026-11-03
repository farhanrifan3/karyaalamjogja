"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AdminSidebarNav() {
  const pathname = usePathname();

  function isActive(path: string) {
    if (path === "/admin/katalog" && pathname.startsWith("/admin/katalog")) return true;
    if (path === "/admin/services" && pathname.startsWith("/admin/services")) return true;
    if (path === "/admin/hero" && pathname.startsWith("/admin/hero")) return true;
    return pathname === path;
  }

  return (
    <nav className="admin-sidebar__nav" aria-label="Menu Admin">
      <div className="admin-sidebar__group">
        <span className="admin-sidebar__label">Utama</span>
        <Link href="/admin/katalog" className={`admin-sidebar__link ${isActive("/admin/katalog") ? "active" : ""}`}>
          Dashboard & Katalog
        </Link>
      </div>

      <div className="admin-sidebar__group">
        <span className="admin-sidebar__label">Konten Publik</span>
        <Link href="/admin/hero" className={`admin-sidebar__link ${isActive("/admin/hero") ? "active" : ""}`}>
          Hero & Promo
        </Link>
        <Link href="/admin/profil" className={`admin-sidebar__link ${isActive("/admin/profil") ? "active" : ""}`}>
          Profil Karya Alam
        </Link>
        <Link href="/admin/katalog" className={`admin-sidebar__link ${isActive("/admin/katalog") ? "active" : ""}`}>
          Katalog Batu Alam
        </Link>
        <Link href="/admin/services" className={`admin-sidebar__link ${isActive("/admin/services") ? "active" : ""}`}>
          Layanan & Maintenance
        </Link>
        <Link href="/admin/testimoni" className={`admin-sidebar__link ${isActive("/admin/testimoni") ? "active" : ""}`}>
          Testimoni & Moderasi
        </Link>
        <Link href="/admin/harga" className={`admin-sidebar__link ${isActive("/admin/harga") ? "active" : ""}`}>
          Harga & Master RAB
        </Link>
      </div>

      <div className="admin-sidebar__group">
        <span className="admin-sidebar__label">Sistem & Aset</span>
        <Link href="/admin/media" className={`admin-sidebar__link ${isActive("/admin/media") ? "active" : ""}`}>
          Media Library
        </Link>
        <Link href="/admin/finance" className={`admin-sidebar__link ${isActive("/admin/finance") ? "active" : ""}`}>
          Kasir & Keuangan
        </Link>
        <Link href="/admin/laporan" className={`admin-sidebar__link ${isActive("/admin/laporan") ? "active" : ""}`}>
          Laporan Analitik
        </Link>
        <Link href="/admin/settings" className={`admin-sidebar__link ${isActive("/admin/settings") ? "active" : ""}`}>
          Pengaturan & Brand
        </Link>
        <Link href="/admin/audit" className={`admin-sidebar__link ${isActive("/admin/audit") ? "active" : ""}`}>
          Audit Log
        </Link>
      </div>
    </nav>
  );
}
