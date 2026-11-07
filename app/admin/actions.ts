"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";

import {
  checkPassword,
  clearFailures,
  clientKey,
  endSession,
  isAdmin,
  isRateLimited,
  rateLimitMinutes,
  registerFailure,
  startSession,
} from "@/lib/cms/auth";
import {
  assertImageExists,
  createProduct,
  deleteProduct,
  moveProduct,
  saveUpload,
  updateProduct,
} from "@/lib/cms/products";
import {
  cleanText,
  validateProductDraft,
  type ProductDraft,
  type ProductFieldErrors,
} from "@/lib/cms/product-input";
import { CONTENT_TAG } from "@/lib/cms/storage";
import { redirectWithAdminFeedback } from "@/lib/cms/admin-feedback";

export type LoginState = {
  error?: string;
};

export type ProductFormState = {
  message?: string;
  errors?: ProductFieldErrors;
  values?: Partial<ProductDraft>;
};

export async function loginAction(
  _previous: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const key = await clientKey();

  if (isRateLimited(key)) {
    return {
      error: `Terlalu banyak percobaan. Coba lagi dalam ${rateLimitMinutes()} menit.`,
    };
  }

  const password = String(formData.get("password") ?? "");

  if (!password) {
    return { error: "Kata sandi belum diisi." };
  }

  if (!checkPassword(password)) {
    registerFailure(key);
    return { error: "Kata sandi salah." };
  }

  clearFailures(key);
  await startSession();
  redirect("/admin/katalog");
}

export async function logoutAction(): Promise<void> {
  await endSession();
  redirect("/admin/login");
}

export async function saveProductAction(
  _previous: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  if (!(await isAdmin())) {
    redirect("/admin/login");
  }

  const id = String(formData.get("id") ?? "").trim();
  const draft: ProductDraft = {
    categoryId: cleanText(formData.get("categoryId")),
    name: cleanText(formData.get("name")),
    description: cleanText(formData.get("description")),
    use: cleanText(formData.get("use")),
    character: cleanText(formData.get("character")),
    label: cleanText(formData.get("label")),
    status: cleanText(formData.get("status")) || "tampil",
    sizes: String(formData.get("sizes") ?? "").trim(),
    image: String(formData.get("imagePath") ?? "").trim(),
    alt: cleanText(formData.get("alt")),
  };

  const file = formData.get("imageFile");
  if (file instanceof File && file.size > 0) {
    try {
      draft.image = await saveUpload(file);
    } catch (error) {
      return {
        message: "Foto gagal diunggah.",
        errors: {
          image:
            error instanceof Error ? error.message : "Foto gagal diunggah.",
        },
        values: draft,
      };
    }
  }

  const errors = validateProductDraft(draft);
  if (Object.keys(errors).length > 0) {
    return {
      message: "Periksa kembali isian yang ditandai.",
      errors,
      values: draft,
    };
  }

  try {
    await assertImageExists(draft.image);
  } catch {
    return {
      message: "Foto yang dipilih tidak ditemukan.",
      errors: { image: "Pilih foto lain dari galeri atau unggah foto baru." },
      values: draft,
    };
  }

  try {
    if (id) {
      await updateProduct(id, draft);
    } else {
      await createProduct(draft);
    }
  } catch (error) {
    return {
      message:
        error instanceof Error
          ? error.message
          : "Barang gagal disimpan. Coba lagi.",
      values: draft,
    };
  }

  updateTag(CONTENT_TAG);
  revalidatePath("/");
  revalidatePath("/katalog");
  revalidatePath("/admin/katalog");
  redirectWithAdminFeedback(
    "/admin/katalog",
    id ? "product-updated" : "product-added",
  );
}

export async function deleteProductAction(formData: FormData): Promise<void> {
  if (!(await isAdmin())) {
    redirect("/admin/login");
  }

  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    redirect("/admin/katalog");
  }

  let deleteFailed = false;
  try {
    await deleteProduct(id);
  } catch {
    deleteFailed = true;
  }

  if (deleteFailed) {
    redirectWithAdminFeedback("/admin/katalog", "product-delete-failed");
  }

  updateTag(CONTENT_TAG);
  revalidatePath("/");
  revalidatePath("/katalog");
  revalidatePath("/admin/katalog");
  redirectWithAdminFeedback("/admin/katalog", "product-deleted");
}

export async function moveProductAction(formData: FormData): Promise<void> {
  if (!(await isAdmin())) {
    redirect("/admin/login");
  }

  const id = String(formData.get("id") ?? "").trim();
  const direction = formData.get("direction") === "up" ? "up" : "down";

  if (id) {
    let moveFailed = false;
    try {
      await moveProduct(id, direction);
    } catch {
      moveFailed = true;
    }
    if (moveFailed) {
      redirectWithAdminFeedback("/admin/katalog", "product-order-failed");
    }
    updateTag(CONTENT_TAG);
    revalidatePath("/");
    revalidatePath("/katalog");
    revalidatePath("/admin/katalog");
    redirectWithAdminFeedback("/admin/katalog", "product-order-updated");
  }

  redirect("/admin/katalog");
}
