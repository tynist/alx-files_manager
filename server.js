const express = require('express');
const router = require('./routes');

const app = express();
const port = env.PORT || 5000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Mount the routes from routes/index.js on the root path '/
app.use('/', routes);

// Start the server
app.listen(port, () => {
  console.log('Server running on port', port);
});
