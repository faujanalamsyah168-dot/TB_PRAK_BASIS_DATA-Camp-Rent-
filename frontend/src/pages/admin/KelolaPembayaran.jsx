// KelolaPembayaran.jsx
import React, { useEffect, useState } from 'react';
import { api } from '../../api/client';
import DataTable from '../../components/common/DataTable';
import ModalForm from '../../components/common/ModalForm';
import StatusBadge from '../../components/common/StatusBadge';
import Toast from '../../components/common/Toast';
import { CreditCard, Edit3, Calendar, Phone, CheckCircle, RefreshCw } from 'lucide-react';

export default function KelolaPembayaran() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal states
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [status, setStatus] = useState('unpaid');
  const [paymentMethod, setPaymentMethod] = useState('Transfer Bank / Cash');
  const [submitting, setSubmitting] = useState(false);

  // Toast notifications
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');

  const fetchPayments = async () => {
    try {
      const data = await api.get('/payments');
      // Sorting: data terbaru di atas (besar ke kecil)
      const sortedData = [...data]
        .sort((a, b) => Number(b.booking_id) - Number(a.booking_id))
        .map((row, idx) => ({ ...row, __sortIdx: idx }));
      console.log('KelolaPembayaran sorted booking_id desc:', sortedData.map(x => x.booking_id));
      setPayments(sortedData);
    } catch (err) {
      console.error(err);
      triggerToast('Gagal memuat data pembayaran.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const triggerToast = (msg, type = 'success') => {
    setToastMsg(msg);
    setToastType(type);
  };

  // Open Edit Modal
  const handleEditOpen = (payment) => {
    setEditingPayment(payment);
    setStatus(payment.status);
    setPaymentMethod(payment.payment_method);
    setIsOpenEdit(true);
  };

  // Submit payment updates
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await api.put(`/payments/${editingPayment.id}`, { status, payment_method: paymentMethod });
      triggerToast('Data pembayaran berhasil diperbarui.');
      setIsOpenEdit(false);
      fetchPayments();
    } catch (err) {
      console.error(err);
      triggerToast('Terjadi kesalahan saat memperbarui pembayaran.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const formatIDR = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num);
  };

  // Headers for data table - semua kolom diberi padding yang konsisten
  const headers = [
    { 
      key: 'booking_id', 
      label: 'ID',
      className: 'px-3 py-4 text-center w-16', // Lebih rapi
      render: (_row, rowIdx) => payments.length - rowIdx
    },
    { 
      key: 'customer_name', 
      label: 'Pelanggan',
      className: 'px-3 py-4' // Padding dikurangi
    },
    {
      label: 'Nomor WA',
      className: 'px-3 py-4', // Padding dikurangi
      render: (row) => (
        <a href={`https://wa.me/${row.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-emerald-400 font-semibold hover:underline">
          <Phone className="h-3.5 w-3.5" /> {row.whatsapp}
        </a>
      )
    },
    {
      label: 'Tagihan',
      className: 'px-3 py-4 text-right', // Padding dikurangi dan rata kanan
      render: (row) => (
        <span className="font-extrabold text-[#E2725B]">
          {formatIDR(row.amount)}
        </span>
      )
    },
    { 
      key: 'payment_method', 
      label: 'Metode Bayar',
      className: 'px-3 py-4' // Padding dikurangi
    },
    {
      label: 'Status Bayar',
      className: 'px-3 py-4 text-center', // Padding dikurangi
      render: (row) => <StatusBadge status={row.status} />
    },
    {
      label: 'Waktu Bayar',
      className: 'px-3 py-4 text-center', // Padding dikurangi
      render: (row) => (
        <span className="text-xs text-slate-400">
          {row.paid_at 
            ? new Date(row.paid_at).toLocaleString('id-ID', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) 
            : 'Belum Dibayar'}
        </span>
      )
    }
  ];

  const actions = (row) => (
    <div className="flex justify-end gap-2">
      <button
        onClick={() => handleEditOpen(row)}
        className="rounded-lg border border-slate-700 p-2 text-indigo-400 hover:bg-indigo-500/10 hover:text-indigo-300 transition-colors"
        title="Ubah Pembayaran"
      >
        <Edit3 className="h-4 w-4" />
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-wide text-white">Kelola Transaksi Boxing</h1>
          <p className="text-xs text-slate-400">Konfirmasi status setoran masuk, kelola metode bayar, dan cek riwayat lunas.</p>
        </div>
        
        <button
          onClick={fetchPayments}
          className="flex items-center gap-1 text-xs font-bold text-[#E2725B] hover:underline uppercase tracking-wider"
        >
          <RefreshCw className="h-4 w-4" /> Refresh Data
        </button>
      </div>

      {/* Table Data - TANPA PAGINASI */}
      {loading ? (
        <div className="flex h-60 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#E2725B] border-t-transparent"></div>
        </div>
      ) : (
        <DataTable
          headers={headers}
          data={payments}
          searchPlaceholder="Cari nama pelanggan..."
          searchField="customer_name"
          actions={actions}
          itemsPerPage={9999} // 🔥 INI KUNCI NYA - Semua data dalam 1 halaman
        />
      )}

      {/* Payment Editor Modal */}
      <ModalForm
        isOpen={isOpenEdit}
        onClose={() => setIsOpenEdit(false)}
        title="Ubah Rincian Pembayaran"
      >
        {editingPayment && (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
            {/* Info Summary Box */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-2 text-slate-300">
              <div className="flex justify-between">
                <span>Pelanggan:</span>
                <strong className="text-white">{editingPayment.customer_name} ({editingPayment.whatsapp})</strong>
              </div>
              <div className="flex justify-between">
                <span>Booking ID:</span>
                <span>#{editingPayment.booking_id}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Tagihan:</span>
                <strong className="text-[#E2725B] text-sm">{formatIDR(editingPayment.amount)}</strong>
              </div>
            </div>

            {/* Editing inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 uppercase mb-2">Metode Pembayaran</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/60 p-3 text-white focus:border-[#E2725B] focus:outline-none"
                >
                  <option value="Transfer Bank / Cash">Transfer Bank / Cash</option>
                  <option value="Cash / Bayar di Basecamp">Cash / Bayar di Basecamp</option>
                  <option value="Bank Mandiri Transfer">Bank Mandiri Transfer</option>
                  <option value="Bank BCA Transfer">Bank BCA Transfer</option>
                  <option value="E-Wallet (OVO/Dana/Gopay)">E-Wallet (OVO/Dana/Gopay)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 uppercase mb-2">Status Pembayaran</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/60 p-3 text-white focus:border-[#E2725B] focus:outline-none"
                >
                  <option value="unpaid">Belum Bayar (Unpaid)</option>
                  <option value="paid">Lunas (Paid)</option>
                  <option value="refunded">Dikembalikan (Refunded)</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 border-t border-slate-800 pt-4 mt-6">
              <button
                type="button"
                onClick={() => setIsOpenEdit(false)}
                className="rounded-xl border border-slate-750 px-5 py-2.5 hover:bg-slate-800 hover:text-white transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-xl bg-[#E2725B] px-5 py-2.5 text-white hover:bg-[#E2725B]/90 transition-all flex items-center gap-1.5"
              >
                <CheckCircle className="h-4 w-4" />
                {submitting ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </form>
        )}
      </ModalForm>

      {/* Toast */}
      <Toast
        message={toastMsg}
        type={toastType}
        onClose={() => setToastMsg('')}
      />
    </div>
  );
}