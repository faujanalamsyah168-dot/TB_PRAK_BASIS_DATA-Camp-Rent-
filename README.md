# Camp Rent - Web Rental Alat Outdoor & Camping

**Camp Rent** adalah aplikasi web fullstack untuk rental/persewaan alat outdoor dan camping. Pengguna dapat menelusuri katalog alat camping, melihat paket sewa, mengisi form booking sewa, dan admin dapat mengelola data alat, paket, transaksi booking, konfirmasi pembayaran, serta testimoni ulasan.

## Tech Stack

### Frontend
- **React** (v18)
- **Vite** (v5)
- **React Router DOM** (v6)
- **Tailwind CSS** (v4)
- **Lucide React** (Ikon)

### Backend
- **Node.js**
- **Express.js**
- **MySQL2** (Driver Database)
- **JSON Web Token (JWT)** (Keamanan sesi)
- **Bcrypt** (Hashing password)
- **CORS** & **Dotenv**

---

## Struktur Folder Proyek

```
Camp Rent/
├── backend/                  # Kode Backend (Express & MySQL)

│   ├── config/               # Koneksi database
│   ├── middleware/           # JWT verification
│   ├── routes/               # API Routes (Auth, Equipment, Bookings, dll.)
│   ├── seeders/              # Seeder data awal
│   ├── sql/                  # Skema database SQL
│   ├── server.js             # File server utama
│   └── package.json
│
├── src/                      # Kode Frontend (React & Tailwind v4)
│   ├── api/                  # Fetch client utility
│   ├── components/           # Layout & Custom components
│   ├── context/              # Authentication state
│   ├── pages/                # Halaman publik & panel admin
│   ├── App.jsx               # Routing setup
│   ├── main.jsx              # Entry point React
│   └── index.css             # Tailwind v4 configuration
│
├── .env.example
├── .gitignore
├── index.html
├── package.json              # Package JSON Frontend
└── vite.config.js
```

---

## Panduan Instalasi & Menjalankan Aplikasi

Ikuti petunjuk di bawah ini secara berurutan untuk menjalankan aplikasi lokal di komputermu:

### 1. Prasyarat (Prerequisites)
Pastikan kamu sudah menginstal perkakas berikut pada sistem operasi komputermu:
- **Node.js** (Rekomendasi versi LTS 18 atau 20)
- **MySQL Server** (bisa menggunakan XAMPP, Laragon, atau MySQL Installer mandiri)

---

### 2. Setup Database MySQL
1. Buka database management tool milikmu (seperti phpMyAdmin, DBeaver, HeidiSQL, atau MySQL CLI).
2. Jalankan perintah SQL yang ada pada file `camp_rent_db.sql` di root proyek.
   - Perintah ini akan membuat database `camp_rent_db` beserta seluruh tabel relasional yang diperlukan.


**Menggunakan Terminal / CLI:**
- Jika menggunakan Command Prompt (CMD):
  ```bash
  mysql -u root < camp_rent_db.sql
  ```
- Jika menggunakan PowerShell:
  ```powershell
  Get-Content camp_rent_db.sql | mysql -u root
  ```

*Catatan: Secara default koneksi database disetting pada host `localhost` dengan user `root` tanpa password. Jika MySQL milikmu memerlukan password, silakan ubah pada file `.env` di dalam folder `backend/`.*

---

### 3. Instalasi Dependency & Jalankan Backend
1. Masuk ke folder backend:
   ```bash
   cd backend
   ```
2. Instal library yang dibutuhkan:
   ```bash
   npm install
   ```
3. Jalankan Seeder data awal (admin, alat, paket, testimoni):
   ```bash
   npm run seed
   ```
4. Jalankan server backend dalam mode development (menggunakan nodemon):
   ```bash
   npm run dev
   ```
   *Server backend akan aktif pada port `http://localhost:5000`.*

---

### 4. Instalasi Dependency & Jalankan Frontend (Root)
1. Buka terminal baru dan kembali ke direktori root proyek `Camp Rent/`.
2. Instal library frontend:
   ```bash
   npm install
   ```
3. Jalankan server frontend Vite:
   ```bash
   npm run dev
   ```
   *Frontend akan aktif pada port default Vite: `http://localhost:5173`.*

---

## Akun Login Admin Default
Untuk masuk ke Dashboard Admin, gunakan kredensial berikut:
- **Email:** `admin@CampRent.com`
- **Password:** `admin123`

Sesi portal login dapat diakses melalui link kecil **Admin** di sebelah kanan atas Navbar, atau langsung menuju route `/login`.

---

## Logika & Validasi Bisnis Penting
1. **Validasi Ketersediaan Stok:** Ketika pelanggan melakukan booking, sistem otomatis memverifikasi stok barang satuan maupun isi perlengkapan di dalam paket sewa. Jika stok kurang dari permintaan sewa, booking akan ditolak.
2. **Sinkronisasi Stok Otomatis:**
   - Ketika admin mengubah status booking menjadi **Rented** (Sedang Disewa), stok tersedia (`stock_available`) alat camping akan berkurang.
   - Ketika status diubah menjadi **Returned** (Dikembalikan) atau **Cancelled** (Dibatalkan), stok tersedia akan otomatis dipulihkan kembali ke jumlah semula.
3. **Keamanan Sandi:** Password admin di-hash menggunakan **Bcrypt** dengan salt round 10 sebelum disimpan di database dan divalidasi menggunakan token pengenal sesi **JSON Web Token (JWT)**.
