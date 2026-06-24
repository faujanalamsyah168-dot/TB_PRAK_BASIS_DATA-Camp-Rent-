-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jun 23, 2026 at 04:00 PM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `camp_rent_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `id` int NOT NULL,
  `customer_name` varchar(100) NOT NULL,
  `whatsapp` varchar(30) NOT NULL,
  `address` text NOT NULL,
  `booking_type` enum('equipment','package') NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `total_days` int NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `status` enum('pending','approved','rented','returned','cancelled') DEFAULT 'pending',
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `bookings` (8 data dengan transaksi setiap hari 18-23 Juni)
--

INSERT INTO `bookings` (`id`, `customer_name`, `whatsapp`, `address`, `booking_type`, `start_date`, `end_date`, `total_days`, `total_price`, `status`, `notes`, `created_at`) VALUES
(1, 'Yusef', '6285512345678', 'Jl. Cempaka 7, Surabaya', 'equipment', '2026-06-18', '2026-06-20', 3, '96000.00', 'rented', 'Belum melakukan pembayaran', '2026-06-18 08:00:00'),
(2, 'Rizki', '6283212345678', 'Dusun Suka Maju, Yogyakarta', 'equipment', '2026-06-19', '2026-06-20', 2, '84000.00', 'returned', 'Sudah dikembalikan', '2026-06-19 09:00:00'),
(3, 'Andre', '6284312345678', 'Jl. Mawar 23, Malang', 'package', '2026-06-20', '2026-06-21', 2, '80000.00', 'returned', 'Sudah dikembalikan', '2026-06-20 10:00:00'),
(4, 'Fugi', '6286612345678', 'Jl. Anggrek 5, Semarang', 'equipment', '2026-06-21', '2026-06-22', 2, '52000.00', 'returned', 'Sudah dikembalikan', '2026-06-21 07:46:42'),
(5, 'Naupal', '6287712345678', 'Jl. Kenanga 10, Bandung', 'package', '2026-06-22', '2026-06-24', 3, '190000.00', 'returned', 'Sudah dikembalikan', '2026-06-22 08:00:00'),
(6, 'Faujan Alamsyah', '089517034800', 'Wanaraja', 'package', '2026-06-22', '2026-06-23', 2, '80000.00', 'rented', 'Tenda warna kuning dan biru. Sedang digunakan.', '2026-06-22 14:00:00'),
(7, 'Khansa', '08956782345', 'Jayaraga', 'equipment', '2026-06-23', '2026-06-24', 1, '15000.00', 'returned', 'Headlamp warna biru. Sudah dikembalikan.', '2026-06-23 01:06:35'),
(8, 'Albar', '628991234560', 'Jl. Kenari 14, Solo', 'equipment', '2026-06-23', '2026-06-24', 2, '100000.00', 'pending', 'Menunggu konfirmasi pembayaran', '2026-06-23 13:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `booking_items`
--

CREATE TABLE `booking_items` (
  `id` int NOT NULL,
  `booking_id` int NOT NULL,
  `equipment_id` int DEFAULT NULL,
  `package_id` int DEFAULT NULL,
  `quantity` int NOT NULL,
  `price_per_day` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `booking_items`
--

INSERT INTO `booking_items` (`id`, `booking_id`, `equipment_id`, `package_id`, `quantity`, `price_per_day`, `subtotal`) VALUES
(1, 1, 20, NULL, 1, '14000.00', '42000.00'),
(2, 1, 14, NULL, 2, '9000.00', '54000.00'),
(3, 2, 8, NULL, 3, '6000.00', '36000.00'),
(4, 2, 13, NULL, 2, '12000.00', '48000.00'),
(5, 3, NULL, 2, 1, '80000.00', '160000.00'),
(6, 4, 17, NULL, 4, '5000.00', '40000.00'),
(7, 4, 18, NULL, 2, '3000.00', '12000.00'),
(8, 5, NULL, 2, 1, '80000.00', '240000.00'),
(9, 6, NULL, 1, 1, '45000.00', '90000.00'),
(10, 7, 17, NULL, 3, '5000.00', '15000.00'),
(11, 8, 12, NULL, 2, '22000.00', '88000.00'),
(12, 8, 6, NULL, 2, '3000.00', '12000.00');

-- --------------------------------------------------------

--
-- Table structure for table `equipment`
--

CREATE TABLE `equipment` (
  `id` int NOT NULL,
  `name` varchar(150) NOT NULL,
  `category` varchar(100) NOT NULL,
  `description` text,
  `price_per_day` decimal(10,2) NOT NULL,
  `stock_total` int NOT NULL,
  `stock_available` int NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `status` enum('available','unavailable') DEFAULT 'available',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `equipment`
--

INSERT INTO `equipment` (`id`, `name`, `category`, `description`, `price_per_day`, `stock_total`, `stock_available`, `image_url`, `status`, `created_at`, `deleted_at`) VALUES
(1, 'Tenda 2 Orang', 'Tenda', 'Tenda double layer untuk 2 orang.', '25000.00', 10, 10, 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=500', 'available', '2026-06-21 07:46:42', NULL),
(2, 'Tenda Dome 4 Orang', 'Tenda', 'Tenda dome double layer kapasitas 4 orang.', '40000.00', 8, 8, 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=500', 'available', '2026-06-21 07:46:42', NULL),
(3, 'Sleeping Bag', 'Tidur', 'Sleeping bag polar hangat dengan lapisan luar waterproof.', '8000.00', 30, 29, 'https://i.pinimg.com/736x/62/27/63/62276388af3c9c45647de77b464b2351.jpg', 'available', '2026-06-21 07:46:42', NULL),
(4, 'Carrier 60L', 'Tas', 'Tas gunung carrier kapasitas 60 Liter.', '15000.00', 12, 12, 'https://i.pinimg.com/736x/aa/a4/cf/aaa4cf5a003b07ff88d2caa7ce98b14a.jpg', 'available', '2026-06-21 07:46:42', NULL),
(5, 'Kompor Portable', 'Masak', 'Kompor gas portable mini/windproof.', '7000.00', 20, 20, 'https://i.pinimg.com/736x/40/04/53/400453f6cd119e9e6ad989029c33c06b.jpg', 'available', '2026-06-21 07:46:42', NULL),
(6, 'Matras Camping', 'Tidur', 'Matras karet spon hitam anti selip.', '3000.00', 40, 40, 'https://i.pinimg.com/736x/1a/9e/cf/1a9ecf52900db08ab80f680a57993637.jpg', 'available', '2026-06-21 07:46:42', NULL),
(7, 'Hammock', 'Tidur', 'Hammock single berbahan nilon parasut kuat.', '5000.00', 15, 15, 'https://i.pinimg.com/736x/9f/5c/8c/9f5c8c3c8691c7922e044d799397190f.jpg', 'available', '2026-06-21 07:46:42', NULL),
(8, 'Lampu Camping', 'Alat', 'Lampu tenda LED rechargeable dengan tingkat kecerahan tinggi.', '6000.00', 25, 22, 'https://i.pinimg.com/736x/71/9d/c3/719dc39b82f7cfcbbac78ec90149a112.jpg', 'available', '2026-06-21 07:46:42', NULL),
(9, 'Nesting', 'Masak', 'Nesting panci susun berbahan alumunium tebal anti lengket.', '7000.00', 15, 15, 'https://i.pinimg.com/736x/7c/68/fe/7c68fe2e92249b2f86a9410a516851c8.jpg', 'available', '2026-06-21 07:46:42', NULL),
(10, 'Flysheet 3x4', 'Tenda', 'Flysheet ukuran 3x4 meter sebagai pelindung tambahan.', '6000.00', 20, 20, 'https://i.pinimg.com/736x/ba/86/3b/ba863b092509c871e572e4f4b6cc84f7.jpg', 'available', '2026-06-21 07:46:42', NULL),
(11, 'Tenda Geodesic 6 Orang', 'Tenda', 'Tenda geodesic kelas premium untuk 6 orang.', '75000.00', 4, 4, 'https://i.pinimg.com/736x/35/de/9b/35de9ba23b61a1a9a7901b1c0dd88917.jpg', 'available', '2026-06-21 07:46:42', NULL),
(12, 'Tenda Ransel 1 Orang', 'Tenda', 'Tenda ringan untuk backpacker solo.', '22000.00', 10, 8, 'https://i.pinimg.com/736x/e5/0a/cf/e50acffc0ddfb405e65b53d7a3117bb4.jpg', 'available', '2026-06-21 07:46:42', NULL),
(13, 'Matras Self Inflating', 'Tidur', 'Matras self inflating dengan kenyamanan ekstra.', '12000.00', 18, 16, 'https://i.pinimg.com/1200x/f9/ec/0a/f9ec0aa05a4267432572f271c90302b5.jpg', 'available', '2026-06-21 07:46:42', NULL),
(14, 'Kursi Lipat Camping', 'Furniture', 'Kursi lipat ringan dengan sandaran punggung.', '9000.00', 20, 18, 'https://i.pinimg.com/1200x/38/0e/65/380e6571f303a3aa4abd6ee76aa15e7b.jpg', 'available', '2026-06-21 07:46:42', NULL),
(15, 'Meja Lipat Aluminium', 'Furniture', 'Meja lipat aluminium kuat, tahan karat, ringkas.', '10000.00', 15, 15, 'https://i.pinimg.com/736x/29/98/e3/2998e3ab549bd8662c5b25803946cd1a.jpg', 'available', '2026-06-21 07:46:42', NULL),
(16, 'Powerbank Solar', 'Alat', 'Powerbank solar 20000mAh untuk charging gadget.', '12000.00', 12, 12, 'https://i.pinimg.com/736x/d3/df/50/d3df50bd94456215deb1bb47d51c37f1.jpg', 'available', '2026-06-21 07:46:42', NULL),
(17, 'Headlamp LED', 'Alat', 'Headlamp LED adjustable brightness.', '5000.00', 25, 18, 'https://i.pinimg.com/736x/41/4c/a9/414ca9b301295f90038f34bf71e51877.jpg', 'available', '2026-06-21 07:46:42', NULL),
(18, 'Tali Paracord 20m', 'Alat', 'Tali paracord 20 meter serbaguna untuk tenda.', '3000.00', 30, 28, 'https://i.pinimg.com/736x/af/9a/0b/af9a0baaeda2763dfcdc3c7b06445fed.jpg', 'available', '2026-06-21 07:46:42', NULL),
(19, 'Rain Jacket', 'Pakaian', 'Jaket waterproof ringan untuk melindungi dari hujan.', '15000.00', 14, 14, 'https://i.pinimg.com/736x/db/ed/52/dbed52acb758f0b1ac4688fd2cb5474b.jpg', 'available', '2026-06-21 07:46:42', NULL),
(20, 'Cooler Box Portable', 'Alat', 'Cooler box kecil untuk menyimpan minuman tetap dingin.', '14000.00', 10, 9, 'https://i.pinimg.com/736x/f1/14/1a/f1141a246f219e47aa90a93f75970e61.jpg', 'available', '2026-06-21 07:46:42', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `package_items`
--

CREATE TABLE `package_items` (
  `id` int NOT NULL,
  `package_id` int NOT NULL,
  `equipment_id` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `package_items`
--

INSERT INTO `package_items` (`id`, `package_id`, `equipment_id`, `quantity`) VALUES
(1, 1, 1, 1),
(2, 1, 3, 2),
(3, 1, 6, 2),
(4, 1, 8, 1),
(5, 2, 2, 1),
(6, 2, 3, 4),
(7, 2, 6, 4),
(8, 2, 5, 1),
(9, 2, 8, 1),
(10, 3, 2, 1),
(11, 3, 4, 1),
(12, 3, 3, 1),
(13, 3, 6, 1),
(14, 3, 5, 1),
(15, 3, 9, 1),
(16, 3, 8, 1);

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int NOT NULL,
  `booking_id` int NOT NULL,
  `payment_method` varchar(50) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` enum('unpaid','paid','refunded') DEFAULT 'unpaid',
  `paid_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `booking_id`, `payment_method`, `amount`, `status`, `paid_at`) VALUES
(1, 1, 'Transfer Bank / Cash', '96000.00', 'unpaid', NULL),
(2, 2, 'E-Wallet (OVO/Dana/Gopay)', '84000.00', 'paid', '2026-06-19 09:30:00'),
(3, 3, 'Transfer Bank / Cash', '80000.00', 'paid', '2026-06-20 10:30:00'),
(4, 4, 'Cash / Bayar di Basecamp', '52000.00', 'paid', '2026-06-21 02:00:00'),
(5, 5, 'Bank Mandiri Transfer', '190000.00', 'paid', '2026-06-22 08:30:00'),
(6, 6, 'Bank BCA Transfer', '80000.00', 'paid', '2026-06-22 14:30:00'),
(7, 7, 'Transfer Bank / Cash', '15000.00', 'paid', '2026-06-23 01:09:50'),
(8, 8, 'Transfer Bank / Cash', '100000.00', 'unpaid', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `rental_packages`
--

CREATE TABLE `rental_packages` (
  `id` int NOT NULL,
  `name` varchar(150) NOT NULL,
  `description` text,
  `price_per_day` decimal(10,2) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `rental_packages`
--

INSERT INTO `rental_packages` (`id`, `name`, `description`, `price_per_day`, `image_url`, `status`, `created_at`, `deleted_at`) VALUES
(1, 'Paket Hemat', 'Paket camping hemat nan praktis untuk solo traveler.', '45000.00', 'https://i.pinimg.com/736x/f4/69/8d/f4698d0355cc11f027b1275f465385e1.jpg', 'active', '2026-06-21 07:46:42', NULL),
(2, 'Paket Ramean', 'Pilihan pas untuk camping ceria bareng sahabat.', '80000.00', 'https://i.pinimg.com/736x/e9/39/3e/e9393ec486dfcc5d279cd2be25a2c309.jpg', 'active', '2026-06-21 07:46:42', NULL),
(3, 'Paket Anak Gunung', 'Paket lengkap dan tangguh untuk pendaki sejati.', '95000.00', 'https://i.pinimg.com/736x/42/0b/cd/420bcda5bd02e20f72d97512ce9f3517.jpg', 'active', '2026-06-21 07:46:42', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `testimonials`
--

CREATE TABLE `testimonials` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `comment` text NOT NULL,
  `rating` int NOT NULL,
  `is_visible` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `testimonials`
--

INSERT INTO `testimonials` (`id`, `name`, `comment`, `rating`, `is_visible`, `created_at`) VALUES
(1, 'Rizki', 'Lampu campingnya awet dan terang, recomended!', 4, 1, '2026-06-20 09:00:00'),
(2, 'Andre', 'Paket Ramean lengkap banget buat camping bareng teman.', 5, 1, '2026-06-21 10:00:00'),
(3, 'Fugi', 'Pelayanan ramah, peralatan bersih dan lengkap!', 5, 1, '2026-06-22 08:00:00'),
(4, 'Naupal', 'Sewa paket ramean buat di Papandayan kemarin. Top!', 5, 1, '2026-06-23 07:00:00'),
(5, 'Khansa', 'Headlampnya terang banget! Mantap!', 5, 1, '2026-06-23 06:30:00');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin') DEFAULT 'admin',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `created_at`) VALUES
(1, 'Admin Camp', 'admin@CampRent.com', '$2b$10$UUGzDJD0yYAYZlU5we8.CeEONp5D8TM6N4t9qo4HGkajiPWgGo8Qi', 'admin', '2026-06-21 07:46:42');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_booking_status` (`status`),
  ADD KEY `idx_booking_dates` (`start_date`,`end_date`);

--
-- Indexes for table `booking_items`
--
ALTER TABLE `booking_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `booking_id` (`booking_id`),
  ADD KEY `equipment_id` (`equipment_id`),
  ADD KEY `package_id` (`package_id`);

--
-- Indexes for table `equipment`
--
ALTER TABLE `equipment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_equipment_category` (`category`),
  ADD KEY `idx_equipment_status` (`status`);

--
-- Indexes for table `package_items`
--
ALTER TABLE `package_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `package_id` (`package_id`),
  ADD KEY `equipment_id` (`equipment_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `booking_id` (`booking_id`),
  ADD KEY `idx_payment_status` (`status`);

--
-- Indexes for table `rental_packages`
--
ALTER TABLE `rental_packages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `testimonials`
--
ALTER TABLE `testimonials`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `booking_items`
--
ALTER TABLE `booking_items`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `equipment`
--
ALTER TABLE `equipment`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `package_items`
--
ALTER TABLE `package_items`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `rental_packages`
--
ALTER TABLE `rental_packages`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `testimonials`
--
ALTER TABLE `testimonials`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `booking_items`
--
ALTER TABLE `booking_items`
  ADD CONSTRAINT `booking_items_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `booking_items_ibfk_2` FOREIGN KEY (`equipment_id`) REFERENCES `equipment` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `booking_items_ibfk_3` FOREIGN KEY (`package_id`) REFERENCES `rental_packages` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `package_items`
--
ALTER TABLE `package_items`
  ADD CONSTRAINT `package_items_ibfk_1` FOREIGN KEY (`package_id`) REFERENCES `rental_packages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `package_items_ibfk_2` FOREIGN KEY (`equipment_id`) REFERENCES `equipment` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;