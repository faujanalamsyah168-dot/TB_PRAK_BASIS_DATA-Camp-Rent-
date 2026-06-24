// ============================================================
// NAVBAR - KOMPONEN NAVIGASI UTAMA
// ============================================================
// Komponen ini adalah navbar yang muncul di setiap halaman publik.
// Fitur: logo brand, link navigasi, tombol admin, tombol booking,
// dan menu mobile yang responsif untuk tampilan di perangkat kecil.
// ============================================================

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Tent, LogIn } from 'lucide-react';

export default function Navbar() {
  // ==================== STATE ====================
  
  /**
   * State untuk mengontrol buka/tutup menu mobile
   * true = menu terbuka, false = menu tertutup
   */
  const [isOpen, setIsOpen] = useState(false);
  
  /**
   * Hook untuk mendapatkan path URL saat ini
   * Digunakan untuk menentukan link aktif
   */
  const location = useLocation();

  // ==================== DATA NAVIGASI ====================
  
  /**
   * Array daftar link navigasi utama
   * Setiap link memiliki name (nama tampilan) dan path (URL tujuan)
   */
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Tentang', path: '/tentang' },
    { name: 'Alat Camping', path: '/alat' },
    { name: 'Paket Sewa', path: '/paket' },
    { name: 'Cara Sewa', path: '/cara-sewa' },
    { name: 'Testimoni', path: '/testimoni' },
    { name: 'Kontak', path: '/kontak' }
  ];

  /**
   * Fungsi untuk mengecek apakah link sedang aktif
   * Membandingkan path link dengan path URL saat ini
   * @param {string} path - Path link yang dicek
   * @returns {boolean} true jika aktif, false jika tidak
   */
  const isActive = (path) => location.pathname === path;

  // ==================== RENDER UTAMA ====================
  
  return (
    <nav className="sticky top-0 z-40 w-full border-b border-slate-800 bg-[#1E232A]/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* ===== LOGO ===== */}
          <Link to="/" className="flex items-center gap-2 group">
            {/* Icon tenda dengan efek hover rotate */}
            <Tent className="h-8 w-8 text-[#E2725B] transition-transform group-hover:rotate-6" />
            {/* Nama brand dengan highlight warna oranye */}
            <span className="font-outfit text-xl font-black uppercase tracking-wider text-white">
              Camp<span className="text-[#E2725B]">Rent</span>
            </span>
          </Link>

          {/* ===== DESKTOP LINKS ===== */}
          {/* Hanya tampil di layar lg ke atas (>= 1024px) */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-semibold tracking-wide transition-colors ${
                  isActive(link.path)
                    ? 'text-[#E2725B]' // Aktif: warna oranye
                    : 'text-slate-300 hover:text-[#E2725B]' // Nonaktif: hover oranye
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* ===== DESKTOP RIGHT CTA ===== */}
          {/* Hanya tampil di layar lg ke atas (>= 1024px) */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Tombol Admin (Login) */}
            <Link
              to="/login"
              className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-white transition-colors"
              title="Portal Admin"
            >
              <LogIn className="h-4 w-4 text-slate-500 hover:text-white" />
              <span>Admin</span>
            </Link>
            
            {/* Tombol Booking Sekarang (warna hijau) */}
            <Link
              to="/booking"
              className="rounded-xl bg-[#3B593F] px-4 py-2 text-sm font-bold text-white shadow-md shadow-[#3B593F]/20 hover:bg-[#3B593F]/90 transition-all"
            >
              Booking Sekarang
            </Link>
          </div>

          {/* ===== MOBILE MENU BUTTON ===== */}
          {/* Hanya tampil di layar lg ke bawah (< 1024px) */}
          <div className="flex lg:hidden items-center gap-2">
            {/* Tombol Admin (Login) untuk mobile */}
            <Link
              to="/login"
              className="rounded-lg p-2 text-slate-400 hover:text-white"
            >
              <LogIn className="h-5 w-5" />
            </Link>
            
            {/* Tombol burger menu untuk toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* ===== MOBILE MENU (DROPDOWN) ===== */}
      {/* Tampil hanya jika isOpen = true dan di layar lg ke bawah */}
      {isOpen && (
        <div className="lg:hidden border-t border-slate-850 bg-[#1E232A] px-4 py-4 space-y-3 shadow-2xl">
          
          {/* Daftar link navigasi mobile */}
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)} // Tutup menu setelah klik
              className={`block rounded-xl px-4 py-2.5 text-base font-semibold transition-colors ${
                isActive(link.path)
                  ? 'bg-[#E2725B]/10 text-[#E2725B]' // Aktif: background oranye transparan
                  : 'text-slate-300 hover:bg-slate-850 hover:text-white' // Nonaktif: hover
              }`}
            >
              {link.name}
            </Link>
          ))}
          
          {/* Tombol Booking Sekarang di mobile */}
          <div className="pt-2">
            <Link
              to="/booking"
              onClick={() => setIsOpen(false)} // Tutup menu setelah klik
              className="block w-full text-center rounded-xl bg-[#E2725B] py-3 text-sm font-bold text-white shadow-lg shadow-[#E2725B]/20"
            >
              Booking Sekarang
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}