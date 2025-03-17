import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import passport from 'passport';
import dotenv from 'dotenv';
import pool from '../config/db.js';

dotenv.config();
const router = express.Router();

// Email Transporter Configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Function to generate OTP
function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}

// ===========================
// ✅ Signup Route
// ===========================
router.post('/signup', async (req, res) => {
  // ... existing code ...
  const { name, email, password } = req.body;
  try {
    // Check if user already exists
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();

    // Save user with OTP
    // Fixed (add RETURNING *)
const newUser = await pool.query(
  "INSERT INTO users (name, email, password, google_id, otp_secret, otp_expiry) VALUES ($1, $2, $3, NULL, $4, NOW() + INTERVAL '10 minutes') RETURNING *",
  [name, email, hashedPassword, otp]
);

    // Send OTP email
    await transporter.sendMail({
      from: '"Your App" <noreply@example.com>',
      to: email,
      subject: 'Verify Your Email',
      text: `Your OTP is: ${otp}`,
      html: `<p>Your OTP is: <strong>${otp}</strong></p>`,
    });

    res.status(201).json({ 
      message: 'OTP sent to email', 
      userId: newUser.rows[0].id 
    });
  } catch (error) {
    console.error('Signup Error:', error); // Add this line
    res.status(500).json({ message: 'Error creating user' });
  }
});

// ===========================
// ✅ Verify OTP Route
// ===========================
router.post('/verify-otp', async (req, res) => {
  const { userId, otp } = req.body;

  try {
    // First check if OTP is valid
    const checkResult = await pool.query(
      `SELECT * FROM users 
       WHERE id = $1 
       AND otp_secret = $2 
       AND otp_expiry > NOW()`,
      [userId, otp]
    );

    if (checkResult.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Then update the user
    const updateResult = await pool.query(
      `UPDATE users 
       SET email_verified = true, 
           otp_secret = NULL, 
           otp_expiry = NULL 
       WHERE id = $1 
       RETURNING *`,
      [userId]
    );

    // Generate JWT
    const token = jwt.sign(
      { id: updateResult.rows[0].id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );

    res.json({ token });
  } catch (error) {
    console.error('Verification Error:', error);
    res.status(500).json({ message: 'Verification failed' });
  }
});

// ===========================
// ✅ Login Route
// ===========================
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('Stored hash:', user.rows[0].password); // Add logging
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    console.log('Password valid:', validPassword); // Add logging

    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (!user.rows[0].email_verified) {
      return res.status(400).json({ message: 'Email not verified' });
    }

    const token = jwt.sign(
      { id: user.rows[0].id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '20m' }
    );

    res.json({ token });

  } catch (error) {
    console.error('Login error:', error); // Add error logging
    res.status(500).json({ message: 'Login failed' });
  }
});

// ===========================
// ✅ Google OAuth Routes
// ===========================
// Google Auth
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth Callback
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Generate JWT
    const token = jwt.sign(
      { id: req.user.id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '20m' }
    );

    res.redirect(`http://localhost:5173?token=${token}`);
  }
);

// ===========================
// ✅ Get User Info (After Login)
// ===========================
// ===========================
// ✅ Get User Info (After Login)
// ===========================
router.get('/user', async (req, res) => {
  try {
    // Check JWT first
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [decoded.id]);
      if (userResult.rows.length > 0) {
        return res.json({ user: userResult.rows[0] });
      }
    }

    // Then check session
    if (!req.user) return res.status(401).json({ user: null });
    res.json({ user: req.user });
  } catch (error) {
    console.error('User info error:', error);
    res.status(500).json({ user: null });
  }
});

// ===========================
// ✅ Logout Route
// ===========================
router.get('/logout', (req, res) => {
  req.logout();
  res.clearCookie('connect.sid');
  res.json({ message: 'Logged out' });
});

// Add to authroute.js
transporter.verify((error) => {
  if (error) {
    console.error('SMTP Error:', error);
  } else {
    console.log('SMTP Configured Successfully');
  }
});
// Add this route before the export
router.post('/resend-otp', async (req, res) => {
  const { userId } = req.body;
  try {
    const otp = generateOTP();
    
    await pool.query(
      "UPDATE users SET otp_secret = $1, otp_expiry = NOW() + INTERVAL '10 minutes' WHERE id = $2",
      [otp, userId]
    );

    const userResult = await pool.query('SELECT email FROM users WHERE id = $1', [userId]);
    const email = userResult.rows[0].email;

    await transporter.sendMail({
      from: '"Your App" <noreply@example.com>',
      to: email,
      subject: 'New OTP for Verification',
      text: `Your new OTP is: ${otp}`,
      html: `<p>Your new OTP is: <strong>${otp}</strong></p>`,
    });

    res.json({ message: 'OTP resent successfully' });
  } catch (error) {
    console.error('Resend OTP Error:', error);
    res.status(500).json({ message: 'Failed to resend OTP' });
  }
});

export default router;
