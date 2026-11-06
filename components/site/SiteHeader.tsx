"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

import { site } from "@/lib/site";
import { whatsappLink } from "@/lib/whatsapp";
import { ChevronRight, CloseIcon, MapPin, MenuIcon, Moon, WhatsAppIcon } from "./icons";

type SiteHeaderProps = {
  variant?: "home" | "catalog";
};

export function SiteHeader({ variant = "home" }: SiteHeaderProps) {
  const headerRef = useRef<HTMLElement>(null);
  const drawerRef = useRef<HTMLDialogElement>(null);
  const menuRef = useRef<HTMLButtonElement>(null);

  const home = variant === "home" ? "" : "/";
  const links = [
    { label: "Beranda", href: `${home || "/"}#top` },
    { label: "Profil", href: `${home}#profil` },
    { label: "Katalog Batu", href: "/katalog" },
    { label: "Layanan", href: `${home}#layanan` },
    { label: "Testimoni", href: `${home}#testimoni` },
    { label: "Kontak", href: `${home}#kontak` },
  ];

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const onScroll = () => el.classList.toggle("is-stuck", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const saved = window.localStorage.getItem("karya-theme");
    if (saved === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

  function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    if (next === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    window.localStorage.setItem("karya-theme", next);
  }

  function openDrawer() {
    drawerRef.current?.showModal();
    menuRef.current?.setAttribute("aria-expanded", "true");
  }

  function closeDrawer() {
    drawerRef.current?.close();
    menuRef.current?.setAttribute("aria-expanded", "false");
  }

  return (
    <>
      <div className="topbar" id="top">
        <div className="wrap topbar__in">
          <p className="topbar__note">
            <MapPin />
            {site.addressShort}
          </p>
          <div className="topbar__links">
            <span>{site.hours}</span>
            <a href={`tel:${site.phone.e164}`}>{site.phone.e164}</a>
            <a href={site.mapsDirectionUrl} target="_blank" rel="noopener noreferrer">
              Petunjuk arah
            </a>
          </div>
        </div>
      </div>

      <header className="site-head" id="siteHead" ref={headerRef}>
        <div className="wrap head__in">
          <Link className="brand" href="/" aria-label="Karya Alam — beranda">
            <span className="brand__mark" aria-hidden="true">
              KA
            </span>
            <span>
              <span className="brand__name">Karya Alam</span>
              <span className="brand__tag">batu alam · kolam · taman</span>
            </span>
          </Link>

          <nav className="nav" aria-label="Navigasi utama">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                aria-current={
                  link.href === "/" || link.href === "#top" ? "page" : undefined
                }
              >
                {link.label}
              </Link>
            ))}
            <Link href="/admin" style={{ color: "var(--lime)" }}>
              Admin / Kasir
            </Link>
          </nav>

          <div className="head__actions">
            <a
              className="btn btn--lime btn--sm"
              href={whatsappLink(
                "Halo Karya Alam, saya ingin konsultasi mengenai proyek saya.",
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon />
              Konsultasi Gratis
            </a>
            <button
              className="btn btn--ghost btn--sm"
              type="button"
              onClick={toggleTheme}
              aria-label="Ganti tema gelap/terang"
            >
              <Moon />
            </button>
            <button
              className="menu-btn"
              type="button"
              ref={menuRef}
              aria-label="Buka menu"
              aria-expanded="false"
              aria-controls="drawer"
              onClick={openDrawer}
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </header>

      <dialog className="drawer" id="drawer" ref={drawerRef} aria-label="Menu navigasi">
        <div className="drawer__top">
          <span className="drawer__title">Menu</span>
          <button
            className="drawer__close"
            type="button"
            onClick={closeDrawer}
            aria-label="Tutup menu"
          >
            <CloseIcon />
          </button>
        </div>
        <div className="drawer__body">
          <nav className="drawer__nav" aria-label="Navigasi seluler">
            {links.map((link) => (
              <Link key={link.label} href={link.href} onClick={closeDrawer}>
                {link.label}
                <ChevronRight />
              </Link>
            ))}
            <Link href="/admin" onClick={closeDrawer}>
              Admin / Kasir
              <ChevronRight />
            </Link>
          </nav>
          <div className="drawer__foot">
            <a
              className="btn btn--lime btn--block"
              href={whatsappLink(
                "Halo Karya Alam, saya ingin konsultasi mengenai proyek saya.",
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon />
              Konsultasi Gratis
            </a>
            <p className="drawer__contact">
              Jl. Kapten Haryadi, Dayakan, Sardonoharjo, Sleman
              <br />
              {site.hours}
            </p>
          </div>
        </div>
      </dialog>
    </>
  );
}
