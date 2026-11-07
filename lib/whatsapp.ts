import { site } from "@/lib/site";

export function whatsappLink(
  message: string = site.consultationMessage,
  phone: string = site.phone.whatsapp,
): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
