# Dokumentasi Project: Karya Alam — Landing Page

Dokumentasi ini merangkum seluruh struktur, komponen, alur, konfigurasi, dan rencana integrasi untuk project **Karya Alam — Landing Page** (batu alam, kolam, tebing, taman, dan landscape di Ngaglik, Sleman, Yogyakarta).

---

## 1. Ringkasan & Teknologi Utama
- **Framework:** Next.js (App Router, v16+) + TypeScript
- **Styling / Tampilan:** Menggunakan **Scroll-Craft** (`app/scrollcraft.css` dan `/scrollcraft.js`), sebuah runtime scroll-driven berbasis vanilla JS tanpa membuat DOM sendiri.
- **Font:** Archivo dan Geist
- **Sumber Data Katalog Batu:** Disimpan di `content/products.json` (dikelola lewat panel CMS).
- **Log Aktivitas CMS:** `content/audit-log.json`

---

## 2. Struktur Direktori Project

```text
app/
  layout.tsx             # Layout utama (font, metadata SEO, mount engine)
  page.tsx               # Halaman utama (menyusun bab I sampai VIII)
  globals.css            # Desain brand layer (token, warna, bab, dinding folio, piring kolam)
  scrollcraft.css        # Engine token & perangkat gerak (jangan diubah)
  icon.svg               # Favicon
  not-found.tsx          # Halaman 404
  robots.ts              # Konfigurasi robots.txt
  sitemap.ts             # Konfigurasi sitemap.xml
  admin/                 # Panel CMS (login, katalog, upload foto, actions)
  uploads/[...file]/     # Route dinamis penyaji foto unggahan runtime

components/
  chapters/              # Komponen per bab (Pangkalan, Layanan, Batu, Kolam, Proyek, Proses, Ulasan)
  layout/                # TitlePage (Hero), FolioWall (dinding batu kiri/chip), Colophon
  motion/                # ScrollCraftMount (engine runner)
  ui/                    # Elemen UI (ArrowIcon, ChapterHead, Cta, Wordmark, Lightbox, ReviewForm)
  admin/                 # Form login, form produk, delete product form

lib/
  chapters.ts            # Daftar bab (id, angka Romawi, judul, label nav)
  site.ts                # Identitas, alamat, kontak, sosial, URL
  types.ts               # Definisi tipe data konten
  services.ts            # Data layanan & foto kartu
  products.ts            # Pembacaan katalog untuk halaman publik
  catalog-seed.ts        # Seed data awal katalog
  cms/                   # Logika CMS (auth, git, product-input, products, storage)
  gallery.ts             # Data portofolio galeri
  reviews.ts             # Data ulasan pelanggan
  process-steps.ts       # Data alur kerja 4 langkah
  pond-layers.ts         # Data 6 lapis konstruksi kolam koi
  schema.ts              # JSON-LD LocalBusiness
  whatsapp.ts            # Pembuat tautan WhatsApp
  format-date.ts         # Format tanggal Indonesia

public/
  scrollcraft.js         # Engine vanilla scroll-craft
  images/                # Foto proyek & aset gambar pendukung
  uploads/               # Foto hasil unggahan panel CMS

content/
  products.json          # Sumber data katalog batu
  audit-log.json         # Log riwayat perubahan admin
```

---

## 3. Daftar Bab Halaman Publik (`lib/chapters.ts`)
1. **Bab I:** Pangkalan (`Pangkalan.tsx`) — Lokasi, fakta singkat, dan foto pangkalan.
2. **Bab II:** Layanan (`Layanan.tsx`) — 5 layanan utama.
3. **Bab III:** Batu (`Batu.tsx`) — Katalog batu alam (dari `products.json`).
4. **Bab IV:** Kolam (`Kolam.tsx`) — Penampang & 6 lapis struktur kolam koi.
5. **Bab V:** Proyek (`Proyek.tsx`) — Portofolio & Lightbox foto asli.
6. **Bab VI:** Proses (`Proses.tsx`) — 4 langkah kerja profesional.
7. **Bab VII:** Ulasan (`Ulasan.tsx`) — Testimoni & form kirim ulasan via WhatsApp.
8. **Bab VIII:** Colophon / Kontak — Kontak, alamat, dan masthead.

---

## 4. Panel Admin & CMS (`app/admin`)
- Berada di `/admin`.
- Memerlukan autentikasi sandi (default: `karyaalam`, dikonfigurasi lewat `ADMIN_PASSWORD` di `.env.local`).
- Mengelola penambahan, pengubahan, penghapusan, dan pengurutan barang di katalog batu.
- Menyimpan riwayat perubahan ke `content/audit-log.json`.

---

## 5. Rencana Integrasi Supabase
Untuk memindahkan atau menghubungkan penyimpanan katalog dan ulasan ke **Supabase**:
1. **Instalasi Paket:** `npm install @supabase/supabase-js`
2. **Environment Variables (`.env.local`):**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key # opsional untuk server actions
   ```
3. **Skema Tabel Database Supabase:**
   - Tabel `products`: `id`, `name`, `category`, `price`, `unit`, `description`, `image`, `featured`, `order_index`, `created_at`, `updated_at`
   - Tabel `reviews`: `id`, `name`, `rating`, `comment`, `created_at`
   - Tabel `audit_logs`: `id`, `action`, `details`, `created_at`
4. **Migrasi Data:** Mengunggah seed data dari `content/products.json` ke tabel `products` di Supabase, lalu memperbarui fungsi di `lib/cms/products.ts` dan `lib/products.ts` agar mengambil data dari Supabase alih-alih berkas JSON lokal.
