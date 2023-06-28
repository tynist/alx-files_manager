// Import Express framework & process env variables
const express = require('express');
const { env } = require('process');

 // Import the main route file.
const mainRoute = require('./routes/index');

// Create an Express application and sets port number
const app = express();
const port = env.PORT || 5000;

app.use(express.json()); // Enable JSON parsing
app.use(mainRoute); // Register the main route
app.listen(port, '127.0.0.1'); // Listen on `port` for connections.

// Export the application
module.exports = app;
