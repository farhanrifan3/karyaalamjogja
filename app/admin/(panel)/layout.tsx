import Link from "next/link";

import { logoutAction } from "@/app/admin/actions";
import { Wordmark } from "@/components/ui/Wordmark";
import { requireAdmin } from "@/lib/cms/auth";

export default async function PanelLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await requireAdmin();

  return (
    <>
      <header className="admin-top">
        <div className="admin-top__inner">
          <Link href="/admin/katalog" className="admin-brand">
            <Wordmark />
            <span className="admin-brand__badge">CMS</span>
          </Link>

          <nav className="admin-nav" aria-label="Panel admin">
            <Link href="/admin/katalog">Katalog</Link>
            <Link href="/" target="_blank" rel="noopener noreferrer">
              Lihat situs
            </Link>
            <form action={logoutAction}>
              <button type="submit" className="admin-nav__out">
                Keluar
              </button>
            </form>
          </nav>
        </div>
      </header>

      <main className="admin-main">{children}</main>
    </>
  );
}
