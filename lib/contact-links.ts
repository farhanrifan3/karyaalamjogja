import { site } from "@/lib/site";
import { whatsappLink } from "@/lib/whatsapp";
import type { ContactLink } from "@/lib/types";

export const contactLinks: readonly ContactLink[] = [
  {
    icon: "WA",
    label: site.phone.display,
    sublabel: `${site.owner} · WhatsApp`,
    href: whatsappLink(),
  },
  {
    icon: "📍",
    label: "Google Maps",
    sublabel: "Petunjuk arah ke pangkalan",
    href: site.mapsUrl,
  },
  {
    icon: "IG",
    label: "@karyaalam_yogyakarta",
    sublabel: "Instagram",
    href: site.socials.instagram,
  },
  {
    icon: "f",
    label: "Karya Alam",
    sublabel: "Facebook",
    href: site.socials.facebook,
  },
];
