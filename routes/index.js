const { Router } = require('express');

const AppController = require('../controllers/AppController');
const UsersController = require('../controllers/UsersController');
const AuthController = require('../controllers/AuthController');
const FilesController = require('../controllers/FilesController');
const UtilController = require('../controllers/UtilController');

const router = Router();

// Middleware to check authorization for certain paths
router.use((request, response, next) => {
  const paths = ['/connect'];
  if (!paths.includes(request.path)) {
    next();
  } else if (!request.headers.authorization) {
    // Return 401 Unauthorized error if no authorization header is present
    response.status(401).json({ error: 'Unauthorized' }).end();
  } else {
    next();
  }
});

// Middleware to check authorization for certain paths
router.use((request, response, next) => {
  const paths = ['/disconnect', '/users/me', '/files'];
  if (!paths.includes(request.path)) {
    next();
  } else if (!request.headers['x-token']) {
    // Return 401 Unauthorized error if no 'x-token' header is present
    response.status(401).json({ error: 'Unauthorized' }).end();
  } else {
    next();
  }
});

router.get('/status', AppController.getStatus); // Endpoint to get application status
router.get('/stats', AppController.getStats); // Endpoint to get application statistics
router.post('/users', UsersController.postNew); // Endpoint to create a new user
router.get('/connect', AuthController.getConnect); // Endpoint to handle connection
router.get('/disconnect', AuthController.getDisconnect); // Endpoint to handle disconnection
router.get('/users/me', AuthController.getMe); // Endpoint to get current user information
router.get('/files', FilesController.getIndex); // Endpoint to get a list of files
router.post('/files', FilesController.postUpload); // Endpoint to upload a file
router.get('/files/:id', FilesController.getShow); // Endpoint to get information about a specific file
router.get('/files', FilesController.getIndex); // Endpoint to get a list of files
router.put('/files/:id/publish', UtilController.token, FilesController.putPublish); // Endpoint to publish a file
router.put('/files/:id/unpublish', UtilController.token, FilesController.putUnpublish); // Endpoint to unpublish a file

module.exports = router;
