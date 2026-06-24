// =============================================
// 1. IMPORT LIBRARY
// =============================================
// Mengimpor library jsonwebtoken untuk memverifikasi token JWT
const jwt = require('jsonwebtoken');

// =============================================
// 2. MIDDLEWARE AUTENTIKASI
// =============================================
// Middleware ini berfungsi untuk memverifikasi token JWT yang dikirim oleh client
// dan memastikan bahwa user sudah login sebelum mengakses endpoint tertentu
const authMiddleware = (req, res, next) => {
  
  // =============================================
  // 2a. AMBIL TOKEN DARI HEADER
  // =============================================
  // Mengambil header 'Authorization' dari request yang dikirim client
  // Format standar: "Bearer <token>"
  const authHeader = req.headers['authorization'];
  
  // =============================================
  // 2b. CEK KEBERADAAN TOKEN
  // =============================================
  // Jika header Authorization tidak ada, tolak akses dengan status 401 (Unauthorized)
  if (!authHeader) {
    return res.status(401).json({ 
      message: 'Akses ditolak. Token tidak ditemukan.' 
    });
  }

  // =============================================
  // 2c. VALIDASI FORMAT TOKEN
  // =============================================
  // Memecah header menjadi dua bagian: 'Bearer' dan tokennya
  const parts = authHeader.split(' ');
  
  // Memastikan formatnya benar: harus terdiri dari 2 bagian dan diawali dengan 'Bearer'
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ 
      message: 'Akses ditolak. Format token salah.' 
    });
  }

  // Mengambil token dari bagian kedua (setelah 'Bearer ')
  const token = parts[1];

  // =============================================
  // 2d. VERIFIKASI TOKEN
  // =============================================
  try {
    // Memverifikasi token menggunakan JWT_SECRET dari environment variable
    // Jika token valid, hasil decode akan berisi payload (biasanya id user, email, dll)
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'camp_rent_jwt_secret_key_123!' // Fallback untuk development
    );
    
    // Menyimpan data user hasil decode ke dalam req.user
    // Sehingga controller selanjutnya bisa mengakses informasi user
    req.user = decoded;
    
    // Lanjutkan ke middleware/controller berikutnya
    next();
    
  } catch (error) {
    // =============================================
    // 2e. TANGANI ERROR VERIFIKASI
    // =============================================
    // Jika token tidak valid, expired, atau signature tidak cocok
    // Kembalikan status 403 (Forbidden)
    return res.status(403).json({ 
      message: 'Token tidak valid atau telah kedaluwarsa.' 
    });
  }
};

// =============================================
// 3. EKSPOR MIDDLEWARE
// =============================================
// Ekspor agar bisa digunakan di route-route yang memerlukan autentikasi
module.exports = authMiddleware;