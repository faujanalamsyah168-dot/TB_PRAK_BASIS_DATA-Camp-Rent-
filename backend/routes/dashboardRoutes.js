const express = require('express');

const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');

// Data booking lain tetap dibatasi mulai 18 Juni 2026.
// Kartu Pendapatan dan Total Boxing memakai 7 hari terakhir termasuk hari ini.
const REPORT_START_DATE = '2026-06-18 00:00:00';

const toNumber = (value) => Number(value) || 0;

const DASHBOARD_STATS_QUERY = `
  WITH filtered_bookings AS (
    SELECT *
    FROM bookings
    WHERE created_at >= ?
      AND created_at <= NOW()
  ),

  filtered_paid_payments AS (
    SELECT *
    FROM payments
    WHERE status = 'paid'
      AND paid_at IS NOT NULL
      AND paid_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
      AND paid_at <= NOW()
  )

  SELECT
    COALESCE((
      SELECT SUM(amount)
      FROM filtered_paid_payments
    ), 0) AS total_paid_revenue,

    COALESCE((
      SELECT COUNT(DISTINCT booking_id)
      FROM filtered_paid_payments
    ), 0) AS total_paid_bookings,

    COALESCE((
      SELECT COUNT(*)
      FROM equipment
      WHERE deleted_at IS NULL
    ), 0) AS total_equipment,

    COALESCE((
      SELECT COUNT(*)
      FROM rental_packages
      WHERE deleted_at IS NULL
    ), 0) AS total_packages,

    COALESCE((
      SELECT COUNT(*)
      FROM filtered_bookings
    ), 0) AS total_bookings,

    COALESCE((
      SELECT SUM(status = 'pending')
      FROM filtered_bookings
    ), 0) AS bookings_pending,

    COALESCE((
      SELECT SUM(status = 'approved')
      FROM filtered_bookings
    ), 0) AS bookings_approved,

    COALESCE((
      SELECT SUM(status = 'rented')
      FROM filtered_bookings
    ), 0) AS bookings_rented,

    COALESCE((
      SELECT SUM(status = 'returned')
      FROM filtered_bookings
    ), 0) AS bookings_returned,

    COALESCE((
      SELECT SUM(status = 'cancelled')
      FROM filtered_bookings
    ), 0) AS bookings_cancelled
`;

const BOOKING_STATUS_QUERY = `
  WITH status_reference AS (
    SELECT
      'pending' AS status_key,
      'Menunggu Konfirmasi' AS status_label,
      1 AS sort_order

    UNION ALL SELECT 'approved', 'Disetujui', 2
    UNION ALL SELECT 'rented', 'Sedang Disewa', 3
    UNION ALL SELECT 'returned', 'Selesai / Dikembalikan', 4
    UNION ALL SELECT 'cancelled', 'Dibatalkan', 5
  ),

  filtered_bookings AS (
    SELECT status
    FROM bookings
    WHERE created_at >= ?
      AND created_at <= NOW()
  ),

  status_counts AS (
    SELECT
      status AS status_key,
      COUNT(*) AS booking_count
    FROM filtered_bookings
    GROUP BY status
  ),

  booking_total AS (
    SELECT COUNT(*) AS total_bookings
    FROM filtered_bookings
  )

  SELECT
    sr.status_key,
    sr.status_label,
    COALESCE(sc.booking_count, 0) AS booking_count,
    CASE
      WHEN bt.total_bookings = 0 THEN 0
      ELSE ROUND(
        COALESCE(sc.booking_count, 0) * 100.0 /
        bt.total_bookings,
        2
      )
    END AS percentage,
    bt.total_bookings
  FROM status_reference sr
  CROSS JOIN booking_total bt
  LEFT JOIN status_counts sc
    ON sc.status_key = sr.status_key
  ORDER BY sr.sort_order ASC
`;

const TOP_ITEMS_QUERY = `
  WITH item_usage AS (
    SELECT
      e.id,
      e.name,
      SUM(bi.quantity) AS rental_count
    FROM booking_items bi
    INNER JOIN bookings b
      ON b.id = bi.booking_id
    INNER JOIN equipment e
      ON e.id = bi.equipment_id
    WHERE bi.equipment_id IS NOT NULL
      AND b.booking_type = 'equipment'
      AND b.status <> 'cancelled'
      AND b.created_at >= ?
      AND b.created_at <= NOW()
    GROUP BY e.id, e.name
  ),

  top_items AS (
    SELECT
      id,
      name,
      rental_count
    FROM item_usage
    ORDER BY rental_count DESC, name ASC
    LIMIT 5
  )

  SELECT
    id,
    name,
    rental_count,
    SUM(rental_count) OVER () AS displayed_total,
    CASE
      WHEN SUM(rental_count) OVER () = 0 THEN 0
      ELSE ROUND(
        rental_count * 100.0 /
        SUM(rental_count) OVER (),
        2
      )
    END AS percentage
  FROM top_items
  ORDER BY rental_count DESC, name ASC
`;

const TOP_PACKAGES_QUERY = `
  WITH package_usage AS (
    SELECT
      rp.id,
      rp.name,
      SUM(bi.quantity) AS rental_count
    FROM booking_items bi
    INNER JOIN bookings b
      ON b.id = bi.booking_id
    INNER JOIN rental_packages rp
      ON rp.id = bi.package_id
    WHERE bi.package_id IS NOT NULL
      AND b.booking_type = 'package'
      AND b.status <> 'cancelled'
      AND b.created_at >= ?
      AND b.created_at <= NOW()
    GROUP BY rp.id, rp.name
  ),

  top_packages AS (
    SELECT
      id,
      name,
      rental_count
    FROM package_usage
    ORDER BY rental_count DESC, name ASC
    LIMIT 5
  )

  SELECT
    id,
    name,
    rental_count,
    SUM(rental_count) OVER () AS displayed_total,
    CASE
      WHEN SUM(rental_count) OVER () = 0 THEN 0
      ELSE ROUND(
        rental_count * 100.0 /
        SUM(rental_count) OVER (),
        2
      )
    END AS percentage
  FROM top_packages
  ORDER BY rental_count DESC, name ASC
`;

const REVENUE_TREND_QUERY = `
  WITH RECURSIVE date_range AS (
    -- Tepat 7 tanggal: hari ini dan 6 hari sebelumnya.
    SELECT DATE_SUB(CURDATE(), INTERVAL 6 DAY) AS trend_date

    UNION ALL

    SELECT DATE_ADD(trend_date, INTERVAL 1 DAY)
    FROM date_range
    WHERE trend_date < CURDATE()
  ),

  paid_per_day AS (
    SELECT
      DATE(p.paid_at) AS trend_date,
      SUM(p.amount) AS paid_revenue
    FROM payments p
    WHERE p.status = 'paid'
      AND p.paid_at IS NOT NULL
      AND p.paid_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
      AND p.paid_at <= NOW()
    GROUP BY DATE(p.paid_at)
  )

  SELECT
    DATE_FORMAT(d.trend_date, '%Y-%m-%d') AS trend_date,
    COALESCE(p.paid_revenue, 0) AS paid_revenue,
    SUM(COALESCE(p.paid_revenue, 0)) OVER () AS range_paid_revenue
  FROM date_range d
  LEFT JOIN paid_per_day p
    ON p.trend_date = d.trend_date
  ORDER BY d.trend_date ASC
`;

const loadDashboardStats = async () => {
  const [[row]] = await db.query(
    DASHBOARD_STATS_QUERY,
    [REPORT_START_DATE]
  );

  return {
    total_paid_revenue: toNumber(row.total_paid_revenue),
    total_paid_bookings: toNumber(row.total_paid_bookings),
    total_boxing: toNumber(row.total_paid_bookings),
    total_equipment: toNumber(row.total_equipment),
    total_packages: toNumber(row.total_packages),
    total_bookings: toNumber(row.total_bookings),
    bookings_pending: toNumber(row.bookings_pending),
    bookings_approved: toNumber(row.bookings_approved),
    bookings_rented: toNumber(row.bookings_rented),
    bookings_returned: toNumber(row.bookings_returned),
    bookings_cancelled: toNumber(row.bookings_cancelled)
  };
};

router.get('/overview', authMiddleware, async (req, res) => {
  try {
    const [
      stats,
      [revenueRows],
      [statusRows],
      [topItemRows],
      [topPackageRows]
    ] = await Promise.all([
      loadDashboardStats(),
      db.query(REVENUE_TREND_QUERY),
      db.query(BOOKING_STATUS_QUERY, [REPORT_START_DATE]),
      db.query(TOP_ITEMS_QUERY, [REPORT_START_DATE]),
      db.query(TOP_PACKAGES_QUERY, [REPORT_START_DATE])
    ]);

    const revenueTrend = revenueRows.map((row) => ({
      date: row.trend_date,
      paid_revenue: toNumber(row.paid_revenue)
    }));

    const bookingStatus = statusRows.map((row) => ({
      status: row.status_key,
      label: row.status_label,
      value: toNumber(row.booking_count),
      percentage: toNumber(row.percentage)
    }));

    const topItems = topItemRows.map((row) => ({
      id: toNumber(row.id),
      name: row.name,
      value: toNumber(row.rental_count),
      percentage: toNumber(row.percentage)
    }));

    const topPackages = topPackageRows.map((row) => ({
      id: toNumber(row.id),
      name: row.name,
      value: toNumber(row.rental_count),
      percentage: toNumber(row.percentage)
    }));

    return res.json({
      filters: {
        start_date: '2026-06-18',
        description: 'Data booking lain: 18 Juni 2026 sampai sekarang',
        paid_summary: {
          days: 7,
          description: 'Pendapatan dan Total Boxing: 7 hari terakhir'
        },
        revenue_trend: {
          days: 7,
          start_date: revenueRows[0]?.trend_date || null,
          end_date:
            revenueRows[revenueRows.length - 1]?.trend_date || null,
          description: '7 hari terakhir'
        }
      },
      stats,
      totals: {
        range_paid_revenue: toNumber(
          revenueRows[0]?.range_paid_revenue
        ),
        total_bookings: toNumber(
          statusRows[0]?.total_bookings
        ),
        top_item_units: toNumber(
          topItemRows[0]?.displayed_total
        ),
        top_package_units: toNumber(
          topPackageRows[0]?.displayed_total
        )
      },
      revenue_trend: revenueTrend,
      booking_status: bookingStatus,
      top_items: topItems,
      top_packages: topPackages
    });
  } catch (error) {
    console.error('Get dashboard overview error:', error);

    return res.status(500).json({
      message: 'Terjadi kesalahan saat memuat dashboard.'
    });
  }
});

router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const stats = await loadDashboardStats();
    return res.json(stats);
  } catch (error) {
    console.error('Get dashboard stats error:', error);

    return res.status(500).json({
      message: 'Terjadi kesalahan saat memuat statistik dashboard.'
    });
  }
});

module.exports = router;
