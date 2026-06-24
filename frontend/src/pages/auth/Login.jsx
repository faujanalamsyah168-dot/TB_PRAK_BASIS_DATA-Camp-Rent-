// ============================================================
// LOGIN - HALAMAN AUTENTIKASI ADMIN
// ============================================================
// Komponen ini digunakan untuk halaman login admin.
// Fitur: autentikasi dengan email dan password, 
// redirect otomatis jika sudah login, dan notifikasi toast.
// ============================================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Tent, Lock, Mail, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Toast from '../../components/common/Toast';

export default function Login() {
  // ==================== STATE MANAGEMENT ====================
  
  // State untuk field email
  const [email, setEmail] = useState('');
  
  // State untuk field password
  const [password, setPassword] = useState('');
  
  // State untuk menampilkan pesan error
  const [errorMsg, setErrorMsg] = useState('');
  
  // State untuk indikator proses submit (disable tombol saat loading)
  const [submitting, setSubmitting] = useState(false);

  // ==================== HOOKS & CONTEXT ====================
  
  // Hook untuk autentikasi dari AuthContext
  const { login, user, loading } = useAuth();
  
  // Hook untuk navigasi halaman
  const navigate = useNavigate();
  
  // State untuk notifikasi toast
  const [toast, setToast] = useState(null);

  // ==================== REDIRECT JIKA SUDAH LOGIN ====================
  
  /**
   * useEffect untuk redirect otomatis ke dashboard admin
   * Jika user sudah login dan tidak dalam proses loading,
   * langsung diarahkan ke halaman admin
   */
  useEffect(() => {
    if (!loading && user) {
      navigate('/admin');
    }
  }, [user, loading, navigate]);

  // ==================== FUNGSI HANDLE LOGIN ====================
  
  /**
   * Menangani submit form login
   * Melakukan validasi input dan memanggil fungsi login dari AuthContext
   * @param {Event} e - Event submit form
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(''); // Reset pesan error sebelumnya

    // ===== VALIDASI FORM =====
    // Pastikan email dan password tidak kosong
    if (!email || !password) {
      setErrorMsg('Email dan password wajib diisi.');
      return;
    }

    setSubmitting(true); // Aktifkan indikator loading

    try {
      // Panggil fungsi login dari AuthContext
      const result = await login(email, password);

      // Tampilkan pesan sukses setelah login berhasil
      setToast({
        message: result?.message || 'Login berhasil.',
        type: 'success',
      });

      // Redirect ke halaman admin
      navigate('/admin');
    } catch (err) {
      // Tangani error login
      console.error(err);
      setErrorMsg(err.message || 'Login gagal. Email atau password salah.');
    } finally {
      setSubmitting(false); // Matikan indikator loading
    }
  };

  // ==================== RENDER LOADING ====================
  
  // Jika AuthContext masih loading, tampilkan animasi spinner
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0c0f12]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#E2725B] border-t-transparent"></div>
      </div>
    );
  }

  // ==================== RENDER UTAMA ====================
  
  return (
    <div className="min-h-screen bg-[#0c0f12] text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* ===== BACKGROUND DECORATION ===== */}
      {/* Efek blur di latar belakang untuk estetika */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#3B593F]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#E2725B]/5 rounded-full blur-3xl" />

      {/* ===== BACK TO HOME ===== */}
      {/* Link untuk kembali ke halaman utama */}
      <div className="absolute top-8 left-8">
        <Link 
          to="/" 
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-wider"
        >
          <ChevronLeft className="h-4 w-4" /> Kembali Ke Home
        </Link>
      </div>

      {/* ===== HEADER ===== */}
      {/* Logo dan judul halaman login */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-4">
        {/* Logo dengan icon tenda */}
        <div className="flex justify-center">
          <div className="rounded-3xl bg-[#E2725B]/10 border border-[#E2725B]/20 p-4">
            <Tent className="h-10 w-10 text-[#E2725B]" />
          </div>
        </div>
        
        <div>
          <h2 className="font-outfit text-3xl font-black uppercase tracking-wider text-white">
            Portal Administrator
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Masuk untuk mengelola rental outdoor Camp Rent
          </p>
        </div>
      </div>

      {/* ===== FORM LOGIN ===== */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-[#1E232A]/50 border border-slate-800 rounded-3xl py-8 px-6 sm:px-10 shadow-2xl backdrop-blur-md space-y-6">
          
          {/* ===== ERROR MESSAGE ===== */}
          {/* Tampilkan pesan error jika ada */}
          {errorMsg && (
            <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-xs font-semibold text-rose-400">
              {errorMsg}
            </div>
          )}

          {/* ===== TOAST NOTIFICATION ===== */}
          {/* Tampilkan notifikasi toast jika ada */}
          {toast && (
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast(null)}
              duration={3000}
            />
          )}

          {/* ===== FORM ===== */}
          <form onSubmit={handleSubmit} className="space-y-5 text-xs font-semibold">
            
            {/* ===== FIELD EMAIL ===== */}
            <div>
              <label className="block text-slate-400 uppercase mb-2">Alamat Email *</label>
              <div className="relative">
                {/* Icon email di dalam input */}
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-4 w-4 text-slate-500" />
                </span>
                <input
                  type="email"
                  required
                  placeholder="admin@CampRent.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-[#1E232A]/80 py-3.5 pl-10 pr-4 text-xs text-white focus:border-[#E2725B] focus:outline-none"
                />
              </div>
            </div>

            {/* ===== FIELD PASSWORD ===== */}
            <div>
              <label className="block text-slate-400 uppercase mb-2">Kata Sandi *</label>
              <div className="relative">
                {/* Icon lock di dalam input */}
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-4 w-4 text-slate-500" />
                </span>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-[#1E232A]/80 py-3.5 pl-10 pr-4 text-xs text-white focus:border-[#E2725B] focus:outline-none"
                />
              </div>
            </div>

            {/* ===== TOMBOL LOGIN ===== */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-[#E2725B] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#E2725B]/20 hover:bg-[#E2725B]/90 transition-all disabled:opacity-50"
            >
              {submitting ? 'Menghubungkan...' : 'Masuk Sistem'}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}