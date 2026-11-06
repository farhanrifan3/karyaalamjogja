"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";

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

  await supabase.from("reviews").insert(newReview);

  revalidatePath("/");
  revalidatePath("/admin/testimoni");
}

export async function setReviewStatusAction(formData: FormData): Promise<void> {
  const id = formData.get("id") as string;
  const status = formData.get("status") as "approved" | "rejected";

  if (!id || !status) return;

  await supabase.from("reviews").update({ status }).eq("id", id);

  revalidatePath("/");
  revalidatePath("/admin/testimoni");
}

export async function deleteReviewAction(formData: FormData): Promise<void> {
  const id = formData.get("id") as string;
  if (!id) return;

  await supabase.from("reviews").delete().eq("id", id);

  revalidatePath("/");
  revalidatePath("/admin/testimoni");
}
