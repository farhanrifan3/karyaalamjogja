"use client";

import Image from "next/image";
import { useRef, useState } from "react";

import type { GalleryItem } from "@/lib/types";
import { CloseIcon } from "./icons";

export function InspirationClient({ gallery }: { gallery: GalleryItem[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState<GalleryItem | null>(null);

  function open(item: GalleryItem) {
    setActive(item);
    dialogRef.current?.showModal();
  }

  function close() {
    dialogRef.current?.close();
  }

  return (
    <section className="section" aria-labelledby="inspirasi-title">
      <div className="wrap">
        <div className="section-head">
          <div className="section-head__copy">
            <p className="eyebrow">Proyek &amp; inspirasi</p>
            <h2 id="inspirasi-title">Beberapa cara batu bekerja di ruang.</h2>
            <p className="lead">
              Referensi visual penerapan material — dari taman kering dalam
              ruang sampai carport batu sikat. Ketuk foto untuk memperbesar.
            </p>
          </div>
        </div>

        <div className="insp-grid">
          {gallery.map((item) => (
            <button
              className="insp reveal"
              type="button"
              key={item.image}
              onClick={() => open(item)}
              aria-label={`Perbesar foto: ${item.caption}`}
              aria-haspopup="dialog"
            >
              <Image
                src={item.image}
                alt={item.alt}
                fill
                loading="lazy"
                sizes="46vw"
              />
              <figcaption>
                <strong>{item.caption}</strong>
                <span>Proyek Karya Alam</span>
              </figcaption>
            </button>
          ))}
        </div>

        {gallery.length > 2 ? (
          <p className="insp-swipe-hint" aria-hidden="true">
            Geser untuk melihat foto lainnya →
          </p>
        ) : null}
      </div>

      <dialog
        className="modal"
        ref={dialogRef}
        aria-labelledby="galleryTitle"
        onClick={(event) => {
          if (event.target === dialogRef.current) close();
        }}
        style={{ maxWidth: "min(1100px, 94vw)" }}
      >
        <button
          className="modal__close"
          type="button"
          onClick={close}
          aria-label="Tutup foto"
        >
          <CloseIcon />
        </button>
        {active ? (
          <div>
            <div style={{ background: "var(--paper-3)" }}>
              <Image
                src={active.image}
                alt={active.alt}
                width={1600}
                height={1067}
                sizes="94vw"
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            </div>
            <div className="modal__body">
              <p className="modal__cat">Proyek Karya Alam</p>
              <h2 id="galleryTitle">{active.caption}</h2>
            </div>
          </div>
        ) : null}
      </dialog>
    </section>
  );
}
