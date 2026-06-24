// ============================================================
// TESTIMONIAL PAGE - HALAMAN ULASAN PELANGGAN
// ============================================================
// Komponen ini menampilkan halaman testimoni yang berisi ulasan
// dari pelanggan Camp Rent. Fitur: melihat daftar testimoni,
// menulis testimoni baru dengan rating bintang, dan form submit.
// ============================================================

import React, { useEffect, useState } from 'react';
import { api } from '../../api/client';
import TestimonialCard from '../../components/common/TestimonialCard';
import { Star, MessageSquarePlus, PenTool } from 'lucide-react';

export default function TestimonialPage() {
  // ==================== STATE MANAGEMENT ====================
  
  /**
   * State untuk menyimpan data testimoni dari API
   * Hanya menampilkan testimoni dengan is_visible = true
   */
  const [testimonials, setTestimonials] = useState([]);
  
  /**
   * State untuk indikator loading saat mengambil data dari API
   */
  const [loading, setLoading] = useState(true);

  // ==================== STATE FORM ====================
  
  /**
   * State untuk field nama pengulas (wajib diisi)
   */
  const [name, setName] = useState('');
  
  /**
   * State untuk field komentar/ulasan (wajib diisi)
   */
  const [comment, setComment] = useState('');
  
  /**
   * State untuk rating bintang (1-5)
   * Default: 5 (bintang penuh)
   */
  const [rating, setRating] = useState(5);
  
  /**
   * State untuk menampilkan pesan error pada form
   */
  const [submitError, setSubmitError] = useState('');
  
  /**
   * State untuk menampilkan pesan sukses pada form
   */
  const [submitSuccess, setSubmitSuccess] = useState('');
  
  /**
   * State untuk indikator proses submit (disable tombol saat loading)
   */
  const [submitting, setSubmitting] = useState(false);

  // ==================== FUNGSI FETCH DATA ====================
  
  /**
   * Mengambil data testimoni dari API
   * Hanya menampilkan testimoni yang is_visible = true
   * Dipanggil saat komponen dimuat dan setelah submit berhasil
   */
  const fetchTestimonials = async () => {
    try {
      const data = await api.get('/testimonials');
      // Filter: hanya tampilkan yang sudah disetujui admin
      setTestimonials(data.filter(t => t.is_visible));
    } catch (err) {
      console.error('Gagal mengambil data testimoni:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * useEffect untuk mengambil data saat komponen pertama kali di-render
   */
  useEffect(() => {
    fetchTestimonials();
  }, []);

  // ==================== FUNGSI SUBMIT FORM ====================
  
  /**
   * Menangani submit form testimoni baru
   * Melakukan validasi, mengirim data ke API, dan refresh daftar
   * 
   * @param {Event} e - Event submit form
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');      // Reset pesan error sebelumnya
    setSubmitSuccess('');    // Reset pesan sukses sebelumnya

    // ===== VALIDASI FORM =====
    // Pastikan nama dan komentar tidak kosong
    if (!name || !comment) {
      setSubmitError('Nama dan ulasan wajib diisi.');
      return;
    }

    setSubmitting(true); // Aktifkan indikator loading pada tombol
    
    try {
      // Kirim request POST ke API untuk menyimpan testimoni baru
      await api.post('/testimonials', { name, comment, rating });
      
      // Tampilkan pesan sukses
      setSubmitSuccess('Ulasan kamu berhasil dikirim dan ditampilkan!');
      
      // Reset form setelah sukses
      setName('');
      setComment('');
      setRating(5);
      
      // Refresh daftar testimoni untuk menampilkan data terbaru
      fetchTestimonials();
    } catch (err) {
      console.error(err);
      setSubmitError(err.message || 'Gagal mengirim ulasan.');
    } finally {
      setSubmitting(false); // Matikan indikator loading
    }
  };

  // ==================== RENDER UTAMA ====================
  
  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* ===== HEADER HALAMAN ===== */}
        <div className="text-center space-y-4 max-w-xl mx-auto">
          {/* Badge label dengan warna oranye */}
          <span className="text-xs font-bold uppercase tracking-widest text-[#E2725B] bg-[#E2725B]/10 border border-[#E2725B]/20 rounded-full px-4 py-1">
            Testimoni & Review
          </span>
          
          {/* Judul utama dengan highlight warna oranye */}
          <h1 className="font-outfit text-4xl font-black uppercase text-white sm:text-5xl">
            Kata <span className="text-[#E2725B]">Mereka</span>
          </h1>
          
          {/* Deskripsi singkat */}
          <p className="text-xs text-slate-400">
            Ulasan asli dari petualang yang telah menggunakan alat sewa outdoor kami untuk berkemah dan naik gunung.
          </p>
        </div>

        {/* ============================================================
            KONTEN UTAMA - GRID 2 KOLOM
            ============================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* ===== KOLOM KIRI: FORM TULIS ULASAN ===== */}
          <div className="lg:col-span-1 h-fit rounded-3xl border border-slate-800 bg-[#1E232A]/50 p-6 md:p-8 shadow-xl backdrop-blur-md space-y-6">
            
            {/* Header form dengan icon */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
              <MessageSquarePlus className="h-5 w-5 text-[#E2725B]" />
              <h3 className="text-lg font-bold text-white tracking-wide uppercase">
                Tulis Ulasan Kamu
              </h3>
            </div>

            {/* Form testimoni */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
              
              {/* ===== PESAN ERROR / SUKSES ===== */}
              {/* Tampilkan pesan error jika ada */}
              {submitError && (
                <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-rose-400">
                  {submitError}
                </div>
              )}
              
              {/* Tampilkan pesan sukses jika ada */}
              {submitSuccess && (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-emerald-400">
                  {submitSuccess}
                </div>
              )}

              {/* ===== FIELD: RATING BINTANG ===== */}
              <div>
                <label className="block text-slate-400 uppercase mb-2">Rating</label>
                <div className="flex gap-2">
                  {/* Loop untuk membuat 5 bintang */}
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="text-slate-400 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`h-6 w-6 ${
                          star <= rating 
                            ? 'fill-amber-400 text-amber-400' // Bintang terisi (warna emas)
                            : 'text-slate-600'                // Bintang kosong (abu-abu)
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* ===== FIELD: NAMA LENGKAP ===== */}
              <div>
                <label className="block text-slate-400 uppercase mb-2">Nama Lengkap *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Rian Petualang"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-[#1E232A]/80 p-3 text-xs text-white focus:border-[#E2725B] focus:outline-none"
                />
              </div>

              {/* ===== FIELD: KOMENTAR ===== */}
              <div>
                <label className="block text-slate-400 uppercase mb-2">Komentar / Ulasan *</label>
                <textarea
                  required
                  rows="4"
                  placeholder="Ceritakan pengalaman kamu menyewa alat di Camp Rent..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-[#1E232A]/80 p-3 text-xs text-white focus:border-[#E2725B] focus:outline-none"
                />
              </div>

              {/* ===== TOMBOL SUBMIT ===== */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-[#E2725B] py-3 text-sm font-bold text-white shadow-lg shadow-[#E2725B]/20 hover:bg-[#E2725B]/90 transition-all disabled:opacity-50"
              >
                {submitting ? 'Mengirim...' : 'Kirim Ulasan'}
              </button>
            </form>
          </div>

          {/* ===== KOLOM KANAN: DAFTAR TESTIMONI ===== */}
          <div className="lg:col-span-2">
            
            {loading ? (
              // ===== TAMPILAN LOADING =====
              // Menampilkan spinner animasi saat data sedang dimuat
              <div className="flex h-60 items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#E2725B] border-t-transparent"></div>
              </div>
              
            ) : testimonials.length === 0 ? (
              // ===== TAMPILAN KOSONG =====
              // Menampilkan pesan jika belum ada testimoni
              <div className="text-center py-20 border border-slate-800 rounded-3xl bg-slate-900/50">
                <PenTool className="h-10 w-10 text-slate-600 mx-auto mb-4" />
                <h4 className="text-base font-bold text-slate-500">Belum ada ulasan untuk ditampilkan.</h4>
                <p className="text-xs text-slate-655 mt-1">
                  Jadilah yang pertama menulis ulasan tentang Camp Rent!
                </p>
              </div>
              
            ) : (
              // ===== GRID TESTIMONI =====
              // Menampilkan daftar testimoni dalam grid 2 kolom
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {testimonials.map((test) => (
                  <TestimonialCard key={test.id} testimonial={test} />
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}