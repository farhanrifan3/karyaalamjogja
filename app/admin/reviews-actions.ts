"use server";

import { revalidatePath } from "next/cache";
import { addReview, updateReviewStatus, deleteReviewItem } from "@/lib/cms/reviews";

export async function submitReviewAction(formData: FormData) {
  const name = formData.get("name") as string;
  const text = formData.get("text") as string;
  const rating = parseInt((formData.get("rating") as string) || "5", 10);

  if (!name || !text) return;

  await addReview({ name, text, rating });
  revalidatePath("/");
  revalidatePath("/admin/testimoni");
}

export async function setReviewStatusAction(formData: FormData) {
  const id = formData.get("id") as string;
  const status = formData.get("status") as "approved" | "rejected";

  if (id && status) {
    await updateReviewStatus(id, status);
    revalidatePath("/");
    revalidatePath("/admin/testimoni");
  }
}

export async function deleteReviewAction(formData: FormData) {
  const id = formData.get("id") as string;
  if (id) {
    await deleteReviewItem(id);
    revalidatePath("/");
    revalidatePath("/admin/testimoni");
  }
}
