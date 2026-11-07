# Migrasi modul Keuangan dan Harga ke Supabase

## Konteks
Modul Keuangan (`lib/cms/finance.ts`) dan Harga (`lib/cms/prices.ts`) sebelumnya membaca/menulis berkas JSON di `content/`. Di Vercel filesystem bersifat read-only, sehingga transaksi dan harga gagal disimpan.

## Keputusan atau temuan
- Tabel `finance_settings` dan `finance_transactions` sudah tersedia di project Supabase produksi.
- Belum ada tabel `prices` khusus. Harga master disimpan sebagai baris `hero_promo` dengan `type = "price"`.
- Pemetaan harga: `title` = nama item, `label` = kategori, `alt` = satuan, `harga_normal` = harga beli, `harga_promo` = harga jual, `description` = catatan, `urutan` = urutan tampil.
- Query publik selalu memfilter `type` (`hero`, `promo`, atau `settings`), jadi baris harga tidak ikut tampil di situs.

## Alasan
Memakai tabel yang sudah ada menghindari perubahan skema yang tidak bisa dijalankan lewat REST API. Struktur per baris juga membuat tambah/ubah/hapus harga lebih aman daripada menyimpan satu blob JSON.

## Langkah berikutnya
Bila akses SQL/dashboard Supabase tersedia, buat tabel `prices` khusus lalu pindahkan baris `hero_promo` bertipe `price` ke tabel tersebut. Setelah itu ubah `lib/cms/prices.ts` agar memakai tabel baru.
