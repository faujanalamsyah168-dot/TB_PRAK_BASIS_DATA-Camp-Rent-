const express = require('express');

const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');

const VALID_STATUSES = ['available', 'unavailable'];

function parseNonNegativeNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

function parseNonNegativeInteger(value) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : null;
}

router.get('/', async (req, res) => {
  try {
    const [items] = await db.query(
      `SELECT *
       FROM equipment
       WHERE deleted_at IS NULL
       ORDER BY created_at DESC, id DESC`
    );

    return res.json(items);
  } catch (error) {
    console.error('Get equipment error:', error);
    return res.status(500).json({
      message: 'Terjadi kesalahan saat mengambil data alat.'
    });
  }
});

router.get('/:id', async (req, res) => {
  const id = Number.parseInt(req.params.id, 10);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      message: 'ID alat tidak valid.'
    });
  }

  try {
    const [items] = await db.query(
      `SELECT *
       FROM equipment
       WHERE id = ?
         AND deleted_at IS NULL
       LIMIT 1`,
      [id]
    );

    if (items.length === 0) {
      return res.status(404).json({
        message: 'Alat camping tidak ditemukan.'
      });
    }

    return res.json(items[0]);
  } catch (error) {
    console.error('Get equipment by ID error:', error);
    return res.status(500).json({
      message: 'Terjadi kesalahan saat mengambil detail alat.'
    });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  const name = String(req.body.name || '').trim();
  const category = String(req.body.category || '').trim();
  const description = String(req.body.description || '').trim() || null;
  const imageUrl = String(req.body.image_url || '').trim() || null;
  const status = String(req.body.status || 'available').trim();
  const pricePerDay = parseNonNegativeNumber(req.body.price_per_day);
  const stockTotal = parseNonNegativeInteger(req.body.stock_total);

  if (!name || !category || pricePerDay === null || stockTotal === null) {
    return res.status(400).json({
      message:
        'Nama, kategori, harga per hari, dan stok total harus diisi dengan benar.'
    });
  }

  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({
      message: 'Status alat tidak valid.'
    });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO equipment (
         name,
         category,
         description,
         price_per_day,
         stock_total,
         stock_available,
         image_url,
         status
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        category,
        description,
        pricePerDay,
        stockTotal,
        stockTotal,
        imageUrl,
        status
      ]
    );

    return res.status(201).json({
      message: 'Alat camping berhasil ditambahkan.',
      id: result.insertId
    });
  } catch (error) {
    console.error('Create equipment error:', error);
    return res.status(500).json({
      message: 'Terjadi kesalahan saat menambahkan alat camping.'
    });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  const name = String(req.body.name || '').trim();
  const category = String(req.body.category || '').trim();
  const description = String(req.body.description || '').trim() || null;
  const imageUrl = String(req.body.image_url || '').trim() || null;
  const status = String(req.body.status || '').trim();
  const pricePerDay = parseNonNegativeNumber(req.body.price_per_day);
  const stockTotal = parseNonNegativeInteger(req.body.stock_total);
  const stockAvailable = parseNonNegativeInteger(req.body.stock_available);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      message: 'ID alat tidak valid.'
    });
  }

  if (
    !name ||
    !category ||
    pricePerDay === null ||
    stockTotal === null ||
    stockAvailable === null
  ) {
    return res.status(400).json({
      message:
        'Nama, kategori, harga, stok total, dan stok tersedia harus diisi dengan benar.'
    });
  }

  if (stockAvailable > stockTotal) {
    return res.status(400).json({
      message: 'Stok tersedia tidak boleh lebih besar dari stok total.'
    });
  }

  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({
      message: 'Status alat tidak valid.'
    });
  }

  try {
    const [result] = await db.query(
      `UPDATE equipment
       SET
         name = ?,
         category = ?,
         description = ?,
         price_per_day = ?,
         stock_total = ?,
         stock_available = ?,
         image_url = ?,
         status = ?
       WHERE id = ?
         AND deleted_at IS NULL`,
      [
        name,
        category,
        description,
        pricePerDay,
        stockTotal,
        stockAvailable,
        imageUrl,
        status,
        id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'Alat camping tidak ditemukan.'
      });
    }

    return res.json({
      message: 'Alat camping berhasil diperbarui.'
    });
  } catch (error) {
    console.error('Update equipment error:', error);
    return res.status(500).json({
      message: 'Terjadi kesalahan saat memperbarui alat camping.'
    });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  const id = Number.parseInt(req.params.id, 10);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      message: 'ID alat tidak valid.'
    });
  }

  try {
    const [items] = await db.query(
      `SELECT id
       FROM equipment
       WHERE id = ?
         AND deleted_at IS NULL
       LIMIT 1`,
      [id]
    );

    if (items.length === 0) {
      return res.status(404).json({
        message: 'Alat camping tidak ditemukan.'
      });
    }

    const [activeBookings] = await db.query(
      `SELECT b.id
       FROM bookings b
       JOIN booking_items bi ON bi.booking_id = b.id
       WHERE bi.equipment_id = ?
         AND b.status IN ('pending', 'approved', 'rented')
       LIMIT 1`,
      [id]
    );

    if (activeBookings.length > 0) {
      return res.status(400).json({
        message:
          'Alat tidak bisa dihapus karena digunakan dalam booking aktif.'
      });
    }

    const [activePackages] = await db.query(
      `SELECT rp.id
       FROM rental_packages rp
       JOIN package_items pi ON pi.package_id = rp.id
       WHERE pi.equipment_id = ?
         AND rp.deleted_at IS NULL
       LIMIT 1`,
      [id]
    );

    if (activePackages.length > 0) {
      return res.status(400).json({
        message:
          'Alat tidak bisa dihapus karena masih menjadi bagian dari paket.'
      });
    }

    await db.query(
      `UPDATE equipment
       SET
         status = 'unavailable',
         deleted_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [id]
    );

    return res.json({
      message: 'Alat camping berhasil dihapus.'
    });
  } catch (error) {
    console.error('Delete equipment error:', error);
    return res.status(500).json({
      message: 'Terjadi kesalahan saat menghapus alat camping.'
    });
  }
});

module.exports = router;
