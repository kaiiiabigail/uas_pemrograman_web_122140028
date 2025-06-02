# Aplikasi Web Kopiku

## Ikhtisar
Kopiku adalah aplikasi web komprehensif untuk mengelola bisnis kedai kopi. Aplikasi ini menampilkan frontend React modern dan backend Python yang kuat, menyediakan solusi lengkap untuk manajemen menu, pemrosesan pesanan, dan manajemen pengguna.

## Fitur
- **Manajemen Menu**: Tambah, edit, hapus, dan kelola item menu kedai kopi
- **Manajemen Stok**: Lacak dan perbarui tingkat persediaan untuk item menu
- **Pemrosesan Pesanan**: Tangani pesanan pelanggan secara efisien
- **Autentikasi Pengguna**: Login aman untuk pelanggan dan administrator
- **Desain Responsif**: Berfungsi dengan mulus di desktop dan perangkat mobile
- **Unggah Gambar**: Dukungan untuk gambar item menu

## Tech Stack
### Frontend
- **Framework**: React.js
- **Manajemen State**: React Context API
- **Routing**: React Router
- **Komponen UI**: Komponen kustom dengan CSS
- **HTTP Client**: Axios
- **Notifikasi**: React Toastify

### Backend
- **Framework**: Python dengan SQLAlchemy
- **Database**: Database SQL (dikonfigurasi dengan SQLAlchemy)
- **Autentikasi**: Autentikasi berbasis JWT
- **API**: Endpoint API RESTful

## Struktur Proyek

```
kopiku-web/
├── kopiku_frontend/           # Aplikasi frontend React
│   ├── public/                # File statis
│   └── src/                   # Kode sumber
│       ├── assets/            # Gambar, font, dan aset statis lainnya
│       ├── components/        # Komponen UI yang dapat digunakan kembali
│       │   └── FileUpload.jsx # Komponen untuk menangani unggahan file
│       ├── contexts/          # Penyedia konteks React
│       │   └── AdminContext.js # State dan fungsi terkait admin
│       ├── Hooks/             # Hook React kustom
│       ├── pages/             # Halaman aplikasi
│       │   ├── Admin/         # Halaman dashboard admin
│       │   ├── Auth/          # Halaman autentikasi
│       │   └── Checkout/      # Halaman alur checkout
│       ├── services/          # Layer layanan untuk komunikasi API
│       ├── utils/             # Fungsi utilitas
│       └── api/               # Integrasi API
│
├── kopiku_backend/            # Aplikasi backend Python
│   ├── kopiku_backend/        # Paket utama
│   │   ├── alembic/           # Skrip migrasi database
│   │   ├── middleware/        # Komponen middleware
│   │   ├── models/            # Model database
│   │   │   ├── menu_item.py   # Model item menu
│   │   │   ├── order.py       # Model pesanan
│   │   │   └── user.py        # Model pengguna
│   │   ├── orms/              # Object-Relational Mappings
│   │   ├── schema/            # Definisi skema
│   │   ├── scripts/           # Skrip utilitas
│   │   ├── templates/         # Template HTML
│   │   └── views/             # Pengendali tampilan
│   │       ├── admin.py       # Endpoint admin
│   │       ├── customer.py    # Endpoint pelanggan
│   │       └── order_item.py  # Endpoint item pesanan
│   └── README.txt             # Dokumentasi backend
│
└── .gitignore                 # File Git ignore
```

## Memulai

### Prasyarat
- Node.js (v14 atau lebih tinggi)
- Python (v3.8 atau lebih tinggi)
- Database SQL

### Pengaturan Frontend
1. Navigasi ke direktori frontend:
   ```
   cd kopiku_frontend
   ```
2. Instal dependensi:
   ```
   npm install
   ```
3. Mulai server pengembangan:
   ```
   npm start
   ```
4. Aplikasi akan tersedia di `http://localhost:3000`

### Pengaturan Backend
1. Navigasi ke direktori backend:
   ```
   cd kopiku_backend
   ```
2. Buat dan aktifkan lingkungan virtual:
   ```
   python -m venv venv
   venv\Scripts\activate  # Di Windows
   source venv/bin/activate  # Di Unix/macOS
   ```
3. Instal dependensi:
   ```
   pip install -e .
   ```
4. Inisialisasi database:
   ```
   python -m kopiku_backend.scripts.initialize_db
   ```
5. Mulai server:
   ```
   pserve development.ini
   ```
6. API akan tersedia di `http://localhost:6543`

## Endpoint API

### Autentikasi
- `POST /api/auth/login`: Login pengguna
- `POST /api/auth/register`: Pendaftaran pengguna

### Item Menu
- `GET /api/admin/menu`: Dapatkan semua item menu
- `GET /api/admin/menu/{id}`: Dapatkan item menu tertentu
- `POST /api/admin/menu`: Buat item menu baru
- `PUT /api/admin/menu/{id}`: Perbarui item menu
- `DELETE /api/admin/menu/{id}`: Hapus item menu
- `PUT /api/admin/menu/{id}/stock`: Perbarui stok item menu

### Pesanan
- `GET /api/admin/orders`: Dapatkan semua pesanan
- `POST /api/customer/orders`: Buat pesanan baru
- `GET /api/customer/orders/{id}`: Dapatkan pesanan tertentu

## Kontribusi
Kontribusi dipersilakan! Jangan ragu untuk mengirimkan Pull Request.

## Lisensi
Proyek ini dilisensikan di bawah Lisensi MIT - lihat file LICENSE untuk detailnya.
