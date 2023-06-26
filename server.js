const express = require('express');
const controllerRouting = require('./routes/index');

const app = express();
const port = process.env.PORT || 5000;

controllerRouting(app);

app.listen(port, () => {
  console.log(`Express Server app running on http://localhost:${port}/`);
});
module.exports = app;
