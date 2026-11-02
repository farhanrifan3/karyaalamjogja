import Link from "next/link";
import { logoutAction } from "@/app/admin/actions";
import { Wordmark } from "@/components/ui/Wordmark";
import { requireAdmin } from "@/lib/cms/auth";

export default async function PanelLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await requireAdmin();

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar" aria-label="Navigasi Samping Admin">
        <div className="admin-sidebar__top">
          <Link href="/admin/katalog" className="admin-brand">
            <Wordmark />
            <span className="admin-brand__badge">CMS</span>
          </Link>
        </div>

        <nav className="admin-sidebar__nav" aria-label="Menu Admin">
          <div className="admin-sidebar__group">
            <span className="admin-sidebar__label">Utama</span>
            <Link href="/admin/katalog" className="admin-sidebar__link">
              Dashboard & Katalog
            </Link>
          </div>

          <div className="admin-sidebar__group">
            <span className="admin-sidebar__label">Konten Publik</span>
            <Link href="/admin/hero" className="admin-sidebar__link">
              Hero & Promo
            </Link>
            <Link href="/admin/profil" className="admin-sidebar__link">
              Profil Karya Alam
            </Link>
            <Link href="/admin/katalog" className="admin-sidebar__link">
              Katalog Batu Alam
            </Link>
            <Link href="/admin/services" className="admin-sidebar__link">
              Layanan & Maintenance
            </Link>
            <Link href="/admin/testimoni" className="admin-sidebar__link">
              Testimoni & Moderasi
            </Link>
            <Link href="/admin/harga" className="admin-sidebar__link">
              Harga & Master RAB
            </Link>
          </div>

          <div className="admin-sidebar__group">
            <span className="admin-sidebar__label">Sistem & Aset</span>
            <Link href="/admin/media" className="admin-sidebar__link">
              Media Library
            </Link>
            <Link href="/admin/finance" className="admin-sidebar__link">
              Kasir & Keuangan
            </Link>
            <Link href="/admin/laporan" className="admin-sidebar__link">
              Laporan Analitik
            </Link>
            <Link href="/admin/settings" className="admin-sidebar__link">
              Pengaturan & Brand
            </Link>
            <Link href="/admin/audit" className="admin-sidebar__link">
              Audit Log
            </Link>
          </div>
        </nav>

        <div className="admin-sidebar__foot">
          <Link href="/" target="_blank" rel="noopener noreferrer" className="admin-sidebar__site">
            Lihat Situs Publik →
          </Link>
          <form action={logoutAction}>
            <button type="submit" className="admin-sidebar__out">
              Keluar Sesi
            </button>
          </form>
        </div>
      </aside>

      <div className="admin-content-area">
        <header className="admin-topbar">
          <div className="admin-topbar__inner">
            <span className="admin-topbar__role">Admin Owner (Akses Penuh)</span>
            <div className="admin-topbar__actions">
              <Link href="/" target="_blank" rel="noopener noreferrer" className="admin-btn admin-btn--small">
                Buka Situs
              </Link>
            </div>
          </div>
        </header>

        <main className="admin-main">{children}</main>
      </div>
    </div>
  );
}
