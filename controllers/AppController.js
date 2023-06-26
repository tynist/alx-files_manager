// Import the redis client and the db client
const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');

// Controller class for the app
class AppController {
  // Get the status of Redis and MongoDB connections
  static getStatus(req, res) {
    // Create a statusData object
    const statusData = {
      redis: redisClient.isAlive(),
      db: dbClient.isAlive(),
    };

    // Send the statusData object back to the client
    res.send(statusData);
  }

  // Get the number of users and files from the MongoDB database
  // Create a statsData object
    const statsData = {
      users: await dbClient.nbUsers(),
      files: await dbClient.nbFiles(),
    };

    // Send the statsData object back to the client
    res.send(statsData);
  }
}

// Export the AppController class
module.exports = AppController;
