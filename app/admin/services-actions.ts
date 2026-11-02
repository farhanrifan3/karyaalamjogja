"use server";

import { revalidatePath } from "next/cache";
import { getServicesContent, saveServicesContent } from "@/lib/cms/services";
import { commitContent } from "@/lib/cms/git";

export async function saveServiceAction(formData: FormData) {
  const data = await getServicesContent();
  const id = formData.get("id") as string;
  const originalId = (formData.get("originalId") as string) || id;
  
  const checklistStr = formData.get("checklist") as string;
  const checklist = checklistStr ? checklistStr.split("\n").map(s => s.trim()).filter(Boolean) : [];

  const updatedService = {
    id,
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    image: formData.get("image") as string,
    checklist,
    urutan: parseInt((formData.get("urutan") as string) || "1", 10),
    aktif: true,
  };

  const idx = data.services.findIndex(s => s.id === originalId);
  if (idx >= 0) {
    data.services[idx] = updatedService;
  } else {
    data.services.push(updatedService);
  }

  await saveServicesContent(data);
  await commitContent(["content/services.json"], `Save service: ${updatedService.name}`);
  revalidatePath("/");
  revalidatePath("/admin/services");
}

export async function deleteServiceAction(formData: FormData) {
  const id = formData.get("id") as string;
  const data = await getServicesContent();
  data.services = data.services.filter(s => s.id !== id);
  await saveServicesContent(data);
  await commitContent(["content/services.json"], `Delete service: ${id}`);
  revalidatePath("/");
  revalidatePath("/admin/services");
}
