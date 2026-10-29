import { site } from "@/lib/site";

export function whatsappLink(message: string = site.consultationMessage): string {
  return `https://wa.me/${site.phone.whatsapp}?text=${encodeURIComponent(message)}`;
}
