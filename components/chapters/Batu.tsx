import Image from "next/image";

import { ChapterHead } from "@/components/ui/ChapterHead";
import { Cta } from "@/components/ui/Cta";
import { chapters } from "@/lib/chapters";
import { getProducts } from "@/lib/products";
import { whatsappLink } from "@/lib/whatsapp";

const chapter = chapters[2];

const COUNT_WORDS = [
  "",
  "Satu",
  "Dua",
  "Tiga",
  "Empat",
  "Lima",
  "Enam",
  "Tujuh",
  "Delapan",
  "Sembilan",
  "Sepuluh",
  "Sebelas",
  "Dua belas",
];

export async function Batu() {
  const products = await getProducts();
  const countLabel =
    products.length > 0 && products.length < COUNT_WORDS.length
      ? COUNT_WORDS[products.length]
      : String(products.length);

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
          heading={
            products.length === 0
              ? "Katalog batu sedang diperbarui."
              : `${countLabel} batu, dipilih menurut tempatnya.`
          }
          lead="Semua batu di bawah ini ada di pangkalan. Teksturnya berbeda di bawah cahaya, jadi kami sarankan melihat langsung sebelum memesan."
        />

        {products.length === 0 ? (
          <div className="stones__empty" data-sc-in>
            <p className="sc-label">Katalog</p>
            <p>
              Daftar batu sedang disiapkan. Sementara itu, tanyakan
              ketersediaan lewat WhatsApp, atau datang langsung ke pangkalan.
            </p>
            <Cta href={whatsappLink()} external>
              Tanya stok via WhatsApp
            </Cta>
          </div>
        ) : (
          <div className="stones">
            {products.map((product) => (
              <figure className="stone" key={product.id} data-sc-in>
                <div className="stone__media">
                  <Image
                    src={product.image}
                    alt={product.alt}
                    fill
                    loading="lazy"
                    sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
                  />
                </div>
                <figcaption className="stone__label">
                  <h3 className="sc-display stone__name">{product.name}</h3>
                  <p className="stone__text">{product.description}</p>
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
                </figcaption>
              </figure>
            ))}
          </div>
        )}

        <aside className="stone__note" data-sc-in>
          <p className="sc-label">Stok</p>
          <p>
            Ukuran dan jumlah berubah sesuai kiriman. Tanyakan ketersediaan
            sebelum datang jauh-jauh.
          </p>
          <Cta href={whatsappLink()} external>
            Tanya stok via WhatsApp
          </Cta>
        </aside>
      </div>
    </section>
  );
}
