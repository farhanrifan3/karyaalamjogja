"use client";

import { useState } from "react";
import { submitReviewAction } from "@/app/admin/reviews-actions";

export function ReviewForm() {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    try {
      await submitReviewAction(formData);
      setStatus("Terima kasih! Ulasan Anda telah terkirim dan akan ditampilkan setelah disetujui oleh admin.");
    } catch {
      setStatus("Terjadi kesalahan saat mengirim ulasan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="review-form" action={handleSubmit}>
      <label className="field">
        <span className="field__label">Nama dan daerah</span>
        <input
          name="name"
          placeholder="Contoh: Pak Hendra, Sleman"
          required
          maxLength={60}
          autoComplete="name"
        />
      </label>

      <label className="field">
        <span className="field__label">Beri Rating</span>
        <select name="rating" defaultValue="5" className="field__input" style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--a-line)", background: "var(--a-card)", color: "var(--a-text)", fontSize: "0.95rem" }}>
          <option value="5">⭐⭐⭐⭐⭐ (5/5 Sangat Puas)</option>
          <option value="4">⭐⭐⭐⭐ (4/5 Puas)</option>
          <option value="3">⭐⭐⭐ (3/5 Cukup)</option>
        </select>
      </label>

      <label className="field">
        <span className="field__label">Ulasan</span>
        <textarea
          name="text"
          rows={4}
          placeholder="Tulis pengalaman Anda bersama Karya Alam"
          required
          maxLength={600}
        />
      </label>

      <div className="review-form__action">
        <button className="btn-solid" type="submit" disabled={loading}>
          {loading ? "Mengirim..." : "Kirim Ulasan ke Website"}
        </button>
        <small>
          Ulasan Anda akan dimoderasi oleh admin sebelum tampil di beranda publik.
        </small>
      </div>

      {status ? (
        <p className="form-status" role="status" aria-live="polite" style={{ marginTop: "1rem", color: "var(--a-accent)", fontSize: "0.9rem", fontWeight: 500 }}>
          {status}
        </p>
      ) : null}
    </form>
  );
}
