# Karya Alam — Landing Page

Landing page Karya Alam (batu alam, kolam, tebing, taman, dan landscape di
Ngaglik, Sleman, Yogyakarta) sebagai **Next.js (App Router) + TypeScript**.

Tampilan memakai **scroll-craft**: runtime scroll-driven berbasis vanilla JS
yang tidak membuat DOM sendiri. Halaman ditulis sebagai HTML semantik biasa,
lalu diberi penanda `data-sc-*`; engine membaca penanda itu dan menggerakkannya
dari satu nilai scroll di satu loop `requestAnimationFrame`.

## Menjalankan

```bash
npm install
npm run dev
```

Buka <http://localhost:3000>.

Perintah lain:

```bash
npm run build      # build produksi
npm run start      # jalankan hasil build
npm run typecheck  # cek TypeScript
```

## Dua lapis gaya

| Lapis | Berkas | Boleh diubah? |
| --- | --- | --- |
| Engine | `app/scrollcraft.css`, `public/scrollcraft.js` | Tidak. Ini mekanisme, bukan tema. |
| Brand | `app/globals.css`, markup komponen | Ya. Semua identitas visual ada di sini. |

`app/scrollcraft.css` hanya menyediakan token (warna, skala tipe, spasi,
elevasi, motion) dan perangkat gerak. `app/globals.css` menimpa token dengan
palet Karya Alam, lalu menyusun bab-bab halaman. Kelas `data-sc-*` dan
`.sc-stage/.sc-copy` tidak pernah di-restyle.

## Struktur

```text
app/
  layout.tsx             # font Archivo + Geist, metadata SEO, mount engine
  page.tsx               # menyusun delapan bab
  globals.css            # brand layer: token, bab, dinding folio, piring kolam
  scrollcraft.css        # token + device milik engine (jangan diedit)
  icon.svg               # favicon
  not-found.tsx          # halaman 404
  robots.ts              # robots.txt
  sitemap.ts             # sitemap.xml
  admin/                 # panel CMS (login, katalog, unggah foto)
    admin.css            # gaya panel; tidak dimuat di halaman publik
    actions.ts           # server action: login, simpan, hapus, urutkan
    login/               # halaman masuk
    (panel)/katalog/     # daftar + form tambah/ubah barang
  uploads/[...file]/     # route penyaji foto unggahan saat runtime

components/
  chapters/              # satu berkas per bab
    Pangkalan.tsx        # I   — pangkalan, foto, fakta singkat
    Layanan.tsx          # II  — lima layanan
    Batu.tsx             # III — katalog batu dari content/products.json
    Kolam.tsx            # IV  — potongan kolam + enam lapis
    Proyek.tsx           # V   — portofolio + lightbox
    Proses.tsx           # VI  — empat langkah kerja
    Ulasan.tsx           # VII — ulasan + form
  layout/
    TitlePage.tsx        # halaman judul (hero) + indeks bab
    FolioWall.tsx        # dinding batu di margin kiri (desktop) dan chip (mobile)
    Colophon.tsx         # bab VIII: kontak + masthead
  motion/
    ScrollCraftMount.tsx # memasang engine dari /public/scrollcraft.js
  ui/
    ArrowIcon.tsx, ChapterHead.tsx, Cta.tsx, Wordmark.tsx
    Lightbox.tsx         # dialog foto portofolio
    ReviewForm.tsx       # form ulasan (kirim via WhatsApp)
  admin/
    LoginForm.tsx        # form masuk panel
    ProductForm.tsx      # form tambah/ubah barang + unggah foto
    DeleteProductForm.tsx

lib/
  chapters.ts            # daftar bab: id, angka Romawi, judul, label nav
  site.ts                # identitas, alamat, kontak, sosial, URL
  types.ts               # tipe data konten
  services.ts            # data layanan + foto kartu
  products.ts            # pembacaan katalog untuk halaman publik
  catalog-seed.ts        # isi awal katalog bila content/ belum ada
  cms/
    products.ts          # baca/tulis content/products.json + unggah foto
    product-input.ts     # aturan validasi field (dipakai klien + server)
    auth.ts              # sesi admin (cookie bertanda tangan)
    git.ts               # commit konten opsional (CMS_GIT_COMMIT=1)
  gallery.ts             # data portofolio
  reviews.ts             # data ulasan
  process-steps.ts       # data alur kerja
  pond-layers.ts         # data enam lapis kolam + geometri gambar
  schema.ts              # JSON-LD LocalBusiness
  whatsapp.ts            # pembuat tautan WhatsApp
  format-date.ts         # format tanggal Indonesia

public/
  scrollcraft.js         # engine (vanilla, tanpa dependensi)
  images/                # 21 foto proyek + foto stok CC0 untuk hero/kartu
  uploads/               # foto yang diunggah lewat panel CMS

content/
  products.json          # cadangan/seed lama; katalog aktif ada di Supabase
  audit-log.json         # riwayat tambah/ubah/hapus/urutkan (dibuat otomatis)
```

Menambah, menghapus, atau mengurutkan bab dimulai dari `lib/chapters.ts`.
Dinding folio, indeks di halaman judul, dan menu mobile membaca daftar yang
sama, jadi urutannya otomatis ikut. Nomor bab juga dipakai sebagai tinggi
dinding, jadi jangan lompati angka Romawinya.

## Mengubah konten

Teks, harga, foto, dan tautan tidak ditulis di dalam komponen. Semuanya ada di
`lib/`, dengan `lib/site.ts` untuk identitas dan kontak. Satu bab = satu
komponen di `components/chapters/`.

Katalog batu, layanan, testimoni, hero/promo, identitas situs, keuangan, dan
harga master dikelola lewat panel CMS dan disimpan di Supabase. Berkas di
`content/` hanya menjadi cadangan/seed lama.

## CMS katalog

Panel admin ada di <http://localhost:3000/admin>. Dari sini pemilik usaha bisa
menambah barang, mengubah keterangan, mengunggah foto, memilih foto lama, dan
mengatur urutan tanpa membuka kode.

- Masuk dengan kata sandi. Tanpa konfigurasi, sandi awal adalah `karyaalam`
  (petunjuknya hanya tampil di mode pengembangan). Ganti lewat
  `ADMIN_PASSWORD` sebelum dipakai di server.
- Sesi disimpan di cookie `httpOnly` selama 8 jam; percobaan masuk dibatasi
  6 kali per 10 menit.
- Setiap barang wajib punya foto dan teks alternatif. Foto yang diganti tidak
  dihapus: berkas lama tetap ada di `public/images/` atau `public/uploads/`
  dan bisa dipilih lagi.
- Foto unggahan disajikan lewat route `/uploads/[...file]` karena berkas yang
  dibuat setelah build tidak masuk manifes statis Next.
- Perubahan katalog disimpan ke tabel `products` di Supabase dan dicatat di
  tabel `audit_logs` (tambah/ubah/hapus/urutkan). Halaman publik direvalidasi
  otomatis setelah simpan.
- Modul keuangan memakai tabel `finance_settings` dan `finance_transactions`.
- Harga master memakai tabel `hero_promo` dengan `type = "price"` selama tabel
  `prices` khusus belum tersedia.
- Set `CMS_GIT_COMMIT=1` bila ingin perubahan berkas di `content/` otomatis
  menjadi commit git. Audit log tidak lagi memakai berkas.

### Penyimpanan dan deploy

Data konten, keuangan, harga, foto unggahan, dan audit log tersimpan di
Supabase sehingga tetap persisten di Vercel. Foto baru masuk ke bucket publik
`karya-alam-media` melalui Supabase Storage, sedangkan audit log masuk ke tabel
`audit_logs`. Berkas di `content/` hanya menjadi cadangan/seed lama. Halaman
publik sendiri tetap statis dan tidak memuat JavaScript CMS.

### Konfigurasi panel

Tambahkan ke `.env.local`:

```bash
ADMIN_PASSWORD=sandi-yang-kuat
ADMIN_SESSION_SECRET=string-acak-panjang-minimal-32-karakter
# opsional: commit otomatis perubahan konten
CMS_GIT_COMMIT=1
```

## Konfigurasi

Untuk URL produksi (metadata, sitemap, JSON-LD), buat `.env.local`:

```bash
NEXT_PUBLIC_SITE_URL=https://karyaalamjogja.com
KA_SUPABASE_URL=https://your-project.supabase.co
KA_SUPABASE_ANON_KEY=your-supabase-anon-key
KA_SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

`KA_SUPABASE_*` diutamakan. Variabel lama `NEXT_PUBLIC_SUPABASE_URL`,
`NEXT_PUBLIC_SUPABASE_ANON_KEY`, dan `SUPABASE_SERVICE_ROLE_KEY` tetap
didukung sebagai cadangan. Di Vercel, pastikan ketiga variabel `KA_SUPABASE_*`
menunjuk ke project Supabase yang berisi data produksi — bukan project kosong
hasil integrasi marketplace.

Tanpa variabel itu, URL fallback ke `https://karyaalamjogja.com`.

## Catatan

- `index.html` lama tetap disimpan di folder induk sebagai arsip.
- Foto sudah dipindahkan ke `public/images/` dan dioptimalkan oleh
  `next/image` (AVIF/WebP). Lightbox memakai berkas asli (`unoptimized`)
  supaya tidak menunggu optimasi saat diklik.
- Gambar hero (`hero-garden.jpg`) adalah ilustrasi taman Jepang, bukan foto
  proyek; keterangannya di halaman judul menyebut hal itu. Sebagian kartu
  layanan masih memakai stok CC0 dari Openverse (pd.w.org, rawpixel,
  stocksnap) tanpa atribusi. Foto pekerjaan dan batu tetap foto asli Karya
  Alam.
- Form ulasan mengirim ulasan lewat WhatsApp karena project ini tidak memakai
  database. Jika nanti ingin ulasan tersimpan, ganti handler di
  `components/ui/ReviewForm.tsx` dengan API route.
- Halaman bergantian antara ground gelap dan terang. Setiap bab menetapkan
  sendiri `ground--dark` atau `ground--light`; token warna diteruskan ke
  seluruh isinya.
- Animasi menghormati `prefers-reduced-motion`: gerak posisi dihentikan,
  konten tetap tampil dalam keadaan akhir. Tanpa JavaScript, fallback
  `<noscript>` di `app/layout.tsx` membuka semua elemen yang tersembunyi.
