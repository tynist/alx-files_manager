// Import Express module and the routes module
const express = require('express');
const routes = require('./routes/index');

// Create an Express application and sets port number
const app = express();
const port = process.env.PORT || 5000;

// Enable JSON, use the route module
app.use(express.json());
app.use('/', routes);

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
