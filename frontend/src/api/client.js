// =============================================
// KONFIGURASI API
// Base URL untuk semua request API
// =============================================
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

// =============================================
// FUNGSI HEADERS
// Menambahkan token autentikasi ke setiap request
// =============================================
const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };
  const token = localStorage.getItem('camp_rent_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`; // Kirim token untuk autentikasi
  }
  return headers;
};

// =============================================
// FUNGSI HANDLE RESPONSE
// Memproses response dari server
// =============================================
const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || 'Terjadi kesalahan pada jaringan.');
  }
  return data;
};

// =============================================
// OBJEK API
// Kumpulan method untuk melakukan request HTTP
// =============================================
export const api = {
  // GET - Mengambil data
  async get(endpoint) {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  // POST - Mengirim data baru
  async post(endpoint, body) {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  },

  // PUT - Mengupdate data
  async put(endpoint, body) {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  },

  // DELETE - Menghapus data
  async delete(endpoint) {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
};

// =============================================
// PENJELASAN SINGKAT:
// =============================================
/**
 * 1. API_BASE - Alamat dasar server backend
 * 2. getHeaders() - Menambahkan token JWT untuk autentikasi
 * 3. handleResponse() - Mengubah response menjadi JSON atau error
 * 4. api.get() - Untuk mengambil data (contoh: daftar peralatan)
 * 5. api.post() - Untuk menambah data (contoh: membuat pesanan)
 * 6. api.put() - Untuk mengupdate data (contoh: update status)
 * 7. api.delete() - Untuk menghapus data (contoh: hapus testimoni)
 */

// =============================================
// CONTOH PENGGUNAAN:
// =============================================
// api.get('/equipment')                    → GET semua peralatan
// api.post('/bookings', { ... })          → Buat pemesanan baru
// api.put('/payments/1', { status: 'paid' }) → Update pembayaran
// api.delete('/testimonials/5')           → Hapus testimoni