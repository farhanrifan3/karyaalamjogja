# Unggah foto admin dipindah ke Supabase Storage

## Konteks
Semua fitur ganti foto di panel admin (katalog, layanan, hero, promo, profil, media library) gagal di Vercel dengan error:

```
ENOENT: no such file or directory, mkdir '/var/task/public'
```

Penyebabnya, foto baru ditulis ke `public/uploads` di filesystem. Di Vercel filesystem bersifat read-only dan tidak persisten.

## Keputusan atau temuan
- Foto baru sekarang disimpan di Supabase Storage, bucket publik `karya-alam-media`.
- Bucket dibuat dengan batas 4 MB dan tipe `image/jpeg`, `image/png`, `image/webp`, `image/avif`.
- Unggah dan hapus memakai service role di server; pembacaan memakai URL publik.
- Nama berkas selalu unik (`slug-waktu-acak.ext`), jadi foto baru tidak menimpa foto lama.
- Format dideteksi dari isi berkas (magic bytes), bukan hanya nama/ekstensi.
- `next.config.ts` diberi `remotePatterns` `*.supabase.co/storage/v1/object/public/**` agar `next/image` bisa menampilkan foto remote.
- Foto lama di `/images` dan `/uploads` tetap didukung dan tetap muncul di media library.

## Berkas yang berubah
- `lib/cms/media.ts` (baru): `uploadImage`, `saveUpload`, `deleteMedia`, `assertImageExists`, `listLibraryImages`.
- `lib/cms/products.ts`: fungsi media lama dihapus, di-re-export dari `media.ts`.
- `lib/cms/services.ts`: unggah layanan memakai `uploadImage`.
- `app/admin/media-actions.ts`: hapus media memakai `deleteMedia`/`isManagedImage`.
- `lib/cms/product-input.ts`: `IMAGE_PATTERN` menerima URL Supabase bucket.
- `components/admin/ProductForm.tsx`: label galeri "Baru:" juga untuk foto Supabase.
- `next.config.ts`: `remotePatterns` Supabase.

## Verifikasi
Diuji end-to-end lewat server action pada `next start` lokal:

| Fitur | Hasil |
| --- | --- |
| Katalog (tambah produk + foto) | 303 `product-added`, URL Supabase tersimpan |
| Layanan | 303 `service-saved`, URL Supabase tersimpan |
| Promo | 303 `promo-saved`, URL Supabase tersimpan |
| Hero | 303 `hero-saved`, URL Supabase tersimpan |
| Profil | 303 `profile-saved`, URL Supabase tersimpan |
| Hapus media | 303 `media-deleted`, berkas hilang dari bucket |

Foto uji bisa diakses publik (HTTP 200) dan muncul di `/admin/media`. Semua data serta foto uji sudah dihapus dan data hero/profil asli dipulihkan.

## Langkah berikutnya
Bila ingin audit log juga persisten di Vercel, aktifkan `CMS_STORAGE=github` beserta `GITHUB_TOKEN` dan `GITHUB_REPO`. Audit log masih memakai filesystem.
