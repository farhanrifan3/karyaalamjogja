"use client";

import type { FormEvent } from "react";
import { useState } from "react";

import { formatIndonesianDate } from "@/lib/format-date";
import { whatsappLink } from "@/lib/whatsapp";

export function ReviewForm() {
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [status, setStatus] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const date = formatIndonesianDate();
    const message = [
      "Halo Karya Alam, saya ingin mengirim ulasan.",
      `Nama: ${name}`,
      `Tanggal: ${date}`,
      `Ulasan: ${text}`,
    ].join("\n");

    window.open(whatsappLink(message), "_blank", "noopener,noreferrer");
    setStatus(
      "Terima kasih. WhatsApp terbuka di tab baru untuk mengirim ulasan Anda.",
    );
  }

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <label className="field">
        <span className="field__label">Nama dan daerah</span>
        <input
          name="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Contoh: Pak Hendra, Sleman"
          required
          maxLength={60}
          autoComplete="name"
        />
      </label>

      <label className="field">
        <span className="field__label">Ulasan</span>
        <textarea
          name="review"
          value={text}
          onChange={(event) => setText(event.target.value)}
          rows={4}
          placeholder="Tulis pengalaman Anda bersama Karya Alam"
          required
          maxLength={600}
        />
      </label>

      <div className="review-form__action">
        <button className="btn-solid" type="submit">
          Kirim lewat WhatsApp
        </button>
        <small>
          Ulasan dikirim lewat WhatsApp agar bisa langsung ditanggapi.
        </small>
      </div>

      {status ? (
        <p className="form-status" role="status" aria-live="polite">
          {status}
        </p>
      ) : null}
    </form>
  );
}
