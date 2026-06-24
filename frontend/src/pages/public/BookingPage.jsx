// ============================================================
// BOOKING PAGE - HALAMAN FORMULIR PEMESANAN SEWA
// ============================================================
// Komponen ini menampilkan halaman booking untuk menyewa alat
// atau paket camping. Fitur: form pemesanan, pre-selected item
// dari halaman sebelumnya, dan tampilan sukses setelah booking.
// ============================================================

import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import BookingForm from '../../components/common/BookingForm';
import { CheckCircle2, ChevronLeft, ArrowRight, PhoneCall } from 'lucide-react';

export default function BookingPage() {
  // ==================== HOOKS & STATE ====================
  
  // Hook untuk mengakses state dari navigasi (data item yang dipilih)
  const location = useLocation();
  
  // State untuk menandai apakah booking berhasil
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Ref untuk scroll ke elemen sukses saat booking berhasil
  const successRef = useRef(null);

  // ==================== EFFECTS ====================
  
  /**
   * useEffect untuk memastikan halaman berada di posisi atas
   * saat komponen pertama kali di-mount (LANGSUNG, tanpa animasi)
   */
  useEffect(() => {
    // Scroll ke atas halaman secara INSTANT (tanpa animasi)
    window.scrollTo(0, 0);
  }, []); // Empty dependency array = hanya dijalankan sekali saat mount

  /**
   * useEffect untuk scroll otomatis ke bagian sukses
   * Hanya dijalankan ketika booking berhasil (isSuccess = true)
   * dengan delay agar pengguna melihat transisi
   */
  useEffect(() => {
    if (isSuccess && successRef.current) {
      // Beri delay 500ms sebelum scroll agar pengguna melihat animasi sukses
      const timer = setTimeout(() => {
        successRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  // ==================== DATA DARI NAVIGASI ====================
  
  /**
   * Membaca data yang dikirim dari halaman sebelumnya (Alat atau Paket)
   * - preselectedItem: data alat atau paket yang dipilih
   * - preselectedType: tipe item ('equipment' atau 'package')
   * Jika tidak ada data, nilainya null
   */
  const preselectedItem = location.state?.preselectedItem || null;
  const preselectedType = location.state?.preselectedType || null;

  // ==================== HANDLER ====================
  
  /**
   * Handler untuk callback sukses dari BookingForm
   */
  const handleBookingSuccess = () => {
    setIsSuccess(true);
  };

  // ==================== RENDER UTAMA ====================
  
  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        
        {/* ===== BACK LINK ===== */}
        {/* Link untuk kembali ke halaman utama */}
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors font-bold uppercase tracking-wider"
          >
            <ChevronLeft className="h-4 w-4" /> Kembali ke Home
          </Link>
        </div>

        {/* ===== KONDISI: BOOKING BERHASIL ===== */}
        {isSuccess ? (
          // ===== TAMPILAN SUKSES =====
          // Ditampilkan setelah booking berhasil diajukan
          <div 
            ref={successRef} 
            className="rounded-3xl border border-emerald-500/20 bg-[#1E232A]/50 p-8 md:p-12 text-center space-y-6 shadow-2xl backdrop-blur-md animate-zoom-in"
          >
            {/* Icon centang hijau */}
            <div className="inline-flex rounded-full bg-emerald-500/10 p-4 border border-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="h-12 w-12" />
            </div>
            
            {/* Pesan sukses */}
            <div className="space-y-3 max-w-lg mx-auto">
              <h2 className="text-2xl font-black uppercase tracking-wide text-white">
                Booking Berhasil Diajukan!
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Terima kasih telah melakukan pemesanan sewa di Camp Rent. 
                Admin kami akan segera memeriksa ketersediaan stok aktual 
                dan menghubungimu via WhatsApp untuk konfirmasi serah terima barang.
              </p>
            </div>

            {/* Tombol aksi setelah booking sukses */}
            <div className="pt-4 flex flex-wrap justify-center gap-4">
              {/* Tombol Hubungi Admin via WhatsApp */}
              <a
                href="https://wa.me/6289517034800"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-lg hover:bg-emerald-700 transition-colors"
              >
                <PhoneCall className="h-4 w-4" /> Hubungi Admin via WhatsApp
              </a>
              
              {/* Tombol Sewa Barang Lain */}
              <Link
                to="/alat"
                className="flex items-center gap-1 rounded-xl border border-slate-700 bg-slate-800/40 px-6 py-3 text-sm font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
              >
                Sewa Barang Lain <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          
        ) : (
          // ===== TAMPILAN FORM BOOKING =====
          // Ditampilkan saat pengguna mengisi form booking
          <div className="rounded-3xl border border-slate-850 bg-[#1E232A]/50 p-6 md:p-10 shadow-2xl backdrop-blur-md space-y-8">
            
            {/* Header Form */}
            <div className="border-b border-slate-800 pb-6">
              <h1 className="font-outfit text-3xl font-black uppercase text-white tracking-wide">
                Formulir Booking Sewa
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Lengkapi formulir di bawah ini untuk memesan sewa peralatan outdoor favoritmu.
              </p>
            </div>
            
            {/* Komponen BookingForm */}
            {/* Menerima props untuk pre-selected item dan callback onSuccess */}
            <BookingForm
              preselectedItem={preselectedItem}     // Data item yang dipilih dari halaman sebelumnya
              preselectedType={preselectedType}     // Tipe item: 'equipment' atau 'package'
              onSuccess={handleBookingSuccess}     // Callback saat booking berhasil
            />
          </div>
        )}

      </div>
    </div>
  );
}