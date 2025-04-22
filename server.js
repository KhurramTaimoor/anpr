const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();
const port = 3000;

// Enable CORS
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // set your MySQL root password
  database: 'vehicle_system' // set your actual DB name
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to the database');
});

// POST route to handle signup
app.post('/signup', (req, res) => {
  const { name, email, phone, password } = req.body;

  const sql = 'INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)';
  db.query(sql, [name, email, phone, password], (err, result) => {
    if (err) {
      console.error('Error inserting into DB:', err);
      res.status(500).json({ message: 'Signup failed.' });
    } else {
      res.json({ message: 'User registered successfully!' });
    }
  });
});

// POST route to handle login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error('Error querying DB:', err);
      res.status(500).json({ message: 'Login failed.' });
    } else if (results.length === 0) {
      res.status(401).json({ message: 'User not found' });
    } else {
      const user = results[0];

      // Check if passwords match (this is simple, use bcrypt for production)
      if (password !== user.password) {
        res.status(401).json({ message: 'Incorrect password' });
      } else {
        res.status(200).json({ message: 'Login successful' });
      }
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log("Server running at http://localhost:${port}");
});  