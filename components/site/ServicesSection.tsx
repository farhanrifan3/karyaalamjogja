"use client";

import Image from "next/image";
import { useRef, useState } from "react";

import type { ServiceItem } from "@/lib/cms/services";
import { whatsappLink } from "@/lib/whatsapp";
import { ArrowRight, CheckIcon, ChevronRight, CloseIcon, WhatsAppIcon } from "./icons";

const maintenance = {
  mingguan: [
    "Pembersihan lumut dan permukaan batu",
    "Pemeriksaan filter dan aliran air",
    "Cek kebocoran dan bagian rusak",
    "Laporan kondisi singkat",
  ],
  bulanan: [
    "Semua tugas paket mingguan",
    "Cat ulang dan coating ulang permukaan",
    "Perawatan chamber dan perpipaan",
    "Peremajaan tebing, fitur air, dan taman",
  ],
};

type ServicesSectionProps = {
  services: ServiceItem[];
};

export function ServicesSection({ services }: ServicesSectionProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState<ServiceItem | null>(null);
  const [frequency, setFrequency] = useState<"mingguan" | "bulanan">("mingguan");

  const maintenanceService = services.find((service) => service.id === "maintenance");
  const maintenancePrice = "Rp160.000";

  function openService(service: ServiceItem) {
    setActive(service);
    dialogRef.current?.showModal();
  }

  function closeService() {
    dialogRef.current?.close();
  }

  return (
    <section className="section section--alt" id="layanan" aria-labelledby="layanan-title">
      <div className="wrap">
        <div className="section-head">
          <div className="section-head__copy">
            <p className="eyebrow">Layanan</p>
            <h2 id="layanan-title">
              Satu pangkalan, {services.length || "banyak"} pekerjaan.
            </h2>
            <p className="lead">
              Kolam, taman, tebing, pemasangan batu, sampai perawatan berkala.
              Pilih layanan untuk melihat cakupan pekerjaannya.
            </p>
          </div>
          <div className="section-head__aside">
            <a
              className="link-arrow"
              href={whatsappLink("Halo Karya Alam, saya ingin konsultasi layanan.")}
              target="_blank"
              rel="noopener noreferrer"
            >
              Konsultasi layanan
              <ArrowRight />
            </a>
          </div>
        </div>

        <div className="svc-grid">
          {services.map((service, index) => (
            <button
              className="svc reveal"
              type="button"
              key={service.id}
              onClick={() => openService(service)}
            >
              <span className="svc__media">
                <Image
                  src={service.image}
                  alt={service.name}
                  fill
                  loading="lazy"
                  sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
                />
              </span>
              <span className="svc__body">
                <span className="svc__meta">
                  Layanan {String(index + 1).padStart(2, "0")}
                </span>
                <span className="svc__name">{service.name}</span>
                <span className="svc__go">
                  Lihat cakupan
                  <ChevronRight />
                </span>
              </span>
            </button>
          ))}
        </div>

        <div className="maint" id="perawatan">
          <div>
            <p className="eyebrow">Paket perawatan</p>
            <h3>Rawat setelah proyek selesai.</h3>
            <p className="maint__lead">
              {maintenanceService?.description ??
                "Kolam dan taman butuh perawatan agar tetap bekerja dan tetap enak dilihat. Pilih paket mingguan untuk kebersihan rutin, atau bulanan untuk perawatan menyeluruh."}
            </p>
            <p className="maint__price">
              Mulai <strong>{maintenancePrice}</strong> / kunjungan · koi standar
              bulanan
            </p>
            <a
              className="btn btn--dark maint__cta"
              href={whatsappLink(
                "Halo Karya Alam, saya ingin tanya paket maintenance kolam dan taman.",
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              Tanya paket perawatan
              <ArrowRight />
            </a>
          </div>
          <div>
            <div className="seg" role="group" aria-label="Pilih frekuensi perawatan">
              <button
                className="seg__btn"
                type="button"
                data-maint="mingguan"
                aria-pressed={frequency === "mingguan"}
                onClick={() => setFrequency("mingguan")}
              >
                Mingguan
              </button>
              <button
                className="seg__btn"
                type="button"
                data-maint="bulanan"
                aria-pressed={frequency === "bulanan"}
                onClick={() => setFrequency("bulanan")}
              >
                Bulanan
              </button>
            </div>
            <ul className="maint__list">
              {maintenance[frequency].map((item) => (
                <li key={item}>
                  <CheckIcon />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <dialog
        className="modal svc-dialog"
        ref={dialogRef}
        aria-labelledby="svcDialogTitle"
        onClick={(event) => {
          if (event.target === dialogRef.current) closeService();
        }}
      >
        <button
          className="modal__close"
          type="button"
          onClick={closeService}
          aria-label="Tutup detail layanan"
        >
          <CloseIcon />
        </button>
        {active ? (
          <div className="modal__grid">
            <div className="modal__media">
              <Image
                src={active.image}
                alt={active.name}
                width={1600}
                height={1067}
                sizes="(max-width: 900px) 92vw, 46vw"
              />
            </div>
            <div className="modal__body">
              <p className="modal__cat">Layanan</p>
              <h2 id="svcDialogTitle">{active.name}</h2>
              <p className="modal__desc">{active.description}</p>
              <div className="modal__section">
                <span className="modal__label">Cakupan pekerjaan</span>
                <ul className="check-list">
                  {active.checklist.map((item) => (
                    <li key={item}>
                      <CheckIcon />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="modal__cta">
                <a
                  className="btn btn--lime"
                  href={whatsappLink(
                    `Halo Karya Alam, saya ingin konsultasi layanan ${active.name}.`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WhatsAppIcon className="ic ic--sm" />
                  Tanya layanan ini
                </a>
                <a className="btn btn--outline" href="/katalog">
                  Lihat material
                </a>
              </div>
            </div>
          </div>
        ) : null}
      </dialog>
    </section>
  );
}
