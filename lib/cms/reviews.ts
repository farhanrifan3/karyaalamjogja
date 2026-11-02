import fs from "fs/promises";
import path from "path";
import { commitContent } from "@/lib/cms/git";

const REVIEWS_PATH = "content/reviews.json";

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

export async function getReviewsStore(): Promise<StoreFile> {
  try {
    const raw = await fs.readFile(path.join(process.cwd(), REVIEWS_PATH), "utf-8");
    return JSON.parse(raw);
  } catch {
    return {
      version: 1,
      updatedAt: new Date().toISOString(),
      items: [],
    };
  }
}

export async function saveReviewsStore(store: StoreFile): Promise<void> {
  store.updatedAt = new Date().toISOString();
  await fs.writeFile(path.join(process.cwd(), REVIEWS_PATH), JSON.stringify(store, null, 2), "utf-8");
}

export async function getAllReviews(): Promise<ReviewItem[]> {
  const store = await getReviewsStore();
  return store.items;
}

export async function getApprovedReviews(): Promise<ReviewItem[]> {
  const store = await getReviewsStore();
  return store.items.filter((item) => item.status === "approved");
}

export async function addReview(draft: { name: string; text: string; rating?: number }): Promise<ReviewItem> {
  const store = await getReviewsStore();
  const newItem: ReviewItem = {
    id: `rev-${Date.now()}`,
    name: draft.name,
    text: draft.text,
    date: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
    source: "website",
    status: "pending", // Wajib moderasi admin
    rating: draft.rating || 5,
  };

  store.items.unshift(newItem);
  await saveReviewsStore(store);
  try {
    await commitContent([REVIEWS_PATH], `Add pending review from ${newItem.name}`);
  } catch {}
  return newItem;
}

export async function updateReviewStatus(id: string, status: "approved" | "rejected"): Promise<void> {
  const store = await getReviewsStore();
  const item = store.items.find((r) => r.id === id);
  if (item) {
    item.status = status;
    await saveReviewsStore(store);
    try {
      await commitContent([REVIEWS_PATH], `Update review status ${id} to ${status}`);
    } catch {}
  }
}

export async function deleteReviewItem(id: string): Promise<void> {
  const store = await getReviewsStore();
  store.items = store.items.filter((r) => r.id !== id);
  await saveReviewsStore(store);
  try {
    await commitContent([REVIEWS_PATH], `Delete review ${id}`);
  } catch {}
}
