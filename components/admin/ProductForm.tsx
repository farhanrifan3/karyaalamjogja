"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";

import { saveProductAction, type ProductFormState } from "@/app/admin/actions";
import type { LibraryImage } from "@/lib/cms/products";
import type { Product } from "@/lib/types";
import { PRODUCT_LIMITS } from "@/lib/cms/product-input";

type ProductFormProps = {
  product: Product | null;
  library: LibraryImage[];
};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="admin-btn admin-btn--solid"
      disabled={pending}
    >
      {pending ? "Menyimpan..." : label}
    </button>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <p className="admin-field__error" id={id} role="alert">
      {message}
    </p>
  );
}

export function ProductForm({ product, library }: ProductFormProps) {
  const [state, formAction] = useActionState<ProductFormState, FormData>(
    saveProductAction,
    {},
  );

  const [imagePath, setImagePath] = useState(product?.image ?? "");
  const [preview, setPreview] = useState(product?.image ?? "");
  const [fileName, setFileName] = useState("");
  const [descriptionLength, setDescriptionLength] = useState(
    product?.description.length ?? 0,
  );

  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!preview.startsWith("blob:")) {
      return;
    }

    return () => {
      URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // Bila server sudah menyimpan foto tetapi isian lain gagal, pakai path
  // hasil unggahan supaya foto tidak diunggah dua kali saat mencoba lagi.
  useEffect(() => {
    const savedImage = state.values?.image;

    if (!savedImage || state.errors?.image || savedImage === imagePath) {
      return;
    }

    setImagePath(savedImage);
    setPreview(savedImage);
    setFileName("");

    if (fileInput.current) {
      fileInput.current.value = "";
    }
  }, [state, imagePath]);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      setFileName("");
      setPreview(imagePath);
      return;
    }

    setFileName(file.name);
    setPreview(URL.createObjectURL(file));
  }

  function handleLibraryChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const value = event.target.value;
    setImagePath(value);
    setPreview(value);
    setFileName("");

    if (fileInput.current) {
      fileInput.current.value = "";
    }
  }

  const errors = state.errors ?? {};
  const libraryValue = library.some((image) => image.path === imagePath)
    ? imagePath
    : "";

  return (
    <form action={formAction} className="admin-panel admin-form-wrap">
      {product ? <input type="hidden" name="id" value={product.id} /> : null}
      <input type="hidden" name="imagePath" value={imagePath} />

      {state.message ? (
        <p className="admin-alert" role="alert">
          {state.message}
        </p>
      ) : null}

      <div className="admin-form">
        <div className="admin-fields">
          <div className="admin-field">
            <label htmlFor="name">Nama barang</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              maxLength={PRODUCT_LIMITS.name}
              defaultValue={product?.name ?? ""}
              placeholder="Contoh: Batu Andesit Bakar"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "name-error" : "name-hint"}
            />
            <p className="admin-field__hint" id="name-hint">
              Nama yang tampil di kartu katalog.
            </p>
            <FieldError id="name-error" message={errors.name} />
          </div>

          <div className="admin-field">
            <label htmlFor="description">Deskripsi singkat</label>
            <textarea
              id="description"
              name="description"
              required
              rows={3}
              maxLength={PRODUCT_LIMITS.description}
              defaultValue={product?.description ?? ""}
              placeholder="Satu atau dua kalimat tentang warna, tekstur, dan kesan batu."
              onChange={(event) => setDescriptionLength(event.target.value.length)}
              aria-invalid={Boolean(errors.description)}
              aria-describedby={
                errors.description ? "description-error" : "description-hint"
              }
            />
            <p className="admin-field__hint" id="description-hint">
              {descriptionLength}/{PRODUCT_LIMITS.description} karakter.
            </p>
            <FieldError id="description-error" message={errors.description} />
          </div>

          <div className="admin-fields__pair">
            <div className="admin-field">
              <label htmlFor="use">Dipakai untuk</label>
              <input
                id="use"
                name="use"
                type="text"
                required
                maxLength={PRODUCT_LIMITS.use}
                defaultValue={product?.use ?? ""}
                placeholder="Dinding, lantai, fasad"
                aria-invalid={Boolean(errors.use)}
                aria-describedby={errors.use ? "use-error" : undefined}
              />
              <FieldError id="use-error" message={errors.use} />
            </div>

            <div className="admin-field">
              <label htmlFor="character">Sifat / karakter</label>
              <input
                id="character"
                name="character"
                type="text"
                required
                maxLength={PRODUCT_LIMITS.character}
                defaultValue={product?.character ?? ""}
                placeholder="Keras, gelap, tahan lama"
                aria-invalid={Boolean(errors.character)}
                aria-describedby={errors.character ? "character-error" : undefined}
              />
              <FieldError id="character-error" message={errors.character} />
            </div>
          </div>

          <div className="admin-field">
            <label htmlFor="alt">Teks alternatif foto</label>
            <input
              id="alt"
              name="alt"
              type="text"
              required
              maxLength={PRODUCT_LIMITS.alt}
              defaultValue={product?.alt ?? ""}
              placeholder="Contoh: Batu andesit gelap dengan permukaan kasar"
              aria-invalid={Boolean(errors.alt)}
              aria-describedby={errors.alt ? "alt-error" : "alt-hint"}
            />
            <p className="admin-field__hint" id="alt-hint">
              Dibaca mesin pencari dan pembaca layar. Jelaskan foto apa adanya.
            </p>
            <FieldError id="alt-error" message={errors.alt} />
          </div>
        </div>

        <aside className="admin-photo" aria-label="Foto barang">
          <div className="admin-photo__frame">
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="" />
            ) : (
              <p className="admin-photo__empty">
                Belum ada foto.
                <span>Unggah baru atau pilih dari galeri di bawah.</span>
              </p>
            )}
          </div>

          <div className="admin-field">
            <label htmlFor="imageFile">Unggah foto baru</label>
            <input
              ref={fileInput}
              id="imageFile"
              name="imageFile"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={handleFileChange}
              aria-describedby={errors.image ? "image-error" : "image-hint"}
            />
            <p className="admin-field__hint" id="image-hint">
              JPG, PNG, WebP, atau AVIF. Maksimal 4 MB. Foto baru disimpan
              tanpa menimpa foto lama.
            </p>
            <FieldError id="image-error" message={errors.image} />
          </div>

          <div className="admin-field">
            <label htmlFor="library">Atau pilih foto yang sudah ada</label>
            <select
              id="library"
              value={libraryValue}
              onChange={handleLibraryChange}
            >
              <option value="">Pilih dari galeri</option>
              {library.map((image) => (
                <option key={image.path} value={image.path}>
                  {image.path.startsWith("/uploads/") ? "Baru: " : ""}
                  {image.label}
                </option>
              ))}
            </select>
          </div>

          <p className="admin-photo__path">
            {fileName
              ? `Akan diunggah: ${fileName}`
              : imagePath || "Belum ada foto terpilih"}
          </p>
        </aside>
      </div>

      <div className="admin-form__actions">
        <Link href="/admin/katalog" className="admin-btn">
          Batal
        </Link>
        <SubmitButton label={product ? "Simpan perubahan" : "Tambah ke katalog"} />
      </div>
    </form>
  );
}
