import Image from "next/image";
import Link from "next/link";

import type { CatalogCategory, CatalogItem } from "@/lib/catalog";
import { ArrowRight } from "./icons";

type CategorySectionProps = {
  categories: CatalogCategory[];
  items: CatalogItem[];
};

export function CategorySection({ categories, items }: CategorySectionProps) {
  if (categories.length === 0) return null;

  return (
    <section className="section section--alt" aria-labelledby="kategori-title">
      <div className="wrap">
        <div className="section-head">
          <div className="section-head__copy">
            <p className="eyebrow">Katalog batu</p>
            <h2 id="kategori-title">
              {categories.length} material, banyak kemungkinan.
            </h2>
            <p className="lead">
              Dari andesit yang tegas sampai palimanan yang hangat. Setiap batu
              punya karakter, ukuran, dan penggunaan yang berbeda.
            </p>
          </div>
          <div className="section-head__aside">
            <Link className="btn btn--outline btn--sm" href="/katalog">
              Buka katalog lengkap
            </Link>
          </div>
        </div>

        <div className="cat-grid">
          {categories.map((category, index) => {
            const count = items.filter(
              (item) => item.categoryId === category.id,
            ).length;

            return (
              <Link
                className="cat reveal"
                href={`/katalog?kategori=${category.slug}`}
                key={category.id}
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  loading="lazy"
                  sizes="(max-width: 720px) 92vw, (max-width: 1120px) 45vw, 30vw"
                />
                <span className="cat__num">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="cat__body">
                  <div>
                    <h3>{category.name}</h3>
                    <p>
                      {count > 0
                        ? `${count} varian · ukuran menyesuaikan`
                        : "Ukuran menyesuaikan"}
                    </p>
                  </div>
                  <span className="cat__go" aria-hidden="true">
                    <ArrowRight className="ic ic--sm" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
