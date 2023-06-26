// Import the redis client and the db client
const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');

// Controller class for the app
class AppController {
  // Get the status of Redis and MongoDB connections
  static getStatus(req, res) {
    const data = {
      redis: redisClient.isAlive(),
      db: dbClient.isAlive(),
    };
    // Send the statusData object back to the client
    res.status(200).send(data);
  }

  static async getStats(req, res) {
    // Create a statsData object
    const statsData = {
      users: await dbClient.nbUsers(),
      files: await dbClient.nbFiles(),
    };
    // Send the statsData object back to the client
    res.status(200).send(statsData);
  }
}

// Export the AppController class
module.exports = AppController;
