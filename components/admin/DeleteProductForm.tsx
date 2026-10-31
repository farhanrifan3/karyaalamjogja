"use client";

import { deleteProductAction } from "@/app/admin/actions";

type DeleteProductFormProps = {
  id: string;
  name: string;
};

export function DeleteProductForm({ id, name }: DeleteProductFormProps) {
  return (
    <form
      action={deleteProductAction}
      onSubmit={(event) => {
        const confirmed = window.confirm(
          `Hapus "${name}" dari katalog?\n\nFotonya tetap disimpan dan masih bisa dipakai lagi.`,
        );

        if (!confirmed) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="admin-btn admin-btn--danger admin-btn--small"
        aria-label={`Hapus ${name}`}
      >
        Hapus
      </button>
    </form>
  );
}
