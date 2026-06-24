// ============================================================
// PACKAGE CARD - KOMPONEN KARTU PAKET SEWA
// ============================================================
// Komponen ini menampilkan kartu untuk setiap paket sewa
// yang tersedia. Menampilkan gambar, nama, deskripsi, daftar
// item yang termasuk, harga, dan tombol pilih paket.
// Kartu akan menampilkan overlay "Tidak Aktif" jika status inactive.
// ============================================================

import React from 'react';
import { Package, Check } from 'lucide-react';

/**
 * Komponen PackageCard
 * 
 * @param {Object} props - Props komponen
 * @param {Object} props.rentalPackage - Data paket yang akan ditampilkan
 * @param {Function} props.onBook - Callback saat tombol pilih paket diklik
 */
export default function PackageCard({ rentalPackage, onBook }) {
  // ==================== DESTRUKTURISASI DATA ====================
  
  /**
   * Mengambil semua properti dari object rentalPackage
   */
  const { name, description, price_per_day, image_url, items = [], status } = rentalPackage;
  
  /**
   * Mengecek apakah paket tidak aktif
   * Digunakan untuk menonaktifkan tombol dan menampilkan overlay
   */
  const isInactive = status === 'inactive';

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
          GAMBAR PAKET
          ============================================================ */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
        {/* Gambar dengan efek zoom pada hover */}
        <img
          src={image_url || 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=500'}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            // Fallback jika gambar gagal dimuat
            e.target.src = 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=500';
          }}
        />
        
        {/* ===== OVERLAY TIDAK AKTIF ===== */}
        {/* Muncul jika status paket inactive */}
        {isInactive && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-xs">
            <span className="rounded-xl border border-rose-500/50 bg-rose-950/80 px-4 py-2 text-xs font-bold uppercase tracking-wider text-rose-400">
              Tidak Aktif
            </span>
          </div>
        )}
      </div>

      {/* ============================================================
          DETAIL PAKET
          ============================================================ */}
      <div className="flex flex-1 flex-col p-6">
        
        {/* ===== NAMA PAKET ===== */}
        {/* Berubah warna menjadi oranye saat hover */}
        <h4 className="text-xl font-extrabold text-white tracking-wide leading-tight group-hover:text-[#E2725B] transition-colors">
          {name}
        </h4>
        
        {/* ===== DESKRIPSI ===== */}
        <p className="mt-2 text-xs text-slate-400 leading-relaxed">
          {description}
        </p>

        {/* ============================================================
            DAFTAR ITEM YANG TERMASUK
            ============================================================ */}
        <div className="mt-4 flex-1 border-t border-slate-700/30 pt-4">
          {/* Label daftar item */}
          <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-3">
            Item yang didapat:
          </span>
          
          {/* List item dengan icon centang hijau */}
          <ul className="space-y-2">
            {items.map((item, idx) => (
              <li key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                {/* Icon centang dengan background hijau transparan */}
                <span className="rounded-full bg-[#3B593F]/30 p-0.5 border border-[#3B593F]/50">
                  <Check className="h-3 w-3 text-emerald-400" />
                </span>
                {/* Nama item dengan jumlah */}
                <span>{item.quantity || item.qty}x {item.equipment_name || item.name}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* ============================================================
            HARGA
            ============================================================ */}
        <div className="mt-6 flex items-end justify-between border-t border-slate-700/30 pt-4">
          <div>
            <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Harga / Hari
            </span>
            {/* Harga dengan ukuran lebih besar (text-2xl) */}
            <span className="text-2xl font-extrabold text-[#E2725B] tracking-tight">
              {formatIDR(price_per_day)}
            </span>
          </div>
        </div>

        {/* ============================================================
            TOMBOL PILIH PAKET
            ============================================================ */}
        <button
          onClick={() => !isInactive && onBook(rentalPackage)}
          disabled={isInactive}
          className={`mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all duration-300 ${
            isInactive
              ? 'cursor-not-allowed border border-slate-800 bg-slate-900/40 text-slate-600' // Nonaktif: abu-abu
              : 'bg-[#E2725B] text-white hover:bg-[#E2725B]/90 shadow-lg hover:shadow-[#E2725B]/20' // Aktif: oranye
          }`}
        >
          <Package className="h-4 w-4" />
          Pilih Paket
        </button>
      </div>
    </div>
  );
}