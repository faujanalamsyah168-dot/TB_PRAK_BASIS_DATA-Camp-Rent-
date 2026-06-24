const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');

// GET /api/testimonials (Publik - menampilkan semua ulasan)
router.get('/', async (req, res) => {
  try {
    const [items] = await db.query('SELECT * FROM testimonials ORDER BY created_at DESC');
    res.json(items);
  } catch (error) {
    console.error('Error mengambil testimoni:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengambil testimoni.' });
  }
});

// POST /api/testimonials (Publik - pelanggan menulis ulasan)
router.post('/', async (req, res) => {
  const { name, comment, rating } = req.body;

  // Validasi input
  if (!name || !comment || rating === undefined) {
    return res.status(400).json({ message: 'Nama, komentar, dan rating wajib diisi.' });
  }

  const numericRating = parseInt(rating, 10);
  if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
    return res.status(400).json({ message: 'Rating harus berkisar antara 1 sampai 5.' });
  }

  try {
    // Simpan testimoni dengan status visibilitas TRUE (akan ditampilkan)
    const [result] = await db.query(
      'INSERT INTO testimonials (name, comment, rating, is_visible) VALUES (?, ?, ?, TRUE)',
      [name, comment, numericRating]
    );
    res.status(201).json({
      message: 'Testimoni berhasil dikirim dan akan segera ditampilkan.',
      id: result.insertId
    });
  } catch (error) {
    console.error('Error membuat testimoni:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengirim testimoni.' });
  }
});

// PUT /api/testimonials/:id (Dilindungi - Admin mengedit atau mengubah visibilitas)
router.put('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { name, comment, rating, is_visible } = req.body;

  // Validasi semua field harus diisi
  if (!name || !comment || rating === undefined || is_visible === undefined) {
    return res.status(400).json({ message: 'Nama, komentar, rating, dan status visibilitas wajib diisi.' });
  }

  try {
    // Cek apakah testimoni dengan ID tersebut ada
    const [existing] = await db.query('SELECT * FROM testimonials WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Testimoni tidak ditemukan.' });
    }

    // Update testimoni
    await db.query(
      'UPDATE testimonials SET name = ?, comment = ?, rating = ?, is_visible = ? WHERE id = ?',
      [name, comment, rating, is_visible ? 1 : 0, id]
    );

    res.json({ message: 'Testimoni berhasil diperbarui.' });
  } catch (error) {
    console.error('Error memperbarui testimoni:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat memperbarui testimoni.' });
  }
});

// DELETE /api/testimonials/:id (Dilindungi - Admin menghapus testimoni)
router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    // Cek apakah testimoni dengan ID tersebut ada
    const [existing] = await db.query('SELECT * FROM testimonials WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Testimoni tidak ditemukan.' });
    }

    // Hapus testimoni
    await db.query('DELETE FROM testimonials WHERE id = ?', [id]);
    res.json({ message: 'Testimoni berhasil dihapus.' });
  } catch (error) {
    console.error('Error menghapus testimoni:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat menghapus testimoni.' });
  }
});

module.exports = router;