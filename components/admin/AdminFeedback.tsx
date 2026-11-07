"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";

type ToastTone = "success" | "error";

type ToastMessage = {
  tone: ToastTone;
  title: string;
  message: string;
};

type ConfirmationState = {
  form: HTMLFormElement;
  submitter: HTMLButtonElement | HTMLInputElement | null;
  title: string;
  message: string;
  confirmLabel: string;
  tone: "danger" | "primary";
};

const FEEDBACK_MESSAGES: Record<string, ToastMessage> = {
  "product-added": {
    tone: "success",
    title: "Barang ditambahkan",
    message: "Perubahan katalog sudah tersimpan dan siap tampil di situs.",
  },
  "product-updated": {
    tone: "success",
    title: "Perubahan tersimpan",
    message: "Informasi barang sudah diperbarui.",
  },
  "product-deleted": {
    tone: "success",
    title: "Barang dihapus",
    message: "Barang sudah dihapus dari katalog. Foto tetap tersedia.",
  },
  "product-order-updated": {
    tone: "success",
    title: "Urutan diperbarui",
    message: "Urutan katalog sudah berubah.",
  },
  "product-delete-failed": {
    tone: "error",
    title: "Barang belum terhapus",
    message: "Data belum berubah. Coba lagi beberapa saat lagi.",
  },
  "product-order-failed": {
    tone: "error",
    title: "Urutan belum berubah",
    message: "Data belum berubah. Coba lagi beberapa saat lagi.",
  },
  "service-saved": {
    tone: "success",
    title: "Layanan tersimpan",
    message: "Perubahan layanan sudah tampil di situs publik.",
  },
  "service-deleted": {
    tone: "success",
    title: "Layanan dihapus",
    message: "Layanan sudah dihapus dari situs publik.",
  },
  "service-save-failed": {
    tone: "error",
    title: "Layanan belum tersimpan",
    message: "Periksa koneksi lalu coba simpan kembali.",
  },
  "service-delete-failed": {
    tone: "error",
    title: "Layanan belum terhapus",
    message: "Data belum berubah. Coba lagi beberapa saat lagi.",
  },
  "hero-saved": {
    tone: "success",
    title: "Hero diperbarui",
    message: "Perubahan banner utama sudah tampil di situs.",
  },
  "promo-saved": {
    tone: "success",
    title: "Promo tersimpan",
    message: "Perubahan promo sudah tersimpan.",
  },
  "promo-deleted": {
    tone: "success",
    title: "Promo dihapus",
    message: "Promo sudah dihapus dari situs publik.",
  },
  "hero-save-failed": {
    tone: "error",
    title: "Hero belum tersimpan",
    message: "Periksa koneksi lalu coba simpan kembali.",
  },
  "promo-save-failed": {
    tone: "error",
    title: "Promo belum tersimpan",
    message: "Periksa isian dan koneksi, lalu coba lagi.",
  },
  "promo-delete-failed": {
    tone: "error",
    title: "Promo belum terhapus",
    message: "Data belum berubah. Coba lagi beberapa saat lagi.",
  },
  "profile-saved": {
    tone: "success",
    title: "Profil diperbarui",
    message: "Profil dan statistik sudah tersimpan.",
  },
  "profile-save-failed": {
    tone: "error",
    title: "Profil belum tersimpan",
    message: "Periksa format statistik lalu coba simpan kembali.",
  },
  "review-approved": {
    tone: "success",
    title: "Ulasan disetujui",
    message: "Ulasan sekarang tampil di situs publik.",
  },
  "review-rejected": {
    tone: "success",
    title: "Ulasan ditolak",
    message: "Ulasan tidak akan tampil di situs publik.",
  },
  "review-deleted": {
    tone: "success",
    title: "Ulasan dihapus",
    message: "Ulasan sudah dihapus.",
  },
  "review-action-failed": {
    tone: "error",
    title: "Ulasan belum berubah",
    message: "Coba lagi beberapa saat lagi.",
  },
  "price-saved": {
    tone: "success",
    title: "Harga tersimpan",
    message: "Harga master sudah diperbarui.",
  },
  "price-deleted": {
    tone: "success",
    title: "Harga dihapus",
    message: "Item harga sudah dihapus.",
  },
  "price-action-failed": {
    tone: "error",
    title: "Harga belum berubah",
    message: "Data belum berubah. Coba lagi beberapa saat lagi.",
  },
  "transaction-added": {
    tone: "success",
    title: "Transaksi tercatat",
    message: "Transaksi sudah masuk ke laporan keuangan.",
  },
  "transaction-deleted": {
    tone: "success",
    title: "Transaksi dihapus",
    message: "Transaksi sudah dihapus dari laporan.",
  },
  "transaction-action-failed": {
    tone: "error",
    title: "Transaksi belum berubah",
    message: "Periksa isian dan coba lagi.",
  },
  "media-deleted": {
    tone: "success",
    title: "Media dihapus permanen",
    message: "Berkas sudah dibuang dari penyimpanan situs.",
  },
  "media-delete-failed": {
    tone: "error",
    title: "Media belum terhapus",
    message: "Berkas gagal dihapus. Coba lagi beberapa saat lagi.",
  },
  "settings-saved": {
    tone: "success",
    title: "Identitas tersimpan",
    message: "Nama brand, kontak, dan tautan sudah diperbarui di situs.",
  },
  "settings-save-failed": {
    tone: "error",
    title: "Identitas belum tersimpan",
    message: "Periksa isian dan koneksi, lalu coba simpan kembali.",
  },
};

export function AdminFeedback() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  const feedback = searchParams.get("feedback");
  const [dismissedFeedback, setDismissedFeedback] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<ConfirmationState | null>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const toast: ToastMessage | null = feedback
    ? FEEDBACK_MESSAGES[feedback] ?? {
        tone: feedback.endsWith("failed") ? "error" : "success",
        title: feedback.endsWith("failed") ? "Perubahan gagal" : "Perubahan tersimpan",
        message: feedback.endsWith("failed")
          ? "Data belum berubah. Coba lagi beberapa saat lagi."
          : "Perubahan sudah berhasil disimpan.",
      }
    : null;

  useEffect(() => {
    if (!feedback) {
      setDismissedFeedback(null);
      return;
    }

    const timeout = window.setTimeout(() => dismissToast(), 8000);
    return () => window.clearTimeout(timeout);
  }, [feedback, pathname, query]);

  useEffect(() => {
    const handleSubmit = (event: Event) => {
      const form = event.target;
      if (!(form instanceof HTMLFormElement) || !form.dataset.confirmMessage) {
        return;
      }

      if (form.dataset.confirmed === "true") {
        delete form.dataset.confirmed;
        return;
      }

      event.preventDefault();
      const submitEvent = event as SubmitEvent;
      const submitter =
        submitEvent.submitter instanceof HTMLButtonElement ||
        submitEvent.submitter instanceof HTMLInputElement
          ? submitEvent.submitter
          : null;

      returnFocusRef.current = submitter ?? (document.activeElement as HTMLElement);
      setConfirmation({
        form,
        submitter,
        title: form.dataset.confirmTitle || "Konfirmasi tindakan",
        message: form.dataset.confirmMessage,
        confirmLabel: form.dataset.confirmLabel || "Ya, lanjutkan",
        tone: form.dataset.confirmTone === "primary" ? "primary" : "danger",
      });
    };

    document.addEventListener("submit", handleSubmit, true);
    return () => document.removeEventListener("submit", handleSubmit, true);
  }, []);

  useEffect(() => {
    if (confirmation) {
      confirmButtonRef.current?.focus();
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }

    returnFocusRef.current?.focus();
    returnFocusRef.current = null;
    return undefined;
  }, [confirmation]);

  function closeConfirmation() {
    setConfirmation(null);
  }

  function dismissToast() {
    if (!feedback) return;
    setDismissedFeedback(feedback);

    const params = new URLSearchParams(window.location.search);
    params.delete("feedback");
    const cleanQuery = params.toString();
    window.history.replaceState(
      null,
      "",
      `${pathname}${cleanQuery ? `?${cleanQuery}` : ""}${window.location.hash}`,
    );
  }

  function confirmSubmit() {
    if (!confirmation) return;

    const { form, submitter } = confirmation;
    setConfirmation(null);
    window.setTimeout(() => {
      form.dataset.confirmed = "true";
      if (submitter) {
        form.requestSubmit(submitter);
      } else {
        form.requestSubmit();
      }
    }, 0);
  }

  function handleDialogKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeConfirmation();
      return;
    }

    if (event.key !== "Tab") return;
    const dialog = event.currentTarget;
    const focusable = Array.from(
      dialog.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    );
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <>
      {toast && dismissedFeedback !== feedback ? (
        <div
          className={`admin-toast admin-toast--${toast.tone}`}
          role={toast.tone === "error" ? "alert" : "status"}
          aria-live={toast.tone === "error" ? "assertive" : "polite"}
        >
          <span className="admin-toast__icon" aria-hidden="true">
            {toast.tone === "success" ? "✓" : "!"}
          </span>
          <span className="admin-toast__copy">
            <strong>{toast.title}</strong>
            <span>{toast.message}</span>
          </span>
          <button
            type="button"
            className="admin-toast__close"
            aria-label="Tutup notifikasi"
            onClick={dismissToast}
          >
            ×
          </button>
        </div>
      ) : null}

      {confirmation ? (
        <div
          className="admin-dialog-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeConfirmation();
          }}
        >
          <section
            className="admin-dialog"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="admin-dialog-title"
            aria-describedby="admin-dialog-message"
            onKeyDown={handleDialogKeyDown}
          >
            <span className="admin-dialog__eyebrow">Konfirmasi</span>
            <h2 id="admin-dialog-title">{confirmation.title}</h2>
            <p id="admin-dialog-message">{confirmation.message}</p>
            <div className="admin-dialog__actions">
              <button
                type="button"
                className="admin-btn"
                onClick={closeConfirmation}
              >
                Batal
              </button>
              <button
                ref={confirmButtonRef}
                type="button"
                className={
                  confirmation.tone === "danger"
                    ? "admin-btn admin-btn--danger"
                    : "admin-btn admin-btn--solid"
                }
                onClick={confirmSubmit}
              >
                {confirmation.confirmLabel}
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
