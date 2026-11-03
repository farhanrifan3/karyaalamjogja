import Link from "next/link";
import { logoutAction } from "@/app/admin/actions";
import { Wordmark } from "@/components/ui/Wordmark";
import { requireAdmin } from "@/lib/cms/auth";
import { AdminSidebarNav } from "./AdminSidebarNav";

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

        <AdminSidebarNav />

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
