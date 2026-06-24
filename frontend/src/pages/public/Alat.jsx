// ============================================================
// ALAT - HALAMAN KATALOG PERALATAN CAMPING
// ============================================================
// Komponen ini menampilkan daftar semua alat camping yang tersedia
// untuk disewa. Fitur: pencarian, filter kategori, dan navigasi
// ke halaman booking dengan item yang dipilih.
// ============================================================

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/client';
import EquipmentCard from '../../components/common/EquipmentCard';
import { Search, Tent } from 'lucide-react';

export default function Alat() {
  // ==================== STATE MANAGEMENT ====================
  
  // State untuk menyimpan semua data alat dari API
  const [equipment, setEquipment] = useState([]);
  
  // State untuk indikator loading saat mengambil data
  const [loading, setLoading] = useState(true);
  
  // State untuk query pencarian alat (berdasarkan nama atau deskripsi)
  const [searchQuery, setSearchQuery] = useState('');
  
  // State untuk filter kategori (default 'Semua')
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  
  // Hook untuk navigasi ke halaman lain
  const navigate = useNavigate();

  // ==================== FETCH DATA ====================
  
  /**
   * useEffect untuk mengambil data alat dari API
   * Dipanggil saat komponen pertama kali di-mount
   */
  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const data = await api.get('/equipment');
        setEquipment(data);
      } catch (err) {
        console.error('Gagal mengambil data alat:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEquipment();
  }, []);

  // ==================== DATA PROCESSING ====================
  
  /**
   * Menghasilkan daftar kategori unik dari data alat
   * Menggunakan Set untuk menghilangkan duplikat
   */
  const categories = ['Semua', ...new Set(equipment.map(item => item.category))];

  /**
   * Memfilter alat berdasarkan pencarian dan kategori
   * - Pencarian: cocok dengan nama atau deskripsi (case insensitive)
   * - Kategori: hanya menampilkan kategori yang dipilih
   */
  const filteredEquipment = equipment.filter(item => {
    // Cek apakah nama atau deskripsi mengandung kata kunci pencarian
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Cek apakah kategori sesuai dengan filter yang dipilih
    const matchesCategory = selectedCategory === 'Semua' || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // ==================== FUNGSI NAVIGASI ====================
  
  /**
   * Menangani klik tombol booking pada card alat
   * Navigasi ke halaman booking dengan data item yang dipilih
   * @param {Object} item - Data alat yang akan di-booking
   */
  const handleBook = (item) => {
    navigate('/booking', { 
      state: { 
        preselectedItem: item,      // Data alat yang dipilih
        preselectedType: 'equipment' // Tipe booking: peralatan satuan
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
            Katalog Alat Outdoor
          </span>
          
          {/* Judul utama */}
          <h1 className="font-outfit text-4xl font-black uppercase text-white sm:text-5xl">
            Peralatan <span className="text-[#E2725B]">Camping Lengkap</span>
          </h1>
          
          {/* Deskripsi singkat */}
          <p className="text-xs text-slate-400">
            Cari alat satuan yang kamu butuhkan untuk petualanganmu. Kami sediakan alat bersih, wangi dan siap pakai.
          </p>
        </div>

        {/* ===== FILTER & SEARCH ===== */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-800 pb-8">
          
          {/* ===== KATEGORI FILTER (TABS) ===== */}
          <div className="flex flex-wrap gap-2 order-2 md:order-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-xl px-4 py-2.5 text-xs font-bold transition-all border ${
                  selectedCategory === cat
                    ? 'bg-[#E2725B] text-white border-[#E2725B]' // Aktif: warna oranye
                    : 'bg-[#1E232A]/50 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white' // Nonaktif: transparan
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* ===== SEARCH BAR ===== */}
          <div className="relative w-full md:max-w-xs order-1 md:order-2">
            {/* Icon pencarian */}
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-slate-500" />
            </span>
            <input
              type="text"
              placeholder="Cari alat camping..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-[#1E232A]/50 py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:border-[#E2725B] focus:outline-none focus:ring-1 focus:ring-[#E2725B] backdrop-blur-md"
            />
          </div>
        </div>

        {/* ===== KONTEN UTAMA ===== */}
        
        {loading ? (
          // ===== TAMPILAN LOADING =====
          // Menampilkan spinner animasi saat data sedang dimuat
          <div className="flex h-60 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#E2725B] border-t-transparent"></div>
          </div>
          
        ) : filteredEquipment.length === 0 ? (
          // ===== TAMPILAN KOSONG =====
          // Menampilkan pesan jika tidak ada alat yang sesuai dengan filter
          <div className="text-center py-20 space-y-4">
            <div className="inline-block rounded-2xl bg-slate-800/40 p-4 text-slate-600">
              <Tent className="h-10 w-10" />
            </div>
            <h4 className="text-lg font-bold text-slate-500">Alat camping tidak ditemukan.</h4>
            <p className="text-xs text-slate-600">Coba ubah kata kunci pencarian atau kategori filter kamu.</p>
          </div>
          
        ) : (
          // ===== GRID KATALOG ALAT =====
          // Menampilkan daftar alat dalam grid responsive
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEquipment.map((item) => (
              <EquipmentCard 
                key={item.id} 
                equipment={item} 
                onBook={handleBook} 
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}