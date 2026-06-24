// ============================================================
// FOOTER - KOMPONEN BAWAH HALAMAN
// ============================================================
// Komponen ini adalah footer yang muncul di setiap halaman publik.
// Berisi informasi brand, navigasi cepat, jam operasional,
// dan kontak Camp Rent. Terdiri dari 4 kolom informasi.
// ============================================================

import React from 'react';
import { Link } from 'react-router-dom';
import { Tent, Phone, Mail, MapPin, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-[#0c0f12] text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        
        {/* ============================================================
            GRID UTAMA - 4 KOLOM
            ============================================================ */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* ===== KOLOM 1: BRAND ===== */}
          <div className="space-y-4">
            {/* Logo Camp Rent dengan link ke home */}
            <Link to="/" className="flex items-center gap-2">
              <Tent className="h-7 w-7 text-[#E2725B]" />
              <span className="font-outfit text-lg font-black uppercase tracking-wider text-white">
                Camp<span className="text-[#E2725B]">Rent</span>
              </span>
            </Link>
            
            {/* Deskripsi singkat brand */}
            <p className="text-xs leading-relaxed text-slate-500">
              Sewa alat camping tanpa ribet. Menyediakan perlengkapan outdoor lengkap, 
              bersih, wangi, dan siap pakai buat camping, hiking, atau healing.
            </p>
          </div>

          {/* ===== KOLOM 2: NAVIGASI CEPAT ===== */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Navigasi Cepat
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/alat" className="hover:text-white transition-colors">
                  Daftar Alat Camping
                </Link>
              </li>
              <li>
                <Link to="/paket" className="hover:text-white transition-colors">
                  Pilihan Paket Hemat
                </Link>
              </li>
              <li>
                <Link to="/cara-sewa" className="hover:text-white transition-colors">
                  Cara Melakukan Sewa
                </Link>
              </li>
              <li>
                <Link to="/testimoni" className="hover:text-white transition-colors">
                  Testimoni Customer
                </Link>
              </li>
            </ul>
          </div>

          {/* ===== KOLOM 3: JAM OPERASIONAL & LOKASI ===== */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Jam Operasional
            </h4>
            <ul className="space-y-3 text-xs">
              {/* Jam operasional dengan icon jam */}
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#3B593F]" />
                <span>Senin - Minggu: 08.00 - 21.00 WIB</span>
              </li>
              
              {/* Alamat lokasi dengan icon pin */}
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#3B593F]" />
                <span>Garut, Jawa Barat, Indonesia</span>
              </li>
            </ul>
          </div>

          {/* ===== KOLOM 4: KONTAK ===== */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Hubungi Kami
            </h4>
            <ul className="space-y-3 text-xs">
              {/* WhatsApp dengan link langsung */}
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#E2725B]" />
                <a
                  href="https://wa.me/6289517034800"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  089517034800 (WhatsApp)
                </a>
              </li>
              
              {/* Email dengan mailto link */}
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#E2725B]" />
                <a
                  href="mailto:rental@camprent.com"
                  className="hover:text-white transition-colors"
                >
                  rental@camprent.com
                </a>
              </li>
            </ul>
          </div>
          
        </div>

        {/* ============================================================
            BOTTOM BANNER - COPYRIGHT
            ============================================================ */}
        <div className="mt-12 border-t border-slate-850 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          {/* Copyright dengan tahun otomatis */}
          <p>© {new Date().getFullYear()} Camp Rent. Hak cipta dilindungi.</p>
          
          {/* Tagline */}
          <p>Dibuat untuk para pecinta petualangan & alam bebas.</p>
        </div>
        
      </div>
    </footer>
  );
}