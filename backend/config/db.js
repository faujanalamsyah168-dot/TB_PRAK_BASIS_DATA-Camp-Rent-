// Mengimpor library mysql2 dengan fitur Promise (async/await) untuk koneksi database
const mysql = require('mysql2/promise');

// Mengimpor dotenv untuk membaca variabel lingkungan dari file .env
const dotenv = require('dotenv');

// Mengimpor modul path untuk memanipulasi jalur direktori
const path = require('path');

// =============================================
// 1. MEMUAT VARIABEL LINGKUNGAN (ENVIRONMENT)
// =============================================
// Menentukan lokasi file .env berada di folder backend (satu level di atas folder saat ini)
// Path: backend/config/db.js -> backend/.env
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// =============================================
// 2. MEMBUAT POOL KONEKSI DATABASE
// =============================================
// Pool digunakan untuk mengelola beberapa koneksi sekaligus (connection pooling)
// Ini lebih efisien daripada membuat koneksi baru setiap kali query
const db = mysql.createPool({
  // Host database (default: localhost jika tidak diatur di .env)
  host: process.env.DB_HOST || 'localhost',
  
  // Port database MySQL (default: 3306)
  port: process.env.DB_PORT || 3306,
  
  // Username untuk akses database (default: root)
  user: process.env.DB_USER || 'root',
  
  // Password database (default: kosong untuk lingkungan pengembangan lokal)
  password: process.env.DB_PASSWORD || '',
  
  // Nama database yang akan digunakan (default: camp_rent_db)
  database: process.env.DB_NAME || 'camp_rent_db',
  
  // Jika semua koneksi sedang sibuk, antrikan permintaan berikutnya
  waitForConnections: true,
  
  // Maksimal 10 koneksi simultan dalam pool
  connectionLimit: 10,
  
  // Tidak ada batasan antrian (0 = tidak terbatas)
  queueLimit: 0
});

// =============================================
// 3. TESTING KONEKSI (OTOMATIS SAAT MODUL DI-LOAD)
// =============================================
// Fungsi async self-invoking untuk mengecek apakah koneksi berhasil
(async () => {
  try {
    // Mencoba mengambil satu koneksi dari pool
    const connection = await db.getConnection();
    
    // Jika berhasil, tampilkan pesan sukses dengan nama database
    console.log('Database connected successfully to ' + (process.env.DB_NAME || 'camp_rent_db'));
    
    // Lepaskan koneksi kembali ke pool agar bisa digunakan oleh query lain
    connection.release();
  } catch (error) {
    // Jika gagal, tampilkan pesan error tanpa menghentikan aplikasi
    console.error('Database connection failed:', error.message);
  }
})();

// =============================================
// 4. EKSPOR MODUL
// =============================================
// Ekspor objek pool agar bisa digunakan di file lain (misal: model, controller, atau route)
module.exports = db;