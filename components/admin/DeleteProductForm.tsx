"use client";

import { deleteProductAction } from "@/app/admin/actions";
import { AdminSubmitButton } from "@/components/admin/AdminSubmitButton";

type DeleteProductFormProps = {
  id: string;
  name: string;
};

export function DeleteProductForm({ id, name }: DeleteProductFormProps) {
  return (
    <form
      action={deleteProductAction}
      data-confirm-title="Hapus barang dari katalog?"
      data-confirm-message={`“${name}” akan dihapus dari situs. Fotonya tetap tersimpan dan masih bisa dipakai lagi.`}
      data-confirm-label="Hapus barang"
      data-confirm-tone="danger"
    >
      <input type="hidden" name="id" value={id} />
      <AdminSubmitButton
        className="admin-btn admin-btn--danger admin-btn--small"
        aria-label={`Hapus ${name}`}
        pendingLabel="Menghapus…"
      >
        Hapus
      </AdminSubmitButton>
    </form>
  );
}
