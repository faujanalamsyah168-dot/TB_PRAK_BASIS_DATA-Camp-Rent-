// ============================================================
// TENTANG - HALAMAN TENTANG KAMI
// ============================================================
// Komponen ini menampilkan halaman tentang Camp Rent yang berisi
// cerita brand, visi misi, dan komitmen pelayanan. Terdiri dari
// 3 bagian utama: header, brand story, dan value guarantees.
// ============================================================

import React from 'react';
import { Tent, Award, Sparkles, HeartHandshake } from 'lucide-react';

export default function Tentang() {
  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* ============================================================
            1. HEADER / TITLE SECTION
            ============================================================ */}
        <div className="text-center space-y-4">
          {/* Badge label */}
          <span className="text-xs font-bold uppercase tracking-widest text-[#E2725B] bg-[#E2725B]/10 border border-[#E2725B]/20 rounded-full px-4 py-1">
            Tentang Camp Rent
          </span>
          
          {/* Judul utama dengan highlight warna oranye */}
          <h1 className="font-outfit text-4xl font-black uppercase text-white sm:text-5xl">
            Solusi Sewa Alat Camping <br className="hidden sm:inline" />
            <span className="text-[#E2725B]">Tanpa Ribet & Terpercaya</span>
          </h1>
          
          {/* Deskripsi singkat tentang tujuan Camp Rent */}
          <p className="max-w-xl mx-auto text-sm text-slate-400 leading-relaxed">
            Membantu Anda menikmati keindahan alam bebas Indonesia tanpa harus 
            dibebani biaya mahal untuk membeli perlengkapan camping.
          </p>
        </div>

        {/* ============================================================
            2. BRAND STORY DAN GAMBAR
            ============================================================ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* ===== KOLOM KIRI: CERITA BRAND ===== */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white tracking-wide">
              Cerita Di Balik Camp Rent
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Camp Rent berawal dari dari sekumpulan anak muda di Garut yang hobi mendaki gunung dan healing ke alam bebas
              Untuk itu, kami menghadirkan Camp Rent sebagai solusi persewaan 
              alat outdoor terlengkap dengan komitmen memberikan barang yang 
              bersih, higienis, terawat, dan siap pakai. Kami merawat setiap 
              barang seperti milik sendiri agar petualangan Anda tetap aman 
              dan menyenangkan.
            </p>
          </div>
          
          {/* ===== KOLOM KANAN: GAMBAR ===== */}
          <div className="rounded-3xl overflow-hidden border border-slate-700/50 shadow-2xl relative aspect-video md:aspect-square">
            <img 
              src="https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=600" 
              alt="Tenda Camping di Alam" 
              className="w-full h-full object-cover"
            />
            {/* Gradient overlay untuk efek visual yang lebih baik */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
          </div>
        </div>

        {/* ============================================================
            3. VALUE GUARANTEES / KEUNGGULAN
            ============================================================ */}
        <div className="space-y-8">
          
          {/* Judul section keunggulan */}
          <h3 className="text-2xl font-bold text-center text-white tracking-wide">
            Komitmen Pelayanan Kami
          </h3>
          
          {/* Grid 3 kolom keunggulan */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* ===== KEUNGGULAN 1: Produk Berkualitas ===== */}
            <div className="rounded-3xl bg-[#1E232A]/50 border border-slate-800 p-6 space-y-3">
              {/* Icon dengan background oranye */}
              <div className="inline-block rounded-2xl bg-[#E2725B]/20 border border-[#E2725B]/35 p-3 text-[#E2725B]">
                <Award className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-bold text-white">100% Produk Berkualitas</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Kami hanya menyediakan merek-merek alat outdoor terkemuka yang 
                sudah teruji ketangguhannya di medan gunung Indonesia.
              </p>
            </div>

            {/* ===== KEUNGGULAN 2: Bersih, Wangi & Steril ===== */}
            <div className="rounded-3xl bg-[#1E232A]/50 border border-slate-800 p-6 space-y-3">
              {/* Icon dengan background hijau */}
              <div className="inline-block rounded-2xl bg-[#3B593F]/20 border border-[#3B593F]/35 p-3 text-emerald-400">
                <Sparkles className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Bersih, Wangi & Steril</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Semua tenda disapu bersih, sleeping bag dicuci wangi dengan 
                antiseptik khusus, dan alat masak disterilisasi sebelum disewakan.
              </p>
            </div>

            {/* ===== KEUNGGULAN 3: Respon Cepat & Mudah ===== */}
            <div className="rounded-3xl bg-[#1E232A]/50 border border-slate-800 p-6 space-y-3">
              {/* Icon dengan background biru */}
              <div className="inline-block rounded-2xl bg-sky-500/10 border border-sky-500/20 p-3 text-sky-400">
                <HeartHandshake className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Respon Cepat & Mudah</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Proses administrasi yang ringkas dan ramah. Hubungi kami via 
                WhatsApp dan barang siap diambil sesuai jadwal sewa.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}