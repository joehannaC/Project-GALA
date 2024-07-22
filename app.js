const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const app = express();
const routes = require('./src/router');
const initData = require('./src/initData');
require('dotenv').config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
}));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home-default.html'));
});

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(routes);
initData();

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
