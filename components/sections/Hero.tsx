import Image from "next/image";

import { ButtonLink } from "@/components/ui/ButtonLink";
import { site } from "@/lib/site";
import { whatsappLink } from "@/lib/whatsapp";

export function Hero() {
  return (
    <header className="hero" id="top">
      <div className="wrap">
        <div className="rv">
          <span className="badge">● Sleman, Yogyakarta · Sejak {site.foundedYear}</span>
          <h1>
            Batu alam yang <em>menghidupkan</em> rumahmu.
          </h1>
          <p>
            Spesialis batu alam, kolam, tebing, taman, dan landscape. Dari desain
            dan RAB, pilihan material, sampai pengerjaan dan perawatan.
          </p>

          <div className="cta-row">
            <ButtonLink href={whatsappLink()} variant="wa" external>
              Chat WhatsApp →
            </ButtonLink>
            <ButtonLink href={site.mapsUrl} variant="line" external>
              Kunjungi Pangkalan
            </ButtonLink>
          </div>
        </div>

        <div className="hero-photo rv">
          <div className="hero-photo-frame">
            <Image
              src="/images/pangkalan.jpg"
              alt="Pangkalan Karya Alam di Ngaglik, Sleman: tumpukan batu alam, batu kali, dan water wall"
              fill
              priority
              sizes="(max-width: 860px) 100vw, 50vw"
            />
          </div>
          <div className="tag">
            <b>Pangkalan Karya Alam</b>
            Lihat langsung batunya, Ngaglik
          </div>
        </div>
      </div>
    </header>
  );
}
