// Import Express module and the routes module
const express = require('express');
const routes = require('./routes/index');

// Create an Express application and sets port number
const app = express();
const port = process.env.PORT || 5000;

// Use the router to set up routes for the server
router(server);

// Start the server and listen on the specified port
server.listen(port, () => {
  console.log(`Server listening at https://localhost:${port}/`);
});
