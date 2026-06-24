const express = require('express');

const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');

const REPORT_START_DATE = '2026-06-18 00:00:00';

const VALID_STATUSES = ['unpaid', 'paid', 'refunded'];

router.get('/', authMiddleware, async (req, res) => {
  try {
    const [payments] = await db.query(
      `SELECT
         p.*,
         b.customer_name,
         b.whatsapp,
         b.booking_type,
         b.start_date,
         b.end_date
       FROM payments p
       JOIN bookings b ON b.id = p.booking_id
       WHERE (
         p.status IN ('paid', 'refunded')
         AND p.paid_at IS NOT NULL
         AND p.paid_at >= ?
         AND p.paid_at <= NOW()
       )
       OR (
         p.status = 'unpaid'
         AND b.created_at >= ?
         AND b.created_at <= NOW()
       )
       ORDER BY p.id DESC`,
      [REPORT_START_DATE, REPORT_START_DATE]
    );

    return res.json(payments);
  } catch (error) {
    console.error('Get payments error:', error);
    return res.status(500).json({
      message: 'Terjadi kesalahan saat mengambil data pembayaran.'
    });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  const status = String(req.body.status || '').trim();
  const requestedMethod = String(req.body.payment_method || '').trim();

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      message: 'ID pembayaran tidak valid.'
    });
  }

  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({
      message: 'Status pembayaran tidak valid.'
    });
  }

  try {
    const [payments] = await db.query(
      'SELECT * FROM payments WHERE id = ? LIMIT 1',
      [id]
    );

    if (payments.length === 0) {
      return res.status(404).json({
        message: 'Pembayaran tidak ditemukan.'
      });
    }

    const payment = payments[0];
    const paymentMethod = requestedMethod || payment.payment_method;

    let paidAt = payment.paid_at;

    if (status === 'paid' && payment.status !== 'paid') {
      paidAt = new Date();
    }

    if (status === 'unpaid') {
      paidAt = null;
    }

    await db.query(
      `UPDATE payments
       SET
         status = ?,
         payment_method = ?,
         paid_at = ?
       WHERE id = ?`,
      [status, paymentMethod, paidAt, id]
    );

    return res.json({
      message: 'Status pembayaran berhasil diperbarui.'
    });
  } catch (error) {
    console.error('Update payment error:', error);
    return res.status(500).json({
      message: 'Terjadi kesalahan saat memperbarui pembayaran.'
    });
  }
});

module.exports = router;
