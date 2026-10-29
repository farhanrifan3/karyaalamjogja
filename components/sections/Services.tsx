import { SectionIntro } from "@/components/ui/SectionIntro";
import { services } from "@/lib/services";

export function Services() {
  return (
    <section id="layanan">
      <div className="wrap">
        <SectionIntro
          eyebrow="Layanan kami"
          title="Satu tim, dari ide sampai serah terima."
          lead="Konsultasi desain, penyusunan Rencana Anggaran Biaya, pemilihan material, hingga pekerjaan di lapangan."
        />

        <div className="grid4">
          {services.map((service) => (
            <article className="card rv" key={service.number}>
              <div className="n">{service.number}</div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <ul>
                {service.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
