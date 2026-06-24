// ============================================================
// EQUIPMENT CARD - KOMPONEN KARTU ALAT CAMPING
// ============================================================
// Komponen ini menampilkan kartu untuk setiap alat camping
// yang tersedia untuk disewa. Menampilkan gambar, nama, kategori,
// deskripsi, harga, stok, dan tombol sewa. Kartu akan
// menampilkan overlay "Habis" jika stok habis atau tidak tersedia.
// ============================================================

import React from 'react';
import { ShoppingBag } from 'lucide-react';

/**
 * Komponen EquipmentCard
 * 
 * @param {Object} props - Props komponen
 * @param {Object} props.equipment - Data alat yang akan ditampilkan
 * @param {Function} props.onBook - Callback saat tombol sewa diklik
 */
export default function EquipmentCard({ equipment, onBook }) {
  // ==================== DESTRUKTURISASI DATA ====================
  
  /**
   * Mengambil semua properti dari object equipment
   */
  const { name, category, description, price_per_day, stock_available, image_url, status } = equipment;
  
  /**
   * Mengecek apakah stok habis atau status tidak tersedia
   * Digunakan untuk menonaktifkan tombol dan menampilkan overlay
   */
  const isOutOfStock = stock_available <= 0 || status === 'unavailable';

  // ==================== FUNGSI FORMAT ====================
  
  /**
   * Memformat angka ke format Rupiah Indonesia
   * @param {number} num - Angka yang akan diformat
   * @returns {string} String dengan format Rp
   */
  const formatIDR = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num);
  };

  // ==================== RENDER UTAMA ====================
  
  return (
    <div className="group flex flex-col overflow-hidden rounded-3xl border border-slate-700/30 bg-[#1E232A]/50 shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[#E2725B]/50 hover:shadow-2xl">
      
      {/* ============================================================
          GAMBAR ALAT
          ============================================================ */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
        {/* Gambar dengan efek zoom pada hover */}
        <img
          src={image_url || 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=500'}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            // Fallback jika gambar gagal dimuat
            e.target.src = 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=500';
          }}
        />
        
        {/* ===== TAG KATEGORI ===== */}
        {/* Muncul di pojok kiri atas gambar */}
        <span className="absolute left-3 top-3 rounded-full bg-[#1E232A]/90 px-3 py-1 text-xs font-semibold text-[#E2725B] border border-slate-700/50 backdrop-blur-md">
          {category}
        </span>
        
        {/* ===== OVERLAY STOK HABIS ===== */}
        {/* Muncul jika stok habis atau status tidak tersedia */}
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-xs">
            <span className="rounded-xl border border-rose-500/50 bg-rose-950/80 px-4 py-2 text-xs font-bold uppercase tracking-wider text-rose-400">
              Habis / Tidak Tersedia
            </span>
          </div>
        )}
      </div>

      {/* ============================================================
          DETAIL ALAT
          ============================================================ */}
      <div className="flex flex-1 flex-col p-6">
        
        {/* ===== NAMA ALAT ===== */}
        {/* Berubah warna menjadi oranye saat hover */}
        <h4 className="text-lg font-bold text-white tracking-wide leading-tight group-hover:text-[#E2725B] transition-colors">
          {name}
        </h4>
        
        {/* ===== DESKRIPSI ===== */}
        {/* Maksimal 2 baris dengan ellipsis */}
        <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed flex-1">
          {description}
        </p>
        
        {/* ===== HARGA & STOK ===== */}
        <div className="mt-4 flex items-end justify-between border-t border-slate-700/30 pt-4">
          
          {/* Harga per hari */}
          <div>
            <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Harga / Hari
            </span>
            <span className="text-lg font-extrabold text-[#E2725B] tracking-tight">
              {formatIDR(price_per_day)}
            </span>
          </div>
          
          {/* Sisa stok */}
          <div className="text-right">
            <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Sisa Stok
            </span>
            <span className={`text-sm font-bold ${isOutOfStock ? 'text-rose-500' : 'text-emerald-400'}`}>
              {isOutOfStock ? 'Habis' : `${stock_available} Unit`}
            </span>
          </div>
        </div>

        {/* ============================================================
            TOMBOL SEWA
            ============================================================ */}
        <button
          onClick={() => !isOutOfStock && onBook(equipment)}
          disabled={isOutOfStock}
          className={`mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all duration-300 ${
            isOutOfStock
              ? 'cursor-not-allowed border border-slate-800 bg-slate-900/40 text-slate-600' // Nonaktif: abu-abu
              : 'bg-[#3B593F] text-white hover:bg-[#3B593F]/90 shadow-lg hover:shadow-[#3B593F]/20' // Aktif: hijau
          }`}
        >
          <ShoppingBag className="h-4 w-4" />
          Sewa Sekarang
        </button>
      </div>
    </div>
  );
}