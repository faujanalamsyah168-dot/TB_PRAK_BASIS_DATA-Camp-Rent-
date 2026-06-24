// ============================================================
// SIDEBAR - KOMPONEN NAVIGASI ADMIN
// ============================================================
// Komponen ini adalah sidebar navigasi untuk halaman admin.
// Berisi menu navigasi ke semua halaman manajemen, profil user,
// dan tombol logout. Hanya tampil untuk admin yang sudah login.
// ============================================================

import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Tent,
  Boxes,
  CalendarDays,
  CreditCard,
  MessageSquare,
  LogOut,
  ChevronRight
} from 'lucide-react';

export default function Sidebar() {
  // ==================== HOOKS ====================
  
  /**
   * Hook untuk mendapatkan data user dan fungsi logout dari AuthContext
   */
  const { user, logout } = useAuth();
  
  /**
   * Hook untuk mendapatkan path URL saat ini
   * Digunakan untuk menentukan menu aktif
   */
  const location = useLocation();
  
  /**
   * Hook untuk navigasi setelah logout
   */
  const navigate = useNavigate();

  // ==================== DATA MENU ====================
  
  /**
   * Array daftar menu admin
   * Setiap menu memiliki: name (nama tampilan), path (URL), icon (komponen icon)
   */
  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: 'Kelola Alat', path: '/admin/alat', icon: <Tent className="h-5 w-5" /> },
    { name: 'Kelola Paket', path: '/admin/paket', icon: <Boxes className="h-5 w-5" /> },
    { name: 'Kelola Booking', path: '/admin/booking', icon: <CalendarDays className="h-5 w-5" /> },
    { name: 'Kelola Pembayaran', path: '/admin/pembayaran', icon: <CreditCard className="h-5 w-5" /> },
    { name: 'Kelola Testimoni', path: '/admin/testimoni', icon: <MessageSquare className="h-5 w-5" /> },
  ];

  // ==================== FUNGSI ====================
  
  /**
   * Menangani logout user
   * Memanggil fungsi logout dari AuthContext dan redirect ke halaman home
   */
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  /**
   * Mengecek apakah menu sedang aktif
   * - Untuk dashboard (/admin): exact match
   * - Untuk menu lain: cek apakah path saat ini dimulai dengan path menu
   * 
   * @param {string} path - Path menu yang dicek
   * @returns {boolean} true jika aktif, false jika tidak
   */
  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  // ==================== RENDER UTAMA ====================
  
  return (
    <aside className="w-64 bg-[#13171B] border-r border-slate-800 flex flex-col h-screen fixed left-0 top-0 text-slate-300">
      
      {/* ============================================================
          1. BRAND / HEADER
          ============================================================ */}
      <div className="h-16 flex items-center gap-2 px-6 border-b border-slate-800 bg-[#0c0f12]/50">
        {/* Icon tenda */}
        <Tent className="h-6 w-6 text-[#E2725B]" />
        
        {/* Nama brand dengan badge ADMIN */}
        <span className="font-outfit text-sm font-extrabold uppercase tracking-widest text-white">
          Camp<span className="text-[#E2725B]">Rent</span> 
          <span className="text-[9px] bg-[#E2725B]/20 text-[#E2725B] px-1.5 py-0.5 rounded font-mono ml-1">
            ADMIN
          </span>
        </span>
      </div>

      {/* ============================================================
          2. USER PROFILE SUMMARY
          ============================================================ */}
      <div className="p-6 border-b border-slate-800 bg-[#13171B]/35 flex items-center gap-3">
        {/* Avatar user (inisial dari nama) */}
        <div className="h-10 w-10 rounded-xl bg-[#E2725B] flex items-center justify-center font-bold text-white uppercase text-lg shadow-lg shadow-[#E2725B]/10 border border-[#E2725B]/25">
          {user ? user.name.charAt(0) : 'A'}
        </div>
        
        {/* Informasi user */}
        <div className="overflow-hidden">
          <h4 className="text-sm font-bold text-white truncate">
            {user ? user.name : 'Admin CampRent'}
          </h4>
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">
            Administrator
          </span>
        </div>
      </div>

      {/* ============================================================
          3. NAVIGASI MENU
          ============================================================ */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                active
                  ? 'bg-[#E2725B] text-white shadow-lg shadow-[#E2725B]/10' // Aktif: background oranye
                  : 'text-slate-400 hover:bg-slate-800/40 hover:text-white' // Nonaktif: hover transparan
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span>{item.name}</span>
              </div>
              {/* Icon panah kanan untuk menu aktif */}
              {active && <ChevronRight className="h-4 w-4" />}
            </Link>
          );
        })}
      </nav>

      {/* ============================================================
          4. LOGOUT BUTTON
          ============================================================ */}
  
      
    </aside>
  );
}