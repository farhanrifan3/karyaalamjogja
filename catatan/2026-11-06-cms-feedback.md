# Pola feedback untuk CMS Karya Alam

## Konteks
Form CMS sebelumnya memberi status simpan yang berbeda-beda, dan sebagian aksi hapus memakai dialog bawaan browser.

## Keputusan atau temuan
Panel admin memakai satu `AdminFeedback` untuk modal konfirmasi dan toast sukses/gagal, serta `AdminSubmitButton` untuk status menunggu. Form hapus menandai pesan konfirmasi lewat atribut data; aksi server mengirim kode feedback setelah berhasil atau gagal.

## Alasan
Satu pola menjaga perilaku yang mudah dikenali di seluruh halaman, termasuk tombol di layar kecil, tanpa menambah dependency UI.

## Langkah berikutnya
Saat menambah aksi CMS, beri kode feedback di server action dan pesan pasangannya di `components/admin/AdminFeedback.tsx`. Aksi hapus perlu atribut konfirmasi pada form.
