import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { Catalog } from "@/components/sections/Catalog";
import { Contact } from "@/components/sections/Contact";
import { Gallery } from "@/components/sections/Gallery";
import { Hero } from "@/components/sections/Hero";
import { Process } from "@/components/sections/Process";
import { Services } from "@/components/sections/Services";
import { Stats } from "@/components/sections/Stats";
import { StoneGuide } from "@/components/sections/StoneGuide";
import { buildLocalBusinessJsonLd } from "@/lib/schema";

export default function HomePage() {
  const jsonLd = buildLocalBusinessJsonLd();

  return (
    <>
      <noscript>
        <style>{`.rv{opacity:1;transform:none}`}</style>
      </noscript>

      <ScrollReveal />
      <Navbar />

      <main>
        <Hero />
        <Stats />
        <Services />
        <Catalog />
        <StoneGuide />
        <Gallery />
        <Process />
        <Contact />
      </main>

      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
