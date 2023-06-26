const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');

class AppController {
  static getStatus(request, response) {
    return response.status(200).send(
      `{"redis": ${redisClient.isAlive()}, "db": ${dbClient.isAlive()}}`,
    );
  }

  static async getStats(request, response) {
    const nbusers = await dbClient.nbUsers();
    const nbfiles = await dbClient.nbFiles();
    return response.status(200).send(
      `{"users": ${nbusers}, "files": ${nbfiles}}`,
    );
  }
}

module.exports = AppController;
