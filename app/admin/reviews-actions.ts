"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/cms/auth";
import { redirectWithAdminFeedback } from "@/lib/cms/admin-feedback";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function submitReviewAction(formData: FormData): Promise<void> {
  const name = formData.get("name") as string;
  const text = formData.get("text") as string;
  const rating = parseInt((formData.get("rating") as string) || "5", 10);

  if (!name || !text) return;

  const newReview = {
    id: `rev-${Date.now()}`,
    name,
    text,
    rating,
    date: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
    source: "website",
    status: "pending",
  };

  const { error } = await supabase.from("reviews").insert(newReview);

  if (error) {
    throw new Error(`Gagal mengirim ulasan: ${error.message}`);
  }

  revalidatePath("/");
  revalidatePath("/admin/testimoni");
}

export async function setReviewStatusAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = formData.get("id") as string;
  const status = formData.get("status") as "approved" | "rejected";

  if (!id || (status !== "approved" && status !== "rejected")) {
    redirectWithAdminFeedback("/admin/testimoni", "review-action-failed");
  }

  const { error } = await getSupabaseAdmin()
    .from("reviews")
    .update({ status })
    .eq("id", id);

  if (error) {
    console.error("[cms] gagal memperbarui status ulasan:", error);
    redirectWithAdminFeedback("/admin/testimoni", "review-action-failed");
  }

  revalidatePath("/");
  revalidatePath("/admin/testimoni");
  redirectWithAdminFeedback(
    "/admin/testimoni",
    status === "approved" ? "review-approved" : "review-rejected",
  );
}

export async function deleteReviewAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = formData.get("id") as string;
  if (!id) {
    redirectWithAdminFeedback("/admin/testimoni", "review-action-failed");
  }

  const { error } = await getSupabaseAdmin().from("reviews").delete().eq("id", id);

  if (error) {
    console.error("[cms] gagal menghapus ulasan:", error);
    redirectWithAdminFeedback("/admin/testimoni", "review-action-failed");
  }

  revalidatePath("/");
  revalidatePath("/admin/testimoni");
  redirectWithAdminFeedback("/admin/testimoni", "review-deleted");
}
