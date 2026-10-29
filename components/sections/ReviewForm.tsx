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
    setStatus("Terima kasih! WhatsApp terbuka di tab baru untuk mengirim ulasan Anda.");
  }

  return (
    <form onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="review-name">
        Nama dan daerah
      </label>
      <input
        id="review-name"
        name="name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Nama (dan daerah)"
        required
        maxLength={60}
      />

      <label className="sr-only" htmlFor="review-text">
        Ulasan
      </label>
      <textarea
        id="review-text"
        name="review"
        value={text}
        onChange={(event) => setText(event.target.value)}
        rows={4}
        placeholder="Tulis pengalaman Anda bersama Karya Alam"
        required
        maxLength={600}
      />

      <button className="btn btn-main" type="submit">
        Kirim ulasan →
      </button>

      {status ? (
        <small className="form-status" role="status" aria-live="polite">
          {status}
        </small>
      ) : (
        <small>
          Ulasan dikirim lewat WhatsApp Karya Alam agar bisa langsung ditanggapi.
        </small>
      )}
    </form>
  );
}
