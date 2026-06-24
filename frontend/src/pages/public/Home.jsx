// ============================================================
// HOME - HALAMAN UTAMA LANDING PAGE
// ============================================================
// Komponen ini adalah halaman utama (landing page) dari aplikasi
// Camp Rent. Menampilkan hero section, keunggulan, paket hemat,
// alat populer, testimoni, dan call to action.
// ============================================================

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../api/client';
import EquipmentCard from '../../components/common/EquipmentCard';
import PackageCard from '../../components/common/PackageCard';
import TestimonialCard from '../../components/common/TestimonialCard';
import { Tent, ShieldCheck, CheckCircle2, BadgePercent, ArrowRight } from 'lucide-react';

export default function Home() {
  // ==================== STATE MANAGEMENT ====================
  
  // State untuk menyimpan data alat (hanya 3 teratas)
  const [equipment, setEquipment] = useState([]);
  
  // State untuk menyimpan data paket (hanya 3 teratas)
  const [packages, setPackages] = useState([]);
  
  // State untuk menyimpan data testimoni (hanya 3 yang tampil)
  const [testimonials, setTestimonials] = useState([]);
  
  // Hook untuk navigasi ke halaman lain
  const navigate = useNavigate();

  // ==================== FETCH DATA ====================
  
  /**
   * useEffect untuk mengambil data landing page dari API
   * Mengambil data equipment, packages, dan testimonials secara paralel
   * Hanya menampilkan 3 data teratas untuk setiap kategori
   */
  useEffect(() => {
    const fetchLandingData = async () => {
      try {
        // Mengambil 3 API secara paralel menggunakan Promise.all
        const [equipData, pkgData, testData] = await Promise.all([
          api.get('/equipment'),
          api.get('/packages'),
          api.get('/testimonials')
        ]);
        
        // Ambil 3 data teratas untuk ditampilkan di landing page
        setEquipment(equipData.slice(0, 3));
        setPackages(pkgData.slice(0, 3));
        // Filter testimoni yang visible dan ambil 3 teratas
        setTestimonials(testData.filter(t => t.is_visible).slice(0, 3));
      } catch (err) {
        console.error('Gagal memuat data landing page:', err);
      }
    };
    fetchLandingData();
  }, []);

  // ==================== FUNGSI NAVIGASI ====================
  
  /**
   * Menangani klik tombol booking pada card
   * Navigasi ke halaman booking dengan data item yang dipilih
   * @param {Object} item - Data item (alat atau paket) yang dipilih
   */
  const handleBook = (item) => {
    navigate('/booking', { 
      state: { 
        preselectedItem: item,
        // Deteksi tipe item: jika ada properti items maka paket, else equipment
        preselectedType: item.items ? 'package' : 'equipment' 
      } 
    });
  };

  // ==================== RENDER UTAMA ====================
  
  return (
    <div className="space-y-20 bg-slate-900 text-slate-100">
      
      {/* ============================================================
          1. HERO SECTION - BAGIAN UTAMA HALAMAN
          ============================================================ */}
      <section 
        className="relative h-[85vh] w-full bg-cover bg-center"
        style={{ 
          backgroundImage: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.4), rgba(15, 23, 42, 0.95)), url("https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1600")' 
        }}
      >
        <div className="mx-auto flex h-full max-w-7xl flex-col justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-6 animate-fade-in">
            
            {/* Badge label */}
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E2725B]/20 border border-[#E2725B]/35 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#E2725B]">
              <Tent className="h-4 w-4" /> Camp Rent Rental
            </span>
            
            {/* Judul utama hero */}
            <h1 className="font-outfit text-5xl font-black uppercase tracking-tight text-white sm:text-6xl md:text-7xl leading-none">
              Sewa Alat Camping <br />
              <span className="text-[#E2725B]">Tanpa Ribet</span>
            </h1>
            
            {/* Deskripsi hero */}
            <p className="text-base text-slate-300 leading-relaxed max-w-lg">
              Rental alat outdoor lengkap, bersih, wangi, dan siap dipakai buat camping, 
              hiking, atau healing sok anak alam di daerah Garut dan sekitarnya.
            </p>
            
            {/* Tombol aksi hero */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                to="/booking"
                className="rounded-2xl bg-[#E2725B] px-8 py-4 text-sm font-bold text-white shadow-xl shadow-[#E2725B]/30 hover:bg-[#E2725B]/90 transition-all hover:scale-105"
              >
                Booking Sekarang
              </Link>
              <Link
                to="/alat"
                className="rounded-2xl border border-slate-700 bg-slate-800/40 px-8 py-4 text-sm font-bold text-slate-300 backdrop-blur-md hover:bg-slate-800 hover:text-white transition-all hover:scale-105"
              >
                Lihat Katalog Alat
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          2. CORE VALUE / KEUNGGULAN - 4 KEUNGGULAN UTAMA
          ============================================================ */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h2 className="font-outfit text-3xl font-extrabold uppercase tracking-tight text-white">
            Kenapa Harus Sewa Di Camp Rent?
          </h2>
          <p className="text-sm text-slate-400">
            Kami berkomitmen memberikan pengalaman camping terbaik dengan alat-alat berkualitas tinggi.
          </p>
        </div>

        {/* Grid 4 kolom keunggulan */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Keunggulan 1: Alat Lengkap */}
          <div className="rounded-3xl border border-slate-800 bg-slate-850 p-6 space-y-4">
            <div className="inline-block rounded-2xl bg-[#3B593F]/20 border border-[#3B593F]/35 p-3 text-[#3B593F]">
              <Tent className="h-6 w-6 text-emerald-400" />
            </div>
            <h4 className="text-lg font-bold text-white">Alat Lengkap</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Mulai dari tenda, sleeping bag, tas carrier, nesting, kompor portable, matras, sampai lampu tenda.
            </p>
          </div>

          {/* Keunggulan 2: Harga Terjangkau */}
          <div className="rounded-3xl border border-slate-800 bg-slate-850 p-6 space-y-4">
            <div className="inline-block rounded-2xl bg-[#E2725B]/20 border border-[#E2725B]/35 p-3 text-[#E2725B]">
              <BadgePercent className="h-6 w-6" />
            </div>
            <h4 className="text-lg font-bold text-white">Harga Terjangkau</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Harga sewa harian ramah di kantong mahasiswa maupun traveler hemat. 
              Kami juga menyediakan paket sewa bundling hemat.
            </p>
          </div>

          {/* Keunggulan 3: Barang Terawat */}
          <div className="rounded-3xl border border-slate-800 bg-slate-850 p-6 space-y-4">
            <div className="inline-block rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-emerald-400">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h4 className="text-lg font-bold text-white">Barang Terawat</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Semua perlengkapan selalu dicuci bersih, wangi, diinspeksi kelengkapannya 
              dan dipastikan kokoh sebelum diserahkan.
            </p>
          </div>

          {/* Keunggulan 4: Booking Mudah */}
          <div className="rounded-3xl border border-slate-800 bg-slate-850 p-6 space-y-4">
            <div className="inline-block rounded-2xl bg-sky-500/10 border border-sky-500/20 p-3 text-sky-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h4 className="text-lg font-bold text-white">Booking Mudah</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pilih item, isi form booking online, dan admin kami akan langsung 
              menghubungi kamu via WhatsApp untuk konfirmasi pengambilan.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          3. FEATURED PACKAGES - PAKET HEMAT
          ============================================================ */}
      {packages.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header section paket */}
          <div className="flex items-end justify-between border-b border-slate-800 pb-6">
            <div className="space-y-2">
              <h2 className="font-outfit text-3xl font-extrabold uppercase tracking-tight text-white">
                Pilihan Paket Hemat
              </h2>
              <p className="text-sm text-slate-400">
                Pilih paket bundling sewa untuk camping yang lebih hemat dan praktis.
              </p>
            </div>
            {/* Link ke halaman paket (hidden di mobile) */}
            <Link to="/paket" className="hidden md:flex items-center gap-1.5 text-xs font-bold text-[#E2725B] hover:text-[#E2725B]/90 transition-colors uppercase tracking-widest">
              Lihat Semua <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Grid 3 kolom paket */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <PackageCard key={pkg.id} rentalPackage={pkg} onBook={handleBook} />
            ))}
          </div>
        </section>
      )}

      {/* ============================================================
          4. FEATURED EQUIPMENT - ALAT POPULER
          ============================================================ */}
      {equipment.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header section alat */}
          <div className="flex items-end justify-between border-b border-slate-800 pb-6">
            <div className="space-y-2">
              <h2 className="font-outfit text-3xl font-extrabold uppercase tracking-tight text-white">
                Daftar Alat Populer
              </h2>
              <p className="text-sm text-slate-400">
                Alat outdoor berkualitas yang siap menemani petualangan alam bebasmu.
              </p>
            </div>
            {/* Link ke halaman alat (hidden di mobile) */}
            <Link to="/alat" className="hidden md:flex items-center gap-1.5 text-xs font-bold text-[#E2725B] hover:text-[#E2725B]/90 transition-colors uppercase tracking-widest">
              Katalog Lengkap <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Grid 3 kolom alat */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {equipment.map((item) => (
              <EquipmentCard key={item.id} equipment={item} onBook={handleBook} />
            ))}
          </div>
        </section>
      )}

      {/* ============================================================
          5. TESTIMONIAL SECTION - ULASAN PELANGGAN
          ============================================================ */}
      {testimonials.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-4 pb-6">
            <h2 className="font-outfit text-3xl font-extrabold uppercase tracking-tight text-white">
              Apa Kata Mereka?
            </h2>
            <p className="text-sm text-slate-400">
              Ulasan jujur dari kawan petualang yang telah mempercayakan peralatannya pada kami.
            </p>
          </div>

          {/* Grid 3 kolom testimoni */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((test) => (
              <TestimonialCard key={test.id} testimonial={test} />
            ))}
          </div>
        </section>
      )}

      {/* ============================================================
          6. CALL TO ACTION BANNER - AJAKAN BOOKING
          ============================================================ */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        <div className="rounded-3xl border border-[#3B593F]/30 bg-gradient-to-r from-[#1E232A] to-[#13171B] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
          
          {/* Efek dekoratif (glow) di latar belakang */}
          <div className="absolute top-0 right-0 h-40 w-40 bg-[#3B593F]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 h-40 w-40 bg-[#E2725B]/5 rounded-full blur-3xl" />
          
          {/* Konten kiri: teks ajakan */}
          <div className="space-y-4 max-w-xl relative z-10">
            <h2 className="font-outfit text-3xl font-black uppercase tracking-tight text-white">
              Siap Healing Bernuansa Alam Bebas?
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Booking perlengkapanmu sekarang, pastikan stok aman sebelum keberangkatan, 
              dan nikmati petualanganmu tanpa memikirkan repotnya beli alat tenda yang mahal!
            </p>
          </div>

          {/* Konten kanan: tombol aksi */}
          <div className="relative z-10 flex flex-wrap gap-4">
            <Link
              to="/booking"
              className="rounded-2xl bg-[#E2725B] px-8 py-4 text-sm font-bold text-white shadow-xl shadow-[#E2725B]/20 hover:bg-[#E2725B]/90 transition-all hover:scale-105"
            >
              Booking Sekarang
            </Link>
            <Link
              to="/Hubungi Kami"
              className="rounded-2xl border border-slate-700 bg-slate-800/40 px-8 py-4 text-sm font-bold text-slate-300 backdrop-blur-md hover:bg-slate-800 hover:text-white transition-all hover:scale-105"
            >
              Hubungi Kami
            </Link>
          </div>
        </div>
      </section>
      
    </div>
  );
}