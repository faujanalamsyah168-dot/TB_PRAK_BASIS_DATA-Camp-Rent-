const express = require('express');

const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');

const VALID_STATUSES = ['active', 'inactive'];

function createHttpError(message, statusCode = 400) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function normalizePackageItems(items) {
  if (!Array.isArray(items) || items.length === 0) {
    throw createHttpError('Minimal satu item alat wajib dipilih.');
  }

  const normalized = [];
  const equipmentIds = new Set();

  for (const item of items) {
    const equipmentId = Number.parseInt(item.equipment_id, 10);
    const quantity = Number.parseInt(item.quantity, 10);

    if (
      !Number.isInteger(equipmentId) ||
      equipmentId <= 0 ||
      !Number.isInteger(quantity) ||
      quantity <= 0
    ) {
      throw createHttpError('Format item alat tidak valid.');
    }

    if (equipmentIds.has(equipmentId)) {
      throw createHttpError('Alat yang sama tidak boleh dimasukkan dua kali.');
    }

    equipmentIds.add(equipmentId);
    normalized.push({
      equipment_id: equipmentId,
      quantity
    });
  }

  return normalized;
}

async function validateEquipment(connection, items) {
  const ids = items.map((item) => item.equipment_id);
  const placeholders = ids.map(() => '?').join(', ');

  const [rows] = await connection.query(
    `SELECT id
     FROM equipment
     WHERE id IN (${placeholders})
       AND deleted_at IS NULL
       AND status = 'available'`,
    ids
  );

  if (rows.length !== ids.length) {
    throw createHttpError(
      'Salah satu alat tidak ditemukan atau tidak tersedia.'
    );
  }
}

async function attachPackageItems(packages) {
  for (const rentalPackage of packages) {
    const [items] = await db.query(
      `SELECT
         pi.id,
         pi.quantity,
         e.id AS equipment_id,
         e.name AS equipment_name,
         e.price_per_day,
         e.image_url,
         e.category
       FROM package_items pi
       JOIN equipment e ON e.id = pi.equipment_id
       WHERE pi.package_id = ?
       ORDER BY pi.id`,
      [rentalPackage.id]
    );

    rentalPackage.items = items;
  }
}

router.get('/', async (req, res) => {
  try {
    const [packages] = await db.query(
      `SELECT *
       FROM rental_packages
       WHERE deleted_at IS NULL
       ORDER BY created_at DESC, id DESC`
    );

    await attachPackageItems(packages);
    return res.json(packages);
  } catch (error) {
    console.error('Get packages error:', error);
    return res.status(500).json({
      message: 'Terjadi kesalahan saat mengambil data paket.'
    });
  }
});

router.get('/:id', async (req, res) => {
  const id = Number.parseInt(req.params.id, 10);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      message: 'ID paket tidak valid.'
    });
  }

  try {
    const [packages] = await db.query(
      `SELECT *
       FROM rental_packages
       WHERE id = ?
         AND deleted_at IS NULL
       LIMIT 1`,
      [id]
    );

    if (packages.length === 0) {
      return res.status(404).json({
        message: 'Paket sewa tidak ditemukan.'
      });
    }

    await attachPackageItems(packages);
    return res.json(packages[0]);
  } catch (error) {
    console.error('Get package by ID error:', error);
    return res.status(500).json({
      message: 'Terjadi kesalahan saat mengambil detail paket.'
    });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  const name = String(req.body.name || '').trim();
  const description = String(req.body.description || '').trim() || null;
  const imageUrl = String(req.body.image_url || '').trim() || null;
  const status = String(req.body.status || 'active').trim();
  const pricePerDay = Number(req.body.price_per_day);

  if (!name || !Number.isFinite(pricePerDay) || pricePerDay < 0) {
    return res.status(400).json({
      message: 'Nama dan harga paket harus diisi dengan benar.'
    });
  }

  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({
      message: 'Status paket tidak valid.'
    });
  }

  let items;

  try {
    items = normalizePackageItems(req.body.items);
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      message: error.message
    });
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();
    await validateEquipment(connection, items);

    const [packageResult] = await connection.query(
      `INSERT INTO rental_packages (
         name,
         description,
         price_per_day,
         image_url,
         status
       ) VALUES (?, ?, ?, ?, ?)`,
      [name, description, pricePerDay, imageUrl, status]
    );

    const packageId = packageResult.insertId;

    for (const item of items) {
      await connection.query(
        `INSERT INTO package_items (
           package_id,
           equipment_id,
           quantity
         ) VALUES (?, ?, ?)`,
        [packageId, item.equipment_id, item.quantity]
      );
    }

    await connection.commit();

    return res.status(201).json({
      message: 'Paket sewa berhasil dibuat.',
      id: packageId
    });
  } catch (error) {
    await connection.rollback();
    console.error('Create package error:', error);

    return res.status(error.statusCode || 500).json({
      message: error.message || 'Terjadi kesalahan saat membuat paket sewa.'
    });
  } finally {
    connection.release();
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  const name = String(req.body.name || '').trim();
  const description = String(req.body.description || '').trim() || null;
  const imageUrl = String(req.body.image_url || '').trim() || null;
  const status = String(req.body.status || '').trim();
  const pricePerDay = Number(req.body.price_per_day);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      message: 'ID paket tidak valid.'
    });
  }

  if (!name || !Number.isFinite(pricePerDay) || pricePerDay < 0) {
    return res.status(400).json({
      message: 'Nama dan harga paket harus diisi dengan benar.'
    });
  }

  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({
      message: 'Status paket tidak valid.'
    });
  }

  let items;

  try {
    items = normalizePackageItems(req.body.items);
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      message: error.message
    });
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [existing] = await connection.query(
      `SELECT id
       FROM rental_packages
       WHERE id = ?
         AND deleted_at IS NULL
       FOR UPDATE`,
      [id]
    );

    if (existing.length === 0) {
      throw createHttpError('Paket sewa tidak ditemukan.', 404);
    }

    await validateEquipment(connection, items);

    await connection.query(
      `UPDATE rental_packages
       SET
         name = ?,
         description = ?,
         price_per_day = ?,
         image_url = ?,
         status = ?
       WHERE id = ?`,
      [name, description, pricePerDay, imageUrl, status, id]
    );

    await connection.query(
      'DELETE FROM package_items WHERE package_id = ?',
      [id]
    );

    for (const item of items) {
      await connection.query(
        `INSERT INTO package_items (
           package_id,
           equipment_id,
           quantity
         ) VALUES (?, ?, ?)`,
        [id, item.equipment_id, item.quantity]
      );
    }

    await connection.commit();

    return res.json({
      message: 'Paket sewa berhasil diperbarui.'
    });
  } catch (error) {
    await connection.rollback();
    console.error('Update package error:', error);

    return res.status(error.statusCode || 500).json({
      message: error.message || 'Terjadi kesalahan saat memperbarui paket sewa.'
    });
  } finally {
    connection.release();
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  const id = Number.parseInt(req.params.id, 10);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      message: 'ID paket tidak valid.'
    });
  }

  try {
    const [existing] = await db.query(
      `SELECT id
       FROM rental_packages
       WHERE id = ?
         AND deleted_at IS NULL
       LIMIT 1`,
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        message: 'Paket sewa tidak ditemukan.'
      });
    }

    const [activeBookings] = await db.query(
      `SELECT b.id
       FROM bookings b
       JOIN booking_items bi ON bi.booking_id = b.id
       WHERE bi.package_id = ?
         AND b.status IN ('pending', 'approved', 'rented')
       LIMIT 1`,
      [id]
    );

    if (activeBookings.length > 0) {
      return res.status(400).json({
        message:
          'Paket tidak bisa dihapus karena digunakan dalam booking aktif.'
      });
    }

    await db.query(
      `UPDATE rental_packages
       SET
         status = 'inactive',
         deleted_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [id]
    );

    return res.json({
      message: 'Paket sewa berhasil dihapus.'
    });
  } catch (error) {
    console.error('Delete package error:', error);
    return res.status(500).json({
      message: 'Terjadi kesalahan saat menghapus paket sewa.'
    });
  }
});

module.exports = router;
