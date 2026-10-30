"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import type { GalleryItem } from "@/lib/types";

type LightboxProps = {
  item: GalleryItem | null;
  onClose: () => void;
};

export function Lightbox({ item, onClose }: LightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!item) return;

    restoreRef.current = document.activeElement as HTMLElement | null;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }

      if (event.key === "Tab") {
        event.preventDefault();
        closeRef.current?.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      restoreRef.current?.focus();
    };
  }, [item, onClose]);

  if (!item) return null;

  return createPortal(
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={item.caption}
      onClick={onClose}
    >
      <button
        ref={closeRef}
        type="button"
        className="lightbox__close"
        aria-label="Tutup foto"
        onClick={onClose}
      >
        Tutup
      </button>

      <figure
        className="lightbox__figure"
        onClick={(event) => event.stopPropagation()}
      >
        <Image
          src={item.image}
          alt={item.alt}
          width={1200}
          height={900}
          sizes="100vw"
          unoptimized
        />
        <figcaption>{item.caption}</figcaption>
      </figure>
    </div>,
    document.body,
  );
}
