const db = require('../config/db');

/**
 * Seed Camp Rent yang disinkronkan dengan dump camp_rent_db
 * tanggal 23 Juni 2026.
 *
 * Sifat seed:
 * - Tidak menggunakan TRUNCATE atau DELETE.
 * - Tidak menimpa data yang sudah ada.
 * - INSERT IGNORE membuat seed aman dijalankan berulang kali.
 * - ID, tanggal, nominal, status, dan relasi mengikuti dump SQL.
 */

const users = [
  [
    1,
    'Admin Camp',
    'admin@CampRent.com',
    '$2b$10$UUGzDJD0yYAYZlU5we8.CeEONp5D8TM6N4t9qo4HGkajiPWgGo8Qi',
    'admin',
    '2026-06-21 07:46:42'
  ]
];

const equipment = [
  [1, 'Tenda 2 Orang', 'Tenda', 'Tenda double layer untuk 2 orang.', 25000, 10, 10, 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=500', 'available', '2026-06-21 07:46:42', null],
  [2, 'Tenda Dome 4 Orang', 'Tenda', 'Tenda dome double layer kapasitas 4 orang.', 40000, 8, 8, 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=500', 'available', '2026-06-21 07:46:42', null],
  [3, 'Sleeping Bag', 'Tidur', 'Sleeping bag polar hangat dengan lapisan luar waterproof.', 8000, 30, 29, 'https://i.pinimg.com/736x/62/27/63/62276388af3c9c45647de77b464b2351.jpg', 'available', '2026-06-21 07:46:42', null],
  [4, 'Carrier 60L', 'Tas', 'Tas gunung carrier kapasitas 60 Liter.', 15000, 12, 12, 'https://i.pinimg.com/736x/aa/a4/cf/aaa4cf5a003b07ff88d2caa7ce98b14a.jpg', 'available', '2026-06-21 07:46:42', null],
  [5, 'Kompor Portable', 'Masak', 'Kompor gas portable mini/windproof.', 7000, 20, 20, 'https://i.pinimg.com/736x/40/04/53/400453f6cd119e9e6ad989029c33c06b.jpg', 'available', '2026-06-21 07:46:42', null],
  [6, 'Matras Camping', 'Tidur', 'Matras karet spon hitam anti selip.', 3000, 40, 40, 'https://i.pinimg.com/736x/1a/9e/cf/1a9ecf52900db08ab80f680a57993637.jpg', 'available', '2026-06-21 07:46:42', null],
  [7, 'Hammock', 'Tidur', 'Hammock single berbahan nilon parasut kuat.', 5000, 15, 15, 'https://i.pinimg.com/736x/9f/5c/8c/9f5c8c3c8691c7922e044d799397190f.jpg', 'available', '2026-06-21 07:46:42', null],
  [8, 'Lampu Camping', 'Alat', 'Lampu tenda LED rechargeable dengan tingkat kecerahan tinggi.', 6000, 25, 22, 'https://i.pinimg.com/736x/71/9d/c3/719dc39b82f7cfcbbac78ec90149a112.jpg', 'available', '2026-06-21 07:46:42', null],
  [9, 'Nesting', 'Masak', 'Nesting panci susun berbahan alumunium tebal anti lengket.', 7000, 15, 15, 'https://i.pinimg.com/736x/7c/68/fe/7c68fe2e92249b2f86a9410a516851c8.jpg', 'available', '2026-06-21 07:46:42', null],
  [10, 'Flysheet 3x4', 'Tenda', 'Flysheet ukuran 3x4 meter sebagai pelindung tambahan.', 6000, 20, 20, 'https://i.pinimg.com/736x/ba/86/3b/ba863b092509c871e572e4f4b6cc84f7.jpg', 'available', '2026-06-21 07:46:42', null],
  [11, 'Tenda Geodesic 6 Orang', 'Tenda', 'Tenda geodesic kelas premium untuk 6 orang.', 75000, 4, 4, 'https://i.pinimg.com/736x/35/de/9b/35de9ba23b61a1a9a7901b1c0dd88917.jpg', 'available', '2026-06-21 07:46:42', null],
  [12, 'Tenda Ransel 1 Orang', 'Tenda', 'Tenda ringan untuk backpacker solo.', 22000, 10, 8, 'https://i.pinimg.com/736x/e5/0a/cf/e50acffc0ddfb405e65b53d7a3117bb4.jpg', 'available', '2026-06-21 07:46:42', null],
  [13, 'Matras Self Inflating', 'Tidur', 'Matras self inflating dengan kenyamanan ekstra.', 12000, 18, 16, 'https://i.pinimg.com/1200x/f9/ec/0a/f9ec0aa05a4267432572f271c90302b5.jpg', 'available', '2026-06-21 07:46:42', null],
  [14, 'Kursi Lipat Camping', 'Furniture', 'Kursi lipat ringan dengan sandaran punggung.', 9000, 20, 18, 'https://i.pinimg.com/1200x/38/0e/65/380e6571f303a3aa4abd6ee76aa15e7b.jpg', 'available', '2026-06-21 07:46:42', null],
  [15, 'Meja Lipat Aluminium', 'Furniture', 'Meja lipat aluminium kuat, tahan karat, ringkas.', 10000, 15, 15, 'https://i.pinimg.com/736x/29/98/e3/2998e3ab549bd8662c5b25803946cd1a.jpg', 'available', '2026-06-21 07:46:42', null],
  [16, 'Powerbank Solar', 'Alat', 'Powerbank solar 20000mAh untuk charging gadget.', 12000, 12, 12, 'https://i.pinimg.com/736x/d3/df/50/d3df50bd94456215deb1bb47d51c37f1.jpg', 'available', '2026-06-21 07:46:42', null],
  [17, 'Headlamp LED', 'Alat', 'Headlamp LED adjustable brightness.', 5000, 25, 18, 'https://i.pinimg.com/736x/41/4c/a9/414ca9b301295f90038f34bf71e51877.jpg', 'available', '2026-06-21 07:46:42', null],
  [18, 'Tali Paracord 20m', 'Alat', 'Tali paracord 20 meter serbaguna untuk tenda.', 3000, 30, 28, 'https://i.pinimg.com/736x/af/9a/0b/af9a0baaeda2763dfcdc3c7b06445fed.jpg', 'available', '2026-06-21 07:46:42', null],
  [19, 'Rain Jacket', 'Pakaian', 'Jaket waterproof ringan untuk melindungi dari hujan.', 15000, 14, 14, 'https://i.pinimg.com/736x/db/ed/52/dbed52acb758f0b1ac4688fd2cb5474b.jpg', 'available', '2026-06-21 07:46:42', null],
  [20, 'Cooler Box Portable', 'Alat', 'Cooler box kecil untuk menyimpan minuman tetap dingin.', 14000, 10, 9, 'https://i.pinimg.com/736x/f1/14/1a/f1141a246f219e47aa90a93f75970e61.jpg', 'available', '2026-06-21 07:46:42', null]
];

const rentalPackages = [
  [1, 'Paket Hemat', 'Paket camping hemat nan praktis untuk solo traveler.', 45000, 'https://i.pinimg.com/736x/f4/69/8d/f4698d0355cc11f027b1275f465385e1.jpg', 'active', '2026-06-21 07:46:42', null],
  [2, 'Paket Ramean', 'Pilihan pas untuk camping ceria bareng sahabat.', 80000, 'https://i.pinimg.com/736x/e9/39/3e/e9393ec486dfcc5d279cd2be25a2c309.jpg', 'active', '2026-06-21 07:46:42', null],
  [3, 'Paket Anak Gunung', 'Paket lengkap dan tangguh untuk pendaki sejati.', 95000, 'https://i.pinimg.com/736x/42/0b/cd/420bcda5bd02e20f72d97512ce9f3517.jpg', 'active', '2026-06-21 07:46:42', null]
];

const packageItems = [
  [1, 1, 1, 1], [2, 1, 3, 2], [3, 1, 6, 2], [4, 1, 8, 1],
  [5, 2, 2, 1], [6, 2, 3, 4], [7, 2, 6, 4], [8, 2, 5, 1], [9, 2, 8, 1],
  [10, 3, 2, 1], [11, 3, 4, 1], [12, 3, 3, 1], [13, 3, 6, 1],
  [14, 3, 5, 1], [15, 3, 9, 1], [16, 3, 8, 1]
];

const bookings = [
  [1, 'Yusef', '6285512345678', 'Jl. Cempaka 7, Surabaya', 'equipment', '2026-06-18', '2026-06-20', 3, 96000, 'rented', 'Belum melakukan pembayaran', '2026-06-18 08:00:00'],
  [2, 'Rizki', '6283212345678', 'Dusun Suka Maju, Yogyakarta', 'equipment', '2026-06-19', '2026-06-20', 2, 84000, 'returned', 'Sudah dikembalikan', '2026-06-19 09:00:00'],
  [3, 'Andre', '6284312345678', 'Jl. Mawar 23, Malang', 'package', '2026-06-20', '2026-06-21', 2, 80000, 'returned', 'Sudah dikembalikan', '2026-06-20 10:00:00'],
  [4, 'Fugi', '6286612345678', 'Jl. Anggrek 5, Semarang', 'equipment', '2026-06-21', '2026-06-22', 2, 52000, 'returned', 'Sudah dikembalikan', '2026-06-21 07:46:42'],
  [5, 'Naupal', '6287712345678', 'Jl. Kenanga 10, Bandung', 'package', '2026-06-22', '2026-06-24', 3, 190000, 'returned', 'Sudah dikembalikan', '2026-06-22 08:00:00'],
  [6, 'Faujan Alamsyah', '089517034800', 'Wanaraja', 'package', '2026-06-22', '2026-06-23', 2, 80000, 'rented', 'Tenda warna kuning dan biru. Sedang digunakan.', '2026-06-22 14:00:00'],
  [7, 'Khansa', '08956782345', 'Jayaraga', 'equipment', '2026-06-23', '2026-06-24', 1, 15000, 'returned', 'Headlamp warna biru. Sudah dikembalikan.', '2026-06-23 01:06:35'],
  [8, 'Albar', '628991234560', 'Jl. Kenari 14, Solo', 'equipment', '2026-06-23', '2026-06-24', 2, 100000, 'pending', 'Menunggu konfirmasi pembayaran', '2026-06-23 13:00:00']
];

const bookingItems = [
  [1, 1, 20, null, 1, 14000, 42000],
  [2, 1, 14, null, 2, 9000, 54000],
  [3, 2, 8, null, 3, 6000, 36000],
  [4, 2, 13, null, 2, 12000, 48000],
  [5, 3, null, 2, 1, 80000, 160000],
  [6, 4, 17, null, 4, 5000, 40000],
  [7, 4, 18, null, 2, 3000, 12000],
  [8, 5, null, 2, 1, 80000, 240000],
  [9, 6, null, 1, 1, 45000, 90000],
  [10, 7, 17, null, 3, 5000, 15000],
  [11, 8, 12, null, 2, 22000, 88000],
  [12, 8, 6, null, 2, 3000, 12000]
];

const payments = [
  [1, 1, 'Transfer Bank / Cash', 96000, 'unpaid', null],
  [2, 2, 'E-Wallet (OVO/Dana/Gopay)', 84000, 'paid', '2026-06-19 09:30:00'],
  [3, 3, 'Transfer Bank / Cash', 80000, 'paid', '2026-06-20 10:30:00'],
  [4, 4, 'Cash / Bayar di Basecamp', 52000, 'paid', '2026-06-21 02:00:00'],
  [5, 5, 'Bank Mandiri Transfer', 190000, 'paid', '2026-06-22 08:30:00'],
  [6, 6, 'Bank BCA Transfer', 80000, 'paid', '2026-06-22 14:30:00'],
  [7, 7, 'Transfer Bank / Cash', 15000, 'paid', '2026-06-23 01:09:50'],
  [8, 8, 'Transfer Bank / Cash', 100000, 'unpaid', null]
];

const testimonials = [
  [1, 'Rizki', 'Lampu campingnya awet dan terang, recomended!', 4, 1, '2026-06-20 09:00:00'],
  [2, 'Andre', 'Paket Ramean lengkap banget buat camping bareng teman.', 5, 1, '2026-06-21 10:00:00'],
  [3, 'Fugi', 'Pelayanan ramah, peralatan bersih dan lengkap!', 5, 1, '2026-06-22 08:00:00'],
  [4, 'Naupal', 'Sewa paket ramean buat di Papandayan kemarin. Top!', 5, 1, '2026-06-23 07:00:00'],
  [5, 'Khansa', 'Headlampnya terang banget! Mantap!', 5, 1, '2026-06-23 06:30:00']
];

const requiredTables = [
  'users',
  'equipment',
  'rental_packages',
  'package_items',
  'bookings',
  'booking_items',
  'payments',
  'testimonials'
];

async function ensureSchemaExists(connection) {
  const [rows] = await connection.query('SHOW TABLES');
  const existingTables = new Set(
    rows.map((row) => String(Object.values(row)[0]))
  );

  const missingTables = requiredTables.filter(
    (table) => !existingTables.has(table)
  );

  if (missingTables.length > 0) {
    throw new Error(
      `Tabel belum tersedia: ${missingTables.join(', ')}. ` +
      'Import backend/sql/camp_rent_db.sql terlebih dahulu.'
    );
  }
}

async function assertNoIdConflicts(connection, table, rows, identityIndex, identityColumn) {
  for (const row of rows) {
    const id = row[0];
    const expectedIdentity = row[identityIndex];

    const [existingRows] = await connection.query(
      `SELECT \`${identityColumn}\` AS identity_value FROM \`${table}\` WHERE id = ? LIMIT 1`,
      [id]
    );

    if (
      existingRows.length > 0 &&
      String(existingRows[0].identity_value) !== String(expectedIdentity)
    ) {
      throw new Error(
        `Konflik ID pada tabel ${table}: id ${id} sudah digunakan oleh ` +
        `"${existingRows[0].identity_value}", sedangkan seed membutuhkan ` +
        `"${expectedIdentity}". Seed dibatalkan agar data lama tidak tertimpa.`
      );
    }
  }
}

async function insertIgnore(connection, table, columns, rows) {
  if (!rows.length) return 0;

  const placeholders = rows
    .map(() => `(${columns.map(() => '?').join(', ')})`)
    .join(', ');

  const sql = `
    INSERT IGNORE INTO \`${table}\`
      (${columns.map((column) => `\`${column}\``).join(', ')})
    VALUES ${placeholders}
  `;

  const [result] = await connection.query(sql, rows.flat());
  return result.affectedRows;
}

async function readTableCounts(connection) {
  const result = {};

  for (const table of requiredTables) {
    const [[row]] = await connection.query(
      `SELECT COUNT(*) AS total FROM \`${table}\``
    );
    result[table] = Number(row.total || 0);
  }

  return result;
}

async function seed() {
  const connection = await db.getConnection();

  try {
    console.log('=== MEMULAI SEED CAMP RENT (NON-DESTRUKTIF) ===');
    console.log('Seed tidak menjalankan TRUNCATE, DELETE, atau UPDATE data lama.');

    await connection.query("SET time_zone = '+00:00'");
    await ensureSchemaExists(connection);

    // Lindungi database dari relasi yang salah jika ID lama sudah dipakai data lain.
    await assertNoIdConflicts(connection, 'users', users, 2, 'email');
    await assertNoIdConflicts(connection, 'equipment', equipment, 1, 'name');
    await assertNoIdConflicts(connection, 'rental_packages', rentalPackages, 1, 'name');
    await assertNoIdConflicts(connection, 'bookings', bookings, 1, 'customer_name');
    await assertNoIdConflicts(connection, 'testimonials', testimonials, 1, 'name');

    await connection.beginTransaction();

    const inserted = {};

    inserted.users = await insertIgnore(
      connection,
      'users',
      ['id', 'name', 'email', 'password', 'role', 'created_at'],
      users
    );

    inserted.equipment = await insertIgnore(
      connection,
      'equipment',
      [
        'id', 'name', 'category', 'description', 'price_per_day',
        'stock_total', 'stock_available', 'image_url', 'status',
        'created_at', 'deleted_at'
      ],
      equipment
    );

    inserted.rental_packages = await insertIgnore(
      connection,
      'rental_packages',
      [
        'id', 'name', 'description', 'price_per_day', 'image_url',
        'status', 'created_at', 'deleted_at'
      ],
      rentalPackages
    );

    inserted.package_items = await insertIgnore(
      connection,
      'package_items',
      ['id', 'package_id', 'equipment_id', 'quantity'],
      packageItems
    );

    inserted.bookings = await insertIgnore(
      connection,
      'bookings',
      [
        'id', 'customer_name', 'whatsapp', 'address', 'booking_type',
        'start_date', 'end_date', 'total_days', 'total_price', 'status',
        'notes', 'created_at'
      ],
      bookings
    );

    inserted.booking_items = await insertIgnore(
      connection,
      'booking_items',
      [
        'id', 'booking_id', 'equipment_id', 'package_id', 'quantity',
        'price_per_day', 'subtotal'
      ],
      bookingItems
    );

    inserted.payments = await insertIgnore(
      connection,
      'payments',
      ['id', 'booking_id', 'payment_method', 'amount', 'status', 'paid_at'],
      payments
    );

    inserted.testimonials = await insertIgnore(
      connection,
      'testimonials',
      ['id', 'name', 'comment', 'rating', 'is_visible', 'created_at'],
      testimonials
    );

    await connection.commit();

    const counts = await readTableCounts(connection);

    console.log('\nData baru yang ditambahkan:');
    for (const [table, total] of Object.entries(inserted)) {
      console.log(`- ${table}: ${total}`);
    }

    console.log('\nTotal data database setelah seed:');
    for (const [table, total] of Object.entries(counts)) {
      console.log(`- ${table}: ${total}`);
    }

    console.log('\n=== SEED SELESAI TANPA MENGGANTI DATA LAMA ===');
  } catch (error) {
    try {
      await connection.rollback();
    } catch (_) {
      // Tidak ada transaksi aktif atau rollback gagal; error utama tetap ditampilkan.
    }

    console.error('\nSeed database gagal:', error.message);
    process.exitCode = 1;
  } finally {
    connection.release();
    await db.end();
  }
}

seed();
