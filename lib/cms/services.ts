import fs from "fs/promises";
import path from "path";
import { commitContent } from "@/lib/cms/git";
import { getStorage } from "@/lib/cms/storage";

const SERVICES_PATH = "content/services.json";

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
  try {
    const raw = await fs.readFile(path.join(process.cwd(), SERVICES_PATH), "utf-8");
    return JSON.parse(raw);
  } catch {
    return {
      version: 1,
      updatedAt: new Date().toISOString(),
      services: [],
    };
  }
}

export async function saveServicesContent(store: ServicesStore): Promise<void> {
  store.updatedAt = new Date().toISOString();
  await fs.writeFile(path.join(process.cwd(), SERVICES_PATH), JSON.stringify(store, null, 2), "utf-8");
}

export async function handleServiceImageUpload(formData: FormData): Promise<string | null> {
  const file = formData.get("imageFile") as File;
  if (!file || typeof file.arrayBuffer !== "function" || file.size === 0) {
    return null;
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  
  // Save using getStorage commit
  const storage = getStorage();
  const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
  const filePath = `public/uploads/${filename}`;
  const publicPath = `/uploads/${filename}`;

  await storage.commit(
    [
      {
        path: filePath,
        data: buffer,
      },
    ],
    `Upload service image: ${filename}`
  );

  return publicPath;
}
