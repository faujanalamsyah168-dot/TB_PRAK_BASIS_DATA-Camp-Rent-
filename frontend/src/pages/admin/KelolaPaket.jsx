// ============================================================
// KELOLA PAKET - HALAMAN MANAJEMEN PAKET SEWA BUNDLING
// ============================================================
// Komponen ini digunakan untuk mengelola paket sewa yang berisi
// kombinasi beberapa alat camping dengan harga bundling.
// Fitur: CRUD paket, manajemen item dalam paket, status aktif/nonaktif.
// ============================================================

import React, { useEffect, useState } from 'react';
import { api } from '../../api/client';
import DataTable from '../../components/common/DataTable';
import ModalForm from '../../components/common/ModalForm';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Toast from '../../components/common/Toast';
import { Plus, Edit2, Trash2, Trash, PlusCircle } from 'lucide-react';

export default function KelolaPaket() {
  // ==================== STATE MANAGEMENT ====================
  
  // State untuk menyimpan semua data paket dari API
  const [packages, setPackages] = useState([]);
  
  // State untuk menyimpan daftar alat yang tersedia (untuk dipilih dalam paket)
  const [equipmentList, setEquipmentList] = useState([]);
  
  // State untuk indikator loading saat mengambil data
  const [loading, setLoading] = useState(true);

  // ==================== STATE MODAL FORM ====================
  
  // State untuk mengontrol tampilan modal form (tambah/edit)
  const [isOpenForm, setIsOpenForm] = useState(false);
  
  // State untuk menyimpan ID paket yang sedang diedit (null = mode tambah)
  const [editingId, setEditingId] = useState(null);

  // ==================== STATE FIELD FORM ====================
  
  // State untuk setiap field dalam form
  const [name, setName] = useState('');                 // Nama paket (wajib)
  const [description, setDescription] = useState('');   // Deskripsi paket
  const [pricePerDay, setPricePerDay] = useState('');   // Harga sewa per hari (wajib)
  const [imageUrl, setImageUrl] = useState('');         // URL gambar paket
  const [status, setStatus] = useState('active');       // Status: active/inactive
  
  /**
   * State untuk menyimpan daftar item dalam paket
   * Format: [{ equipment_id: '', quantity: 1 }]
   * Setiap item memiliki ID alat dan jumlah yang dimasukkan
   */
  const [selectedItems, setSelectedItems] = useState([]);

  // ==================== STATE DIALOG KONFIRMASI ====================
  
  // State untuk dialog konfirmasi hapus paket
  const [isOpenConfirm, setIsOpenConfirm] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // ==================== STATE TOAST NOTIFIKASI ====================
  
  // State untuk notifikasi toast
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');

  // ==================== FUNGSI FETCH DATA ====================
  
  /**
   * Mengambil data paket dan daftar alat yang tersedia dari API
   * Dipanggil saat komponen dimuat dan setelah operasi CRUD
   * Menggunakan Promise.all untuk mengambil data secara paralel
   */
  const fetchPackagesAndEquipment = async () => {
    try {
      const [packagesData, equipmentData] = await Promise.all([
        api.get('/packages'),
        api.get('/equipment')
      ]);
      setPackages(packagesData);
      // Hanya tampilkan alat dengan status 'available' untuk dipilih
      setEquipmentList(equipmentData.filter(e => e.status === 'available'));
    } catch (err) {
      console.error(err);
      triggerToast('Gagal memuat data paket sewa.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // useEffect untuk mengambil data saat komponen pertama kali di-render
  useEffect(() => {
    fetchPackagesAndEquipment();
  }, []);

  // ==================== FUNGSI UTILITY ====================
  
  /**
   * Menampilkan notifikasi toast
   * @param {string} msg - Pesan yang ditampilkan
   * @param {string} type - Tipe notifikasi ('success' atau 'error')
   */
  const triggerToast = (msg, type = 'success') => {
    setToastMsg(msg);
    setToastType(type);
  };

  // ==================== FUNGSI CRUD ====================
  
  /**
   * Membuka modal form untuk menambah paket baru
   * Mengosongkan semua field dan set mode ke create
   * Inisialisasi dengan satu baris item kosong
   */
  const handleCreateOpen = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setPricePerDay('');
    setImageUrl('');
    setStatus('active');
    setSelectedItems([{ equipment_id: '', quantity: 1 }]);
    setIsOpenForm(true);
  };

  /**
   * Membuka modal form untuk mengedit paket yang ada
   * Mengisi field dengan data dari paket yang dipilih
   * @param {Object} pkg - Data paket yang akan diedit
   */
  const handleEditOpen = (pkg) => {
    setEditingId(pkg.id);
    setName(pkg.name);
    setDescription(pkg.description || '');
    setPricePerDay(pkg.price_per_day);
    setImageUrl(pkg.image_url || '');
    setStatus(pkg.status);

    // Mapping item yang sudah ada dalam paket ke format form
    const mapped = pkg.items.map(item => ({
      equipment_id: String(item.equipment_id),
      quantity: item.quantity
    }));
    // Jika ada item, gunakan data tersebut, jika tidak buat satu baris kosong
    setSelectedItems(mapped.length > 0 ? mapped : [{ equipment_id: '', quantity: 1 }]);
    setIsOpenForm(true);
  };

  /**
   * Menambahkan baris baru untuk memilih item dalam paket
   * Digunakan untuk menambah alat ke dalam paket
   */
  const handleAddItemRow = () => {
    setSelectedItems([...selectedItems, { equipment_id: '', quantity: 1 }]);
  };

  /**
   * Menghapus baris item dari daftar paket
   * @param {number} idx - Index item yang akan dihapus
   * Pastikan minimal ada 1 baris tersisa
   */
  const handleRemoveItemRow = (idx) => {
    const updated = selectedItems.filter((_, i) => i !== idx);
    // Jika semua baris dihapus, buat satu baris kosong
    setSelectedItems(updated.length > 0 ? updated : [{ equipment_id: '', quantity: 1 }]);
  };

  /**
   * Mengubah nilai field dalam baris item paket
   * @param {number} idx - Index item yang diubah
   * @param {string} field - Nama field yang diubah ('equipment_id' atau 'quantity')
   * @param {any} value - Nilai baru untuk field
   */
  const handleItemRowChange = (idx, field, value) => {
    const updated = selectedItems.map((item, i) => {
      if (i === idx) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setSelectedItems(updated);
  };

  /**
   * Membuka dialog konfirmasi untuk menghapus paket
   * @param {number} id - ID paket yang akan dihapus
   */
  const handleDeleteOpen = (id) => {
    setDeletingId(id);
    setIsOpenConfirm(true);
  };

  /**
   * Menangani submit form (create atau update)
   * Melakukan validasi dan mengirim data ke API
   * @param {Event} e - Event submit form
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ===== VALIDASI FORM =====
    // Validasi field wajib: nama dan harga
    if (!name || pricePerDay === '') {
      triggerToast('Nama paket dan harga wajib diisi.', 'error');
      return;
    }

    // Filter baris yang kosong (belum memilih alat)
    const itemsPayload = selectedItems
      .filter(item => item.equipment_id !== '')
      .map(item => ({
        equipment_id: parseInt(item.equipment_id, 10),
        quantity: parseInt(item.quantity, 10)
      }));

    // Validasi minimal ada 1 item dalam paket
    if (itemsPayload.length === 0) {
      triggerToast('Minimal pilih 1 item alat untuk dimasukkan ke paket.', 'error');
      return;
    }

    // ===== MEMBUAT PAYLOAD =====
    const payload = {
      name,
      description,
      price_per_day: parseFloat(pricePerDay),
      image_url: imageUrl,
      status,
      items: itemsPayload
    };

    try {
      if (editingId) {
        // Mode Update: kirim request PUT
        await api.put(`/packages/${editingId}`, payload);
        triggerToast('Paket sewa berhasil diperbarui.');
      } else {
        // Mode Create: kirim request POST
        await api.post('/packages', payload);
        triggerToast('Paket sewa baru berhasil dibuat.');
      }
      setIsOpenForm(false);
      fetchPackagesAndEquipment(); // Refresh data
    } catch (err) {
      console.error(err);
      triggerToast(err.message || 'Terjadi kesalahan saat menyimpan paket.', 'error');
    }
  };

  /**
   * Menangani konfirmasi hapus paket
   * Menghapus data dari API dan refresh daftar
   */
  const handleConfirmDelete = async () => {
    if (!deletingId) return;

    try {
      await api.delete(`/packages/${deletingId}`);
      triggerToast('Paket sewa berhasil dihapus.');
      fetchPackagesAndEquipment();
    } catch (err) {
      console.error(err);
      triggerToast(err.message || 'Gagal menghapus paket. Paket mungkin sedang disewa.', 'error');
    }
  };

  // ==================== KONFIGURASI TABLE ====================
  
  /**
   * Definisi kolom-kolom untuk DataTable
   * Setiap header memiliki label dan fungsi render untuk custom tampilan
   */
  const headers = [
    // Kolom 1: Gambar Paket
    {
      label: 'Gambar',
      render: (row) => (
        <div className="h-10 w-16 overflow-hidden rounded bg-slate-900 border border-slate-700/50">
          <img
            src={row.image_url || 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=50'}
            alt={row.name}
            className="h-full w-full object-cover"
          />
        </div>
      )
    },
    // Kolom 2: Nama Paket
    { key: 'name', label: 'Nama Paket' },
    
    // Kolom 3: Isi Paket (daftar alat yang termasuk)
    {
      label: 'Isi Paket',
      render: (row) => (
        <ul className="text-xs space-y-0.5 text-slate-400">
          {row.items.map((item, idx) => (
            <li key={idx}>• {item.quantity}x {item.equipment_name}</li>
          ))}
        </ul>
      )
    },
    
    // Kolom 4: Harga per Hari (format Rupiah)
    {
      label: 'Harga / Hari',
      render: (row) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(row.price_per_day)
    },
    
    // Kolom 5: Status Paket (Aktif/Nonaktif)
    {
      label: 'Status',
      render: (row) => (
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold ${
          row.status === 'active'
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' // Hijau: Aktif
            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'          // Merah: Nonaktif
        }`}>
          {row.status === 'active' ? 'Aktif' : 'Nonaktif'}
        </span>
      )
    }
  ];

  /**
   * Render tombol aksi untuk setiap baris data
   * @param {Object} pkg - Data paket yang akan ditampilkan aksinya
   * @returns {JSX.Element} Tombol Edit dan Hapus
   */
  const actions = (pkg) => (
    <div className="flex justify-end gap-2">
      {/* Tombol Edit */}
      <button
        onClick={() => handleEditOpen(pkg)}
        className="rounded-lg border border-slate-700 p-2 text-indigo-400 hover:bg-indigo-500/10 hover:text-indigo-300 transition-colors"
        title="Edit Paket"
      >
        <Edit2 className="h-4 w-4" />
      </button>
      {/* Tombol Hapus */}
      <button
        onClick={() => handleDeleteOpen(pkg.id)}
        className="rounded-lg border border-slate-700 p-2 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
        title="Hapus Paket"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );

  // ==================== RENDER UTAMA ====================
  
  return (
    <div className="space-y-6">
      {/* ===== HEADER HALAMAN ===== */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-wide text-white">Kelola Paket Sewa</h1>
          <p className="text-xs text-slate-400">Buat paket sewa bundling hemat yang berisi kombinasi alat camping.</p>
        </div>
        
        {/* Tombol Tambah Paket Baru */}
        <button
          onClick={handleCreateOpen}
          className="flex items-center gap-1.5 rounded-xl bg-[#E2725B] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#E2725B]/15 hover:bg-[#E2725B]/90 transition-all"
        >
          <Plus className="h-4 w-4" /> Tambah Paket Baru
        </button>
      </div>

      {/* ===== TABLE DATA ===== */}
      {loading ? (
        // Tampilkan animasi loading jika sedang mengambil data
        <div className="flex h-60 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#E2725B] border-t-transparent"></div>
        </div>
      ) : (
        // Tampilkan DataTable dengan data paket
        <DataTable
          headers={headers}
          data={packages}
          searchPlaceholder="Cari nama paket..."
          searchField="name"
          actions={actions}
        />
      )}

      {/* ===== MODAL FORM (TAMBAH/EDIT) ===== */}
      <ModalForm
        isOpen={isOpenForm}
        onClose={() => setIsOpenForm(false)}
        title={editingId ? 'Edit Data Paket Sewa' : 'Buat Paket Sewa Baru'}
      >
        <form onSubmit={handleSubmit} className="space-y-6 text-xs font-semibold">
          
          {/* ===== ROW 1: Nama & Harga ===== */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 uppercase mb-2">Nama Paket *</label>
              <input
                type="text"
                required
                placeholder="Contoh: Paket Hemat"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900/60 p-3 text-white focus:border-[#E2725B]"
              />
            </div>

            <div>
              <label className="block text-slate-400 uppercase mb-2">Harga Sewa Paket / Hari *</label>
              <input
                type="number"
                required
                min="0"
                placeholder="50000"
                value={pricePerDay}
                onChange={(e) => setPricePerDay(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900/60 p-3 text-white focus:border-[#E2725B]"
              />
            </div>
          </div>

          {/* ===== ROW 2: Deskripsi ===== */}
          <div>
            <label className="block text-slate-400 uppercase mb-2">Deskripsi Paket</label>
            <textarea
              rows="2"
              placeholder="Terangkan secara singkat kegunaan paket atau target penyewa..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900/60 p-3 text-white focus:border-[#E2725B]"
            />
          </div>

          {/* ===== ROW 3: Gambar & Status ===== */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 uppercase mb-2">URL Gambar Paket</label>
              <input
                type="text"
                placeholder="https://unsplash.com/..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900/60 p-3 text-white focus:border-[#E2725B]"
              />
            </div>

            <div>
              <label className="block text-slate-400 uppercase mb-2">Status Paket</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900/60 p-3 text-white focus:border-[#E2725B]"
              >
                <option value="active">Aktif</option>
                <option value="inactive">Nonaktif</option>
              </select>
            </div>
          </div>

          {/* ===== ROW 4: DAFTAR ITEM DALAM PAKET (DYNAMIC FORM) ===== */}
          <div className="border-t border-slate-800 pt-4 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-bold text-white uppercase tracking-wide">Daftar Isi Alat Camping</h4>
              {/* Tombol Tambah Item */}
              <button
                type="button"
                onClick={handleAddItemRow}
                className="flex items-center gap-1 text-[#E2725B] hover:text-[#E2725B]/90 transition-colors uppercase tracking-wider font-bold"
              >
                <PlusCircle className="h-4 w-4" /> Tambah Item
              </button>
            </div>

            {/* Loop untuk menampilkan setiap baris item */}
            <div className="space-y-3">
              {selectedItems.map((selected, idx) => (
                <div key={idx} className="flex gap-4 items-center">
                  {/* Dropdown pilih alat */}
                  <div className="flex-1">
                    <select
                      value={selected.equipment_id}
                      onChange={(e) => handleItemRowChange(idx, 'equipment_id', e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-900/60 p-3 text-white focus:border-[#E2725B] focus:outline-none"
                    >
                      <option value="">-- Pilih Alat --</option>
                      {equipmentList.map(item => (
                        <option key={item.id} value={item.id}>
                          {item.name} (Stok: {item.stock_available})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Input quantity */}
                  <div className="w-24">
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="Qty"
                      value={selected.quantity}
                      onChange={(e) => handleItemRowChange(idx, 'quantity', Math.max(1, parseInt(e.target.value, 10)))}
                      className="w-full rounded-xl border border-slate-700 bg-slate-900/60 p-3 text-center text-white focus:border-[#E2725B] focus:outline-none"
                    />
                  </div>

                  {/* Tombol Hapus Item */}
                  <button
                    type="button"
                    onClick={() => handleRemoveItemRow(idx)}
                    className="rounded-xl border border-slate-750 p-3 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* ===== TOMBOL FORM ===== */}
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
              Simpan Paket
            </button>
          </div>
        </form>
      </ModalForm>

      {/* ===== DIALOG KONFIRMASI HAPUS ===== */}
      <ConfirmDialog
        isOpen={isOpenConfirm}
        onClose={() => setIsOpenConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Hapus Paket Sewa?"
        message="Apakah Anda yakin ingin menghapus paket sewa ini? Item yang dihapus tidak akan dapat dipesan lagi oleh penyewa."
      />

      {/* ===== NOTIFIKASI TOAST ===== */}
      <Toast
        message={toastMsg}
        type={toastType}
        onClose={() => setToastMsg('')}
      />
    </div>
  );
}