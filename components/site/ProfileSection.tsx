import Image from "next/image";
import Link from "next/link";

import type { ProfilContent } from "@/lib/cms/hero-promo";
import { processSteps } from "@/lib/process-steps";
import { site } from "@/lib/site";
import { ArrowRight } from "./icons";

type ProfileSectionProps = {
  profil: ProfilContent;
};

const principles = [
  "Dengarkan kebutuhan dulu",
  "RAB transparan sejak awal",
  "Progres dikabari",
  "Garansi kedap air 100%",
];

export function ProfileSection({ profil }: ProfileSectionProps) {
  const paragraphs = profil.narrative
    .split(/\n{2,}/)
    .map((line) => line.trim())
    .filter(Boolean);

  const image = profil.images[0] ?? "/images/pangkalan.jpg";
  const years = new Date().getFullYear() - site.foundedYear;

  return (
    <section className="section" id="profil" aria-labelledby="profil-title">
      <div className="wrap">
        <div className="profile">
          <div className="profile__media reveal">
            <Image
              src={image}
              alt="Pangkalan dan pengerjaan Karya Alam"
              width={1600}
              height={1067}
              loading="lazy"
              sizes="(max-width: 900px) 92vw, 46vw"
            />
            <div className="profile__badge">
              <strong>{years} tahun</strong>
              <span>Belajar dari batu</span>
            </div>
            <p className="profile__caption">
              Pangkalan Karya Alam, Ngaglik. Stok berganti sesuai kiriman.
            </p>
          </div>

          <div className="profile__body reveal">
            <p className="eyebrow">Profil Karya Alam</p>
            <h2 id="profil-title">{profil.title}</h2>

            {paragraphs.length > 0 ? (
              paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
            ) : (
              <p>
                Karya Alam berdiri di Dayakan, Sardonoharjo, Ngaglik, Sleman
                sejak {site.foundedYear}.
              </p>
            )}

            <p className="profile__scope">
              Cakupan usaha: desain, perencanaan, pembuatan, renovasi,
              perawatan, serta penjualan dan pemasangan batu alam — untuk
              hunian, perkantoran, tempat usaha, dan area komersial di Sleman,
              Yogyakarta, dan sekitarnya.
            </p>

            <ul className="principle-row">
              {principles.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <div className="profile__stats">
              {profil.stats.map((stat) => (
                <div className="stat" key={stat.label}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>

            <p className="profile__link">
              <Link className="link-arrow" href="#layanan">
                Lihat cara kami bekerja
                <ArrowRight />
              </Link>
            </p>
          </div>
        </div>

        <ol className="steps" aria-label="Alur kerja Karya Alam">
          {processSteps.map((step, index) => (
            <li key={step.title}>
              <span className="step__num">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="step__title">{step.title}</span>
              <span className="step__desc">{step.description}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
