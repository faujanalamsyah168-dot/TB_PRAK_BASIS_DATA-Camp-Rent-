// ============================================================
// APP - KOMPONEN UTAMA ROUTING APLIKASI
// ============================================================
// File ini merupakan konfigurasi routing utama aplikasi Camp Rent.
// Mengatur semua rute publik dan admin yang dilindungi oleh
// autentikasi. Terdiri dari 2 jenis layout: PublicLayout untuk
// pengguna umum dan AdminLayout untuk admin yang sudah login.
// ============================================================

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AdminLayout from './components/layout/AdminLayout';
import ProtectedRoute from './components/common/ProtectedRoute';

// ==================== IMPOR HALAMAN PUBLIK ====================
// Halaman-halaman yang dapat diakses oleh semua pengguna tanpa login

import Home from './pages/public/Home';
import Tentang from './pages/public/Tentang';
import Alat from './pages/public/Alat';
import Paket from './pages/public/Paket';
import CaraSewa from './pages/public/CaraSewa';
import BookingPage from './pages/public/BookingPage';
import TestimonialPage from './pages/public/TestimonialPage';
import Kontak from './pages/public/Kontak';

// ==================== IMPOR HALAMAN AUTENTIKASI ====================
// Halaman login untuk admin

import Login from './pages/auth/Login';

// ==================== IMPOR HALAMAN ADMIN ====================
// Halaman-halaman yang hanya dapat diakses oleh admin yang sudah login

import Dashboard from './pages/admin/Dashboard';
import KelolaAlat from './pages/admin/KelolaAlat';
import KelolaPaket from './pages/admin/KelolaPaket';
import KelolaBooking from './pages/admin/KelolaBooking';
import KelolaPembayaran from './pages/admin/KelolaPembayaran';
import KelolaTestimoni from './pages/admin/KelolaTestimoni';

// ============================================================
// PUBLIC LAYOUT - LAYOUT UNTUK HALAMAN PUBLIK
// ============================================================
// Layout wrapper untuk semua halaman publik yang terdiri dari:
// - Navbar (di atas)
// - Konten utama (children)
// - Footer (di bawah)
// 
// @param {Object} props - Props komponen
// @param {React.ReactNode} props.children - Konten halaman yang akan dibungkus
// @returns {JSX.Element} Layout publik dengan Navbar, konten, dan Footer
// ============================================================

function PublicLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-900 text-slate-100 font-sans">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

// ============================================================
// APP - KOMPONEN UTAMA
// ============================================================
// Mengatur semua routing aplikasi dengan:
// - AuthProvider: menyediakan context autentikasi
// - BrowserRouter: routing berbasis browser
// - Routes: daftar semua rute yang tersedia
// - ProtectedRoute: melindungi halaman admin dari akses publik
// ============================================================

export default function App() {
  return (
    // Provider autentikasi untuk seluruh aplikasi
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          
          {/* ============================================================
              RUTE HALAMAN PUBLIK
              Semua halaman publik dibungkus dengan PublicLayout
              ============================================================ */}
          
          {/* Halaman Utama (Landing Page) */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          
          {/* Halaman Tentang Kami */}
          <Route path="/tentang" element={<PublicLayout><Tentang /></PublicLayout>} />
          
          {/* Halaman Katalog Alat */}
          <Route path="/alat" element={<PublicLayout><Alat /></PublicLayout>} />
          
          {/* Halaman Katalog Paket */}
          <Route path="/paket" element={<PublicLayout><Paket /></PublicLayout>} />
          
          {/* Halaman Panduan Cara Sewa */}
          <Route path="/cara-sewa" element={<PublicLayout><CaraSewa /></PublicLayout>} />
          
          {/* Halaman Form Booking */}
          <Route path="/booking" element={<PublicLayout><BookingPage /></PublicLayout>} />
          
          {/* Halaman Testimoni / Ulasan */}
          <Route path="/testimoni" element={<PublicLayout><TestimonialPage /></PublicLayout>} />
          
          {/* Halaman Kontak */}
          <Route path="/kontak" element={<PublicLayout><Kontak /></PublicLayout>} />

          {/* ============================================================
              RUTE AUTENTIKASI
              Halaman login tanpa layout (full page)
              ============================================================ */}
          <Route path="/login" element={<Login />} />

          {/* ============================================================
              RUTE ADMIN (DILINDUNGI)
              Semua halaman admin dilindungi oleh ProtectedRoute
              yang akan redirect ke login jika belum autentikasi
              ============================================================ */}
          
          {/* ============================================================
              RUTE ADMIN (DILINDUNGI) - NESTED ROUTES
              Agar AdminLayout (termasuk dropdown notifikasi) tidak remount
              saat berpindah halaman admin.
              ============================================================ */}

<Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Dashboard />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/alat"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <KelolaAlat />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/paket"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <KelolaPaket />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/booking"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <KelolaBooking />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/pembayaran"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <KelolaPembayaran />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/testimoni"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <KelolaTestimoni />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}