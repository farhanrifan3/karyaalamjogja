import Image from "next/image";

import { ChapterHead } from "@/components/ui/ChapterHead";
import { Cta } from "@/components/ui/Cta";
import { chapters } from "@/lib/chapters";
import { site } from "@/lib/site";

const chapter = chapters[0];

export function Pangkalan() {
  return (
    <section
      id={chapter.id}
      className="chapter chapter--pangkalan ground--light"
      data-sc-act="flow"
      aria-labelledby="pangkalan-title"
    >
      <div className="chapter__inner">
        <ChapterHead
          chapter={chapter}
          headingId="pangkalan-title"
          heading="Batunya ada di halaman, bukan di katalog."
          lead="Pangkalan kami di Jl. Kapten Haryadi, Dayakan, Ngaglik. Stok batu ditata di luar, bisa dilihat dan dipegang sebelum dipilih."
        />

        <div className="pangkalan__grid">
          <figure className="pangkalan__media" data-sc-in>
            <div className="frame frame--4x3">
              <Image
                src="/images/pangkalan.jpg"
                alt="Pangkalan Karya Alam di Ngaglik, Sleman: tumpukan batu alam, batu kali, dan water wall"
                fill
                sizes="(max-width: 900px) 100vw, 58vw"
              />
            </div>
            <figcaption>
              Pangkalan Karya Alam, Ngaglik. Stok berganti sesuai kiriman.
            </figcaption>
          </figure>

          <div className="pangkalan__panel" data-sc-in>
            <p>
              Batu andesit, candi, palimanan, koral, dan batu kali ada di tempat
              yang sama. Anda bisa membandingkan teksturnya di bawah cahaya
              sehari-hari, bukan lewat foto yang sudah diperbagus.
            </p>

            <dl className="facts">
              <div>
                <dt>Berdiri</dt>
                <dd>{site.foundedYear}</dd>
              </div>
              <div>
                <dt>Jenis batu</dt>
                <dd>6</dd>
              </div>
              <div>
                <dt>Layanan</dt>
                <dd>5</dd>
              </div>
            </dl>

            <Cta href={site.mapsUrl} external>
              Buka di Google Maps
            </Cta>
          </div>
        </div>
      </div>
    </section>
  );
}
