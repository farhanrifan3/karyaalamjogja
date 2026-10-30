"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { ChapterHead } from "@/components/ui/ChapterHead";
import { Lightbox } from "@/components/ui/Lightbox";
import { chapters } from "@/lib/chapters";
import { gallery } from "@/lib/gallery";
import type { GalleryItem } from "@/lib/types";

const chapter = chapters[4];

export function Proyek() {
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);
  const close = () => setActiveItem(null);

  return (
    <section
      id={chapter.id}
      className="chapter chapter--proyek ground--light"
      data-sc-act="flow"
      aria-labelledby="proyek-title"
    >
      <div className="chapter__inner">
        <ChapterHead
          chapter={chapter}
          headingId="proyek-title"
          heading="Yang sudah berdiri."
          lead="Sebagian pekerjaan yang selesai di Sleman dan sekitarnya. Ketuk foto untuk memperbesar."
        />

        <div className="work">
          {gallery.map((item, index) => (
            <figure
              className={`work__item work__item--${index + 1}`}
              key={item.image}
              data-sc-in
            >
              <button
                type="button"
                className="work__button"
                onClick={() => setActiveItem(item)}
                aria-label={`Perbesar foto: ${item.caption}`}
                aria-haspopup="dialog"
              >
                <span className="frame frame--work">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    loading="lazy"
                    sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 40vw"
                  />
                </span>
              </button>
              <figcaption className="work__caption">{item.caption}</figcaption>
            </figure>
          ))}
        </div>
      </div>

      <Lightbox item={activeItem} onClose={close} />
    </section>
  );
}
