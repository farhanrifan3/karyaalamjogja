import Link from "next/link";

import { whatsappLink } from "@/lib/whatsapp";
import { ChevronRight } from "./icons";

export function CtaBand() {
  return (
    <section className="band-cta" aria-labelledby="cta-band-title">
      <div className="wrap band-cta__in">
        <div>
          <h2 id="cta-band-title">
            Konsultasi gratis, RAB jelas sebelum mulai.
          </h2>
          <p>
            Ceritakan ukuran area dan rencana Anda. Kami bantu memilih material,
            menyusun RAB, dan menjadwalkan survei.
          </p>
        </div>
        <div className="band-cta__actions">
          <a
            className="btn btn--dark"
            href={whatsappLink(
              "Halo Karya Alam, saya ingin konsultasi dan minta RAB.",
            )}
            target="_blank"
            rel="noopener noreferrer"
          >
            Konsultasi via WhatsApp
            <ChevronRight className="ic ic--sm" />
          </a>
          <Link className="btn btn--outline" href="/katalog">
            Lihat katalog
          </Link>
        </div>
      </div>
    </section>
  );
}
