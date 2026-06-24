const express = require('express');

const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');

const VALID_BOOKING_TYPES = ['equipment', 'package'];
const VALID_STATUSES = [
  'pending',
  'approved',
  'rented',
  'returned',
  'cancelled'
];

function createHttpError(message, statusCode = 400) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function parsePositiveInteger(value, fieldName) {
  const parsed = Number.parseInt(value, 10);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw createHttpError(`${fieldName} harus berupa angka lebih dari 0.`);
  }

  return parsed;
}

function parseDateOnly(value) {
  const text = String(value || '').trim();

  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    return null;
  }

  const timestamp = Date.parse(`${text}T00:00:00Z`);
  return Number.isNaN(timestamp) ? null : timestamp;
}

function calculateDays(startDate, endDate) {
  const start = parseDateOnly(startDate);
  const end = parseDateOnly(endDate);

  if (start === null || end === null) {
    throw createHttpError('Format tanggal booking tidak valid.');
  }

  if (end < start) {
    throw createHttpError(
      'Tanggal kembali tidak boleh lebih awal dari tanggal mulai.'
    );
  }

  return Math.floor((end - start) / 86400000) + 1;
}

async function getBookingItems(connection, bookingId) {
  const [items] = await connection.query(
    'SELECT * FROM booking_items WHERE booking_id = ?',
    [bookingId]
  );

  return items;
}

async function adjustBookingStock(connection, bookingItems, direction) {
  for (const item of bookingItems) {
    if (item.equipment_id) {
      const [equipmentRows] = await connection.query(
        `SELECT id, name, stock_total, stock_available
         FROM equipment
         WHERE id = ?
         FOR UPDATE`,
        [item.equipment_id]
      );

      if (equipmentRows.length === 0) {
        throw createHttpError('Alat pada booking tidak ditemukan.');
      }

      const equipment = equipmentRows[0];

      if (direction < 0 && equipment.stock_available < item.quantity) {
        throw createHttpError(
          `Stok "${equipment.name}" tidak mencukupi.`
        );
      }

      if (direction < 0) {
        await connection.query(
          `UPDATE equipment
           SET stock_available = stock_available - ?
           WHERE id = ?`,
          [item.quantity, item.equipment_id]
        );
      } else {
        await connection.query(
          `UPDATE equipment
           SET stock_available = LEAST(
             stock_total,
             stock_available + ?
           )
           WHERE id = ?`,
          [item.quantity, item.equipment_id]
        );
      }

      continue;
    }

    if (item.package_id) {
      const [packageItems] = await connection.query(
        `SELECT
           pi.equipment_id,
           pi.quantity,
           e.name,
           e.stock_total,
           e.stock_available
         FROM package_items pi
         JOIN equipment e ON e.id = pi.equipment_id
         WHERE pi.package_id = ?
         FOR UPDATE`,
        [item.package_id]
      );

      if (packageItems.length === 0) {
        throw createHttpError('Isi paket pada booking tidak ditemukan.');
      }

      for (const packageItem of packageItems) {
        const quantity = packageItem.quantity * item.quantity;

        if (direction < 0 && packageItem.stock_available < quantity) {
          throw createHttpError(
            `Stok "${packageItem.name}" untuk paket tidak mencukupi.`
          );
        }

        if (direction < 0) {
          await connection.query(
            `UPDATE equipment
             SET stock_available = stock_available - ?
             WHERE id = ?`,
            [quantity, packageItem.equipment_id]
          );
        } else {
          await connection.query(
            `UPDATE equipment
             SET stock_available = LEAST(
               stock_total,
               stock_available + ?
             )
             WHERE id = ?`,
            [quantity, packageItem.equipment_id]
          );
        }
      }
    }
  }
}

router.get('/', authMiddleware, async (req, res) => {
  try {
    const [bookings] = await db.query(
      'SELECT * FROM bookings ORDER BY created_at DESC, id DESC'
    );

    for (const booking of bookings) {
      const [items] = await db.query(
        `SELECT
           bi.*,
           e.name AS equipment_name,
           e.image_url AS equipment_image,
           p.name AS package_name,
           p.image_url AS package_image
         FROM booking_items bi
         LEFT JOIN equipment e ON e.id = bi.equipment_id
         LEFT JOIN rental_packages p ON p.id = bi.package_id
         WHERE bi.booking_id = ?
         ORDER BY bi.id`,
        [booking.id]
      );

      const [payments] = await db.query(
        'SELECT * FROM payments WHERE booking_id = ? LIMIT 1',
        [booking.id]
      );

      booking.items = items;
      booking.payment = payments[0] || null;
    }

    return res.json(bookings);
  } catch (error) {
    console.error('Get bookings error:', error);
    return res.status(500).json({
      message: 'Terjadi kesalahan saat mengambil data booking.'
    });
  }
});

router.get('/notifications', authMiddleware, async (req, res) => {
  const status = String(req.query.status || '').trim();

  if (status && !VALID_STATUSES.includes(status)) {
    return res.status(400).json({
      message: 'Filter status booking tidak valid.'
    });
  }

  try {
    let query = `
      SELECT
        id,
        customer_name,
        whatsapp,
        address,
        booking_type,
        start_date,
        end_date,
        total_days,
        total_price,
        status,
        notes,
        created_at
      FROM bookings
    `;

    const params = [];

    if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC, id DESC';

    const [rows] = await db.query(query, params);
    return res.json(rows);
  } catch (error) {
    console.error('Get booking notifications error:', error);
    return res.status(500).json({
      message: 'Terjadi kesalahan saat mengambil notifikasi booking.'
    });
  }
});

router.get('/:id', authMiddleware, async (req, res) => {
  const id = Number.parseInt(req.params.id, 10);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      message: 'ID booking tidak valid.'
    });
  }

  try {
    const [bookings] = await db.query(
      'SELECT * FROM bookings WHERE id = ? LIMIT 1',
      [id]
    );

    if (bookings.length === 0) {
      return res.status(404).json({
        message: 'Booking tidak ditemukan.'
      });
    }

    const booking = bookings[0];

    const [items] = await db.query(
      `SELECT
         bi.*,
         e.name AS equipment_name,
         e.image_url AS equipment_image,
         p.name AS package_name,
         p.image_url AS package_image
       FROM booking_items bi
       LEFT JOIN equipment e ON e.id = bi.equipment_id
       LEFT JOIN rental_packages p ON p.id = bi.package_id
       WHERE bi.booking_id = ?
       ORDER BY bi.id`,
      [id]
    );

    const [payments] = await db.query(
      'SELECT * FROM payments WHERE booking_id = ? LIMIT 1',
      [id]
    );

    booking.items = items;
    booking.payment = payments[0] || null;

    return res.json(booking);
  } catch (error) {
    console.error('Get booking by ID error:', error);
    return res.status(500).json({
      message: 'Terjadi kesalahan saat mengambil detail booking.'
    });
  }
});

router.post('/', async (req, res) => {
  const customerName = String(req.body.customer_name || '').trim();
  const whatsapp = String(req.body.whatsapp || '').trim();
  const address = String(req.body.address || '').trim();
  const bookingType = String(req.body.booking_type || '').trim();
  const startDate = String(req.body.start_date || '').trim();
  const endDate = String(req.body.end_date || '').trim();
  const notes = String(req.body.notes || '').trim() || null;
  const items = req.body.items;

  if (
    !customerName ||
    !whatsapp ||
    !address ||
    !bookingType ||
    !startDate ||
    !endDate ||
    !Array.isArray(items) ||
    items.length === 0
  ) {
    return res.status(400).json({
      message: 'Semua field wajib diisi dan minimal harus menyewa 1 item.'
    });
  }

  if (!/^\d{8,20}$/.test(whatsapp)) {
    return res.status(400).json({
      message: 'Nomor WhatsApp harus berisi 8 sampai 20 angka.'
    });
  }

  if (!VALID_BOOKING_TYPES.includes(bookingType)) {
    return res.status(400).json({
      message: 'Tipe booking hanya boleh equipment atau package.'
    });
  }

  let totalDays;

  try {
    totalDays = calculateDays(startDate, endDate);
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      message: error.message
    });
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    let totalPrice = 0;
    const validatedItems = [];
    const selectedIds = new Set();

    for (const rawItem of items) {
      const itemId = parsePositiveInteger(rawItem.id, 'ID item');
      const quantity = parsePositiveInteger(rawItem.quantity, 'Jumlah sewa');

      if (selectedIds.has(itemId)) {
        throw createHttpError('Item yang sama tidak boleh dikirim dua kali.');
      }

      selectedIds.add(itemId);

      if (bookingType === 'equipment') {
        const [equipmentRows] = await connection.query(
          `SELECT *
           FROM equipment
           WHERE id = ?
             AND deleted_at IS NULL
             AND status = 'available'
           FOR UPDATE`,
          [itemId]
        );

        if (equipmentRows.length === 0) {
          throw createHttpError(
            `Alat dengan ID ${itemId} tidak ditemukan atau tidak tersedia.`
          );
        }

        const equipment = equipmentRows[0];

        if (quantity > equipment.stock_available) {
          throw createHttpError(
            `Stok "${equipment.name}" tidak mencukupi. ` +
            `Tersedia: ${equipment.stock_available}, diminta: ${quantity}.`
          );
        }

        const pricePerDay = Number(equipment.price_per_day);
        const subtotal = pricePerDay * totalDays * quantity;

        totalPrice += subtotal;
        validatedItems.push({
          equipment_id: equipment.id,
          package_id: null,
          quantity,
          price_per_day: pricePerDay,
          subtotal
        });

        continue;
      }

      const [packageRows] = await connection.query(
        `SELECT *
         FROM rental_packages
         WHERE id = ?
           AND deleted_at IS NULL
           AND status = 'active'
         FOR UPDATE`,
        [itemId]
      );

      if (packageRows.length === 0) {
        throw createHttpError(
          `Paket dengan ID ${itemId} tidak ditemukan atau tidak aktif.`
        );
      }

      const rentalPackage = packageRows[0];

      const [packageItems] = await connection.query(
        `SELECT
           pi.quantity AS item_quantity,
           e.id AS equipment_id,
           e.name AS equipment_name,
           e.stock_available,
           e.status,
           e.deleted_at
         FROM package_items pi
         JOIN equipment e ON e.id = pi.equipment_id
         WHERE pi.package_id = ?
         FOR UPDATE`,
        [itemId]
      );

      if (packageItems.length === 0) {
        throw createHttpError(`Paket "${rentalPackage.name}" belum memiliki item.`);
      }

      for (const packageItem of packageItems) {
        if (
          packageItem.deleted_at !== null ||
          packageItem.status !== 'available'
        ) {
          throw createHttpError(
            `Alat "${packageItem.equipment_name}" di dalam paket tidak tersedia.`
          );
        }

        const requiredQuantity = packageItem.item_quantity * quantity;

        if (requiredQuantity > packageItem.stock_available) {
          throw createHttpError(
            `Stok "${packageItem.equipment_name}" di dalam paket tidak mencukupi. ` +
            `Tersedia: ${packageItem.stock_available}, ` +
            `diperlukan: ${requiredQuantity}.`
          );
        }
      }

      const pricePerDay = Number(rentalPackage.price_per_day);
      const subtotal = pricePerDay * totalDays * quantity;

      totalPrice += subtotal;
      validatedItems.push({
        equipment_id: null,
        package_id: rentalPackage.id,
        quantity,
        price_per_day: pricePerDay,
        subtotal
      });
    }

    const [bookingResult] = await connection.query(
      `INSERT INTO bookings (
         customer_name,
         whatsapp,
         address,
         booking_type,
         start_date,
         end_date,
         total_days,
         total_price,
         status,
         notes
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)`,
      [
        customerName,
        whatsapp,
        address,
        bookingType,
        startDate,
        endDate,
        totalDays,
        totalPrice,
        notes
      ]
    );

    const bookingId = bookingResult.insertId;

    for (const item of validatedItems) {
      await connection.query(
        `INSERT INTO booking_items (
           booking_id,
           equipment_id,
           package_id,
           quantity,
           price_per_day,
           subtotal
         ) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          bookingId,
          item.equipment_id,
          item.package_id,
          item.quantity,
          item.price_per_day,
          item.subtotal
        ]
      );
    }

    await connection.query(
      `INSERT INTO payments (
         booking_id,
         payment_method,
         amount,
         status,
         paid_at
       ) VALUES (?, 'Transfer Bank / Cash', ?, 'unpaid', NULL)`,
      [bookingId, totalPrice]
    );

    await connection.commit();

    return res.status(201).json({
      message:
        'Booking berhasil. Admin Camp Rent akan menghubungi Anda melalui WhatsApp.',
      bookingId
    });
  } catch (error) {
    await connection.rollback();
    console.error('Create booking error:', error);

    return res.status(error.statusCode || 400).json({
      message: error.message || 'Terjadi kesalahan saat memproses booking.'
    });
  } finally {
    connection.release();
  }
});

router.put('/:id/status', authMiddleware, async (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  const status = String(req.body.status || '').trim();

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      message: 'ID booking tidak valid.'
    });
  }

  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({
      message: 'Status booking tidak valid.'
    });
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [bookings] = await connection.query(
      'SELECT * FROM bookings WHERE id = ? FOR UPDATE',
      [id]
    );

    if (bookings.length === 0) {
      throw createHttpError('Booking tidak ditemukan.', 404);
    }

    const booking = bookings[0];
    const oldStatus = booking.status;

    if (oldStatus === status) {
      await connection.rollback();
      return res.json({
        message: `Status booking tetap ${status}.`
      });
    }

    const bookingItems = await getBookingItems(connection, id);

    if (oldStatus !== 'rented' && status === 'rented') {
      await adjustBookingStock(connection, bookingItems, -1);
    }

    if (oldStatus === 'rented' && status !== 'rented') {
      await adjustBookingStock(connection, bookingItems, 1);
    }

    await connection.query(
      'UPDATE bookings SET status = ? WHERE id = ?',
      [status, id]
    );

    if (status === 'cancelled') {
      await connection.query(
        `UPDATE payments
         SET status = CASE
           WHEN status = 'paid' THEN 'refunded'
           ELSE status
         END
         WHERE booking_id = ?`,
        [id]
      );
    }

    await connection.commit();

    return res.json({
      message:
        `Status booking berhasil diubah dari ${oldStatus} menjadi ${status}.`
    });
  } catch (error) {
    await connection.rollback();
    console.error('Update booking status error:', error);

    return res.status(error.statusCode || 400).json({
      message: error.message || 'Gagal mengubah status booking.'
    });
  } finally {
    connection.release();
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  const id = Number.parseInt(req.params.id, 10);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      message: 'ID booking tidak valid.'
    });
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [bookings] = await connection.query(
      'SELECT * FROM bookings WHERE id = ? FOR UPDATE',
      [id]
    );

    if (bookings.length === 0) {
      throw createHttpError('Booking tidak ditemukan.', 404);
    }

    const booking = bookings[0];

    if (booking.status === 'rented') {
      const bookingItems = await getBookingItems(connection, id);
      await adjustBookingStock(connection, bookingItems, 1);
    }

    await connection.query(
      'DELETE FROM bookings WHERE id = ?',
      [id]
    );

    await connection.commit();

    return res.json({
      message: 'Booking berhasil dihapus.'
    });
  } catch (error) {
    await connection.rollback();
    console.error('Delete booking error:', error);

    return res.status(error.statusCode || 500).json({
      message: error.message || 'Terjadi kesalahan saat menghapus booking.'
    });
  } finally {
    connection.release();
  }
});

module.exports = router;
