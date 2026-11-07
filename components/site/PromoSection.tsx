import Image from "next/image";
import Link from "next/link";

import type { PromoItem } from "@/lib/cms/hero-promo";
import { whatsappLink } from "@/lib/whatsapp";
import { ArrowRight, ChevronRight } from "./icons";

function untilLabel(value: string): string | null {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function PromoSection({
  promos,
  brandName,
  whatsapp,
}: {
  promos: PromoItem[];
  brandName: string;
  whatsapp: string;
}) {
  if (promos.length === 0) return null;

  return (
    <section className="section" aria-labelledby="promo-title">
      <div className="wrap">
        <div className="section-head">
          <div className="section-head__copy">
            <p className="eyebrow">Penawaran</p>
            <h2 id="promo-title">Promo yang sedang berjalan.</h2>
            <p className="lead">
              Harga khusus untuk material dan paket pilihan. Promo hanya tampil
              selama periode tayang — stok dan jadwal dikonfirmasi lewat
              WhatsApp.
            </p>
          </div>
          <div className="section-head__aside">
            <Link className="link-arrow" href="/katalog">
              Jelajahi katalog
              <ArrowRight />
            </Link>
          </div>
        </div>

        <div className="promo-grid">
          {promos.map((promo) => {
            const until = untilLabel(promo.selesaiTayang);
            const message = `Halo ${brandName}, saya tertarik ${promo.title} (${promo.hargaPromo}). Bisa minta detailnya?`;

            return (
              <article className="promo reveal" key={promo.id}>
                <div className="promo__media">
                  <Image
                    src={promo.image}
                    alt={promo.title}
                    fill
                    loading="lazy"
                    sizes="(max-width: 720px) 92vw, (max-width: 1120px) 45vw, 30vw"
                  />
                  {promo.label ? <span className="badge">{promo.label}</span> : null}
                  {until ? <span className="promo__until">s.d. {until}</span> : null}
                </div>
                <div className="promo__body">
                  <h3>{promo.title}</h3>
                  <p className="promo__desc">{promo.description}</p>
                  <p className="promo__price">
                    {promo.hargaNormal ? (
                      <span className="price-old">{promo.hargaNormal}</span>
                    ) : null}
                    <span className="price-new">{promo.hargaPromo}</span>
                  </p>
                  <a
                    className="promo__cta"
                    href={whatsappLink(message, whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Tanya promo ini
                    <ChevronRight />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
        <p className="promo-note">
          Harga promo berlaku selama periode tayang. Ketersediaan material dan
          jadwal pengerjaan dikonfirmasi sebelum transaksi.
        </p>
      </div>
    </section>
  );
}
