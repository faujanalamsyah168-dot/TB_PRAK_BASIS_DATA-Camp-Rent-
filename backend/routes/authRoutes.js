const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/login', async (req, res) => {
  const email = String(req.body.email || '').trim();
  const password = String(req.body.password || '');

  if (!email || !password) {
    return res.status(400).json({
      message: 'Email dan password wajib diisi.'
    });
  }

  try {
    const [users] = await db.query(
      `SELECT id, name, email, password, role, created_at
       FROM users
       WHERE email = ?
       LIMIT 1`,
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        message: 'Email atau password salah.'
      });
    }

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Email atau password salah.'
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET || 'camp_rent_jwt_secret_key_123!',
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '8h'
      }
    );

    return res.json({
      message: 'Login berhasil.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      message: 'Terjadi kesalahan pada server.'
    });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const [users] = await db.query(
      `SELECT id, name, email, role, created_at
       FROM users
       WHERE id = ?
       LIMIT 1`,
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        message: 'User tidak ditemukan.'
      });
    }

    return res.json(users[0]);
  } catch (error) {
    console.error('Verify user error:', error);
    return res.status(500).json({
      message: 'Terjadi kesalahan pada server.'
    });
  }
});

module.exports = router;
