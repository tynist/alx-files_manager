const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');

class AppController {
  // Get the status of Redis and the database
  static async getStatus(request, response) {
    const redisStatus = await redisClient.isAlive();
    const dbStatus = await dbClient.isAlive();
    response.status(200).json({ redis: redisStatus, db: dbStatus }).end();
  }

  // Get statistics about the number of users and files in the database
  static async getStats(request, response) {
    const users = await dbClient.nbUsers();
    const files = await dbClient.nbFiles();
    response.status(200).json({ users, files }).end();
  }
}

module.exports = AppController;
