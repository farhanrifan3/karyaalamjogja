import { supabase } from "@/lib/supabase";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export type ReviewItem = {
  id: string;
  name: string;
  text: string;
  date: string;
  source: "website" | "google";
  status: "pending" | "approved" | "rejected";
  rating: number;
};

type StoreFile = {
  version: number;
  updatedAt: string;
  items: ReviewItem[];
};

function mapReview(row: Record<string, unknown>): ReviewItem {
  return {
    id: String(row.id ?? ""),
    name: String(row.name ?? ""),
    text: String(row.text ?? ""),
    date: String(row.date ?? ""),
    source: row.source === "google" ? "google" : "website",
    status:
      row.status === "approved" || row.status === "rejected"
        ? row.status
        : "pending",
    rating: Number(row.rating ?? 5),
  };
}

export async function getReviewsStore(): Promise<StoreFile> {
  const { data, error } = await getSupabaseAdmin()
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Gagal membaca ulasan dari Supabase: ${error.message}`);
  }

  return {
    version: 1,
    updatedAt: new Date().toISOString(),
    items: (data ?? []).map(mapReview),
  };
}

export async function saveReviewsStore(store: StoreFile): Promise<void> {
  if (store.items.length === 0) {
    return;
  }

  const { error } = await getSupabaseAdmin()
    .from("reviews")
    .upsert(store.items, { onConflict: "id" });

  if (error) {
    throw new Error(`Gagal menyimpan ulasan ke Supabase: ${error.message}`);
  }
}

export async function getAllReviews(): Promise<ReviewItem[]> {
  return (await getReviewsStore()).items;
}

export async function getApprovedReviews(): Promise<ReviewItem[]> {
  return (await getAllReviews()).filter((item) => item.status === "approved");
}

export async function addReview(draft: { name: string; text: string; rating?: number }): Promise<ReviewItem> {
  const review = {
    id: `rev-${Date.now()}`,
    name: draft.name,
    text: draft.text,
    date: new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    source: "website",
    status: "pending",
    rating: draft.rating || 5,
  };

  const { data, error } = await supabase
    .from("reviews")
    .insert(review)
    .select("*")
    .single();

  if (error) {
    throw new Error(`Gagal mengirim ulasan: ${error.message}`);
  }

  return mapReview(data);
}

export async function updateReviewStatus(
  id: string,
  status: "approved" | "rejected",
): Promise<void> {
  const { error } = await getSupabaseAdmin()
    .from("reviews")
    .update({ status })
    .eq("id", id);

  if (error) {
    throw new Error(`Gagal memperbarui ulasan: ${error.message}`);
  }
}

export async function deleteReviewItem(id: string): Promise<void> {
  const { error } = await getSupabaseAdmin().from("reviews").delete().eq("id", id);

  if (error) {
    throw new Error(`Gagal menghapus ulasan: ${error.message}`);
  }
}
