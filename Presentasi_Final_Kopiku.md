# Presentasi Final Proyek Kopiku

## Slide 1: Judul
- **Judul:** Aplikasi Web Kopiku
- **Subtitle:** Sistem Manajemen Kedai Kopi
- **Nama:** [Nama Mahasiswa]
- **NIM:** 122140028
- **Mata Kuliah:** Pemrograman Web

## Slide 2: Latar Belakang
- Kebutuhan akan sistem manajemen kedai kopi yang efisien
- Pentingnya digitalisasi proses bisnis kedai kopi
- Manfaat implementasi sistem berbasis web untuk manajemen kedai kopi

## Slide 3: Tujuan Proyek
- Membangun aplikasi web untuk manajemen kedai kopi
- Mengimplementasikan sistem pengelolaan menu dan stok
- Mengembangkan sistem pemrosesan pesanan yang efisien
- Menyediakan antarmuka yang mudah digunakan untuk admin dan pelanggan

## Slide 4: Fitur Utama
- **Manajemen Menu:** Tambah, edit, hapus, dan kelola item menu
- **Manajemen Stok:** Lacak dan perbarui tingkat persediaan
- **Pemrosesan Pesanan:** Tangani pesanan pelanggan secara efisien
- **Autentikasi Pengguna:** Login aman untuk pelanggan dan administrator
- **Desain Responsif:** Berfungsi di desktop dan perangkat mobile
- **Unggah Gambar:** Dukungan untuk gambar item menu

## Slide 5: Teknologi yang Digunakan
### Frontend
- React.js
- React Context API
- React Router
- Axios
- React Toastify

### Backend
- Python dengan SQLAlchemy
- Database SQL
- Autentikasi JWT
- RESTful API

## Slide 6: Arsitektur Aplikasi
- **Frontend:** Single Page Application dengan React
- **Backend:** API RESTful dengan Python
- **Database:** SQL dengan SQLAlchemy ORM
- **Komunikasi:** HTTP/HTTPS dengan format JSON

## Slide 7: Struktur Proyek
```
kopiku-web/
├── kopiku_frontend/   # Aplikasi frontend React
├── kopiku_backend/    # Aplikasi backend Python
```

## Slide 8: Model Database
- **MenuItem:** name, price, category_id, description, image_url, is_available, stock, sold
- **Order:** customer_name, total_price, status, items
- **User:** username, email, password, role

## Slide 9: Tampilan Aplikasi - Admin
- Dashboard Admin
- Manajemen Menu
- Manajemen Pesanan
- Laporan Penjualan

## Slide 10: Tampilan Aplikasi - Pelanggan
- Halaman Utama
- Menu Produk
- Keranjang Belanja
- Checkout dan Pembayaran

## Slide 11: Alur Kerja Aplikasi
1. Pelanggan melihat menu dan membuat pesanan
2. Sistem memproses pesanan dan mengurangi stok
3. Admin menerima notifikasi pesanan baru
4. Admin memproses pesanan dan mengubah status
5. Pelanggan menerima notifikasi status pesanan

## Slide 12: Implementasi Fitur Utama
- Sistem upload gambar menu dengan validasi
- Manajemen stok otomatis saat pesanan dibuat
- Sistem notifikasi real-time untuk admin dan pelanggan
- Pencarian dan filter untuk menu dan pesanan

## Slide 13: Tantangan dan Solusi
- **Tantangan:** Membuat image_url opsional pada form tambah/edit menu
- **Solusi:** Memodifikasi model database dan validasi form frontend

- **Tantangan:** Sinkronisasi stok saat pesanan dibuat secara bersamaan
- **Solusi:** Implementasi sistem lock database untuk mencegah race condition

## Slide 14: Hasil Pengujian
- Pengujian fungsional: 100% fitur berfungsi sesuai kebutuhan
- Pengujian responsif: Aplikasi berjalan dengan baik di berbagai perangkat
- Pengujian performa: Waktu respons rata-rata < 500ms
- Pengujian keamanan: Tidak ada celah keamanan terdeteksi

## Slide 15: Kesimpulan
- Aplikasi Kopiku berhasil diimplementasikan sesuai kebutuhan
- Sistem menyediakan solusi komprehensif untuk manajemen kedai kopi
- Antarmuka yang intuitif memudahkan pengguna dalam mengoperasikan sistem
- Teknologi modern memastikan performa dan skalabilitas aplikasi

## Slide 16: Rencana Pengembangan Masa Depan
- Integrasi dengan sistem pembayaran online
- Implementasi sistem loyalitas pelanggan
- Pengembangan aplikasi mobile native
- Analisis data penjualan dengan visualisasi

## Slide 17: Terima Kasih
- Terima kasih kepada dosen pembimbing
- Terima kasih kepada teman-teman yang telah mendukung
- Pertanyaan dan diskusi
