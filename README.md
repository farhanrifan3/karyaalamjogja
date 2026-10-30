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

components/
  chapters/              # satu berkas per bab
    Pangkalan.tsx        # I   — pangkalan, foto, fakta singkat
    Layanan.tsx          # II  — lima layanan
    Batu.tsx             # III — enam batu alam
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

lib/
  chapters.ts            # daftar bab: id, angka Romawi, judul, label nav
  site.ts                # identitas, alamat, kontak, sosial, URL
  types.ts               # tipe data konten
  services.ts            # data layanan
  products.ts            # data enam batu
  gallery.ts             # data portofolio
  reviews.ts             # data ulasan
  process-steps.ts       # data alur kerja
  pond-layers.ts         # data enam lapis kolam + geometri gambar
  schema.ts              # JSON-LD LocalBusiness
  whatsapp.ts            # pembuat tautan WhatsApp
  format-date.ts         # format tanggal Indonesia

public/
  scrollcraft.js         # engine (vanilla, tanpa dependensi)
  images/                # 21 foto dari index.html lama
```

Menambah, menghapus, atau mengurutkan bab dimulai dari `lib/chapters.ts`.
Dinding folio, indeks di halaman judul, dan menu mobile membaca daftar yang
sama, jadi urutannya otomatis ikut. Nomor bab juga dipakai sebagai tinggi
dinding, jadi jangan lompati angka Romawinya.

## Mengubah konten

Teks, harga, foto, dan tautan tidak ditulis di dalam komponen. Semuanya ada di
`lib/`, dengan `lib/site.ts` untuk identitas dan kontak. Satu bab = satu
komponen di `components/chapters/`.

## Konfigurasi

Untuk URL produksi (metadata, sitemap, JSON-LD), buat `.env.local`:

```bash
NEXT_PUBLIC_SITE_URL=https://karyaalamjogja.com
```

Tanpa variabel itu, URL fallback ke `https://karyaalamjogja.com`.

## Catatan

- `index.html` lama tetap disimpan di folder induk sebagai arsip.
- Foto sudah dipindahkan ke `public/images/` dan dioptimalkan oleh
  `next/image` (AVIF/WebP). Lightbox memakai berkas asli (`unoptimized`)
  supaya tidak menunggu optimasi saat diklik.
- Form ulasan mengirim ulasan lewat WhatsApp karena project ini tidak memakai
  database. Jika nanti ingin ulasan tersimpan, ganti handler di
  `components/ui/ReviewForm.tsx` dengan API route.
- Halaman bergantian antara ground gelap dan terang. Setiap bab menetapkan
  sendiri `ground--dark` atau `ground--light`; token warna diteruskan ke
  seluruh isinya.
- Animasi menghormati `prefers-reduced-motion`: gerak posisi dihentikan,
  konten tetap tampil dalam keadaan akhir. Tanpa JavaScript, fallback
  `<noscript>` di `app/layout.tsx` membuka semua elemen yang tersembunyi.
