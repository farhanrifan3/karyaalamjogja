import Image from "next/image";

import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { Wordmark } from "@/components/ui/Wordmark";
import { chapters } from "@/lib/chapters";
import { site } from "@/lib/site";
import { whatsappLink } from "@/lib/whatsapp";

const stats = [
  { term: "Berdiri", value: String(site.foundedYear) },
  { term: "Jenis batu", value: "6" },
  { term: "Layanan", value: "5" },
];

export function TitlePage() {
  return (
    <header id="top" className="titlepage ground--dark">
      <div className="titlepage__inner">
        <div className="titlepage__top">
          <a className="titlepage__brand" href="#top" aria-label="Karya Alam">
            <Wordmark />
          </a>
          <p className="titlepage__place">
            Ngaglik, Sleman
            <span>Sejak {site.foundedYear}</span>
          </p>
          <a
            className="titlepage__top-cta"
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp
          </a>
        </div>

        <div className="titlepage__intro">
          <div className="titlepage__copy">
            <p className="sc-label titlepage__eyebrow">
              Batu alam · Kolam · Taman
            </p>
            <h1 className="sc-display titlepage__title">
              Batu, air, dan tanah.
            </h1>
          </div>

          <div className="titlepage__aside">
            <p className="titlepage__lede">
              Kolam, tebing, taman, dan batu alam di Sleman. Digarap sejak 1986,
              dari desain dan RAB sampai perawatan.
            </p>

            <div className="titlepage__actions">
              <a
                className="btn-solid"
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
              >
                Konsultasi via WhatsApp
                <ArrowIcon />
              </a>
              <a className="btn-ghost" href={`tel:${site.phone.e164}`}>
                {site.phone.display}
              </a>
            </div>

            <dl className="titlepage__stats">
              {stats.map((stat) => (
                <div key={stat.term}>
                  <dt>{stat.term}</dt>
                  <dd>{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <figure className="titlepage__figure">
          <div className="frame frame--hero">
            <Image
              src="/images/hero-garden.jpg"
              alt="Ilustrasi taman Jepang dengan kolam koi, air terjun batu, dan rumah kayu"
              fill
              priority
              sizes="(max-width: 1240px) 100vw, 82rem"
            />
          </div>
          <figcaption>
            Ilustrasi taman dan kolam koi. Foto pekerjaan Karya Alam ada di bab
            Proyek.
          </figcaption>
        </figure>

        <nav className="titlepage__index" aria-label="Isi halaman">
          <p className="sc-label">Isi</p>
          <ol>
            {chapters.map((chapter) => (
              <li key={chapter.id}>
                <a href={`#${chapter.id}`}>
                  <span className="titlepage__numeral">{chapter.numeral}</span>
                  {chapter.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </header>
  );
}
