"use client";

import { useState } from "react";

import { submitReviewAction } from "@/app/admin/reviews-actions";
import { Star } from "@/components/site/icons";

export function ReviewForm() {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setStatus(null);
    try {
      await submitReviewAction(formData);
      setStatus(
        "Terima kasih! Ulasan Anda telah terkirim dan akan tampil setelah disetujui admin.",
      );
    } catch {
      setStatus("Terjadi kesalahan saat mengirim ulasan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} noValidate>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="rvName">
            Nama <span className="req" aria-hidden="true">*</span>
          </label>
          <input
            id="rvName"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Contoh: Pak Hendra, Sleman"
            required
            maxLength={60}
          />
        </div>

        <div className="field field--full">
          <span id="ratingLabel">
            Rating <span className="req" aria-hidden="true">*</span>
          </span>
          <div
            className="rating-input"
            role="radiogroup"
            aria-labelledby="ratingLabel"
          >
            {[5, 4, 3, 2, 1].map((value) => (
              <label className="star-btn" title={`${value} bintang`} key={value}>
                <input
                  className="sr-only"
                  type="radio"
                  name="rating"
                  value={value}
                  defaultChecked={value === 5}
                  required
                />
                <Star />
                <span className="sr-only">{value} bintang</span>
              </label>
            ))}
          </div>
        </div>

        <div className="field field--full">
          <label htmlFor="rvText">
            Ulasan <span className="req" aria-hidden="true">*</span>
          </label>
          <textarea
            id="rvText"
            name="text"
            required
            minLength={20}
            maxLength={600}
            placeholder="Tulis pengalaman Anda bersama Karya Alam"
            aria-describedby="rvTextHelp"
          />
          <p className="field__help" id="rvTextHelp">
            Tulis pengalaman Anda selama pengerjaan, minimal 20 karakter.
          </p>
        </div>
      </div>

      <div className="form-foot">
        <button className="btn btn--dark" type="submit" disabled={loading}>
          {loading ? "Mengirim..." : "Kirim ulasan"}
        </button>
        <p className="form-note">
          Ulasan bermoderasi. Kami menolak kontak pribadi, ujaran kebencian, dan
          promosi pihak lain.
        </p>
      </div>

      {status ? (
        <p className="form-status" role="status" aria-live="polite">
          {status}
        </p>
      ) : null}
    </form>
  );
}
