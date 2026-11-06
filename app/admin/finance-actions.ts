"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/cms/auth";
import { redirectWithAdminFeedback } from "@/lib/cms/admin-feedback";
import { addTransaction, deleteTransaction } from "@/lib/cms/finance";

export async function addTransactionAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const date = formData.get("date") as string;
  const type = formData.get("type") as "masuk" | "keluar";
  const category = formData.get("category") as string;
  const description = formData.get("description") as string;
  const amount = parseFloat(formData.get("amount") as string) || 0;
  const paymentMethod = (formData.get("paymentMethod") as any) || "Tunai";
  const customer = formData.get("customer") as string;
  const project = formData.get("project") as string;

  if (!date || !description || amount <= 0) {
    redirectWithAdminFeedback("/admin/finance", "transaction-action-failed");
  }

  let saveFailed = false;
  try {
    await addTransaction({
      date,
      type,
      category,
      description,
      amount,
      paymentMethod,
      customer: customer || undefined,
      project: project || undefined,
    });
  } catch (error) {
    console.error("[admin] gagal mencatat transaksi:", error);
    saveFailed = true;
  }

  if (saveFailed) {
    redirectWithAdminFeedback("/admin/finance", "transaction-action-failed");
  }

  revalidatePath("/admin/finance");
  redirectWithAdminFeedback("/admin/finance", "transaction-added");
}

export async function deleteTransactionAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = formData.get("id") as string;
  if (id) {
    let deleteFailed = false;
    try {
      await deleteTransaction(id);
    } catch (error) {
      console.error("[admin] gagal menghapus transaksi:", error);
      deleteFailed = true;
    }

    if (deleteFailed) {
      redirectWithAdminFeedback("/admin/finance", "transaction-action-failed");
    }

    revalidatePath("/admin/finance");
    redirectWithAdminFeedback("/admin/finance", "transaction-deleted");
  }

  redirectWithAdminFeedback("/admin/finance", "transaction-action-failed");
}
