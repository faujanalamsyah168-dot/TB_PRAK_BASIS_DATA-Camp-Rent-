// ============================================================
// ADMIN LAYOUT
// ============================================================
// Layout utama halaman admin yang berisi sidebar, header,
// informasi admin, dropdown notifikasi, dan tombol logout.
// ============================================================

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Bell, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/client';

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const notifContainerRef = useRef(null);

  // ==========================================================
  // STATE NOTIFIKASI
  // ==========================================================

  const [notifOpen, setNotifOpen] = useState(false);
  const [notifLoading, setNotifLoading] = useState(true);
  const [notifError, setNotifError] = useState('');
  const [notifItems, setNotifItems] = useState([]);

  const notifCount = notifItems.length;

  // ==========================================================
  // LOGOUT
  // ==========================================================

  const handleLogout = () => {
    setNotifOpen(false);
    logout();
    navigate('/');
  };

  // ==========================================================
  // MENGAMBIL DATA NOTIFIKASI
  // ==========================================================

  const fetchNotif = useCallback(async () => {
    try {
      setNotifLoading(true);
      setNotifError('');

      const data = await api.get(
        '/bookings/notifications?status=pending'
      );

      if (Array.isArray(data)) {
        setNotifItems(data);
      } else if (Array.isArray(data?.items)) {
        setNotifItems(data.items);
      } else {
        setNotifItems([]);
      }
    } catch (error) {
      console.error('Gagal mengambil notifikasi:', error);

      setNotifError(
        error?.message || 'Gagal memuat notifikasi booking'
      );
    } finally {
      setNotifLoading(false);
    }
  }, []);

  // Muat notifikasi saat halaman pertama kali dibuka
  // dan lakukan pembaruan secara berkala.
  useEffect(() => {
    fetchNotif();

    const intervalId = window.setInterval(() => {
      // Jangan melakukan request ketika tab tidak aktif.
      if (document.visibilityState === 'visible') {
        fetchNotif();
      }
    }, 15000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [fetchNotif]);

  // Refresh ketika pengguna kembali membuka tab browser.
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchNotif();
      }
    };

    document.addEventListener(
      'visibilitychange',
      handleVisibilityChange
    );

    return () => {
      document.removeEventListener(
        'visibilitychange',
        handleVisibilityChange
      );
    };
  }, [fetchNotif]);

  // Tutup dropdown dengan tombol Escape.
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setNotifOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Tutup dropdown ketika pengguna mengklik area di luar dropdown.
  useEffect(() => {
    if (!notifOpen) return undefined;

    const handleClickOutside = (event) => {
      if (
        notifContainerRef.current &&
        !notifContainerRef.current.contains(event.target)
      ) {
        setNotifOpen(false);
      }
    };

    document.addEventListener(
      'mousedown',
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      );
    };
  }, [notifOpen]);

  // ==========================================================
  // FORMAT TANGGAL NOTIFIKASI
  // ==========================================================

  const formatNotificationDate = (createdAt) => {
    if (!createdAt) return '-';

    const date = new Date(createdAt);

    if (Number.isNaN(date.getTime())) {
      return '-';
    }

    return date.toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="min-h-screen bg-[#0c0f12] font-sans text-slate-100 antialiased">
      {/* Sidebar */}
      <Sidebar />

      {/* Area utama admin */}
      <div className="ml-64 flex min-h-screen flex-col">
        {/* Header */}
        <header className="sticky top-0 z-[100] isolate flex h-16 shrink-0 items-center justify-between overflow-visible border-b border-slate-800 bg-[#13171B]/95 px-8 backdrop-blur-md">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Panel Kontrol Admin
          </h2>

          <div className="flex items-center gap-4">
            {/* Informasi admin dan notifikasi */}
            <div className="flex items-center gap-3">
              {/* Informasi pengguna */}
              <div className="flex items-center gap-2 rounded-xl border border-slate-700/30 bg-slate-800/40 px-3 py-1.5 text-xs text-slate-300">
                <User
                  className="h-4 w-4 text-[#E2725B]"
                  aria-hidden="true"
                />

                <span>
                  Halo,{' '}
                  <strong className="text-white">
                    {user?.name || 'Admin'}
                  </strong>
                </span>
              </div>

              {/* Dropdown notifikasi */}
              <div
                ref={notifContainerRef}
                className="relative z-[110]"
              >
                <button
                  type="button"
                  onClick={() =>
                    setNotifOpen((currentValue) => !currentValue)
                  }
                  className="relative rounded-xl border border-slate-800 bg-[#13171B] p-2 text-slate-400 transition-all hover:border-[#E2725B]/40 hover:text-[#E2725B] focus:outline-none focus:ring-2 focus:ring-[#E2725B]/50"
                  title="Notifikasi booking"
                  aria-label="Buka notifikasi booking"
                  aria-expanded={notifOpen}
                  aria-haspopup="dialog"
                >
                  <Bell
                    className="h-4 w-4"
                    aria-hidden="true"
                  />

                  {notifCount > 0 && (
                    <span
                      className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border border-[#0c0f12] bg-[#E2725B] px-1 text-[10px] font-bold text-white"
                      aria-label={`${notifCount} notifikasi booking`}
                    >
                      {notifCount > 99 ? '99+' : notifCount}
                    </span>
                  )}
                </button>

                {notifOpen && (
                  <div
                    role="dialog"
                    aria-label="Notifikasi booking"
                    className="absolute right-0 top-full z-[120] mt-2 flex max-h-[calc(100dvh-5rem)] w-[min(360px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-slate-700 bg-[#13171B] shadow-2xl shadow-black/60"
                  >
                    {/* Header dropdown */}
                    <div className="shrink-0 border-b border-slate-800 px-4 py-3">
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Notifikasi Booking
                        </p>

                        <button
                          type="button"
                          onClick={() => setNotifOpen(false)}
                          className="rounded-md px-1 py-0.5 text-[10px] text-slate-500 transition-colors hover:bg-slate-800 hover:text-slate-300"
                        >
                          Tutup
                        </button>
                      </div>

                      {notifError ? (
                        <div className="mt-2">
                          <p className="text-xs text-rose-400">
                            {notifError}
                          </p>

                          <button
                            type="button"
                            onClick={fetchNotif}
                            className="mt-2 text-[11px] font-semibold text-[#E2725B] hover:underline"
                          >
                            Coba lagi
                          </button>
                        </div>
                      ) : (
                        <p
                          className="mt-1 text-[11px] text-slate-500"
                          aria-live="polite"
                        >
                          {notifLoading
                            ? 'Memuat notifikasi...'
                            : `${notifCount} notifikasi booking`}
                        </p>
                      )}
                    </div>

                    {/* Daftar notifikasi */}
                    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                      {notifLoading ? (
                        <div className="space-y-2 p-4">
                          <div className="h-14 w-full animate-pulse rounded-xl bg-slate-800/60" />
                          <div className="h-14 w-full animate-pulse rounded-xl bg-slate-800/60" />
                          <div className="h-14 w-full animate-pulse rounded-xl bg-slate-800/60" />
                        </div>
                      ) : notifError ? (
                        <div className="p-4">
                          <p className="text-sm text-slate-500">
                            Notifikasi belum dapat ditampilkan.
                          </p>
                        </div>
                      ) : notifItems.length === 0 ? (
                        <div className="p-4">
                          <p className="text-sm text-slate-500">
                            Tidak ada notifikasi booking baru.
                          </p>
                        </div>
                      ) : (
                        <div className="p-2">
                          {notifItems.map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => {
                                setNotifOpen(false);

                                navigate(
                                  `/admin/booking?bookingId=${item.id}`
                                );
                              }}
                              className="block w-full rounded-xl border border-transparent px-3 py-3 text-left transition-all hover:border-slate-700/50 hover:bg-slate-800/50 focus:border-slate-700 focus:bg-slate-800/50 focus:outline-none"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <p className="truncate text-xs font-bold text-white">
                                    {item.customer_name ||
                                      'Customer'}
                                  </p>

                                  <p className="mt-1 text-[11px] text-slate-500">
                                    {formatNotificationDate(
                                      item.created_at
                                    )}
                                  </p>

                                  <p className="mt-1 text-[11px] text-slate-400">
                                    Status:{' '}
                                    <span className="font-semibold capitalize text-slate-200">
                                      {item.status || '-'}
                                    </span>
                                  </p>
                                </div>

                                <span className="inline-flex shrink-0 items-center rounded-full border border-slate-700/50 bg-slate-800/30 px-2 py-0.5 text-[10px] font-bold text-slate-300">
                                  Lihat
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Footer dropdown */}
                    <div className="shrink-0 border-t border-slate-800 bg-[#13171B] px-4 py-3">
                      <button
                        type="button"
                        onClick={() => {
                          setNotifOpen(false);
                          navigate('/admin/booking');
                        }}
                        className="w-full rounded-lg py-1 text-left text-xs font-bold uppercase tracking-wider text-[#E2725B] transition-colors hover:text-[#f28b76] focus:outline-none focus:ring-2 focus:ring-[#E2725B]/40"
                      >
                        Buka Kelola Booking
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tombol logout */}
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl border border-slate-800 bg-[#13171B] p-2 text-slate-400 transition-all hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-500/40"
              title="Keluar sesi"
              aria-label="Keluar dari akun admin"
            >
              <LogOut
                className="h-4 w-4"
                aria-hidden="true"
              />
            </button>
          </div>
        </header>

        {/* Konten halaman */}
        {/* Jangan tambahkan z-0 pada main karena dapat membuat
            stacking context baru dan mengganggu modal. */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-8">
          <div className="mx-auto max-w-6xl space-y-8 animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}