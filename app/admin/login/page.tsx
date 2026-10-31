import Link from "next/link";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/admin/LoginForm";
import { Wordmark } from "@/components/ui/Wordmark";
import { isAdmin, usesDefaultPassword } from "@/lib/cms/auth";

export const metadata = {
  title: "Masuk",
};

export default async function LoginPage() {
  if (await isAdmin()) {
    redirect("/admin/katalog");
  }

  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <div className="admin-login__brand">
          <Wordmark />
          <span className="admin-brand__badge">CMS</span>
        </div>

        <div className="admin-login__intro">
          <p className="admin-eyebrow">Panel admin</p>
          <h1 className="admin-login__title">Masuk untuk mengelola katalog.</h1>
          <p className="admin-lead">
            Tambah barang, unggah foto, dan atur urutannya. Perubahan langsung
            tampil di halaman publik setelah disimpan.
          </p>
        </div>

        <LoginForm showDefaultHint={usesDefaultPassword()} />

        <Link href="/" className="admin-login__back">
          Kembali ke situs
        </Link>
      </div>
    </div>
  );
}
