// ============================================================
// KELOLA BOOKING - HALAMAN MANAJEMEN TRANSAKSI PENYEWAAN
// ============================================================

import React, { useEffect, useState } from 'react';
import { api } from '../../api/client';
import DataTable from '../../components/common/DataTable';
import ModalForm from '../../components/common/ModalForm';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import StatusBadge from '../../components/common/StatusBadge';
import Toast from '../../components/common/Toast';
import { Eye, Trash2, Phone, Calendar, MapPin, FileText, RefreshCw } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function KelolaBooking() {
  // ==================== HOOKS & ROUTER ====================
  const location = useLocation();
  const navigate = useNavigate();

  // ==================== STATE MANAGEMENT ====================
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All');

  // ==================== STATE MODAL DETAIL ====================
  const [isOpenDetail, setIsOpenDetail] = useState(false);
  const [viewingBooking, setViewingBooking] = useState(null);

  // ==================== STATE UPDATE STATUS ====================
  const [updatingStatusId, setUpdatingStatusId] = useState(null);
  const [updatingStatusVal, setUpdatingStatusVal] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // ==================== STATE KONFIRMASI HAPUS ====================
  const [isOpenConfirm, setIsOpenConfirm] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // ==================== STATE TOAST NOTIFIKASI ====================
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');

  // ==================== FUNGSI FETCH DATA ====================
  const fetchBookings = async () => {
    try {
      const data = await api.get('/bookings');
      
      // 🔥 PASTIKAN data ADALAH ARRAY
      const bookingsData = Array.isArray(data) ? data : [];
      
      // 🔥 SORTING DATA - Urutkan berdasarkan ID dari yang terbesar ke terkecil (terbaru di atas)
      const sortedData = bookingsData.sort((a, b) => b.id - a.id);
      
      setBookings(sortedData);
      
    } catch (err) {
      console.error('Gagal mengambil data booking:', err);
      triggerToast('Gagal mengambil data booking.', 'error');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // ==================== FUNGSI UNTUK MEMBERSIHKAN URL ====================
  const clearBookingIdFromURL = () => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.has('bookingId')) {
      searchParams.delete('bookingId');
      const newSearch = searchParams.toString();
      const newPath = location.pathname + (newSearch ? `?${newSearch}` : '');
      navigate(newPath, { replace: true });
    }
  };

  // ==================== FUNGSI TUTUP MODAL ====================
  const handleCloseDetail = () => {
    setIsOpenDetail(false);
    setViewingBooking(null);
    clearBookingIdFromURL();
  };

  // ==================== AUTO-OPEN DETAIL DARI NOTIFIKASI ====================
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const bookingId = params.get('bookingId');
    
    if (!bookingId) {
      if (isOpenDetail) {
        setIsOpenDetail(false);
        setViewingBooking(null);
      }
      return;
    }

    const openBookingDetail = async () => {
      try {
        if (viewingBooking && viewingBooking.id === parseInt(bookingId) && isOpenDetail) {
          return;
        }

        const detail = await api.get(`/bookings/${bookingId}`);
        setViewingBooking(detail);
        setIsOpenDetail(true);
      } catch (err) {
        console.error('Gagal memuat detail booking:', err);
        triggerToast('Gagal memuat detail booking.', 'error');
        clearBookingIdFromURL();
      }
    };

    openBookingDetail();
  }, [location.search]);

  // ==================== FUNGSI UTILITY ====================
  const triggerToast = (msg, type = 'success') => {
    setToastMsg(msg);
    setToastType(type);
  };

  // ==================== FUNGSI CRUD ====================
  const handleDetailOpen = async (bookingId) => {
    try {
      const detail = await api.get(`/bookings/${bookingId}`);
      setViewingBooking(detail);
      setIsOpenDetail(true);
    } catch (err) {
      console.error('Gagal memuat detail booking:', err);
      triggerToast('Gagal memuat detail booking.', 'error');
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    setUpdatingStatusId(bookingId);
    setUpdatingStatusVal(newStatus);
    setIsUpdating(true);
    
    try {
      await api.put(`/bookings/${bookingId}/status`, { status: newStatus });
      triggerToast(`Status booking berhasil diubah ke "${newStatus}".`);
      
      if (viewingBooking && viewingBooking.id === bookingId) {
        setViewingBooking({ ...viewingBooking, status: newStatus });
      }

      fetchBookings();
    } catch (err) {
      console.error('Gagal mengubah status booking:', err);
      triggerToast(err.message || 'Gagal mengubah status booking.', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteOpen = (id) => {
    setDeletingId(id);
    setIsOpenConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    try {
      await api.delete(`/bookings/${deletingId}`);
      triggerToast('Booking berhasil dihapus.');
      
      if (viewingBooking && viewingBooking.id === deletingId) {
        handleCloseDetail();
      }
      
      fetchBookings();
    } catch (err) {
      console.error('Gagal menghapus data booking:', err);
      triggerToast('Gagal menghapus data booking.', 'error');
    }
  };

  // ==================== FUNGSI FORMAT ====================
  const formatIDR = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num);
  };

  // ==================== FILTER DATA ====================
  const filteredBookings = bookings.filter(b => {
    if (selectedStatusFilter === 'All') return true;
    return b.status === selectedStatusFilter;
  });

  // ==================== KONFIGURASI TABLE ====================
  const headers = [
    // 🔥 KOLOM NO URUT (rapi setelah delete)
    {
      key: 'id',
      label: 'ID',
      className: 'px-4 py-4 w-[6%] text-center',
render: (_row, rowIdx) => (
        <span className="text-xs font-mono font-bold text-slate-500">{filteredBookings.length - rowIdx}</span>
      ),
    },
    { key: 'customer_name', label: 'Nama Penyewa', className: 'px-4 py-4 w-[14%]' },
    {
      label: 'Nomor WA',
      className: 'px-4 py-4 w-[14%]',
      render: (row) => (
        <a
          href={`https://wa.me/${row.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 font-semibold text-emerald-400 hover:underline"
        >
          <Phone className="h-3.5 w-3.5 flex-shrink-0" /> 
          <span className="truncate">{row.whatsapp}</span>
        </a>
      )
    },
    {
      label: 'Tanggal Sewa',
      className: 'px-4 py-4 w-[18%]',
      render: (row) => (
        <span className="text-xs text-slate-400 whitespace-nowrap">
          {new Date(row.start_date).toLocaleDateString('id-ID')} s/d {new Date(row.end_date).toLocaleDateString('id-ID')}
        </span>
      )
    },
    {
      label: 'Durasi',
      className: 'px-4 py-4 w-[8%] text-center',
      render: (row) => <span className="whitespace-nowrap">{row.total_days} Hari</span>
    },
    {
      label: 'Total Biaya',
      className: 'px-4 py-4 w-[14%]',
      render: (row) => (
        <span className="font-extrabold text-[#E2725B] whitespace-nowrap">
          {formatIDR(row.total_price)}
        </span>
      )
    },
    {
      label: 'Status',
      className: 'px-4 py-4 w-[20%]',
      render: (row) => (
        <div className="flex items-center gap-2 flex-wrap">
          <StatusBadge status={row.status} />
          <select
            value={row.status}
            disabled={isUpdating && updatingStatusId === row.id}
            onChange={(e) => handleStatusChange(row.id, e.target.value)}
            className="rounded border border-slate-700 bg-slate-900 py-1 px-1.5 text-[10px] font-bold text-slate-300 focus:border-[#E2725B] focus:outline-none"
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rented">Rented</option>
            <option value="returned">Returned</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      )
    }
  ];

  const actions = (row) => (
    <div className="flex justify-end gap-2 flex-nowrap">
      <button
        onClick={() => handleDetailOpen(row.id)}
        className="rounded-lg border border-slate-700 p-2 text-sky-400 hover:bg-sky-500/10 hover:text-sky-300 transition-colors flex-shrink-0"
        title="Lihat Detail Booking"
      >
        <Eye className="h-4 w-4" />
      </button>
      <button
        onClick={() => handleDeleteOpen(row.id)}
        className="rounded-lg border border-slate-700 p-2 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors flex-shrink-0"
        title="Hapus Booking"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );

  // ==================== RENDER UTAMA ====================
  return (
    <div className="space-y-6">
      {/* HEADER HALAMAN */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-wide text-white">Kelola Booking</h1>
          <p className="text-xs text-slate-400">Verifikasi pemesanan sewa, sesuaikan status, dan kontak pelanggan via WhatsApp.</p>
        </div>
        
        <button
          onClick={fetchBookings}
          className="flex items-center gap-1 text-xs font-bold text-[#E2725B] hover:underline uppercase tracking-wider flex-shrink-0"
        >
          <RefreshCw className="h-4 w-4" /> Refresh Data
        </button>
      </div>

      {/* FILTER TAB */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-4">
        {['All', 'pending', 'approved', 'rented', 'returned', 'cancelled'].map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedStatusFilter(tab)}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all border uppercase tracking-wider ${
              selectedStatusFilter === tab
                ? 'bg-[#E2725B] text-white border-[#E2725B]'
                : 'bg-[#1E232A]/50 text-slate-400 border-slate-800 hover:border-slate-700'
            }`}
          >
            {tab === 'All' ? 'Semua Booking' : tab}
          </button>
        ))}
      </div>

      {/* TABLE DATA - TANPA PAGINASI */}
      {loading ? (
        <div className="flex h-60 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#E2725B] border-t-transparent"></div>
        </div>
      ) : (
        <DataTable
          headers={headers}
          data={filteredBookings}
          searchPlaceholder="Cari nama pelanggan..."
          searchField="customer_name"
          actions={actions}
          itemsPerPage={9999} // 🔥 SEMUA DATA DALAM 1 HALAMAN - TANPA PAGINASI
        />
      )}

      {/* MODAL DETAIL BOOKING */}
      <ModalForm
        isOpen={isOpenDetail}
        onClose={handleCloseDetail}
        title="Detail Penyewaan Alat Outdoor"
      >
        {viewingBooking && (
          <div className="space-y-6 text-xs text-slate-300">
            {/* 🔥 ID BOOKING DI DETAIL - TANPA TANDA PAGAR (#) */}
            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">
                Detail Booking ID: {viewingBooking.id}
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">
                Dibuat: {new Date(viewingBooking.created_at).toLocaleString('id-ID')}
              </span>
            </div>

            {/* BAGIAN ATAS: Informasi Customer & Jadwal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-slate-800 pb-4">
              <div className="space-y-4">
                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Nama Customer</span>
                  <strong className="text-sm font-bold text-white leading-none break-words">{viewingBooking.customer_name}</strong>
                </div>
                
                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-500 mb-1">WhatsApp</span>
                  <a
                    href={`https://wa.me/${viewingBooking.whatsapp}?text=Halo%20${encodeURIComponent(viewingBooking.customer_name)},%20kami%20dari%20admin%20ingin%20mengonfirmasi%20booking%20rental%20alat%20anda...`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 font-bold text-emerald-400 text-sm hover:underline break-all"
                  >
                    <Phone className="h-4 w-4 flex-shrink-0" /> {viewingBooking.whatsapp}
                  </a>
                </div>

                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Alamat Penjemputan</span>
                  <p className="flex items-start gap-1 leading-relaxed break-words">
                    <MapPin className="h-4 w-4 text-[#E2725B] flex-shrink-0 mt-0.5" /> 
                    <span>{viewingBooking.address}</span>
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Durasi Jadwal Sewa</span>
                  <p className="flex items-center gap-1 text-white font-semibold flex-wrap">
                    <Calendar className="h-4 w-4 text-[#E2725B] flex-shrink-0" />
                    <span className="whitespace-nowrap">
                      {new Date(viewingBooking.start_date).toLocaleDateString('id-ID')} s/d {new Date(viewingBooking.end_date).toLocaleDateString('id-ID')}
                    </span>
                    <span className="ml-2 rounded bg-slate-800 px-2 py-0.5 text-[10px] text-[#E2725B] border border-slate-700 whitespace-nowrap">
                      {viewingBooking.total_days} Hari
                    </span>
                  </p>
                </div>

                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Status Sewa Aktif</span>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <StatusBadge status={viewingBooking.status} />
                    <select
                      value={viewingBooking.status}
                      onChange={(e) => handleStatusChange(viewingBooking.id, e.target.value)}
                      className="rounded border border-slate-700 bg-slate-900 py-1.5 px-2 font-bold text-slate-300 focus:border-[#E2725B] focus:outline-none"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rented">Rented</option>
                      <option value="returned">Returned</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Catatan Pelanggan</span>
                  <p className="flex items-start gap-1 leading-relaxed italic text-slate-400 break-words">
                    <FileText className="h-4 w-4 text-slate-600 flex-shrink-0 mt-0.5" /> 
                    <span>{viewingBooking.notes || 'Tidak ada catatan khusus.'}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* BAGIAN TENGAH: Item Yang Disewa */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Item Yang Disewa</h4>
              <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-900/40 p-4 space-y-3">
                {viewingBooking.items && viewingBooking.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs gap-4">
                    <div className="flex-1 min-w-0">
                      <strong className="text-white text-sm block break-words">
                        {item.equipment_name || item.package_name}
                      </strong>
                      <span className="text-slate-500 whitespace-nowrap">
                        {item.quantity} Unit x {formatIDR(item.price_per_day)} / Hari
                      </span>
                    </div>
                    
                    <strong className="text-white text-sm whitespace-nowrap flex-shrink-0">
                      {formatIDR(item.subtotal)}
                    </strong>
                  </div>
                ))}
                
                <div className="flex justify-between border-t border-slate-800 pt-3 text-sm font-extrabold text-white">
                  <span>TOTAL BIAYA:</span>
                  <span className="text-base text-[#E2725B]">{formatIDR(viewingBooking.total_price)}</span>
                </div>
              </div>
            </div>

            {/* BAGIAN BAWAH: Status Pembayaran */}
            <div className="space-y-3 border-t border-slate-800 pt-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Status Pembayaran</h4>
              {viewingBooking.payment ? (
                <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 flex justify-between items-center gap-4 flex-wrap">
                  <div className="space-y-1">
                    <span className="block text-[10px] text-slate-500 font-bold uppercase">Metode Pembayaran</span>
                    <strong className="text-white text-xs break-words">{viewingBooking.payment.payment_method}</strong>
                    {viewingBooking.payment.paid_at && (
                      <span className="block text-[9px] text-slate-600">
                        Dibayar: {new Date(viewingBooking.payment.paid_at).toLocaleString('id-ID')}
                      </span>
                    )}
                  </div>
                  
                  <div className="text-right flex-shrink-0">
                    <StatusBadge status={viewingBooking.payment.status} />
                  </div>
                </div>
              ) : (
                <p className="text-slate-500 italic">Data pembayaran belum digenerate.</p>
              )}
            </div>

            {/* TOMBOL TUTUP */}
            <div className="flex justify-end gap-2 border-t border-slate-800 pt-4 mt-6">
              <button
                onClick={handleCloseDetail}
                className="rounded-xl bg-[#E2725B] px-5 py-2.5 text-white font-bold hover:bg-[#E2725B]/90 transition-all"
              >
                Tutup Detail
              </button>
            </div>
          </div>
        )}
      </ModalForm>

      {/* DIALOG KONFIRMASI HAPUS */}
      <ConfirmDialog
        isOpen={isOpenConfirm}
        onClose={() => setIsOpenConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Hapus Transaksi Booking?"
        message="Apakah Anda yakin ingin menghapus booking ini? Jika status booking adalah 'Rented', stok barang akan otomatis dipulihkan kembali saat booking dihapus."
      />

      {/* NOTIFIKASI TOAST */}
      <Toast
        message={toastMsg}
        type={toastType}
        onClose={() => setToastMsg('')}
      />
    </div>
  );
}