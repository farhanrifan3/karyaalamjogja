import Image from "next/image";

import { SectionIntro } from "@/components/ui/SectionIntro";
import { products } from "@/lib/products";

export function Catalog() {
  return (
    <section id="katalog" className="alt">
      <div className="wrap">
        <SectionIntro
          eyebrow="Katalog batu alam"
          title="Pilih batu, lihat langsung di pangkalan."
          lead="Jenis, ukuran, tekstur, dan warna tersedia sesuai stok. Harga menyesuaikan kebutuhan proyek, tanyakan lewat WhatsApp."
        />

        <div className="grid3">
          {products.map((product) => (
            <article className="prod rv" key={product.name}>
              <div className="prod-media">
                <Image
                  src={product.image}
                  alt={product.alt}
                  fill
                  loading="lazy"
                  sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 33vw"
                />
              </div>
              <div className="prod-body">
                <h3>{product.name}</h3>
                <p>{product.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
