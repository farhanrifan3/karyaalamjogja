import fs from "fs/promises";
import path from "path";

const SERVICES_PATH = path.join(process.cwd(), "content/services.json");

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  image: string;
  checklist: string[];
  urutan: number;
  aktif: boolean;
}

export interface MaintenancePackage {
  id: string;
  frequency: string;
  title: string;
  description: string;
  tasks: string[];
  aktif: boolean;
}

export interface ServicesContent {
  version: number;
  updatedAt: string;
  services: ServiceItem[];
  maintenancePackages: MaintenancePackage[];
}

export async function getServicesContent(): Promise<ServicesContent> {
  try {
    const raw = await fs.readFile(SERVICES_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return {
      version: 1,
      updatedAt: new Date().toISOString(),
      services: [],
      maintenancePackages: [],
    };
  }
}

export async function saveServicesContent(data: ServicesContent): Promise<void> {
  data.updatedAt = new Date().toISOString();
  await fs.writeFile(SERVICES_PATH, JSON.stringify(data, null, 2), "utf-8");
}
