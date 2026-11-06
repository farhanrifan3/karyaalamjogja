"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const groups = [
  {
    label: "Kasir & Keuangan",
    links: [
      { href: "/admin/finance", label: "Catat Transaksi & Saldo" },
      { href: "/admin/laporan", label: "Laporan Keuangan" },
    ],
  },
  {
    label: "Konten Publik",
    links: [
      { href: "/admin/hero", label: "Promo & Banner" },
      { href: "/admin/profil", label: "Profil Karya Alam" },
      { href: "/admin/katalog", label: "Katalog Batu Alam" },
      { href: "/admin/services", label: "Layanan & Maintenance" },
      { href: "/admin/testimoni", label: "Testimoni & Moderasi" },
      { href: "/admin/harga", label: "Harga & Master RAB" },
    ],
  },
  {
    label: "Sistem & Aset",
    links: [
      { href: "/admin/media", label: "Media Library" },
      { href: "/admin/settings", label: "Pengaturan & Brand" },
      { href: "/admin/audit", label: "Audit Log" },
    ],
  },
];

export function AdminSidebarNav() {
  const pathname = usePathname();

  function isActive(path: string) {
    return pathname === path || pathname.startsWith(`${path}/`);
  }

  return (
    <nav className="admin-sidebar__nav" aria-label="Menu Admin">
      {groups.map((group) => (
        <div className="admin-sidebar__group" key={group.label}>
          <span className="admin-sidebar__label">{group.label}</span>
          {group.links.map((link) => (
            <Link
              href={link.href}
              key={link.href}
              className={`admin-sidebar__link${isActive(link.href) ? " active" : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      ))}
    </nav>
  );
}
