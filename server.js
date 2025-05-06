const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'vehicle_system'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to the database');
});

// Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'antitheiftsystem@gmail.com',
    pass: 'vxonkqnuczzmgaix'
  }
});

// Generate OTP
function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}

// POST /signup
app.post('/signup', (req, res) => {
  const { name, email, phone, password } = req.body;
  const otp = generateOTP();

  const sql = 'INSERT INTO users (name, email, phone, password, otp) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [name, email, phone, password, otp], (err, result) => {
    if (err) {
      console.error('DB Error:', err);
      return res.status(500).json({ message: 'Signup failed.' });
    }

    const mailOptions = {
      from: 'antitheiftsystem@gmail.com',
      to: email,
      subject: 'Vehicle Anti-Theft System - OTP Verification',
      text: `Hello ${name},\n\nYour OTP is: ${otp}\n\nUse this to complete your registration.\n\nThanks.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) console.error('Email Error:', error);
      else console.log('OTP Email Sent:', info.response);
    });

    res.json({ message: 'User registered successfully! Please check your email for OTP.' });
  });
});

// POST /verify-otp
app.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;

  const sql = 'SELECT * FROM users WHERE email = ? AND otp = ?';
  db.query(sql, [email, otp], (err, results) => {
    if (err) {
      console.error('DB Error:', err);
      return res.status(500).json({ message: 'Verification failed.' });
    }

    if (results.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid OTP. Please try again.' });
    }

    res.json({ success: true, message: 'OTP verified successfully!' });
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
