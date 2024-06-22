const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('./db');

// Login endpoint
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    const sql = 'SELECT * FROM user WHERE Email = ?';
    db.query(sql, [email], async (err, results) => {
        if (err) {
            return res.status(500).send('An error occurred during login');
        }
        if (results.length === 0) {
            return res.status(401).send('Invalid email or password');
        }

        const user = results[0];
        const match = await bcrypt.compare(password, user.Password);
        if (match) {
            // Login successful
            res.redirect('/home.html');
        } else {
            // Login failed
            res.status(401).send('Invalid email or password');
        }
    });
});

// Register endpoint
router.post('/register', async (req, res) => {
    const { firstName, mi, lastName, suffix, email, phone, address, createPassword } = req.body;
    const hashedPassword = await bcrypt.hash(createPassword, 10);
    const sql = 'INSERT INTO user (FirstName, MiddleName, LastName, Suffix, Email, Phone, Address, Password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [firstName, mi, lastName, suffix, email, phone, address, hashedPassword], (err, result) => {
        if (err) {
            // Handle the error, e.g., show an error message or redirect to an error page
            return res.status(500).send('An error occurred during registration');
        } else {
            // If insertion is successful, redirect the user back to the same page
            res.redirect('/');
        }
    });
});

module.exports = router;