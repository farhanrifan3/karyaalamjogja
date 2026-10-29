import { services } from "@/lib/services";
import { site } from "@/lib/site";

export function buildLocalBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${site.url}/#business`,
    name: site.name,
    description: site.description,
    url: site.url,
    telephone: site.phone.e164,
    image: `${site.url}/images/pangkalan.jpg`,
    foundingDate: String(site.foundedYear),
    founder: {
      "@type": "Person",
      name: site.owner,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      addressCountry: "ID",
    },
    areaServed: {
      "@type": "AdministrativeArea",
      name: site.address.region,
    },
    sameAs: [site.socials.instagram, site.socials.facebook],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Layanan Karya Alam",
      itemListElement: services.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.title,
          description: service.description,
        },
      })),
    },
  };
}
