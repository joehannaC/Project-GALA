const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const routes = require('./src/router'); // Import routes
require('dotenv').config(); // Load environment variables

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Use the imported routes
app.use(routes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
