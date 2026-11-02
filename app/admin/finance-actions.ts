"use server";

import { revalidatePath } from "next/cache";
import { addTransaction, deleteTransaction } from "@/lib/cms/finance";

export async function addTransactionAction(formData: FormData) {
  const date = formData.get("date") as string;
  const type = formData.get("type") as "masuk" | "keluar";
  const category = formData.get("category") as string;
  const description = formData.get("description") as string;
  const amount = parseFloat(formData.get("amount") as string) || 0;
  const paymentMethod = (formData.get("paymentMethod") as any) || "Tunai";
  const customer = formData.get("customer") as string;
  const project = formData.get("project") as string;

  if (!date || !description || amount <= 0) return;

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

  revalidatePath("/admin/finance");
}

export async function deleteTransactionAction(formData: FormData) {
  const id = formData.get("id") as string;
  if (id) {
    await deleteTransaction(id);
    revalidatePath("/admin/finance");
  }
}
