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
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!item) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.body.style.overflow = "hidden";
    document.body.classList.add("lightbox-open");
    document.addEventListener("keydown", handleKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.classList.remove("lightbox-open");
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [item, onClose]);

  if (!item) {
    return null;
  }

  return createPortal(
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={item.caption}
      onClick={onClose}
    >
      <button
        ref={closeButtonRef}
        type="button"
        className="lightbox-close"
        aria-label="Tutup foto"
        onClick={onClose}
      >
        ×
      </button>

      <div
        className="lightbox-inner"
        onClick={(event) => event.stopPropagation()}
      >
        <Image
          src={item.image}
          alt={item.alt}
          width={800}
          height={600}
          sizes="100vw"
        />
      </div>
    </div>,
    document.body,
  );
}
