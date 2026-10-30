import { ChapterHead } from "@/components/ui/ChapterHead";
import { Cta } from "@/components/ui/Cta";
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

        <ol className="services">
          {services.map((service) => (
            <li className="service" key={service.number} data-sc-in>
              <h3 className="sc-display service__title">{service.title}</h3>
              <p className="service__text">{service.description}</p>
              <ul className="service__items">
                {service.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>

        <div className="chapter__body layanan__outro" data-sc-in data-sc-stagger="70">
          <p>
            Belum tahu perlu yang mana? Kirim foto lokasi dan ukuran kasar
            lahan. Kami bantu tentukan pekerjaan yang paling masuk akal.
          </p>
          <Cta href={whatsappLink()} external>
            Konsultasi via WhatsApp
          </Cta>
        </div>
      </div>
    </section>
  );
}
