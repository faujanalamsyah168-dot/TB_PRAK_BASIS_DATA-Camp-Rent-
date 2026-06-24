// ============================================================
// BOOKING FORM - KOMPONEN FORMULIR PEMESANAN
// ============================================================
// Komponen ini adalah formulir untuk melakukan pemesanan sewa
// alat atau paket camping. Fitur: pemilihan item, input data
// pelanggan, penentuan jadwal, kalkulasi biaya otomatis,
// submit booking ke API, dan notifikasi toast.
// ============================================================

import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import Toast from './Toast';
import { Calendar, User, Phone, MapPin, ClipboardList, Info } from 'lucide-react';

/**
 * Komponen BookingForm
 * @param {Object} props - Props komponen
 * @param {Object} props.preselectedItem - Item yang sudah dipilih dari halaman sebelumnya
 * @param {string} props.preselectedType - Tipe item ('equipment' atau 'package')
 * @param {Function} props.onSuccess - Callback saat booking berhasil
 */
export default function BookingForm({ preselectedItem = null, preselectedType = null, onSuccess }) {
  
  // ==================== STATE DATA ====================
  
  /**
   * State untuk menyimpan daftar alat yang tersedia dari API
   */
  const [equipmentList, setEquipmentList] = useState([]);
  
  /**
   * State untuk menyimpan daftar paket yang tersedia dari API
   */
  const [packageList, setPackageList] = useState([]);
  
  /**
   * State untuk indikator loading saat mengambil data item
   */
  const [loadingItems, setLoadingItems] = useState(true);

  // ==================== STATE FORM ====================
  
  /**
   * State untuk field nama pelanggan (wajib)
   */
  const [customerName, setCustomerName] = useState('');
  
  /**
   * State untuk field nomor WhatsApp (wajib, hanya angka)
   */
  const [whatsapp, setWhatsapp] = useState('');
  
  /**
   * State untuk field alamat lengkap (wajib)
   */
  const [address, setAddress] = useState('');
  
  /**
   * State untuk tipe booking: 'equipment' atau 'package'
   * Default dari preselectedType atau 'equipment'
   */
  const [bookingType, setBookingType] = useState(preselectedType || 'equipment');
  
  /**
   * State untuk ID item yang dipilih
   */
  const [itemId, setItemId] = useState('');
  
  /**
   * State untuk tanggal mulai sewa
   */
  const [startDate, setStartDate] = useState('');
  
  /**
   * State untuk tanggal selesai sewa
   */
  const [endDate, setEndDate] = useState('');
  
  /**
   * State untuk jumlah item yang disewa (minimal 1)
   */
  const [quantity, setQuantity] = useState(1);
  
  /**
   * State untuk catatan tambahan (opsional)
   */
  const [notes, setNotes] = useState('');

  // ==================== STATE UI ====================
  
  /**
   * State untuk menampilkan pesan error
   */
  const [errorMsg, setErrorMsg] = useState('');
  
  /**
   * State untuk indikator proses submit
   */
  const [submitting, setSubmitting] = useState(false);
  
  /**
   * State untuk notifikasi toast (pesan)
   */
  const [toast, setToast] = useState('');
  
  /**
   * State untuk tipe notifikasi toast ('success' atau 'error')
   */
  const [toastType, setToastType] = useState('success');

  // ==================== FETCH DATA ====================
  
  /**
   * useEffect untuk mengambil data alat dan paket dari API
   * Filter: hanya menampilkan item yang tersedia
   * Jika ada preselectedItem, otomatis pilih item tersebut
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mengambil data alat dan paket secara paralel
        const [equipmentData, packageData] = await Promise.all([
          api.get('/equipment'),
          api.get('/packages')
        ]);
        
        // Filter: hanya tampilkan item yang tersedia
        setEquipmentList(equipmentData.filter(e => e.status === 'available'));
        setPackageList(packageData.filter(p => p.status === 'active'));

        // Jika ada item yang sudah dipilih dari halaman sebelumnya
        if (preselectedItem) {
          setItemId(preselectedItem.id);
        }
      } catch (err) {
        console.error('Gagal memuat item untuk form booking:', err);
        setErrorMsg('Gagal memuat daftar alat/paket.');
      } finally {
        setLoadingItems(false);
      }
    };
    fetchData();
  }, [preselectedItem]);

  /**
   * useEffect untuk menyesuaikan pilihan saat tipe booking berubah
   * Reset itemId dan quantity jika tipe booking berubah
   */
  useEffect(() => {
    if (preselectedItem && preselectedType === bookingType) {
      setItemId(preselectedItem.id);
    } else {
      setItemId('');
    }
    setQuantity(1);
  }, [bookingType, preselectedItem, preselectedType]);

  // ==================== KALKULASI BIAYA ====================
  
  /**
   * Mendapatkan item yang dipilih berdasarkan tipe booking dan itemId
   */
  const selectedItem = bookingType === 'equipment'
    ? equipmentList.find(e => e.id === parseInt(itemId, 10))
    : packageList.find(p => p.id === parseInt(itemId, 10));

  /**
   * Variabel untuk perhitungan biaya sewa
   */
  let totalDays = 0;          // Total hari sewa
  let totalPrice = 0;         // Total biaya
  let pricePerDay = selectedItem ? parseFloat(selectedItem.price_per_day) : 0;
  let maxStock = selectedItem && bookingType === 'equipment' ? selectedItem.stock_available : 99;

  /**
   * Menghitung durasi dan total biaya jika tanggal sudah diisi
   */
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end >= start) {
      const diffTime = end.getTime() - start.getTime();
      totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (totalDays === 0) totalDays = 1; // Minimal 1 hari
      totalPrice = pricePerDay * totalDays * quantity;
    }
  }

  // ==================== FUNGSI FORMAT ====================
  
  /**
   * Memformat angka ke format Rupiah Indonesia
   * @param {number} num - Angka yang akan diformat
   * @returns {string} String dengan format Rp
   */
  const formatIDR = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num);
  };

  // ==================== FUNGSI SUBMIT ====================
  
  /**
   * Menangani submit form booking
   * Melakukan validasi dan mengirim data ke API
   * @param {Event} e - Event submit form
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // ===== VALIDASI FORM =====
    
    // Validasi field wajib
    if (!customerName || !whatsapp || !address || !itemId || !startDate || !endDate) {
      setErrorMsg('Semua field bertanda bintang (*) wajib diisi.');
      return;
    }

    // Validasi WhatsApp hanya boleh angka
    if (!/^\d+$/.test(whatsapp)) {
      setErrorMsg('Nomor WhatsApp hanya boleh diisi angka.');
      return;
    }

    // Validasi tanggal
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end < start) {
      setErrorMsg('Tanggal kembali tidak boleh lebih awal dari tanggal mulai.');
      return;
    }

    // Validasi quantity
    if (quantity <= 0) {
      setErrorMsg('Jumlah sewa minimal 1.');
      return;
    }

    // Validasi stok untuk alat (client-side)
    if (bookingType === 'equipment' && selectedItem && quantity > selectedItem.stock_available) {
      setErrorMsg(`Jumlah sewa melebihi stok yang tersedia (${selectedItem.stock_available} unit).`);
      return;
    }

    setSubmitting(true);

    try {
      // ===== MEMBUAT PAYLOAD =====
      const payload = {
        customer_name: customerName,
        whatsapp,
        address,
        booking_type: bookingType,
        start_date: startDate,
        end_date: endDate,
        items: [
          {
            id: parseInt(itemId, 10),
            quantity: parseInt(quantity, 10)
          }
        ],
        notes
      };

      // Kirim request POST ke API
      await api.post('/bookings', payload);
      
      // Panggil callback onSuccess jika ada (untuk menampilkan halaman sukses)
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      const errorText = err.message || 'Gagal memproses booking. Coba periksa koneksi atau stok barang.';
      setErrorMsg(errorText);
      setToast(errorText);
      setToastType('error');
    } finally {
      setSubmitting(false);
    }
  };

  // ==================== RENDER LOADING ====================
  
  if (loadingItems) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#E2725B] border-t-transparent"></div>
      </div>
    );
  }

  // ==================== RENDER UTAMA ====================
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* ===== PESAN ERROR ===== */}
      {errorMsg && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs font-semibold text-rose-400">
          {errorMsg}
        </div>
      )}

      {/* ===== NOTIFIKASI TOAST ===== */}
      {toast && (
        <Toast message={toast} type={toastType} onClose={() => setToast('')} />
      )}

      {/* ============================================================
          BARIS 1: TIPE BOOKING & PILIHAN ITEM
          ============================================================ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Tipe Penyewaan (Equipment / Package) */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Tipe Penyewaan *</label>
          <div className="grid grid-cols-2 gap-2">
            {/* Tombol Satuan Alat */}
            <button
              type="button"
              onClick={() => setBookingType('equipment')}
              className={`rounded-xl border py-3 text-sm font-semibold transition-all ${
                bookingType === 'equipment'
                  ? 'border-[#E2725B] bg-[#E2725B]/10 text-white' // Aktif: oranye
                  : 'border-slate-700 bg-slate-900/30 text-slate-400 hover:border-slate-600' // Nonaktif
              }`}
            >
              Satuan Alat
            </button>
            
            {/* Tombol Paket Sewa */}
            <button
              type="button"
              onClick={() => setBookingType('package')}
              className={`rounded-xl border py-3 text-sm font-semibold transition-all ${
                bookingType === 'package'
                  ? 'border-[#E2725B] bg-[#E2725B]/10 text-white' // Aktif: oranye
                  : 'border-slate-700 bg-slate-900/30 text-slate-400 hover:border-slate-600' // Nonaktif
              }`}
            >
              Paket Sewa
            </button>
          </div>
        </div>

        {/* Dropdown Pilih Item */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase mb-2">
            Pilih {bookingType === 'equipment' ? 'Alat Camping' : 'Paket Sewa'} *
          </label>
          <select
            value={itemId}
            onChange={(e) => setItemId(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-[#1E232A]/80 p-3 text-sm text-white focus:border-[#E2725B] focus:outline-none focus:ring-1 focus:ring-[#E2725B]"
            required
          >
            <option value="">-- Pilih Salah Satu --</option>
            {bookingType === 'equipment'
              ? // Opsi untuk alat satuan
                equipmentList.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.name} - ({formatIDR(item.price_per_day)}/hari - Stok: {item.stock_available})
                  </option>
                ))
              : // Opsi untuk paket
                packageList.map(pkg => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.name} - ({formatIDR(pkg.price_per_day)}/hari)
                  </option>
                ))
            }
          </select>
        </div>
      </div>

      {/* ============================================================
          BARIS 2: INFORMASI PELANGGAN
          ============================================================ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Nama Lengkap */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Nama Lengkap *</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <User className="h-4 w-4 text-slate-400" />
            </span>
            <input
              type="text"
              required
              placeholder="Contoh: Ojan Anak Alam"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-[#1E232A]/80 py-3 pl-10 pr-4 text-sm text-white focus:border-[#E2725B] focus:outline-none"
            />
          </div>
        </div>

        {/* Nomor WhatsApp */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Nomor WhatsApp *</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Phone className="h-4 w-4 text-slate-400" />
            </span>
            <input
              type="tel"
              required
              placeholder="Contoh: 081234567890"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-[#1E232A]/80 py-3 pl-10 pr-4 text-sm text-white focus:border-[#E2725B] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* ============================================================
          BARIS 3: ALAMAT
          ============================================================ */}
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Alamat Lengkap *</label>
        <div className="relative">
          <span className="absolute left-3 top-3">
            <MapPin className="h-4 w-4 text-slate-400" />
          </span>
          <textarea
            required
            rows="3"
            placeholder="Alamat penjemputan/pengiriman barang..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-[#1E232A]/80 py-3 pl-10 pr-4 text-sm text-white focus:border-[#E2725B] focus:outline-none"
          />
        </div>
      </div>

      {/* ============================================================
          BARIS 4: TANGGAL & JUMLAH
          ============================================================ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Tanggal Mulai Sewa */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Mulai Sewa *</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Calendar className="h-4 w-4 text-slate-400" />
            </span>
            <input
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-[#1E232A]/80 py-3 pl-10 pr-4 text-sm text-white focus:border-[#E2725B] focus:outline-none"
            />
          </div>
        </div>

        {/* Tanggal Kembali Sewa */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Kembali Sewa *</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Calendar className="h-4 w-4 text-slate-400" />
            </span>
            <input
              type="date"
              required
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-[#1E232A]/80 py-3 pl-10 pr-4 text-sm text-white focus:border-[#E2725B] focus:outline-none"
            />
          </div>
        </div>

        {/* Jumlah Sewa */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Jumlah Sewa *</label>
          <input
            type="number"
            required
            min="1"
            max={maxStock}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10)))}
            className="w-full rounded-xl border border-slate-700 bg-[#1E232A]/80 p-3 text-sm text-white focus:border-[#E2725B] focus:outline-none"
          />
        </div>
      </div>

      {/* ============================================================
          BARIS 5: CATATAN TAMBAHAN
          ============================================================ */}
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Catatan Tambahan (Opsional)</label>
        <div className="relative">
          <span className="absolute left-3 top-3">
            <ClipboardList className="h-4 w-4 text-slate-400" />
          </span>
          <textarea
            rows="2"
            placeholder="Ukuran sepatu, warna tenda, atau instruksi khusus..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-[#1E232A]/80 py-3 pl-10 pr-4 text-sm text-white focus:border-[#E2725B] focus:outline-none"
          />
        </div>
      </div>

      {/* ============================================================
          BARIS 6: RINCIAN BIAYA (LIVE CALCULATION)
          ============================================================ */}
      {selectedItem && startDate && endDate && (
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-5 shadow-inner">
          <h5 className="flex items-center gap-2 text-xs font-bold text-[#E2725B] uppercase tracking-wider mb-3">
            <Info className="h-4 w-4" /> Rincian Biaya Sewa
          </h5>
          <div className="space-y-2 text-sm text-slate-300">
            <div className="flex justify-between">
              <span>Item Pilihan:</span>
              <span className="font-semibold text-white">{selectedItem.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Tarif per Hari:</span>
              <span>{formatIDR(pricePerDay)}</span>
            </div>
            <div className="flex justify-between">
              <span>Durasi Sewa:</span>
              <span className="font-semibold text-white">{totalDays} Hari</span>
            </div>
            <div className="flex justify-between">
              <span>Jumlah Item:</span>
              <span className="font-semibold text-white">{quantity} Unit</span>
            </div>
            <div className="flex justify-between border-t border-slate-700/50 pt-2 text-base font-extrabold text-white">
              <span>Total Harga:</span>
              <span className="text-xl text-[#E2725B]">{formatIDR(totalPrice)}</span>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          BARIS 7: TOMBOL SUBMIT
          ============================================================ */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-xl bg-[#E2725B] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#E2725B]/20 transition-all hover:bg-[#E2725B]/90 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
      >
        {submitting ? 'Sedang Memproses...' : 'Kirim Booking Sekarang'}
      </button>
      
    </form>
  );
}