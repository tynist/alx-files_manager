// Import the AppController, UsersController, and AuthController modules
const AppController = require('../controllers/AppController');
const UsersController = require('../controllers/UsersController');
const AuthController = require('../controllers/AuthController');

const express = require('express'); // Import the Express module

// Create a function that defines the routes
const controllerRouting = (app) => {
  // Create a new Router instance
  const route = express.Router();
  app.use(express.json()); // Enable JSON parsing
  app.use('/', route); // Use the Router instance

  // Define the /status route
  route.get('/status', (req, res) => {
    AppController.getStatus(req, res);
  });

  // Define the /stats route
  route.get('/stats', (req, res) => {
    AppController.getStats(req, res);
  });

  // Define the /users route
  route.post('/users', (req, res) => {
    UsersController.postNew(req, res);
  });

  // Define the /connect route
  route.get('/connect', (req, res) => {
    AuthController.getConnect(req, res);
  });

  // Define the /disconnect route
  route.get('/disconnect', (req, res) => {
    AuthController.getDisconnect(req, res);
  });

  // Define the /users/me route
  route.get('/users/me', (req, res) => {
    UsersController.getMe(req, res);
  });
};

// Export the controller function
module.exports = controllerRouting;
