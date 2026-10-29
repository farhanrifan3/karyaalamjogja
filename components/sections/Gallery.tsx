"use client";

import Image from "next/image";
import { useCallback, useState } from "react";

import { Lightbox } from "@/components/ui/Lightbox";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { gallery } from "@/lib/gallery";
import type { GalleryItem } from "@/lib/types";

export function Gallery() {
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);
  const closeLightbox = useCallback(() => setActiveItem(null), []);

  return (
    <section id="galeri" className="alt">
      <div className="wrap">
        <SectionIntro
          eyebrow="Portofolio"
          title="Hasil kerja yang bicara."
          lead="Kolam, tebing, taman, dan lantai batu alam. Ketuk foto untuk memperbesar."
        />

        <div className="gal">
          {gallery.map((item) => (
            <button
              key={item.image}
              type="button"
              onClick={() => setActiveItem(item)}
              aria-label={`Perbesar foto: ${item.caption}`}
            >
              <Image
                src={item.image}
                alt={item.alt}
                fill
                loading="lazy"
                sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 25vw"
              />
              <span>{item.caption}</span>
            </button>
          ))}
        </div>
      </div>

      <Lightbox item={activeItem} onClose={closeLightbox} />
    </section>
  );
}
