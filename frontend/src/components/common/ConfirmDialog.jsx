// ============================================================
// CONFIRM DIALOG - KOMPONEN DIALOG KONFIRMASI
// ============================================================
// Komponen ini adalah dialog konfirmasi yang muncul di atas
// halaman untuk meminta konfirmasi dari pengguna sebelum
// melakukan tindakan penting seperti hapus data.
// Mendukung 3 tipe: danger (merah), warning (kuning), info (biru).
// ============================================================

import React from 'react';
import { AlertTriangle } from 'lucide-react';

/**
 * Komponen ConfirmDialog
 * 
 * @param {Object} props - Props komponen
 * @param {boolean} props.isOpen - State untuk menampilkan/menyembunyikan dialog
 * @param {Function} props.onClose - Callback saat dialog ditutup
 * @param {Function} props.onConfirm - Callback saat tombol konfirmasi diklik
 * @param {string} props.title - Judul dialog (default: 'Konfirmasi Tindakan')
 * @param {string} props.message - Pesan yang ditampilkan di dialog
 * @param {string} props.confirmText - Teks tombol konfirmasi (default: 'Ya, Hapus')
 * @param {string} props.cancelText - Teks tombol batal (default: 'Batal')
 * @param {string} props.type - Tipe dialog: 'danger', 'warning', 'info' (default: 'danger')
 */
export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Konfirmasi Tindakan',
  message = 'Apakah Anda yakin ingin melakukan tindakan ini? Tindakan ini tidak dapat dibatalkan.',
  confirmText = 'Ya, Hapus',
  cancelText = 'Batal',
  type = 'danger'
}) {
  // Jika dialog tidak terbuka, jangan render apapun
  if (!isOpen) return null;

  // ==================== KONFIGURASI STYLE ====================
  
  /**
   * Mapping style berdasarkan tipe dialog
   * Setiap tipe memiliki warna yang berbeda untuk tombol dan icon
   */
  const typeStyles = {
    danger: {
      button: 'bg-rose-600 hover:bg-rose-700 text-white',      // Merah untuk hapus
      icon: 'text-rose-500 bg-rose-500/10'                     // Merah untuk icon
    },
    warning: {
      button: 'bg-amber-500 hover:bg-amber-600 text-white',    // Kuning untuk peringatan
      icon: 'text-amber-500 bg-amber-500/10'                   // Kuning untuk icon
    },
    info: {
      button: 'bg-sky-600 hover:bg-sky-700 text-white',        // Biru untuk informasi
      icon: 'text-sky-500 bg-sky-500/10'                       // Biru untuk icon
    }
  };

  // Pilih style berdasarkan tipe yang diberikan, fallback ke danger
  const currentStyle = typeStyles[type] || typeStyles.danger;

  // ==================== RENDER UTAMA ====================
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      
      {/* ===== BACKGROUND (OVERLAY) ===== */}
      {/* Latar belakang gelap dengan efek blur */}
      <div 
        className="fixed inset-0 bg-[#0c0f12]/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose} // Klik di luar dialog akan menutup
      />
      
      {/* ===== DIALOG BODY ===== */}
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-slate-700/50 bg-[#1E232A] p-6 shadow-2xl animate-zoom-in">
        
        {/* ===== HEADER: ICON & PESAN ===== */}
        <div className="flex gap-4 items-start mb-6">
          {/* Icon peringatan dengan background sesuai tipe */}
          <div className={`rounded-xl p-3 ${currentStyle.icon}`}>
            <AlertTriangle className="h-6 w-6" />
          </div>
          
          {/* Judul dan pesan */}
          <div>
            <h3 className="text-lg font-bold text-white tracking-wide">{title}</h3>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">{message}</p>
          </div>
        </div>
        
        {/* ===== TOMBOL AKSI ===== */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-700/30 pt-4">
          
          {/* Tombol Batal */}
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            {cancelText}
          </button>
          
          {/* Tombol Konfirmasi (warna sesuai tipe) */}
          <button
            onClick={() => {
              onConfirm();    // Jalankan callback konfirmasi
              onClose();      // Tutup dialog setelah konfirmasi
            }}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${currentStyle.button}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}