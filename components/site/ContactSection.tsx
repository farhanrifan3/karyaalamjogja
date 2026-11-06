"use client";

import { useState } from "react";

import { site } from "@/lib/site";
import { whatsappLink } from "@/lib/whatsapp";
import { ClockIcon, MapPin, WhatsAppIcon } from "./icons";

const needs = [
  "Kolam Koi",
  "Kolam Renang",
  "Kolam Budidaya (RAS)",
  "Taman & Landscape",
  "Tebing & Water Wall",
  "Pasang Batu Alam",
  "Jual Batu Alam",
  "Maintenance",
];

export function ContactSection() {
  const [status, setStatus] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const need = String(data.get("need") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    if (!name || !need || !message) {
      setStatus("Lengkapi nama, kebutuhan, dan pesan terlebih dahulu.");
      return;
    }

    const text = `Halo Karya Alam, saya ${name}.\nKebutuhan: ${need}.\n${message}`;
    window.open(whatsappLink(text), "_blank", "noopener,noreferrer");
    setStatus("Membuka WhatsApp...");
  }

  return (
    <section className="section" id="kontak" aria-labelledby="kontak-title">
      <div className="wrap">
        <div className="contact">
          <div>
            <p className="eyebrow">Kontak</p>
            <h2 id="kontak-title">Ceritakan rencana Anda.</h2>
            <p className="contact__lead">
              Datang ke pangkalan, kirim foto lokasi lewat WhatsApp, atau isi
              formulir singkat. Kami bantu dari ukuran sampai RAB.
            </p>

            <div className="contact__rows">
              <div className="contact-row">
                <span className="contact-row__icon">
                  <WhatsAppIcon />
                </span>
                <span>
                  <span className="contact-row__label">WhatsApp</span>
                  <a
                    className="contact-row__value"
                    href={whatsappLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {site.phone.e164}
                  </a>
                </span>
              </div>

              <div className="contact-row">
                <span className="contact-row__icon">
                  <MapPin />
                </span>
                <span>
                  <span className="contact-row__label">Pangkalan</span>
                  <span className="contact-row__value">
                    Jl. Kapten Haryadi, Dayakan, Sardonoharjo,
                    <br />
                    Ngaglik, Sleman, D.I. Yogyakarta 55581
                  </span>
                </span>
              </div>

              <div className="contact-row">
                <span className="contact-row__icon">
                  <ClockIcon />
                </span>
                <span>
                  <span className="contact-row__label">Jam operasional</span>
                  <span className="contact-row__value">{site.hours}</span>
                </span>
              </div>
            </div>

            <div className="contact__cta">
              <a
                className="btn btn--dark"
                href={whatsappLink("Halo Karya Alam, saya ingin konsultasi.")}
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsAppIcon className="ic ic--sm" />
                Chat WhatsApp
              </a>
              <a
                className="btn btn--outline"
                href={site.mapsDirectionUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MapPin className="ic ic--sm" />
                Petunjuk Arah
              </a>
            </div>

            <p className="profile__link" style={{ marginTop: "1.25rem" }}>
              <a
                className="link-arrow"
                href={site.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram @karyaalam_yogyakarta
              </a>
            </p>
          </div>

          <div className="contact-card">
            <h3>Formulir singkat</h3>
            <p className="card__lead">
              Isi nama dan kebutuhan Anda. Setelah dikirim, pesan akan
              diteruskan ke WhatsApp untuk dibalas tim kami.
            </p>
            <form onSubmit={handleSubmit} noValidate>
              <div className="form-grid">
                <div className="field field--full">
                  <label htmlFor="ctName">
                    Nama <span className="req" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="ctName"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                  />
                </div>
                <div className="field field--full">
                  <label htmlFor="ctNeed">
                    Kebutuhan <span className="req" aria-hidden="true">*</span>
                  </label>
                  <select id="ctNeed" name="need" required defaultValue="">
                    <option value="">Pilih kebutuhan</option>
                    {needs.map((need) => (
                      <option key={need} value={need}>
                        {need}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field field--full">
                  <label htmlFor="ctMsg">
                    Pesan <span className="req" aria-hidden="true">*</span>
                  </label>
                  <textarea
                    id="ctMsg"
                    name="message"
                    required
                    placeholder="Ceritakan ukuran area dan rencana Anda"
                  />
                </div>
              </div>
              <div className="form-foot">
                <button className="btn btn--dark" type="submit">
                  Lanjut ke WhatsApp
                </button>
              </div>
              {status ? (
                <p className="form-status" role="status" aria-live="polite">
                  {status}
                </p>
              ) : null}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
