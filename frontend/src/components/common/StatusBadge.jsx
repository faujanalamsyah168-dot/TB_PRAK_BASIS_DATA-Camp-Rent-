import React from 'react';

export default function StatusBadge({ status }) {
  const styles = {
    // Booking statuses
    pending: 'bg-amber-500/10 text-amber-500 border border-amber-500/20',
    approved: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
    rented: 'bg-sky-500/10 text-sky-400 border border-sky-500/20',
    returned: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    cancelled: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
    
    // Payment statuses
    unpaid: 'bg-red-500/10 text-red-400 border border-red-500/20',
    paid: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    refunded: 'bg-amber-500/10 text-amber-500 border border-amber-500/20',
  };

  const labels = {
    pending: 'Menunggu Konfirmasi',
    approved: 'Disetujui',
    rented: 'Sedang Disewa',
    returned: 'Selesai / Dikembalikan',
    cancelled: 'Dibatalkan',
    unpaid: 'Belum Bayar',
    paid: 'Lunas',
    refunded: 'Dikembalikan (Refund)'
  };

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${styles[status] || 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
      {labels[status] || status}
    </span>
  );
}
