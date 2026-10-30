import Image from "next/image";

import { ChapterHead } from "@/components/ui/ChapterHead";
import { Cta } from "@/components/ui/Cta";
import { chapters } from "@/lib/chapters";
import { products } from "@/lib/products";
import { whatsappLink } from "@/lib/whatsapp";

const chapter = chapters[2];

export function Batu() {
  return (
    <section
      id={chapter.id}
      className="chapter chapter--batu ground--light"
      data-sc-act="flow"
      aria-labelledby="batu-title"
    >
      <div className="chapter__inner">
        <ChapterHead
          chapter={chapter}
          headingId="batu-title"
          heading="Enam batu, dipilih menurut tempatnya."
          lead="Semua batu di bawah ini ada di pangkalan. Teksturnya berbeda di bawah cahaya, jadi kami sarankan melihat langsung sebelum memesan."
        />

        <div className="stones">
          {products.map((product, index) => (
            <figure
              className={`stone stone--${index + 1}`}
              key={product.name}
              data-sc-in
            >
              <div className="frame frame--stone">
                <Image
                  src={product.image}
                  alt={product.alt}
                  fill
                  loading="lazy"
                  sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
                />
              </div>
              <figcaption className="stone__label">
                <h3 className="sc-display stone__name">{product.name}</h3>
                <dl className="stone__spec">
                  <div>
                    <dt>Pakai</dt>
                    <dd>{product.use}</dd>
                  </div>
                  <div>
                    <dt>Sifat</dt>
                    <dd>{product.character}</dd>
                  </div>
                </dl>
                <p className="stone__text">{product.description}</p>
              </figcaption>
            </figure>
          ))}

          <aside className="stone__note" data-sc-in>
            <p className="sc-label">Stok</p>
            <p>
              Ukuran dan jumlah berubah sesuai kiriman. Tanyakan ketersediaan
              sebelum datang jauh-jauh.
            </p>
            <Cta href={whatsappLink()} external>
              Konsultasi via WhatsApp
            </Cta>
          </aside>
        </div>
      </div>
    </section>
  );
}
