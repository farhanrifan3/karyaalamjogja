import { ChatbotWidget } from "@/components/ui/ChatbotWidget";
import { CategorySection } from "@/components/site/CategorySection";
import { ContactSection } from "@/components/site/ContactSection";
import { CtaBand } from "@/components/site/CtaBand";
import { Hero } from "@/components/site/Hero";
import { InspirationSection } from "@/components/site/InspirationSection";
import { ProfileSection } from "@/components/site/ProfileSection";
import { PromoSection } from "@/components/site/PromoSection";
import { RevealObserver } from "@/components/site/RevealObserver";
import { ReviewsSection } from "@/components/site/ReviewsSection";
import { ServicesSection } from "@/components/site/ServicesSection";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import type { PromoItem } from "@/lib/cms/hero-promo";
import { getCatalogFromSupabase } from "@/lib/supabase-catalog";
import { getHeroFromSupabase, getPromosFromSupabase, getProfilFromSupabase, getApprovedReviewsFromSupabase, getServicesFromSupabase, type ServiceItem } from "@/lib/supabase-data";
import { buildLocalBusinessJsonLd } from "@/lib/schema";

export const metadata = {
  alternates: {
    canonical: "/",
  },
};

function normalizeImage(value: string): string {
  return value.startsWith("public/") ? value.slice("public".length) : value;
}

function activePromos(promos: PromoItem[]): PromoItem[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return promos
    .filter((promo) => promo.aktif)
    .filter((promo) => {
      const start = promo.mulaiTayang
        ? new Date(`${promo.mulaiTayang}T00:00:00`)
        : null;
      const end = promo.selesaiTayang
        ? new Date(`${promo.selesaiTayang}T23:59:59`)
        : null;

      if (start && !Number.isNaN(start.getTime()) && start > today) {
        return false;
      }
      if (end && !Number.isNaN(end.getTime()) && end < today) {
        return false;
      }
      return true;
    })
    .sort((a, b) => (a.urutan ?? 0) - (b.urutan ?? 0));
}

export default async function HomePage() {
  const [hero, promos, profil, servicesStore, reviews, catalog] =
    await Promise.all([
      getHeroFromSupabase(),
      getPromosFromSupabase(),
      getProfilFromSupabase(),
      getServicesFromSupabase(),
      getApprovedReviewsFromSupabase(),
      getCatalogFromSupabase(),
    ]);

  const services: ServiceItem[] = servicesStore
    .filter((service) => service.aktif)
    .sort((a, b) => a.urutan - b.urutan)
    .map((service) => ({ ...service, image: normalizeImage(service.image) }));

  const jsonLd = buildLocalBusinessJsonLd();

  return (
    <>
      <a className="skip" href="#main">
        Lompat ke konten
      </a>

      <RevealObserver />
      <SiteHeader />

      <main id="main">
        <Hero
          hero={hero}
          serviceCount={services.length}
          categoryCount={catalog.categories.length}
        />
        <PromoSection promos={activePromos(promos)} />
        <CategorySection
          categories={catalog.categories}
          items={catalog.items}
        />
        <ProfileSection profil={profil} />
        <ServicesSection services={services} />
        <InspirationSection />
        <ReviewsSection reviews={reviews} />
        <ContactSection />
        <CtaBand />
      </main>

      <SiteFooter />
      <ChatbotWidget />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
