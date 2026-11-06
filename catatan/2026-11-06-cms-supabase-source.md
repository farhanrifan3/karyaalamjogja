# CMS memakai Supabase sebagai sumber konten publik

## Konteks
CMS Karya Alam sebelumnya mencampur pembacaan berkas JSON dengan penyimpanan Supabase. Halaman publik sudah membaca tabel Supabase, sehingga perubahan di CMS bisa gagal atau tidak terlihat selaras.

## Keputusan atau temuan
Tabel `services`, `products`, `categories`, `hero_promo`, `profil`, `reviews`, dan `gallery` sudah tersedia dan memuat konten. Pembacaan publik memakai kunci anon dan kebijakan RLS; perubahan CMS memakai klien server dengan `SUPABASE_SERVICE_ROLE_KEY` setelah sesi admin diverifikasi.

## Alasan
Kebijakan database mengizinkan publik membaca konten dan mengirim ulasan, tetapi tidak mengizinkan publik mengubah konten CMS. Menggunakan kunci publik untuk aksi admin membuat perubahan gagal tanpa pesan.

## Langkah berikutnya
Pastikan `SUPABASE_SERVICE_ROLE_KEY` tersedia di environment server Vercel. Jalankan typecheck setelah dependency proyek tersedia. Berkas gambar dan audit katalog tetap menggunakan penyimpanan file yang sudah ada.
