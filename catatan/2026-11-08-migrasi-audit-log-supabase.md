# Migrasi audit log ke Supabase

## Konteks
Audit log katalog sebelumnya ditulis ke `content/audit-log.json`. Di Vercel filesystem bersifat read-only, sehingga setiap simpan produk mencatat error:

```
EROFS: read-only file system, open '/var/task/content/audit-log.json...'
```

Error ini tidak menggagalkan simpan produk, tetapi audit log tidak pernah tersimpan di production.

## Keputusan atau temuan
- Tabel `audit_logs` sudah tersedia di project Supabase produksi.
- Audit log sekarang ditulis dan dibaca dari tabel tersebut.
- Pemetaan baris:
  - `id`: `audit-<waktu>-<acak>`
  - `timestamp`: waktu kejadian
  - `action`: `tambah`, `ubah`, `hapus`, atau `urutkan`
  - `details`: JSON `{ "product": "...", "detail": "..." }`
  - `ip`: belum diisi karena server action belum meneruskan alamat klien
- Empat catatan lama di `content/audit-log.json` dipindahkan ke Supabase.
- Kegagalan menulis audit tetap tidak menggagalkan aksi utama; error hanya dicatat di log server.

## Berkas yang berubah
- `lib/cms/audit.ts` (baru): `recordAudit` dan `getAuditLogs`.
- `lib/cms/products.ts`: audit memakai `recordAudit`, tidak lagi menulis berkas.
- `app/admin/(panel)/audit/page.tsx`: membaca `audit_logs` dari Supabase dan menampilkan produk, detail, serta waktu.
- `README.md`: catatan penyimpanan diperbarui.

## Verifikasi
Diuji di `next start` lokal:

- Halaman `/admin/audit` menampilkan 4 catatan lama dari Supabase.
- Tambah produk uji → baris `tambah` masuk ke `audit_logs`.
- Hapus produk uji → baris `hapus` masuk ke `audit_logs`.
- Data dan foto uji sudah dihapus; jumlah akhir 4 catatan lama.
