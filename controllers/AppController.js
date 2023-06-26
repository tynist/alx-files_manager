// Import the redis client and the db client
const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');

// Controller class for the app
class AppController {
  // Get the status of Redis and MongoDB connections
  static getStatus(request, response) {
    return response.status(200).send(
      `{"redis": ${redisClient.isAlive()}, "db": ${dbClient.isAlive()}}`,
    );
  }

  // Get the number of users and files from the MongoDB database
  static async getStats(request, response) {
    const nbusers = await dbClient.nbUsers();
    const nbfiles = await dbClient.nbFiles();
    return response.status(200).send(
      `{"users": ${nbusers}, "files": ${nbfiles}}`,
    );
  }
}

module.exports = AppController;
