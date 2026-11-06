import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { getStorage } from "@/lib/cms/storage";

export type ServiceItem = {
  id: string;
  name: string;
  description: string;
  image: string;
  checklist: string[];
  urutan: number;
  aktif: boolean;
};

type ServicesStore = {
  version: number;
  updatedAt: string;
  services: ServiceItem[];
};

export async function getServicesContent(): Promise<ServicesStore> {
  const { data, error } = await getSupabaseAdmin()
    .from("services")
    .select("*")
    .order("urutan", { ascending: true });

  if (error) {
    throw new Error(`Gagal membaca layanan dari Supabase: ${error.message}`);
  }

  const services = (data ?? []).map((service) => ({
    id: service.id,
    name: service.name ?? "",
    description: service.description ?? "",
    image: service.image?.startsWith("public/")
      ? service.image.slice("public".length)
      : service.image ?? "/images/taman-minimalis.jpg",
    checklist: Array.isArray(service.checklist) ? service.checklist : [],
    urutan: service.urutan ?? 0,
    aktif: service.aktif !== false,
  }));

  return {
    version: 1,
    updatedAt: new Date().toISOString(),
    services,
  };
}

export async function saveServicesContent(store: ServicesStore): Promise<void> {
  const services = store.services.map((service) => ({
    id: service.id,
    name: service.name,
    description: service.description,
    image: service.image,
    checklist: service.checklist,
    urutan: service.urutan,
    aktif: service.aktif,
  }));

  if (services.length === 0) {
    return;
  }

  const { error } = await getSupabaseAdmin()
    .from("services")
    .upsert(services, { onConflict: "id" });

  if (error) {
    throw new Error(`Gagal menyimpan layanan ke Supabase: ${error.message}`);
  }
}

export async function handleServiceImageUpload(formData: FormData): Promise<string | null> {
  const file = formData.get("imageFile") as File;
  if (!file || typeof file.arrayBuffer !== "function" || file.size === 0) {
    return null;
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const storage = getStorage();
  const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
  const filePath = `public/uploads/${filename}`;
  const publicPath = `/uploads/${filename}`;

  await storage.commit(
    [{ path: filePath, data: buffer }],
    `Upload service image: ${filename}`,
  );

  return publicPath;
}
