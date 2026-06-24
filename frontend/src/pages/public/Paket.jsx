// ============================================================
// PAKET - HALAMAN KATALOG PAKET SEWA BUNDLING
// ============================================================
// Komponen ini menampilkan daftar semua paket sewa yang tersedia
// untuk disewa. Paket adalah bundling dari beberapa alat camping
// dengan harga yang lebih hemat. Fitur: navigasi ke halaman booking
// dengan paket yang dipilih.
// ============================================================

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/client';
import PackageCard from '../../components/common/PackageCard';
import { Boxes, Package } from 'lucide-react';

export default function Paket() {
  // ==================== STATE MANAGEMENT ====================
  
  // State untuk menyimpan semua data paket dari API
  const [packages, setPackages] = useState([]);
  
  // State untuk indikator loading saat mengambil data
  const [loading, setLoading] = useState(true);
  
  // Hook untuk navigasi ke halaman lain
  const navigate = useNavigate();

  // ==================== FETCH DATA ====================
  
  /**
   * useEffect untuk mengambil data paket dari API
   * Dipanggil saat komponen pertama kali di-mount
   */
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const data = await api.get('/packages');
        setPackages(data);
      } catch (err) {
        console.error('Gagal mengambil data paket:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  // ==================== FUNGSI NAVIGASI ====================
  
  /**
   * Menangani klik tombol booking pada card paket
   * Navigasi ke halaman booking dengan data paket yang dipilih
   * @param {Object} pkg - Data paket yang akan di-booking
   */
  const handleBook = (pkg) => {
    navigate('/booking', { 
      state: { 
        preselectedItem: pkg,        // Data paket yang dipilih
        preselectedType: 'package'   // Tipe booking: paket
      } 
    });
  };

  // ==================== RENDER UTAMA ====================
  
  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* ===== HEADER HALAMAN ===== */}
        <div className="text-center space-y-4 max-w-xl mx-auto">
          {/* Badge label */}
          <span className="text-xs font-bold uppercase tracking-widest text-[#E2725B] bg-[#E2725B]/10 border border-[#E2725B]/20 rounded-full px-4 py-1">
            Paket Sewa Hemat
          </span>
          
          {/* Judul utama dengan highlight warna oranye */}
          <h1 className="font-outfit text-4xl font-black uppercase text-white sm:text-5xl">
            Solusi Praktis & <span className="text-[#E2725B]">Lebih Hemat</span>
          </h1>
          
          {/* Deskripsi singkat */}
          <p className="text-xs text-slate-400">
            Dapatkan kumpulan alat esensial lengkap dengan harga sewa paket harian 
            yang jauh lebih ekonomis untuk perjalanan kelompok Anda.
          </p>
        </div>

        {/* ===== KONTEN UTAMA ===== */}
        
        {loading ? (
          // ===== TAMPILAN LOADING =====
          // Menampilkan spinner animasi saat data sedang dimuat
          <div className="flex h-60 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#E2725B] border-t-transparent"></div>
          </div>
          
        ) : packages.length === 0 ? (
          // ===== TAMPILAN KOSONG =====
          // Menampilkan pesan jika belum ada paket yang tersedia
          <div className="text-center py-20 space-y-4">
              <div className="inline-block rounded-2xl bg-slate-800/40 p-4 text-slate-600">
              <Package className="h-10 w-10" />
            </div>
            <h4 className="text-lg font-bold text-slate-500">Paket sewa belum tersedia.</h4>
            <p className="text-xs text-slate-600">Periksa lagi nanti atau pilih persewaan satuan alat.</p>
          </div>
          
        ) : (
          // ===== GRID KATALOG PAKET =====
          // Menampilkan daftar paket dalam grid responsive
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <PackageCard 
                key={pkg.id} 
                rentalPackage={pkg} 
                onBook={handleBook} 
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}