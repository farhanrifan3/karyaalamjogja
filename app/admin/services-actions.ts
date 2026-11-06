"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";

export async function saveServiceAction(formData: FormData): Promise<void> {
  const id = formData.get("id") as string;
  const originalId = (formData.get("originalId") as string) || id;
  
  const checklistStr = formData.get("checklist") as string;
  const checklist = checklistStr ? checklistStr.split("\n").map(s => s.trim()).filter(Boolean) : [];

  const imagePath = (formData.get("imagePath") as string) || (formData.get("image") as string) || "/images/taman-minimalis.jpg";

  const updatedService = {
    id,
    name: formData.get("name") as string,
    description: (formData.get("description") as string) || "",
    image: imagePath,
    checklist,
    urutan: parseInt((formData.get("urutan") as string) || "1", 10),
    aktif: formData.get("aktif") === "true" || formData.get("aktif") === null,
  };

  const { data: existing } = await supabase.from("services").select("id").eq("id", originalId).single();

  if (existing) {
    await supabase.from("services").update(updatedService).eq("id", originalId);
  } else {
    await supabase.from("services").insert(updatedService);
  }

  revalidatePath("/");
  revalidatePath("/admin/services");
}

export async function deleteServiceAction(formData: FormData): Promise<void> {
  const id = formData.get("id") as string;
  if (!id) return;

  await supabase.from("services").delete().eq("id", id);

  revalidatePath("/");
  revalidatePath("/admin/services");
}
