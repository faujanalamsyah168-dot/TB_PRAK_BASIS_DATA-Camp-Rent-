// ============================================================
// CARA SEWA - HALAMAN PANDUAN PENYEWAAN
// ============================================================
// Komponen ini menampilkan panduan langkah demi langkah tentang
// cara menyewa alat camping di Camp Rent. Terdiri dari 5 langkah
// mudah yang dilengkapi dengan ikon dan deskripsi.
// ============================================================

import React from 'react';
import { Link } from 'react-router-dom';
import { Tent, FileText, PhoneCall, Truck, RotateCcw } from 'lucide-react';

export default function CaraSewa() {
  // ==================== DATA LANGKAH ====================
  
  /**
   * Array yang berisi 5 langkah cara sewa
   * Setiap langkah memiliki:
   * - num: nomor urut (format 01, 02, dst)
   * - title: judul langkah
   * - desc: deskripsi detail langkah
   * - icon: komponen icon dari lucide-react
   */
  const steps = [
    {
      num: '01',
      title: 'Pilih Alat / Paket',
      desc: 'Jelajahi katalog kami. Pilih alat satuan (tenda, matras, nesting, dll.) atau pilih paket sewa bundling hemat yang sesuai dengan rencana trip kamu.',
      icon: <Tent className="h-6 w-6 text-[#E2725B]" />
    },
    {
      num: '02',
      title: 'Isi Form Booking',
      desc: 'Klik booking, lengkapi data diri (nama, nomor WA aktif, alamat), tentukan tanggal mulai & selesai sewa, serta jumlah alat yang dibutuhkan.',
      icon: <FileText className="h-6 w-6 text-[#E2725B]" />
    },
    {
      num: '03',
      title: 'Admin Konfirmasi WA',
      desc: 'Setelah booking disubmit, sistem akan meregistrasi pesanan. Admin Camp Rent akan memverifikasi stok lalu menghubungimu via WhatsApp untuk koordinasi pembayaran & serah terima.',
      icon: <PhoneCall className="h-6 w-6 text-[#E2725B]" />
    },
    {
      num: '04',
      title: 'Ambil Barang / Kirim',
      desc: 'Kamu bisa datang langsung ke basecamp Camp Rent di Garut untuk mengambil alat, atau berkoordinasi dengan admin jika memerlukan opsi pengiriman (ongkir ditanggung penyewa).',
      icon: <Truck className="h-6 w-6 text-[#E2725B]" />
    },
    {
      num: '05',
      title: 'Kembalikan Alat',
      desc: 'Gunakan alat outdoor dengan baik. Kembalikan semua barang ke basecamp Camp Rent tepat waktu sesuai dengan tanggal berakhir sewa yang disepakati.',
      icon: <RotateCcw className="h-6 w-6 text-[#E2725B]" />
    }
  ];

  // ==================== RENDER UTAMA ====================
  
  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* ===== HEADER HALAMAN ===== */}
        <div className="text-center space-y-4 max-w-xl mx-auto">
          {/* Badge label */}
          <span className="text-xs font-bold uppercase tracking-widest text-[#E2725B] bg-[#E2725B]/10 border border-[#E2725B]/20 rounded-full px-4 py-1">
            Panduan Persewaan
          </span>
          
          {/* Judul utama */}
          <h1 className="font-outfit text-4xl font-black uppercase text-white sm:text-5xl">
            Bagaimana <span className="text-[#E2725B]">Cara Sewanya?</span>
          </h1>
          
          {/* Deskripsi singkat */}
          <p className="text-xs text-slate-400">
            Ikuti 5 langkah mudah berikut ini untuk menyewa perlengkapan camping andalanmu di Camp Rent.
          </p>
        </div>

        {/* ===== DAFTAR LANGKAH ===== */}
        {/* Container dengan garis vertikal di sisi kiri */}
        <div className="relative border-l border-slate-800 ml-4 md:ml-6 space-y-12">
          {steps.map((step, idx) => (
            <div key={idx} className="relative pl-10 md:pl-12 group">
              
              {/* ===== BULLET NODE ===== */}
              {/* Lingkaran dengan nomor langkah di sebelah kiri garis */}
              <div className="absolute -left-5 top-1 flex h-10 w-10 items-center justify-center rounded-full bg-[#1E232A] border border-slate-700 font-mono text-xs font-extrabold text-[#E2725B] shadow-xl group-hover:border-[#E2725B]/50 transition-colors">
                {step.num}
              </div>

              {/* ===== CARD LANGKAH ===== */}
              <div className="rounded-3xl border border-slate-800 bg-[#1E232A]/50 p-6 md:p-8 space-y-4 shadow-xl backdrop-blur-md">
                
                {/* Header langkah: Icon + Judul */}
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-[#E2725B]/10 p-2.5 border border-[#E2725B]/20">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-wide">{step.title}</h3>
                </div>
                
                {/* Deskripsi langkah */}
                <p className="text-sm text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ===== CALL TO ACTION ===== */}
        {/* Bagian bawah dengan ajakan untuk booking */}
        <div className="text-center bg-[#1E232A]/50 border border-slate-800 rounded-3xl p-8 space-y-4 max-w-xl mx-auto shadow-xl">
          <h4 className="text-lg font-bold text-white uppercase tracking-wide">
            Punya Pertanyaan Lain?
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Jika kamu mengalami kendala seputar spek alat, tanggal sewa, atau negosiasi sewa jangka panjang, 
            jangan ragu untuk menanyakan langsung.
          </p>
          
          {/* Tombol Booking Sekarang */}
          <div className="pt-2">
            <Link
              to="/booking"
              className="inline-block rounded-xl bg-[#E2725B] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#E2725B]/20 hover:bg-[#E2725B]/90 transition-all"
            >
              Booking Sekarang
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}