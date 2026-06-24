// ============================================================
// DATA TABLE - KOMPONEN TABEL DATA REUSABLE
// ============================================================
// Komponen ini adalah tabel data yang dapat digunakan kembali
// untuk menampilkan data dalam format tabel. Fitur: pencarian
// (berdasarkan searchField), pagination, dan custom rendering
// untuk setiap kolom.
// ============================================================

import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Komponen DataTable
 * 
 * @param {Object} props - Props komponen
 * @param {Array} props.headers - Array definisi kolom tabel
 * @param {Array} props.data - Array data yang akan ditampilkan
 * @param {string} props.searchPlaceholder - Placeholder untuk input pencarian
 * @param {string} props.searchField - Nama field yang akan digunakan untuk pencarian
 * @param {number} props.itemsPerPage - Jumlah data per halaman (default: 10)
 * @param {Function} props.actions - Fungsi untuk render tombol aksi (opsional)
 */
export default function DataTable({ 
  headers, 
  data = [], 
  searchPlaceholder = 'Cari...', 
  searchField = 'name',
  itemsPerPage = 10,
  actions
}) {
  // ==================== STATE ====================
  
  /**
   * State untuk kata kunci pencarian
   */
  const [searchTerm, setSearchTerm] = useState('');
  
  /**
   * State untuk halaman saat ini (dimulai dari 1)
   */
  const [currentPage, setCurrentPage] = useState(1);

  // ==================== FILTER DATA ====================
  
  /**
   * Memfilter data berdasarkan kata kunci pencarian
   * Mencocokkan nilai dari field yang ditentukan (searchField)
   * Case insensitive (mengabaikan huruf besar/kecil)
   */
  const filteredData = data.filter((item) => {
    if (!searchTerm) return true; // Jika tidak ada pencarian, tampilkan semua
    
    const value = item[searchField];
    if (value === undefined || value === null) return false; // Skip jika field tidak ada
    
    // Bandingkan dengan case insensitive
    return String(value).toLowerCase().includes(searchTerm.toLowerCase());
  });

  // ==================== PAGINATION ====================
  
  /**
   * Menghitung total item setelah filter
   */
  const totalItems = filteredData.length;
  
  /**
   * Menghitung total halaman (minimal 1)
   */
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  
  /**
   * Index awal data untuk halaman saat ini
   */
  const startIndex = (currentPage - 1) * itemsPerPage;
  
  /**
   * Data yang ditampilkan pada halaman saat ini (sesuai pagination)
   */
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  /**
   * Mengubah ke halaman tertentu
   * @param {number} page - Nomor halaman tujuan
   */
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // ==================== RENDER UTAMA ====================
  
  return (
    <div className="w-full rounded-2xl bg-[#1E232A]/50 border border-slate-700/30 shadow-xl p-6 backdrop-blur-md overflow-hidden">
      
      {/* ============================================================
          HEADER: SEARCH & INFO
          ============================================================ */}
      <div className="mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Input Pencarian */}
        <div className="relative w-full md:max-w-xs">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-slate-400" />
          </span>
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset ke halaman 1 saat mencari
            }}
            className="w-full rounded-xl border border-slate-700 bg-[#1E232A]/80 py-2 pl-10 pr-4 text-sm text-white placeholder-slate-400 focus:border-[#E2725B] focus:outline-none focus:ring-1 focus:ring-[#E2725B]"
          />
        </div>
        
        {/* Informasi jumlah data */}
        <div className="text-xs text-slate-400 whitespace-nowrap">
          Menampilkan {totalItems === 0 ? 0 : startIndex + 1} - {Math.min(startIndex + itemsPerPage, totalItems)} dari {totalItems} data
        </div>
      </div>

      {/* ============================================================
          TABLE CONTENT
          ============================================================ */}
      <div className="rounded-xl border border-slate-700/50 overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm text-slate-300 min-w-[700px]">
          
          {/* ===== TABLE HEADER ===== */}
          <thead className="bg-[#1E232A] text-xs font-semibold uppercase text-slate-400 border-b border-slate-700/50">
            <tr>
              {/* Loop melalui headers untuk membuat kolom */}
              {headers.map((h, idx) => (
                <th key={idx} className={h.className || 'px-4 py-4'}>
                  {h.label}
                </th>
              ))}
              {/* Kolom Aksi (jika ada) */}
              {actions && (
                <th className="px-3 py-4 text-right" style={{ width: '90px' }}>
                  Aksi
                </th>
              )}
            </tr>
          </thead>
          
          {/* ===== TABLE BODY ===== */}
          <tbody className="divide-y divide-slate-700/30">
            {paginatedData.length === 0 ? (

              // Tampilan jika tidak ada data
              <tr>
                <td colSpan={headers.length + (actions ? 1 : 0)} className="px-4 py-8 text-center text-slate-500">
                  Tidak ada data yang ditemukan.
                </td>
              </tr>
            ) : (
              // Loop data dan render baris
              paginatedData.map((item, rowIdx) => (
                <tr
                  key={
                    item.id ??
                    item.payment_id ??
                    item.booking_id ??
                    rowIdx
                  }
                  className="hover:bg-slate-700/10 transition-colors"
                >


                  {headers.map((h, colIdx) => (
                    <td key={colIdx} className={h.className || 'px-4 py-4 align-middle'}>
                      {/* Jika ada fungsi render, gunakan custom render, jika tidak gunakan nilai langsung */}
                      {h.render ? h.render(item, startIndex + rowIdx) : item[h.key]}
                    </td>
                  ))}
                  {/* Kolom Aksi */}
                  {actions && (
                    <td className="px-3 py-4 text-right align-middle" style={{ width: '90px' }}>
                      {actions(item)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ============================================================
          PAGINATION FOOTER
          ============================================================ */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between gap-4 flex-wrap">
          
          {/* Tombol Sebelumnya */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center gap-1 rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-400 hover:bg-slate-800 hover:text-white disabled:pointer-events-none disabled:opacity-40 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" /> Sebelum
          </button>
          
          {/* Nomor Halaman */}
          <div className="flex gap-1 flex-wrap justify-center">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  page === currentPage
                    ? 'bg-[#E2725B] text-white' // Halaman aktif: warna oranye
                    : 'border border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white' // Halaman nonaktif
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          {/* Tombol Selanjutnya */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-400 hover:bg-slate-800 hover:text-white disabled:pointer-events-none disabled:opacity-40 transition-colors"
          >
            Selanjutnya <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
      
    </div>
  );
}