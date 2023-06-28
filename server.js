const express = require('express');
const { env } = require('process');

const mainRoute = require('./routes/index');

const app = express();
const port = env.PORT || 5000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Mount the main route
app.use(mainRoute);

// Start the server
app.listen(port, '127.0.0.1');
