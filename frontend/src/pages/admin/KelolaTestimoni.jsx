import React, { useEffect, useState } from 'react';
import { api } from '../../api/client';
import DataTable from '../../components/common/DataTable';
import ModalForm from '../../components/common/ModalForm';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Toast from '../../components/common/Toast';
import { Star, Edit2, Trash2, Plus, Eye, EyeOff } from 'lucide-react';

export default function KelolaTestimoni() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal form states
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Field states
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [isVisible, setIsVisible] = useState(true);

  // Confirm delete states
  const [isOpenConfirm, setIsOpenConfirm] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Toast notifications
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');

  const fetchTestimonials = async () => {
    try {
      const data = await api.get('/testimonials');
      setTestimonials(data);
    } catch (err) {
      console.error(err);
      triggerToast('Gagal memuat testimoni.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const triggerToast = (msg, type = 'success') => {
    setToastMsg(msg);
    setToastType(type);
  };

  // Open modal for Create
  const handleCreateOpen = () => {
    setEditingId(null);
    setName('');
    setComment('');
    setRating(5);
    setIsVisible(true);
    setIsOpenForm(true);
  };

  // Open modal for Edit
  const handleEditOpen = (item) => {
    setEditingId(item.id);
    setName(item.name);
    setComment(item.comment);
    setRating(item.rating);
    setIsVisible(item.is_visible === 1 || item.is_visible === true);
    setIsOpenForm(true);
  };

  // Quick toggle visibility
  const handleToggleVisibility = async (item) => {
    const nextVisibility = !(item.is_visible === 1 || item.is_visible === true);
    try {
      await api.put(`/testimonials/${item.id}`, {
        name: item.name,
        comment: item.comment,
        rating: item.rating,
        is_visible: nextVisibility
      });
      triggerToast(`Visibilitas ulasan oleh ${item.name} berhasil diubah.`);
      fetchTestimonials();
    } catch (err) {
      console.error(err);
      triggerToast('Gagal mengubah visibilitas ulasan.', 'error');
    }
  };

  // Open confirm delete
  const handleDeleteOpen = (id) => {
    setDeletingId(id);
    setIsOpenConfirm(true);
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    try {
      await api.delete(`/testimonials/${deletingId}`);
      triggerToast('Testimoni berhasil dihapus.');
      fetchTestimonials();
    } catch (err) {
      console.error(err);
      triggerToast('Gagal menghapus testimoni.', 'error');
    }
  };

  // Submit form (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !comment) {
      triggerToast('Nama dan komentar wajib diisi.', 'error');
      return;
    }

    const payload = {
      name,
      comment,
      rating,
      is_visible: isVisible
    };

    try {
      if (editingId) {
        await api.put(`/testimonials/${editingId}`, payload);
        triggerToast('Testimoni berhasil diperbarui.');
      } else {
        // Admin creates testimonial directly (starts as visible)
        await api.post('/testimonials', payload);
        triggerToast('Testimoni baru berhasil ditambahkan.');
      }
      setIsOpenForm(false);
      fetchTestimonials();
    } catch (err) {
      console.error(err);
      triggerToast('Gagal menyimpan ulasan.', 'error');
    }
  };

  // Headers for data table
  const headers = [
    { key: 'name', label: 'Nama Penulis' },
    {
      label: 'Bintang (Rating)',
      render: (row) => (
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, idx) => (
            <Star
              key={idx}
              className={`h-3.5 w-3.5 ${
                idx < row.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
              }`}
            />
          ))}
        </div>
      )
    },
    {
      key: 'comment',
      label: 'Isi Komentar',
      render: (row) => <div className="max-w-xs truncate text-xs text-slate-400 italic">"{row.comment}"</div>
    },
    {
      label: 'Tanggal Masuk',
      render: (row) => new Date(row.created_at).toLocaleDateString('id-ID')
    },
    {
      label: 'Tampilkan Publik',
      render: (row) => (
        <button
          onClick={() => handleToggleVisibility(row)}
          className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1 text-xs font-bold transition-all ${
            row.is_visible === 1 || row.is_visible === true
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/20'
              : 'bg-slate-800 text-slate-500 border-slate-750 hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/20'
          }`}
          title={row.is_visible === 1 || row.is_visible === true ? 'Klik untuk Sembunyikan' : 'Klik untuk Tampilkan'}
        >
          {row.is_visible === 1 || row.is_visible === true ? (
            <>
              <Eye className="h-3.5 w-3.5" /> Aktif
            </>
          ) : (
            <>
              <EyeOff className="h-3.5 w-3.5" /> Disembunyikan
            </>
          )}
        </button>
      )
    }
  ];

  const actions = (row) => (
    <div className="flex justify-end gap-2">
      <button
        onClick={() => handleEditOpen(row)}
        className="rounded-lg border border-slate-700 p-2 text-indigo-400 hover:bg-indigo-500/10 hover:text-indigo-300 transition-colors"
        title="Edit Ulasan"
      >
        <Edit2 className="h-4 w-4" />
      </button>
      <button
        onClick={() => handleDeleteOpen(row.id)}
        className="rounded-lg border border-slate-700 p-2 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
        title="Hapus Ulasan"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-wide text-white">Kelola Testimoni & Review</h1>
          <p className="text-xs text-slate-400">Moderasi testimoni dari pelanggan, sembunyikan ulasan buruk, atau tambah ulasan baru.</p>
        </div>

        
      </div>

      {/* Table Data */}
      {loading ? (
        <div className="flex h-60 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#E2725B] border-t-transparent"></div>
        </div>
      ) : (
        <DataTable
          headers={headers}
          data={testimonials}
          searchPlaceholder="Cari nama penulis..."
          searchField="name"
          actions={actions}
        />
      )}

      {/* Testimoni Modal Form */}
      <ModalForm
        isOpen={isOpenForm}
        onClose={() => setIsOpenForm(false)}
        title={editingId ? 'Edit Data Ulasan Pelanggan' : 'Tulis Testimoni Baru'}
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
          {/* Penulis & Rating */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 uppercase mb-2">Nama Penulis *</label>
              <input
                type="text"
                required
                placeholder="Contoh: Rian Hidayat"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900/60 p-3 text-white focus:border-[#E2725B] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 uppercase mb-2">Rating Bintang *</label>
              <select
                value={rating}
                onChange={(e) => setRating(parseInt(e.target.value, 10))}
                className="w-full rounded-xl border border-slate-700 bg-slate-900/60 p-3 text-white focus:border-[#E2725B] focus:outline-none"
              >
                <option value="5">⭐⭐⭐⭐⭐ (5 Bintang)</option>
                <option value="4">⭐⭐⭐⭐ (4 Bintang)</option>
                <option value="3">⭐⭐⭐ (3 Bintang)</option>
                <option value="2">⭐⭐ (2 Bintang)</option>
                <option value="1">⭐ (1 Bintang)</option>
              </select>
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-slate-400 uppercase mb-2">Komentar / Ulasan Lengkap *</label>
            <textarea
              required
              rows="4"
              placeholder="Tuliskan ulasan pelanggan mengenai barang sewa Ojan Busuk..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900/60 p-3 text-white focus:border-[#E2725B] focus:outline-none"
            />
          </div>

          {/* Visibility Toggle */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isVisible"
              checked={isVisible}
              onChange={(e) => setIsVisible(e.target.checked)}
              className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-[#E2725B] focus:ring-[#E2725B]"
            />
            <label htmlFor="isVisible" className="text-slate-300 font-semibold cursor-pointer">
              Tampilkan Ulasan Ini Di Halaman Publik
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t border-slate-800 pt-4 mt-6">
            <button
              type="button"
              onClick={() => setIsOpenForm(false)}
              className="rounded-xl border border-slate-750 px-5 py-2.5 hover:bg-slate-800 hover:text-white transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="rounded-xl bg-[#E2725B] px-5 py-2.5 text-white hover:bg-[#E2725B]/90 transition-all"
            >
              Simpan Ulasan
            </button>
          </div>
        </form>
      </ModalForm>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isOpenConfirm}
        onClose={() => setIsOpenConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Hapus Ulasan Pelanggan?"
        message="Apakah Anda yakin ingin menghapus testimoni ini? Ulasan yang dihapus akan hilang selamanya dari database."
      />

      {/* Toast */}
      <Toast
        message={toastMsg}
        type={toastType}
        onClose={() => setToastMsg('')}
      />
    </div>
  );
}
