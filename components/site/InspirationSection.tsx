import Image from "next/image";

import { getGalleryFromSupabase } from "@/lib/gallery";
import type { GalleryItem } from "@/lib/types";
import { InspirationClient } from "./InspirationClient";

export async function InspirationSection() {
  const gallery = await getGalleryFromSupabase();
  return <InspirationClient gallery={gallery} />;
}
