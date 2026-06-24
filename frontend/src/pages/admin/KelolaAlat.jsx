import React, { useEffect, useState } from 'react';
import { api } from '../../api/client';
import DataTable from '../../components/common/DataTable';
import ModalForm from '../../components/common/ModalForm';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Toast from '../../components/common/Toast';
import { Plus, Edit2, Trash2, ShieldAlert } from 'lucide-react';

export default function KelolaAlat() {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal form states
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Field states
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [pricePerDay, setPricePerDay] = useState('');
  const [stockTotal, setStockTotal] = useState('');
  const [stockAvailable, setStockAvailable] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [status, setStatus] = useState('available');

  // Confirmation dialog state
  const [isOpenConfirm, setIsOpenConfirm] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Toast state
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');

  const fetchEquipment = async () => {
    try {
      const data = await api.get('/equipment');
      setEquipment(data);
    } catch (err) {
      console.error(err);
      triggerToast('Gagal memuat data alat camping.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  const triggerToast = (msg, type = 'success') => {
    setToastMsg(msg);
    setToastType(type);
  };

  // Open modal for Create
  const handleCreateOpen = () => {
    setEditingId(null);
    setName('');
    setCategory('');
    setDescription('');
    setPricePerDay('');
    setStockTotal('');
    setStockAvailable('');
    setImageUrl('');
    setStatus('available');
    setIsOpenForm(true);
  };

  // Open modal for Edit
  const handleEditOpen = (item) => {
    setEditingId(item.id);
    setName(item.name);
    setCategory(item.category);
    setDescription(item.description || '');
    setPricePerDay(item.price_per_day);
    setStockTotal(item.stock_total);
    setStockAvailable(item.stock_available);
    setImageUrl(item.image_url || '');
    setStatus(item.status);
    setIsOpenForm(true);
  };

  // Open confirm dialog for Delete
  const handleDeleteOpen = (id) => {
    setDeletingId(id);
    setIsOpenConfirm(true);
  };

  // Submit form (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !category || pricePerDay === '' || stockTotal === '') {
      triggerToast('Field nama, kategori, harga, dan total stok wajib diisi.', 'error');
      return;
    }

    const payload = {
      name,
      category,
      description,
      price_per_day: parseFloat(pricePerDay),
      stock_total: parseInt(stockTotal, 10),
      stock_available: editingId ? parseInt(stockAvailable, 10) : parseInt(stockTotal, 10),
      image_url: imageUrl,
      status
    };

    try {
      if (editingId) {
        await api.put(`/equipment/${editingId}`, payload);
        triggerToast('Alat camping berhasil diperbarui.');
      } else {
        await api.post('/equipment', payload);
        triggerToast('Alat camping baru berhasil ditambahkan.');
      }
      setIsOpenForm(false);
      fetchEquipment();
    } catch (err) {
      console.error(err);
      triggerToast(err.message || 'Terjadi kesalahan saat menyimpan data.', 'error');
    }
  };

  // Confirm delete item
  const handleConfirmDelete = async () => {
    if (!deletingId) return;

    try {
      await api.delete(`/equipment/${deletingId}`);
      triggerToast('Alat camping berhasil dihapus.');
      fetchEquipment();
    } catch (err) {
      console.error(err);
      triggerToast(err.message || 'Gagal menghapus alat. Mungkin sedang digunakan dalam transaksi.', 'error');
    }
  };

  // Headers for data table
  const headers = [
    {
      label: 'Gambar',
      render: (row) => (
        <div className="h-10 w-16 overflow-hidden rounded bg-slate-900 border border-slate-700/50">
          <img
            src={row.image_url || 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=50'}
            alt={row.name}
            className="h-full w-full object-cover"
          />
        </div>
      )
    },
    { key: 'name', label: 'Nama Alat' },
    { key: 'category', label: 'Kategori' },
    {
      label: 'Harga / Hari',
      render: (row) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(row.price_per_day)
    },
    {
      label: 'Stok (Tersedia / Total)',
      render: (row) => (
        <span className="font-semibold text-white">
          {row.stock_available} / {row.stock_total}
        </span>
      )
    },
    {
      label: 'Status',
      render: (row) => (
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold ${
          row.status === 'available' && row.stock_available > 0
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
        }`}>
          {row.status === 'available' && row.stock_available > 0 ? 'Tersedia' : 'Habis / Nonaktif'}
        </span>
      )
    }
  ];

  // Actions column render
  const actions = (item) => (
    <div className="flex justify-end gap-2">
      <button
        onClick={() => handleEditOpen(item)}
        className="rounded-lg border border-slate-700 p-2 text-indigo-400 hover:bg-indigo-500/10 hover:text-indigo-300 transition-colors"
        title="Edit Alat"
      >
        <Edit2 className="h-4 w-4" />
      </button>
      <button
        onClick={() => handleDeleteOpen(item.id)}
        className="rounded-lg border border-slate-700 p-2 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
        title="Hapus Alat"
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
          <h1 className="text-2xl font-black uppercase tracking-wide text-white">Kelola Alat Camping</h1>
          <p className="text-xs text-slate-400">Tambah, ubah, atau hapus item katalog alat persewaan outdoor satuan.</p>
        </div>
        
        <button
          onClick={handleCreateOpen}
          className="flex items-center gap-1.5 rounded-xl bg-[#E2725B] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#E2725B]/15 hover:bg-[#E2725B]/90 transition-all"
        >
          <Plus className="h-4 w-4" /> Tambah Alat Baru
        </button>
      </div>

      {/* Table Container */}
      {loading ? (
        <div className="flex h-60 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#E2725B] border-t-transparent"></div>
        </div>
      ) : (
        <DataTable
          headers={headers}
          data={equipment}
          searchPlaceholder="Cari berdasarkan nama alat..."
          searchField="name"
          actions={actions}
        />
      )}

      {/* CRUD Modal Form */}
      <ModalForm
        isOpen={isOpenForm}
        onClose={() => setIsOpenForm(false)}
        title={editingId ? 'Edit Data Alat Camping' : 'Tambah Alat Camping Baru'}
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
          {/* Name & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 uppercase mb-2">Nama Alat *</label>
              <input
                type="text"
                required
                placeholder="Contoh: Tenda Dome Eiger 2P"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900/60 p-3 text-white focus:border-[#E2725B] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 uppercase mb-2">Kategori Alat *</label>
              <input
                type="text"
                required
                placeholder="Contoh: Tenda, Tidur, Masak, Tas"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900/60 p-3 text-white focus:border-[#E2725B] focus:outline-none"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-400 uppercase mb-2">Deskripsi Detail</label>
            <textarea
              rows="3"
              placeholder="Terangkan spesifikasi detail, warna, material, dll..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900/60 p-3 text-white focus:border-[#E2725B] focus:outline-none"
            />
          </div>

          {/* Price & Stocks */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-400 uppercase mb-2">Harga Sewa / Hari *</label>
              <input
                type="number"
                required
                min="0"
                placeholder="20000"
                value={pricePerDay}
                onChange={(e) => setPricePerDay(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900/60 p-3 text-white focus:border-[#E2725B] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 uppercase mb-2">Total Stok *</label>
              <input
                type="number"
                required
                min="1"
                placeholder="10"
                value={stockTotal}
                onChange={(e) => setStockTotal(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900/60 p-3 text-white focus:border-[#E2725B] focus:outline-none"
              />
            </div>

            {editingId && (
              <div>
                <label className="block text-slate-400 uppercase mb-2">Stok Tersedia *</label>
                <input
                  type="number"
                  required
                  min="0"
                  max={stockTotal}
                  placeholder="8"
                  value={stockAvailable}
                  onChange={(e) => setStockAvailable(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/60 p-3 text-white focus:border-[#E2725B] focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Image & Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 uppercase mb-2">URL Gambar Alat</label>
              <input
                type="text"
                placeholder="https://unsplash.com/..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900/60 p-3 text-white focus:border-[#E2725B] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 uppercase mb-2">Status Alat</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900/60 p-3 text-white focus:border-[#E2725B] focus:outline-none"
              >
                <option value="available">Tersedia / Aktif</option>
                <option value="unavailable">Tidak Tersedia / Nonaktif</option>
              </select>
            </div>
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
              Simpan Data
            </button>
          </div>
        </form>
      </ModalForm>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isOpenConfirm}
        onClose={() => setIsOpenConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Hapus Alat Camping?"
        message="Apakah Anda yakin ingin menghapus alat camping ini dari katalog? Barang yang dihapus tidak akan dapat dipesan lagi."
      />

      {/* Toast Notifications */}
      <Toast
        message={toastMsg}
        type={toastType}
        onClose={() => setToastMsg('')}
      />
    </div>
  );
}
