# Karya Alam — Landing Page

Landing page Karya Alam (batu alam, kolam, tebing, taman, dan landscape di Sleman,
Yogyakarta). Dibangun ulang dari `index.html` satu file menjadi project **Next.js
(App Router) + TypeScript** dengan tampilan dan warna yang sama.

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

## Struktur

```text
app/
  layout.tsx            # font, metadata SEO, viewport
  page.tsx              # menyusun seluruh section
  globals.css           # design token + seluruh style landing page
  icon.svg              # favicon
  not-found.tsx         # halaman 404
  robots.ts             # robots.txt
  sitemap.ts            # sitemap.xml

components/
  layout/
    Navbar.tsx          # navigasi + menu mobile
    Footer.tsx          # footer
  motion/
    ScrollReveal.tsx    # animasi muncul saat scroll
  sections/
    Hero.tsx            # hero + foto pangkalan
    Stats.tsx           # 4 angka kunci
    Services.tsx        # 5 layanan
    Catalog.tsx         # katalog 6 batu alam
    StoneGuide.tsx      # panduan RTA vs RTM
    Gallery.tsx         # portofolio + lightbox
    Process.tsx         # 4 langkah kerja
    Contact.tsx         # alamat & tautan kontak
    ReviewsPanel.tsx    # daftar ulasan
    ReviewForm.tsx      # form ulasan (kirim via WhatsApp)
  ui/
    ButtonLink.tsx      # tombol/link dengan varian
    SectionIntro.tsx    # eyebrow + judul + lead
    LogoMark.tsx        # logo SVG
    Lightbox.tsx        # dialog foto portofolio

lib/
  site.ts               # identitas, alamat, kontak, navigasi
  types.ts              # tipe data konten
  stats.ts              # data statistik
  services.ts           # data layanan
  products.ts           # data katalog batu
  stone-types.ts        # data RTA/RTM
  gallery.ts            # data portofolio
  reviews.ts            # data ulasan
  process-steps.ts      # data alur kerja
  contact-links.ts      # data tautan kontak
  schema.ts             # JSON-LD LocalBusiness
  whatsapp.ts           # pembuat tautan WhatsApp
  format-date.ts        # format tanggal Indonesia

public/images/          # 21 gambar hasil ekstraksi dari index.html lama
```

Setiap section dan setiap fungsi kecil punya file sendiri. Data konten tidak
ditulis di dalam komponen, jadi teks/harga/foto bisa diubah dari folder `lib/`
tanpa menyentuh layout.

## Konfigurasi

Identitas, alamat, nomor WhatsApp, dan tautan sosial ada di `lib/site.ts`.

Untuk URL produksi (dipakai metadata, sitemap, dan JSON-LD), buat file `.env.local`:

```bash
NEXT_PUBLIC_SITE_URL=https://domain-anda.com
```

Tanpa variabel itu, URL fallback ke `http://localhost:3000`.

## Catatan

- `index.html` lama tetap disimpan di folder induk sebagai arsip.
- Gambar base64 sudah dipindahkan ke `public/images/` dan dioptimalkan oleh
  `next/image` (AVIF/WebP).
- Form ulasan mengirim ulasan lewat WhatsApp karena project ini tidak memakai
  database. Jika nanti ingin ulasan tersimpan, ganti handler di
  `components/sections/ReviewForm.tsx` dengan API route.
- Dark mode mengikuti preferensi sistem, sama seperti versi HTML lama.
