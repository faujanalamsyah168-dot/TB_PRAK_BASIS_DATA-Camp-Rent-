// ============================================================
// KONTAK - HALAMAN INFORMASI KONTAK DAN LOKASI
// ============================================================
// Komponen ini menampilkan halaman kontak yang berisi informasi
// lengkap tentang Camp Rent: alamat, WhatsApp, email, jam operasional,
// dan peta lokasi menggunakan Google Maps.
// ============================================================

import React from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export default function Kontak() {
  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen py-16 flex items-center">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full space-y-12">
        
        {/* ============================================================
            1. HEADER / TITLE SECTION
            ============================================================ */}
        <div className="text-center space-y-4 max-w-xl mx-auto">
          {/* Badge label */}
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#E2725B] bg-[#E2725B]/10 border border-[#E2725B]/20 rounded-full px-4 py-1.5">
            Hubungi Camp Rent
          </span>
          
          {/* Judul utama dengan highlight warna oranye */}
          <h1 className="font-outfit text-4xl font-black uppercase text-white sm:text-5xl tracking-tight">
            Ada <span className="text-[#E2725B]">Pertanyaan?</span>
          </h1>
          
          {/* Deskripsi singkat */}
          <p className="text-sm text-slate-400 leading-relaxed">
            Tim kami siap melayani pertanyaan seputar persewaan alat, kerjasama, 
            atau request khusus perlengkapan camping lainnya.
          </p>
        </div>

        {/* ============================================================
            2. KONTEN UTAMA - GRID 2 KOLOM
            ============================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          
          {/* ===== KOLOM KIRI: INFORMASI KONTAK ===== */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8 bg-slate-800/40 border border-slate-800 rounded-[2rem] p-6 sm:p-8">
            
            {/* Header informasi kontak */}
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-white uppercase tracking-wide">
                Informasi Kontak
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Silakan kunjungi basecamp kami atau hubungi kami melalui 
                WhatsApp dan email resmi di bawah ini.
              </p>
            </div>

            {/* Daftar informasi kontak */}
            <div className="space-y-6">
              
              {/* ===== 1. ALAMAT ===== */}
              <div className="flex gap-4 items-center">
                {/* Icon dengan background dan border */}
                <div className="flex-shrink-0 rounded-xl bg-[#3B593F]/20 border border-[#3B593F]/30 p-3.5 text-emerald-400">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                    Basecamp Alamat
                  </h4>
                  <p className="text-sm font-semibold text-white leading-snug">
                    institut teknologi garut
                  </p>
                </div>
              </div>

              {/* ===== 2. WHATSAPP ===== */}
              <div className="flex gap-4 items-center">
                <div className="flex-shrink-0 rounded-xl bg-[#E2725B]/20 border border-[#E2725B]/30 p-3.5 text-[#E2725B]">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                    WhatsApp Chat
                  </h4>
                  {/* Link langsung ke WhatsApp dengan nomor tujuan */}
                  <a 
                    href="https://wa.me/6289517034800" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-sm font-semibold text-white hover:text-[#E2725B] transition-colors block leading-snug"
                  >
                    0895-1703-4800
                  </a>
                </div>
              </div>

              {/* ===== 3. EMAIL ===== */}
              <div className="flex gap-4 items-center">
                <div className="flex-shrink-0 rounded-xl bg-sky-500/10 border border-sky-500/20 p-3.5 text-sky-400">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                    Surat Elektronik (Email)
                  </h4>
                  {/* Link mailto untuk membuka aplikasi email */}
                  <a 
                    href="mailto:rental@CampRent.com" 
                    className="text-sm font-semibold text-white hover:text-sky-400 transition-colors block leading-snug"
                  >
                    rental@CampRent.com
                  </a>
                </div>
              </div>

              {/* ===== 4. JAM OPERASIONAL ===== */}
              <div className="flex gap-4 items-center">
                <div className="flex-shrink-0 rounded-xl bg-indigo-500/10 border border-indigo-500/20 p-3.5 text-indigo-400">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                    Jam Operasional
                  </h4>
                  <p className="text-sm font-semibold text-white leading-snug">
                    Senin - Minggu (08.00 - 21.00 WIB)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ===== KOLOM KANAN: PETA LOKASI ===== */}
          <div className="lg:col-span-7 flex">
            <div className="w-full rounded-[2rem] border border-slate-800 bg-[#1E232A]/60 backdrop-blur-sm p-6 shadow-2xl flex flex-col justify-between gap-4">
              
              {/* Header peta dengan tombol Buka Maps */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold uppercase tracking-wide text-white">
                    Lokasi Kami
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Peta lokasi Camp Rent di Garut untuk memudahkan rute kunjungan.
                  </p>
                </div>
                {/* Tombol untuk membuka Google Maps di tab baru */}
                <a
                  href="https://maps.app.goo.gl/7k3XUSrus9vXvYxG9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-center justify-center text-center rounded-full border border-[#E2725B]/30 bg-[#E2725B]/10 px-5 py-2 text-xs font-bold uppercase tracking-wide text-[#E2725B] hover:bg-[#E2725B]/20 transition-all active:scale-95 whitespace-nowrap"
                >
                  Buka Maps
                </a>
              </div>
              
              {/* ===== IFRAME GOOGLE MAPS ===== */}
              <div className="flex-1 min-h-[350px] overflow-hidden rounded-[1.75rem] border border-slate-800 bg-slate-950">
                <iframe
                  title="Google Maps Garut"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3341.67972298093!2d107.89363777299918!3d-7.2066798040446765!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68b1d119852f2f%3A0x116c33498b7cab1d!2sInstitut%20Teknologi%20Garut!5e1!3m2!1sid!2sid!4v1782210434443!5m2!1sid!2sid"
                  className="h-full w-full border-0"
                  allowFullScreen=""
                  loading="lazy" // Lazy loading untuk performa lebih baik
                />
              </div>
            </div>
          </div>
          
        </div>

      </div>
    </div>
  );
}