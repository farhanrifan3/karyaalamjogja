import Image from "next/image";

import { site } from "@/lib/site";
import type { HeroData } from "@/lib/cms/hero-promo";
import { whatsappLink } from "@/lib/whatsapp";
import { ChevronRight, WhatsAppIcon } from "./icons";

type HeroProps = {
  hero: HeroData;
  serviceCount: number;
  categoryCount: number;
};

export function Hero({ hero, serviceCount, categoryCount }: HeroProps) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__media">
        <Image
          src={hero.image}
          alt={hero.alt}
          fill
          priority
          sizes="100vw"
        />
      </div>
      <div className="wrap hero__in">
        <div className="hero__copy">
          <p className="eyebrow">Pangkalan batu alam sejak {site.foundedYear}</p>
          <h1 id="hero-title">{hero.headline}</h1>
          <p className="hero__lead">{hero.subheadline}</p>
          <div className="hero__cta">
            <a className="btn btn--lime" href={hero.ctaLink || "/katalog"}>
              {hero.ctaText || "Lihat Katalog Batu"}
              <ChevronRight className="ic ic--sm" />
            </a>
            <a
              className="btn btn--ghost"
              href={whatsappLink(
                "Halo Karya Alam, saya ingin konsultasi gratis.",
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon className="ic ic--sm" />
              Konsultasi via WhatsApp
            </a>
          </div>
        </div>

        <ul className="hero__facts">
          <li>
            <strong>{site.foundedYear}</strong>
            <span>Berdiri di Jl. Kapten Haryadi, Sleman</span>
          </li>
          <li>
            <strong>{serviceCount} layanan</strong>
            <span>Kolam, taman, tebing, batu</span>
          </li>
          <li>
            <strong>{categoryCount} jenis</strong>
            <span>Batu alam dari pangkalan</span>
          </li>
          <li>
            <strong>100%</strong>
            <span>Garansi kedap air kolam</span>
          </li>
        </ul>
      </div>
    </section>
  );
}
