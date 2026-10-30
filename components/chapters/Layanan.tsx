import Image from "next/image";

import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { ChapterHead } from "@/components/ui/ChapterHead";
import { chapters } from "@/lib/chapters";
import { services } from "@/lib/services";
import { whatsappLink } from "@/lib/whatsapp";

const chapter = chapters[1];

export function Layanan() {
  return (
    <section
      id={chapter.id}
      className="chapter chapter--layanan ground--dark"
      data-sc-act="flow"
      aria-labelledby="layanan-title"
    >
      <div className="chapter__inner">
        <ChapterHead
          chapter={chapter}
          headingId="layanan-title"
          heading="Lima pekerjaan, satu tim yang sama."
          lead="Tidak semua proyek dimulai dari nol. Ada yang hanya perlu dirawat, diperbaiki, atau diselesaikan."
        />

        <div className="services">
          {services.map((service) => (
            <article className="service" key={service.number} data-sc-in>
              <div className="service__media">
                <Image
                  src={service.image}
                  alt={service.alt}
                  fill
                  loading="lazy"
                  sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
                />
                <span className="service__num">{service.number}</span>
              </div>
              <div className="service__body">
                <h3 className="sc-display service__title">{service.title}</h3>
                <p className="service__text">{service.description}</p>
                <ul className="service__items">
                  {service.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}

          <aside className="service service--cta" data-sc-in>
            <p className="sc-label">Belum yakin?</p>
            <h3 className="sc-display service__title">
              Kirim foto lokasi. Kami bantu pilih pekerjaannya.
            </h3>
            <p className="service__text">
              Ukuran kasar lahan sudah cukup. Kami balas dengan langkah paling
              masuk akal, bukan penawaran yang dipaksakan.
            </p>
            <a
              className="btn-solid btn-solid--inverse"
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
            >
              Konsultasi via WhatsApp
              <ArrowIcon />
            </a>
          </aside>
        </div>
      </div>
    </section>
  );
}
