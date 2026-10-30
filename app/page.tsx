import { Batu } from "@/components/chapters/Batu";
import { Kolam } from "@/components/chapters/Kolam";
import { Layanan } from "@/components/chapters/Layanan";
import { Pangkalan } from "@/components/chapters/Pangkalan";
import { Proses } from "@/components/chapters/Proses";
import { Proyek } from "@/components/chapters/Proyek";
import { Ulasan } from "@/components/chapters/Ulasan";
import { Colophon } from "@/components/layout/Colophon";
import { FolioWall } from "@/components/layout/FolioWall";
import { TitlePage } from "@/components/layout/TitlePage";
import { ScrollCraftMount } from "@/components/motion/ScrollCraftMount";
import { buildLocalBusinessJsonLd } from "@/lib/schema";

export default function HomePage() {
  const jsonLd = buildLocalBusinessJsonLd();

  return (
    <>
      <a className="skip" href="#isi">
        Langsung ke isi
      </a>

      <ScrollCraftMount />
      <FolioWall />
      <TitlePage />

      <main id="isi" tabIndex={-1}>
        <Pangkalan />
        <Layanan />
        <Batu />
        <Kolam />
        <Proyek />
        <Proses />
        <Ulasan />
        <Colophon />
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
