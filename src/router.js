const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('./db');
const util = require('util');
const query = util.promisify(db.query).bind(db);

router.get('/logout', async (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('An error occurred during logout');
        }
        res.redirect('/index.html');
    });
});

router.post('/user/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const sql = 'SELECT * FROM user WHERE Email = ? AND Role = ?';
        const results = await query(sql, [email, 'User']);
        
        if (results.length === 0) {
            return res.status(401).send('Invalid email or password');
        }

        const user = results[0];
        const match = await bcrypt.compare(password, user.Password);
        if (match) {
            req.session.userId = user.Id;
            res.redirect('/home.html');
        } else {
            res.status(401).send('Invalid email or password');
        }
    } catch (err) {
        res.status(500).send('An error occurred during login');
    }
});

router.post('/admin/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const sql = 'SELECT * FROM user WHERE Email = ? AND Role = ?';
        const results = await query(sql, [email, 'Admin']);
        
        if (results.length === 0) {
            return res.status(401).send('Invalid email or password');
        }

        const user = results[0];
        const match = await bcrypt.compare(password, user.Password);
        if (match) {
            req.session.userId = user.Id;
            res.redirect('/home_admin.html');
        } else {
            res.status(401).send('Invalid email or password');
        }
    } catch (err) {
        res.status(500).send('An error occurred during login');
    }
});

router.post('/register', async (req, res) => {
    try {
        const { firstName, mi, lastName, suffix, email, phone, address, createPassword } = req.body;
        
        const checkEmailQuery = 'SELECT * FROM user WHERE Email = ?';
        const results = await query(checkEmailQuery, [email]);
        
        if (results.length > 0) {
            return res.status(400).json({ error: 'Email already exists. Please use a different email address.' });
        } else {
            const hashedPassword = await bcrypt.hash(createPassword, 10);
            const insertUserQuery = 'INSERT INTO user (FirstName, MiddleName, LastName, Suffix, Email, Phone, Address, Password, Role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
            await query(insertUserQuery, [firstName, mi, lastName, suffix, email, phone, address, hashedPassword, 'User']);
            res.redirect('/');
        }
    } catch (err) {
        res.status(500).send('An error occurred during registration');
    }
});

module.exports = router;
