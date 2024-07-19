const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');

require('dotenv').config();
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

db.connect((err) => {
    if (err) throw err; //
    console.log('MySQL Connected');
}); 

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server is running....")
});

module.exports = db;
