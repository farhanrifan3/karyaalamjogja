"use client";

import { useEffect, useState } from "react";

import { ButtonLink } from "@/components/ui/ButtonLink";
import { LogoMark } from "@/components/ui/LogoMark";
import { site } from "@/lib/site";
import { whatsappLink } from "@/lib/whatsapp";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <nav>
      <div className="wrap">
        <a href="#top" className="logo" aria-label="Karya Alam, kembali ke atas">
          <LogoMark />
          <span className="logo-text">Karya Alam</span>
        </a>

        <div className="menu">
          {site.navigation.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </div>

        <div className="nav-actions">
          <ButtonLink
            href={whatsappLink()}
            variant="main"
            className="nav-cta"
            external
          >
            Konsultasi
          </ButtonLink>

          <button
            type="button"
            className="menu-toggle"
            aria-label={isOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsOpen((current) => !current)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        className={`mobile-menu${isOpen ? " open" : ""}`}
        hidden={!isOpen}
      >
        {site.navigation.map((item) => (
          <a key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
