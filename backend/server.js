const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// =============================================
// KONFIGURASI ENVIRONMENT
// =============================================
dotenv.config({ path: path.join(__dirname, '.env') });

// =============================================
// INISIALISASI APLIKASI
// =============================================
const app = express();
const PORT = process.env.PORT || 5000;

// =============================================
// MIDDLEWARE (Pemrosesan Request)
// =============================================

// CORS - Mengizinkan akses dari frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Parser JSON - Mengubah body request menjadi objek JS
app.use(express.json());

// Parser URL-encoded - Mengubah data form menjadi objek JS
app.use(express.urlencoded({ extended: true }));

// =============================================
// ROUTE TESTING
// =============================================
app.get('/', (req, res) => {
  res.send('Camp Rent API sedang berjalan...');
});

// =============================================
// IMPORT & BIND ROUTES
// =============================================
const authRoutes = require('./routes/authRoutes');           // Login/Register
const equipmentRoutes = require('./routes/equipmentRoutes'); // Manajemen peralatan
const packageRoutes = require('./routes/packageRoutes');     // Manajemen paket sewa
const bookingRoutes = require('./routes/bookingRoutes');     // Manajemen pemesanan
const paymentRoutes = require('./routes/paymentRoutes');     // Manajemen pembayaran
const testimonialRoutes = require('./routes/testimonialRoutes'); // Manajemen testimoni
const dashboardRoutes = require('./routes/dashboardRoutes'); // Data statistik

// Hubungkan route dengan path URL
app.use('/api/auth', authRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/dashboard', dashboardRoutes);

// =============================================
// GLOBAL ERROR HANDLER
// =============================================
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({ message: 'Terjadi kesalahan internal pada server.' });
});

// =============================================
// START SERVER
// =============================================
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📡 API URL: http://localhost:${PORT}/api`);
});

// =============================================
// PENJELASAN SINGKAT:
// =============================================
/**
 * 1. dotenv.config() - Memuat konfigurasi dari file .env
 * 2. CORS - Mengizinkan frontend mengakses API
 * 3. express.json() - Membaca data JSON dari request
 * 4. express.urlencoded() - Membaca data form dari request
 * 5. Routes - Menangani berbagai endpoint API
 * 6. Error Handler - Menangani error server
 * 7. app.listen() - Menjalankan server
 */